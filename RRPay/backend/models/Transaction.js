const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['faucet_claim', 'withdrawal', 'deposit', 'transfer', 'reward'],
    required: true,
  },
  currency: {
    type: String,
    enum: ['BTC', 'ETH', 'USDT', 'DOGE'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  balanceBefore: {
    type: Number,
    required: true,
  },
  balanceAfter: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending',
  },
  txHash: {
    type: String,
    sparse: true,
  },
  address: {
    type: String,
    sparse: true,
  },
  description: String,
  metadata: {
    faucetId: String,
    taskId: String,
    referralId: String,
  },
  ipAddress: String,
  userAgent: String,
}, {
  timestamps: true,
});

// Index for faster queries
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ type: 1, status: 1 });
transactionSchema.index({ currency: 1, status: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
