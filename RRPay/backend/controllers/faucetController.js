const User = require('../models/User');
const Transaction = require('../models/Transaction');
const FaucetConfig = require('../models/FaucetConfig');
const blockchainService = require('../services/blockchainService');
const logger = require('../utils/logger');

// @desc    Get all faucet configurations
// @route   GET /api/faucet
// @access  Public
exports.getFaucetConfigs = async (req, res) => {
  try {
    const faucets = await FaucetConfig.find({ isActive: true });

    res.json({
      success: true,
      count: faucets.length,
      data: faucets,
    });
  } catch (error) {
    logger.error(`Get faucet configs error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Claim from faucet
// @route   POST /api/faucet/claim
// @access  Private
exports.claimFaucet = async (req, res) => {
  try {
    const { currency } = req.body;

    if (!currency) {
      return res.status(400).json({
        success: false,
        message: 'Currency is required',
      });
    }

    // Get faucet config
    const faucetConfig = await FaucetConfig.findOne({ 
      currency: currency.toUpperCase(),
      isActive: true 
    });

    if (!faucetConfig) {
      return res.status(404).json({
        success: false,
        message: 'Faucet not available for this currency',
      });
    }

    // Get user
    const user = await User.findById(req.user.id);

    // Check last claim time
    const lastClaim = user.lastFaucetClaim[currency.toUpperCase()];
    const now = new Date();

    if (lastClaim) {
      const timeSinceLastClaim = (now - new Date(lastClaim)) / (1000 * 60); // in minutes
      if (timeSinceLastClaim < faucetConfig.minClaimInterval) {
        const waitTime = Math.ceil(faucetConfig.minClaimInterval - timeSinceLastClaim);
        return res.status(400).json({
          success: false,
          message: `Please wait ${waitTime} minutes before claiming again`,
          waitTime: waitTime,
        });
      }
    }

    // Check daily claims limit
    const today = new Date().setHours(0, 0, 0, 0);
    const dailyClaims = user.faucetClaims.filter(claim => {
      const claimDate = new Date(claim.timestamp).setHours(0, 0, 0, 0);
      return claim.currency === currency.toUpperCase() && claimDate === today;
    }).length;

    if (dailyClaims >= faucetConfig.maxDailyClaims) {
      return res.status(400).json({
        success: false,
        message: `Daily claim limit reached (${faucetConfig.maxDailyClaims} claims per day)`,
      });
    }

    // Update user balance
    const balanceBefore = user.balances[currency.toUpperCase()];
    user.balances[currency.toUpperCase()] += faucetConfig.rewardAmount;
    
    // Update last claim time
    user.lastFaucetClaim[currency.toUpperCase()] = now;

    // Add claim to history
    user.faucetClaims.push({
      currency: currency.toUpperCase(),
      amount: faucetConfig.rewardAmount,
      timestamp: now,
    });

    await user.save();

    // Update faucet stats
    faucetConfig.totalDistributed += faucetConfig.rewardAmount;
    faucetConfig.totalClaims += 1;
    await faucetConfig.save();

    // Create transaction record
    await Transaction.create({
      user: user._id,
      type: 'faucet_claim',
      currency: currency.toUpperCase(),
      amount: faucetConfig.rewardAmount,
      balanceBefore,
      balanceAfter: user.balances[currency.toUpperCase()],
      status: 'completed',
      description: `Faucet claim for ${currency.toUpperCase()}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    logger.info(`Faucet claim: User ${user.username} claimed ${faucetConfig.rewardAmount} ${currency}`);

    res.json({
      success: true,
      message: `Successfully claimed ${faucetConfig.rewardAmount} ${currency}`,
      data: {
        amount: faucetConfig.rewardAmount,
        currency: currency.toUpperCase(),
        newBalance: user.balances[currency.toUpperCase()],
        nextClaimIn: faucetConfig.minClaimInterval,
      },
    });
  } catch (error) {
    logger.error(`Claim faucet error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error during claim',
    });
  }
};

// @desc    Get user's faucet claim history
// @route   GET /api/faucet/history
// @access  Private
exports.getClaimHistory = async (req, res) => {
  try {
    const { currency, page = 1, limit = 10 } = req.query;

    const query = { user: req.user.id, type: 'faucet_claim' };
    if (currency) {
      query.currency = currency.toUpperCase();
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Transaction.countDocuments(query);

    res.json({
      success: true,
      count: transactions.length,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: transactions,
    });
  } catch (error) {
    logger.error(`Get claim history error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get next claim time
// @route   GET /api/faucet/next-claim/:currency
// @access  Private
exports.getNextClaimTime = async (req, res) => {
  try {
    const { currency } = req.params;
    const user = await User.findById(req.user.id);
    const faucetConfig = await FaucetConfig.findOne({ currency: currency.toUpperCase() });

    if (!faucetConfig) {
      return res.status(404).json({
        success: false,
        message: 'Faucet not found for this currency',
      });
    }

    const lastClaim = user.lastFaucetClaim[currency.toUpperCase()];
    
    if (!lastClaim) {
      return res.json({
        success: true,
        data: {
          canClaimNow: true,
          nextClaimTime: null,
        },
      });
    }

    const nextClaimTime = new Date(lastClaim.getTime() + (faucetConfig.minClaimInterval * 60000));
    const canClaimNow = new Date() >= nextClaimTime;

    res.json({
      success: true,
      data: {
        canClaimNow,
        nextClaimTime: canClaimNow ? null : nextClaimTime,
        waitTimeSeconds: canClaimNow ? 0 : Math.max(0, Math.floor((nextClaimTime - new Date()) / 1000)),
      },
    });
  } catch (error) {
    logger.error(`Get next claim time error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
