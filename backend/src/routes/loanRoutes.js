const express = require('express');
const router = express.Router();
const {
  getAllLoans,
  getLoanById,
  createLoan,
  returnBook,
  getActiveLoans,
  getOverdueLoans,
  getLoansByMember,
  getLoansByBook,
  getLoanStats
} = require('../controllers/loanController');

// @route   GET /api/loans
// @desc    Get all loans with pagination
// @access  Public
router.get('/', getAllLoans);

// @route   GET /api/loans/active
// @desc    Get all active loans
// @access  Public
router.get('/active', getActiveLoans);

// @route   GET /api/loans/overdue
// @desc    Get all overdue loans
// @access  Public
router.get('/overdue', getOverdueLoans);

// @route   GET /api/loans/stats
// @desc    Get loan statistics
// @access  Public
router.get('/stats', getLoanStats);

// @route   GET /api/loans/member/:memberId
// @desc    Get loans by member
// @access  Public
router.get('/member/:memberId', getLoansByMember);

// @route   GET /api/loans/book/:bookId
// @desc    Get loans by book
// @access  Public
router.get('/book/:bookId', getLoansByBook);

// @route   GET /api/loans/:id
// @desc    Get single loan by ID
// @access  Public
router.get('/:id', getLoanById);

// @route   POST /api/loans
// @desc    Create new loan
// @access  Public
router.post('/', createLoan);

// @route   PUT /api/loans/:id/return
// @desc    Return book (mark as returned)
// @access  Public
router.put('/:id/return', returnBook);

module.exports = router;
