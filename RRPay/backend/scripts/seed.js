/**
 * Seed Database Script
 * Initializes the database with default faucet configurations
 */

require('dotenv').config();
const mongoose = require('mongoose');
const FaucetConfig = require('../models/FaucetConfig');
const connectDB = require('../config/database');
const logger = require('../utils/logger');

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing faucet configs
    await FaucetConfig.deleteMany({});
    logger.info('Cleared existing faucet configurations');

    // Create default faucet configurations
    const faucets = [
      {
        currency: 'BTC',
        rewardAmount: 0.00001, // 1000 satoshis
        minClaimInterval: 60, // 60 minutes
        maxDailyClaims: 24,
        isActive: true,
        walletAddress: process.env.BTC_WALLET_ADDRESS || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        totalDistributed: 0,
        totalClaims: 0,
      },
      {
        currency: 'ETH',
        rewardAmount: 0.0005,
        minClaimInterval: 60,
        maxDailyClaims: 24,
        isActive: true,
        walletAddress: process.env.ETH_WALLET_ADDRESS || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        totalDistributed: 0,
        totalClaims: 0,
      },
      {
        currency: 'USDT',
        rewardAmount: 0.5,
        minClaimInterval: 60,
        maxDailyClaims: 24,
        isActive: true,
        walletAddress: process.env.USDT_WALLET_ADDRESS || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        totalDistributed: 0,
        totalClaims: 0,
      },
      {
        currency: 'DOGE',
        rewardAmount: 5,
        minClaimInterval: 60,
        maxDailyClaims: 24,
        isActive: true,
        walletAddress: process.env.DOGE_WALLET_ADDRESS || 'DH5yaieqoZN36fDVciNyRueRGvGLR3mr7L',
        totalDistributed: 0,
        totalClaims: 0,
      },
    ];

    // Insert faucet configurations
    const inserted = await FaucetConfig.insertMany(faucets);
    logger.info(`Created ${inserted.length} faucet configurations`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nFaucet Configurations:');
    inserted.forEach(faucet => {
      console.log(`  - ${faucet.currency}: ${faucet.rewardAmount} (every ${faucet.minClaimInterval} minutes)`);
    });

    process.exit(0);
  } catch (error) {
    logger.error(`Seed error: ${error.message}`);
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

// Run seed
seedData();
