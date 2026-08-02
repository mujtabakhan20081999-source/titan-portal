const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'default' },
    general: {
      systemName: { type: String, default: 'TITAN SMS' },
      timezone: { type: String, default: 'Asia/Karachi' },
      maintenance: { type: Boolean, default: false },
      registration: { type: Boolean, default: true },
    },
    email: {
      host: { type: String, default: '' },
      port: { type: String, default: '587' },
      fromEmail: { type: String, default: '' },
      enabled: { type: Boolean, default: false },
    },
    sms: {
      provider: { type: String, default: 'Twilio' },
      senderId: { type: String, default: 'TITAN' },
      apiKey: { type: String, default: '' },
      enabled: { type: Boolean, default: false },
    },
    payment: {
      currency: { type: String, default: 'PKR (Rs)' },
      lateFee: { type: String, default: '500' },
      onlinePayments: { type: Boolean, default: true },
    },
    backup: {
      frequency: { type: String, default: 'Daily' },
      retention: { type: String, default: '30' },
      autoBackup: { type: Boolean, default: true },
      lastBackupAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
