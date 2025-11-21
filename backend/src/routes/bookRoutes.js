const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
  getAvailableBooks,
  getBooksByCategory
} = require('../controllers/bookController');

// @route   GET /api/books
// @desc    Get all books with pagination
// @access  Public
router.get('/', getAllBooks);

// @route   GET /api/books/available
// @desc    Get all available books
// @access  Public
router.get('/available', getAvailableBooks);

// @route   GET /api/books/search
// @desc    Search books by title, author or category
// @access  Public
router.get('/search', searchBooks);

// @route   GET /api/books/category/:category
// @desc    Get books by category
// @access  Public
router.get('/category/:category', getBooksByCategory);

// @route   GET /api/books/:id
// @desc    Get single book by ID
// @access  Public
router.get('/:id', getBookById);

// @route   POST /api/books
// @desc    Create new book
// @access  Public
router.post('/', createBook);

// @route   PUT /api/books/:id
// @desc    Update book
// @access  Public
router.put('/:id', updateBook);

// @route   DELETE /api/books/:id
// @desc    Delete book
// @access  Public
router.delete('/:id', deleteBook);

module.exports = router;
