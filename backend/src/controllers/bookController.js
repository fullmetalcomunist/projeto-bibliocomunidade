const { Book } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all books with pagination
// @route   GET /api/books
// @access  Public
const getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: books } = await Book.findAndCountAll({
      limit,
      offset,
      order: [['title', 'ASC']]
    });

    res.json({
      success: true,
      data: books,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error getting books:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Livro não encontrado'
      });
    }

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Error getting book:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

// @desc    Create new book
// @route   POST /api/books
// @access  Public
const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      publisher,
      publicationYear,
      category,
      location,
      description,
      observations
    } = req.body;

    // Check if book with same title and author already exists
    const existingBook = await Book.findOne({
      where: {
        title: { [Op.iLike]: title },
        author: { [Op.iLike]: author }
      }
    });

    if (existingBook) {
      return res.status(409).json({
        success: false,
        error: 'Livro com este título e autor já existe'
      });
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      publisher,
      publicationYear,
      category: category || 'Geral',
      location: location || 'Prateleira Geral',
      description,
      observations
    });

    res.status(201).json({
      success: true,
      data: book,
      message: 'Livro criado com sucesso'
    });
  } catch (error) {
    console.error('Error creating book:', error);
    
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

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Public
const updateBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Livro não encontrado'
      });
    }

    await book.update(req.body);

    res.json({
      success: true,
      data: book,
      message: 'Livro atualizado com sucesso'
    });
  } catch (error) {
    console.error('Error updating book:', error);
    
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

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Public
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Livro não encontrado'
      });
    }

    // Check if book is currently borrowed
    const { Loan } = require('../models');
    const activeLoan = await Loan.findOne({
      where: {
        bookId: book.id,
        status: 'active'
      }
    });

    if (activeLoan) {
      return res.status(409).json({
        success: false,
        error: 'Não é possível excluir livro com empréstimo ativo'
      });
    }

    await book.destroy();

    res.json({
      success: true,
      message: 'Livro excluído com sucesso'
    });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

// @desc    Search books
// @route   GET /api/books/search
// @access  Public
const searchBooks = async (req, res) => {
  try {
    const { q: query, category, available } = req.query;

    if (!query && !category && available === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetro de busca é obrigatório'
      });
    }

    const where = {};

    if (query) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${query}%` } },
        { author: { [Op.iLike]: `%${query}%` } },
        { category: { [Op.iLike]: `%${query}%` } }
      ];
    }

    if (category) {
      where.category = { [Op.iLike]: `%${category}%` };
    }

    if (available !== undefined) {
      where.available = available === 'true';
    }

    const books = await Book.findAll({
      where,
      order: [['title', 'ASC']]
    });

    res.json({
      success: true,
      data: books,
      total: books.length
    });
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

// @desc    Get available books
// @route   GET /api/books/available
// @access  Public
const getAvailableBooks = async (req, res) => {
  try {
    const books = await Book.findAvailable();

    res.json({
      success: true,
      data: books,
      total: books.length
    });
  } catch (error) {
    console.error('Error getting available books:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

// @desc    Get books by category
// @route   GET /api/books/category/:category
// @access  Public
const getBooksByCategory = async (req, res) => {
  try {
    const books = await Book.findByCategory(req.params.category);

    res.json({
      success: true,
      data: books,
      total: books.length
    });
  } catch (error) {
    console.error('Error getting books by category:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
  getAvailableBooks,
  getBooksByCategory
};
