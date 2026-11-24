const { Schema, model } = require('mongoose');
module.exports = model(
  'Notification',
  new Schema(
    {
      recipient: { type: Schema.Types.ObjectId, ref: 'User' },
      recipientRole: { type: String },
      branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
      type: { type: String, required: true },
      title: String,
      message: String,
      payload: Object,
      isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
  )
);