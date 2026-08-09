const User = require('../models/User');
const Transaction = require('../models/Transaction');
const blockchainService = require('../services/blockchainService');
const logger = require('../utils/logger');

// @desc    Request withdrawal
// @route   POST /api/withdrawal
// @access  Private
exports.requestWithdrawal = async (req, res) => {
  try {
    const { currency, address, amount } = req.body;

    // Validate input
    if (!currency || !address || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide currency, address, and amount',
      });
    }

    // Get user
    const user = await User.findById(req.user.id);

    // Check balance
    const currentBalance = user.balances[currency.toUpperCase()];
    if (currentBalance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance',
      });
    }

    // Minimum withdrawal amount
    const MIN_WITHDRAWAL = parseFloat(process.env.MIN_WITHDRAWAL_AMOUNT) || 0.00001;
    if (amount < MIN_WITHDRAWAL) {
      return res.status(400).json({
        success: false,
        message: `Minimum withdrawal amount is ${MIN_WITHDRAWAL} ${currency}`,
      });
    }

    // Validate address (basic validation)
    if (!isValidCryptoAddress(address, currency)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wallet address',
      });
    }

    // Create withdrawal request
    const withdrawal = {
      currency: currency.toUpperCase(),
      amount,
      address,
      status: 'pending',
    };

    user.withdrawals.push(withdrawal);
    
    // Deduct balance immediately (will be refunded if withdrawal fails)
    user.balances[currency.toUpperCase()] -= amount;

    await user.save();

    // Create transaction record
    const transaction = await Transaction.create({
      user: user._id,
      type: 'withdrawal',
      currency: currency.toUpperCase(),
      amount,
      balanceBefore: currentBalance,
      balanceAfter: user.balances[currency.toUpperCase()],
      address,
      status: 'pending',
      description: `Withdrawal request to ${address}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    logger.info(`Withdrawal request: User ${user.username} requested ${amount} ${currency}`);

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      data: {
        withdrawalId: withdrawal._id,
        currency: currency.toUpperCase(),
        amount,
        address,
        status: 'pending',
        newBalance: user.balances[currency.toUpperCase()],
      },
    });
  } catch (error) {
    logger.error(`Request withdrawal error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error during withdrawal request',
    });
  }
};

// @desc    Get user's withdrawal history
// @route   GET /api/withdrawal/history
// @access  Private
exports.getWithdrawalHistory = async (req, res) => {
  try {
    const { currency, status, page = 1, limit = 10 } = req.query;

    const query = { user: req.user.id, type: 'withdrawal' };
    if (currency) {
      query.currency = currency.toUpperCase();
    }
    if (status) {
      query.status = status;
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
    logger.error(`Get withdrawal history error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Process withdrawal (Admin only)
// @route   PUT /api/withdrawal/process/:id
// @access  Private/Admin
exports.processWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, txHash } = req.body; // action: 'approve' or 'reject'

    const user = await User.findById(req.user.id);
    const withdrawal = user.withdrawals.id(id);

    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal not found',
      });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Withdrawal already processed',
      });
    }

    if (action === 'approve') {
      // Send cryptocurrency
      const result = await blockchainService.sendTransaction(
        withdrawal.currency,
        process.env[`${withdrawal.currency}_WALLET_ADDRESS`],
        withdrawal.address,
        withdrawal.amount
      );

      if (result.success) {
        withdrawal.status = 'completed';
        withdrawal.txHash = result.txHash;

        // Update transaction record
        await Transaction.findOneAndUpdate(
          { _id: withdrawal._id },
          { status: 'completed', txHash: result.txHash }
        );

        logger.info(`Withdrawal approved: ${withdrawal.amount} ${withdrawal.currency} to ${withdrawal.address}`);
      } else {
        // Refund user
        user.balances[withdrawal.currency] += withdrawal.amount;
        withdrawal.status = 'failed';
        
        await Transaction.findOneAndUpdate(
          { _id: withdrawal._id },
          { status: 'failed' }
        );
      }
    } else if (action === 'reject') {
      // Refund user
      user.balances[withdrawal.currency] += withdrawal.amount;
      withdrawal.status = 'rejected';

      await Transaction.findOneAndUpdate(
        { _id: withdrawal._id },
        { status: 'rejected' }
      );

      logger.info(`Withdrawal rejected: ${withdrawal.amount} ${withdrawal.currency}`);
    }

    await user.save();

    res.json({
      success: true,
      message: `Withdrawal ${action}ed successfully`,
      data: {
        withdrawalId: id,
        status: withdrawal.status,
        txHash: withdrawal.txHash,
      },
    });
  } catch (error) {
    logger.error(`Process withdrawal error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error during withdrawal processing',
    });
  }
};

// Helper function to validate crypto addresses
function isValidCryptoAddress(address, currency) {
  // Basic validation - in production, use proper libraries
  switch (currency.toUpperCase()) {
    case 'BTC':
      return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/.test(address);
    case 'ETH':
    case 'USDT':
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    case 'DOGE':
      return /^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$/.test(address);
    default:
      return false;
  }
}
