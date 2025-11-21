const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/database');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Título do livro é obrigatório'
      },
      len: {
        args: [1, 255],
        msg: 'Título deve ter entre 1 e 255 caracteres'
      }
    }
  },
  author: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Autor do livro é obrigatório'
      },
      len: {
        args: [1, 255],
        msg: 'Autor deve ter entre 1 e 255 caracteres'
      }
    }
  },
  isbn: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      len: {
        args: [10, 20],
        msg: 'ISBN deve ter entre 10 e 20 caracteres'
      }
    }
  },
  publisher: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  publicationYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: {
        args: 1000,
        msg: 'Ano de publicação deve ser maior que 1000'
      },
      max: {
        args: new Date().getFullYear(),
        msg: 'Ano de publicação não pode ser no futuro'
      }
    }
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Geral'
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Prateleira Geral'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  observations: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Campo para observações como "capa danificada", "páginas soltas"'
  }
}, {
  tableName: 'books',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeValidate: (book) => {
      if (book.title) {
        book.title = book.title.charAt(0).toUpperCase() + book.title.slice(1).toLowerCase();
      }
      if (book.author) {
        book.author = book.author.charAt(0).toUpperCase() + book.author.slice(1).toLowerCase();
      }
    }
  }
});

Book.prototype.isAvailable = function() {
  return this.available === true;
};

Book.prototype.borrow = function() {
  this.available = false;
  return this.save();
};

Book.prototype.return = function() {
  this.available = true;
  return this.save();
};

Book.findByCategory = function(category) {
  return this.findAll({
    where: { category },
    order: [['title', 'ASC']]
  });
};

Book.findAvailable = function() {
  return this.findAll({
    where: { available: true },
    order: [['title', 'ASC']]
  });
};

Book.search = function(query) {
  return this.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.iLike]: `%${query}%` } },
        { author: { [Op.iLike]: `%${query}%` } },
        { category: { [Op.iLike]: `%${query}%` } }
      ]
    },
    order: [['title', 'ASC']]
  });
};

module.exports = Book;
