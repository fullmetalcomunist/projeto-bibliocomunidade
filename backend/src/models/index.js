const Book = require('./Book');
const Member = require('./Member');
const Loan = require('./Loan');

Book.hasMany(Loan, {
  foreignKey: 'bookId',
  as: 'loans'
});

Member.hasMany(Loan, {
  foreignKey: 'memberId',
  as: 'loans'
});

Loan.belongsTo(Book, {
  foreignKey: 'bookId',
  as: 'book'
});

Loan.belongsTo(Member, {
  foreignKey: 'memberId',
  as: 'member'
});

module.exports = {
  Book,
  Member,
  Loan
};
