const { Loan, Book, Member } = require('../models');

// @desc    Get all loans
// @route   GET /api/loans
// @access  Public
const getAllLoans = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status;

    const where = {};
    if (status) {
      where.status = status;
    }

    const { count, rows: loans } = await Loan.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        { model: Book, as: 'book' },
        { model: Member, as: 'member' }
      ],
      order: [['loanDate', 'DESC']]
    });

    res.json({
      success: true,
      data: loans,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error getting loans:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

// @desc    Get single loan
// @route   GET /api/loans/:id
// @access  Public
const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id, {
      include: [
        { model: Book, as: 'book' },
        { model: Member, as: 'member' }
      ]
    });

    if (!loan) {
      return res.status(404).json({
        success: false,
        error: 'Empréstimo não encontrado'
      });
    }

    res.json({
      success: true,
      data: loan
    });
  } catch (error) {
    console.error('Error getting loan:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

// @desc    Create new loan
// @route   POST /api/loans
// @access  Public
const createLoan = async (req, res) => {
  try {
    const { bookId, memberId, dueDate } = req.body;

    // Check if book exists and is available
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Livro não encontrado'
      });
    }

    if (!book.isAvailable()) {
      return res.status(409).json({
        success: false,
        error: 'Livro não está disponível para empréstimo'
      });
    }

    // Check if member exists and is active
    const member = await Member.findByPk(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Membro não encontrado'
      });
    }

    if (!member.canBorrow()) {
      return res.status(409).json({
        success: false,
        error: 'Membro não está ativo e não pode fazer empréstimos'
      });
    }

    // Check if member has too many active loans (max 3)
    const activeLoansCount = await Loan.count({
      where: {
        memberId,
        status: 'active'
      }
    });

    if (activeLoansCount >= 3) {
      return res.status(409).json({
        success: false,
        error: 'Membro já possui o número máximo de empréstimos ativos (3)'
      });
    }

    const loan = await Loan.create({
      bookId,
      memberId,
      dueDate
    });

    // Reload loan with associations
    const newLoan = await Loan.findByPk(loan.id, {
      include: [
        { model: Book, as: 'book' },
        { model: Member, as: 'member' }
      ]
    });

    res.status(201).json({
      success: true,
      data: newLoan,
      message: 'Empréstimo realizado com sucesso'
    });
  } catch (error) {
    console.error('Error creating loan:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Dados de entrada inválidos',
        details: error.errors.map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

// @desc    Return book
// @route   PUT /api/loans/:id/return
// @access  Public
const returnBook = async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id, {
      include: [
        { model: Book, as: 'book' },
        { model: Member, as: 'member' }
      ]
    });

    if (!loan) {
      return res.status(404).json({
        success: false,
        error: 'Empréstimo não encontrado'
      });
    }

    if (loan.returnDate) {
      return res.status(409).json({
        success: false,
        error: 'Livro já foi devolvido'
      });
    }

    await loan.returnBook();

    // Reload loan to get updated data
    const updatedLoan = await Loan.findByPk(loan.id, {
      include: [
        { model: Book, as: 'book' },
        { model: Member, as: 'member' }
      ]
    });

    res.json({
      success: true,
      data: updatedLoan,
      message: 'Livro devolvido com sucesso'
    });
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

// @desc    Get active loans
// @route   GET /api/loans/active
// @access  Public
const getActiveLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      where: { 
        status: 'active',
        returnDate: null 
      },
      include: [
        { model: Book, as: 'book' },
        { model: Member, as: 'member' }
      ],
      order: [['dueDate', 'ASC']]
    });

    res.json({
      success: true,
      data: loans,
      total: loans.length
    });
  } catch (error) {
    console.error('Error getting active loans:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

// @desc    Get overdue loans
// @route   GET /api/loans/overdue
// @access  Public
const getOverdueLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      where: { 
        status: 'overdue',
        returnDate: null 
      },
      include: [
        { model: Book, as: 'book' },
        { model: Member, as: 'member' }
      ],
      order: [['dueDate', 'ASC']]
    });

    res.json({
      success: true,
      data: loans,
      total: loans.length
    });
  } catch (error) {
    console.error('Error getting overdue loans:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

// @desc    Get loans by member
// @route   GET /api/loans/member/:memberId
// @access  Public
const getLoansByMember = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      where: { memberId: req.params.memberId },
      include: [{ model: Book, as: 'book' }],
      order: [['loanDate', 'DESC']]
    });

    res.json({
      success: true,
      data: loans,
      total: loans.length
    });
  } catch (error) {
    console.error('Error getting loans by member:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

// @desc    Get loans by book
// @route   GET /api/loans/book/:bookId
// @access  Public
const getLoansByBook = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      where: { bookId: req.params.bookId },
      include: [{ model: Member, as: 'member' }],
      order: [['loanDate', 'DESC']]
    });

    res.json({
      success: true,
      data: loans,
      total: loans.length
    });
  } catch (error) {
    console.error('Error getting loans by book:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

// @desc    Get loan statistics
// @route   GET /api/loans/stats
// @access  Public
const getLoanStats = async (req, res) => {
  try {
    console.log('📊 Calculando estatísticas de empréstimos...');

    // Estatísticas básicas - versão simplificada e robusta
    const totalLoans = await Loan.count();
    const activeLoans = await Loan.count({ where: { status: 'active' } });
    const overdueLoans = await Loan.count({ where: { status: 'overdue' } });
    const returnedLoans = await Loan.count({ where: { status: 'returned' } });

    // Para livros mais emprestados, vamos fazer uma versão mais simples
    let mostBorrowedBooks = [];
    
    try {
      // Buscar todos os empréstimos com informações dos livros
      const loansWithBooks = await Loan.findAll({
        include: [{ 
          model: Book, 
          as: 'book',
          attributes: ['id', 'title', 'author'] 
        }],
        attributes: ['bookId']
      });

      // Contar manualmente os livros mais emprestados
      const bookCounts = {};
      loansWithBooks.forEach(loan => {
        if (loan.book) {
          const bookId = loan.book.id;
          bookCounts[bookId] = (bookCounts[bookId] || 0) + 1;
        }
      });

      // Converter para array e ordenar
      mostBorrowedBooks = Object.entries(bookCounts)
        .map(([bookId, loanCount]) => ({
          bookId: parseInt(bookId),
          loanCount,
          book: loansWithBooks.find(l => l.book && l.book.id === parseInt(bookId))?.book || 
                { title: 'Livro não encontrado', author: 'N/A' }
        }))
        .sort((a, b) => b.loanCount - a.loanCount)
        .slice(0, 5); // Top 5

    } catch (booksError) {
      console.warn('⚠️ Erro ao calcular livros mais emprestados:', booksError.message);
      // Continua com array vazio se houver erro
    }

    res.json({
      success: true,
      data: {
        total: totalLoans || 0,
        active: activeLoans || 0,
        overdue: overdueLoans || 0,
        returned: returnedLoans || 0,
        mostBorrowedBooks
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor ao calcular estatísticas',
      message: error.message
    });
  }
};

module.exports = {
  getAllLoans,
  getLoanById,
  createLoan,
  returnBook,
  getActiveLoans,
  getOverdueLoans,
  getLoansByMember,
  getLoansByBook,
  getLoanStats
};
