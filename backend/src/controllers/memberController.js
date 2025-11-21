const { Member, Loan } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all members
// @route   GET /api/members
// @access  Public
const getAllMembers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: members } = await Member.findAndCountAll({
      limit,
      offset,
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: members,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error getting members:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

// @desc    Get single member
// @route   GET /api/members/:id
// @access  Public
const getMemberById = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id, {
      include: [{
        model: Loan,
        as: 'loans',
        include: ['book']
      }]
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Membro não encontrado'
      });
    }

    res.json({
      success: true,
      data: member
    });
  } catch (error) {
    console.error('Error getting member:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

// @desc    Create new member
// @route   POST /api/members
// @access  Public
const createMember = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address
    } = req.body;

    // Check if member with same email already exists
    if (email) {
      const existingMember = await Member.findOne({
        where: { email: { [Op.iLike]: email } }
      });

      if (existingMember) {
        return res.status(409).json({
          success: false,
          error: 'Membro com este email já existe'
        });
      }
    }

    const member = await Member.create({
      name,
      email,
      phone,
      address
    });

    res.status(201).json({
      success: true,
      data: member,
      message: 'Membro criado com sucesso'
    });
  } catch (error) {
    console.error('Error creating member:', error);
    
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

// @desc    Update member
// @route   PUT /api/members/:id
// @access  Public
const updateMember = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Membro não encontrado'
      });
    }

    // Check email uniqueness if email is being updated
    if (req.body.email && req.body.email !== member.email) {
      const existingMember = await Member.findOne({
        where: { 
          email: { [Op.iLike]: req.body.email },
          id: { [Op.ne]: member.id }
        }
      });

      if (existingMember) {
        return res.status(409).json({
          success: false,
          error: 'Email já está em uso por outro membro'
        });
      }
    }

    await member.update(req.body);

    res.json({
      success: true,
      data: member,
      message: 'Membro atualizado com sucesso'
    });
  } catch (error) {
    console.error('Error updating member:', error);
    
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

// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Public
const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Membro não encontrado'
      });
    }

    // Check if member has active loans
    const activeLoans = await Loan.count({
      where: {
        memberId: member.id,
        status: 'active'
      }
    });

    if (activeLoans > 0) {
      return res.status(409).json({
        success: false,
        error: 'Não é possível excluir membro com empréstimos ativos'
      });
    }

    await member.destroy();

    res.json({
      success: true,
      message: 'Membro excluído com sucesso'
    });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

// @desc    Search members
// @route   GET /api/members/search
// @access  Public
const searchMembers = async (req, res) => {
  try {
    const { q: query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetro de busca é obrigatório'
      });
    }

    const members = await Member.search(query);

    res.json({
      success: true,
      data: members,
      total: members.length
    });
  } catch (error) {
    console.error('Error searching members:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

// @desc    Get active members
// @route   GET /api/members/active
// @access  Public
const getActiveMembers = async (req, res) => {
  try {
    const members = await Member.findActive();

    res.json({
      success: true,
      data: members,
      total: members.length
    });
  } catch (error) {
    console.error('Error getting active members:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

// @desc    Suspend member
// @route   PUT /api/members/:id/suspend
// @access  Public
const suspendMember = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Membro não encontrado'
      });
    }

    await member.suspend();

    res.json({
      success: true,
      data: member,
      message: 'Membro suspenso com sucesso'
    });
  } catch (error) {
    console.error('Error suspending member:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

// @desc    Activate member
// @route   PUT /api/members/:id/activate
// @access  Public
const activateMember = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Membro não encontrado'
      });
    }

    await member.activate();

    res.json({
      success: true,
      data: member,
      message: 'Membro ativado com sucesso'
    });
  } catch (error) {
    console.error('Error activating member:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

module.exports = {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  searchMembers,
  getActiveMembers,
  suspendMember,
  activateMember
};
