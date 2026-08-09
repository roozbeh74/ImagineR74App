const express = require('express');
const router = express.Router();
const { 
  getFaucetConfigs, 
  claimFaucet, 
  getClaimHistory, 
  getNextClaimTime 
} = require('../controllers/faucetController');
const { protect, rateLimiter } = require('../middleware/auth');

// Public routes
router.get('/', getFaucetConfigs);

// Protected routes
router.use(protect);
router.post('/claim', rateLimiter(10, 60000), claimFaucet); // Max 10 claims per minute
router.get('/history', getClaimHistory);
router.get('/next-claim/:currency', getNextClaimTime);

module.exports = router;
