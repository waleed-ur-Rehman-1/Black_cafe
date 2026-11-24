const { Schema, model } = require('mongoose');
module.exports = model(
  'ChatbotConversation',
  new Schema(
    {
      sessionId: { type: String, index: true },
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
      messages: [{ role: String, content: String, at: Date }],
    },
    { timestamps: true }
  )
);