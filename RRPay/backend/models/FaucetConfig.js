const mongoose = require('mongoose');

const faucetConfigSchema = new mongoose.Schema({
  currency: {
    type: String,
    enum: ['BTC', 'ETH', 'USDT', 'DOGE'],
    required: true,
    unique: true,
  },
  rewardAmount: {
    type: Number,
    required: true,
    default: 0.00001,
  },
  minClaimInterval: {
    type: Number, // in minutes
    required: true,
    default: 60,
  },
  maxDailyClaims: {
    type: Number,
    required: true,
    default: 10,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  walletAddress: {
    type: String,
    required: true,
  },
  totalDistributed: {
    type: Number,
    default: 0,
  },
  totalClaims: {
    type: Number,
    default: 0,
  },
  lastResetDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('FaucetConfig', faucetConfigSchema);
