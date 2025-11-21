const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/database');

const Loan = sequelize.define('Loan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'books',
      key: 'id'
    }
  },
  memberId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'members',
      key: 'id'
    }
  },
  loanDate: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
    validate: {
      isDate: {
        msg: 'Data de empréstimo deve ser válida'
      }
    }
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'Data de devolução deve ser válida'
      },
      isAfterLoanDate(value) {
        if (value <= this.loanDate) {
          throw new Error('Data de devolução deve ser após a data de empréstimo');
        }
      }
    }
  },
  returnDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: {
        msg: 'Data de retorno deve ser válida'
      },
      isAfterLoanDate(value) {
        if (value && value < this.loanDate) {
          throw new Error('Data de retorno não pode ser antes da data de empréstimo');
        }
      }
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'returned', 'overdue'),
    defaultValue: 'active'
  }
}, {
  tableName: 'loans',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeValidate: (loan) => {
      if (!loan.loanDate) {
        loan.loanDate = new Date().toISOString().split('T')[0];
      }
      if (!loan.dueDate) {
        const dueDate = new Date(loan.loanDate);
        dueDate.setDate(dueDate.getDate() + 14);
        loan.dueDate = dueDate.toISOString().split('T')[0];
      }
      if (loan.returnDate) {
        loan.status = 'returned';
      } else if (new Date(loan.dueDate) < new Date()) {
        loan.status = 'overdue';
      } else {
        loan.status = 'active';
      }
    },
    afterCreate: async (loan) => {
      const Book = require('./Book');
      await Book.update(
        { available: false },
        { where: { id: loan.bookId } }
      );
    },
    afterUpdate: async (loan) => {
      if (loan.returnDate && loan.changed('returnDate')) {
        const Book = require('./Book');
        await Book.update(
          { available: true },
          { where: { id: loan.bookId } }
        );
      }
    }
  }
});

Loan.prototype.isOverdue = function() {
  return new Date(this.dueDate) < new Date() && !this.returnDate;
};

Loan.prototype.daysOverdue = function() {
  if (!this.isOverdue()) return 0;
  const today = new Date();
  const dueDate = new Date(this.dueDate);
  return Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
};

Loan.prototype.returnBook = function() {
  this.returnDate = new Date().toISOString().split('T')[0];
  this.status = 'returned';
  return this.save();
};

Loan.findActive = function() {
  return this.findAll({
    where: { 
      status: 'active',
      returnDate: null 
    },
    include: ['Book', 'Member'],
    order: [['dueDate', 'ASC']]
  });
};

Loan.findOverdue = function() {
  return this.findAll({
    where: { 
      status: 'overdue',
      returnDate: null 
    },
    include: ['Book', 'Member'],
    order: [['dueDate', 'ASC']]
  });
};

Loan.findByMember = function(memberId) {
  return this.findAll({
    where: { memberId },
    include: ['Book'],
    order: [['loanDate', 'DESC']]
  });
};

Loan.findByBook = function(bookId) {
  return this.findAll({
    where: { bookId },
    include: ['Member'],
    order: [['loanDate', 'DESC']]
  });
};

module.exports = Loan;
