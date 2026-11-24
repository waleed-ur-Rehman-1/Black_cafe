const cron = require('node-cron');
const { Payment } = require('../models');

// Every 5 minutes, mark abandoned PENDING payments older than 30 min as EXPIRED
cron.schedule('*/5 * * * *', async () => {
  try {
    const cutoff = new Date(Date.now() - 30 * 60 * 1000);
    await Payment.updateMany(
      { status: 'PENDING', createdAt: { $lt: cutoff } },
      { $set: { status: 'EXPIRED' } }
    );
  } catch (e) {
    console.error('reconcilePayments error', e);
  }
});