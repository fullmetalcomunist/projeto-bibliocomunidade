const express = require('express');
const router = express.Router();
const {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  searchMembers,
  getActiveMembers,
  suspendMember,
  activateMember
} = require('../controllers/memberController');

// @route   GET /api/members
// @desc    Get all members with pagination
// @access  Public
router.get('/', getAllMembers);

// @route   GET /api/members/active
// @desc    Get all active members
// @access  Public
router.get('/active', getActiveMembers);

// @route   GET /api/members/search
// @desc    Search members by name or email
// @access  Public
router.get('/search', searchMembers);

// @route   GET /api/members/:id
// @desc    Get single member by ID with loans
// @access  Public
router.get('/:id', getMemberById);

// @route   POST /api/members
// @desc    Create new member
// @access  Public
router.post('/', createMember);

// @route   PUT /api/members/:id
// @desc    Update member
// @access  Public
router.put('/:id', updateMember);

// @route   PUT /api/members/:id/suspend
// @desc    Suspend member
// @access  Public
router.put('/:id/suspend', suspendMember);

// @route   PUT /api/members/:id/activate
// @desc    Activate member
// @access  Public
router.put('/:id/activate', activateMember);

// @route   DELETE /api/members/:id
// @desc    Delete member
// @access  Public
router.delete('/:id', deleteMember);

module.exports = router;
