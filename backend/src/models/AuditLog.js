const { Schema, model } = require('mongoose');
module.exports = model(
  'AuditLog',
  new Schema(
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      action: { type: String, required: true, index: true },
      entity: String,
      entityId: String,
      metadata: Object,
      ip: String,
    },
    { timestamps: true }
  )
);