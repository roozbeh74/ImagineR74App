const express = require('express');
const router = express.Router();
const { 
  requestWithdrawal, 
  getWithdrawalHistory, 
  processWithdrawal 
} = require('../controllers/withdrawalController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// User routes
router.post('/', requestWithdrawal);
router.get('/history', getWithdrawalHistory);

// Admin only route
router.put('/process/:id', authorize('admin', 'moderator'), processWithdrawal);

module.exports = router;
