const { Schema, model } = require('mongoose');
module.exports = model(
  'ChatbotKnowledge',
  new Schema(
    {
      question: String,
      answer: String,
      category: String,
      tags: [String],
      isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
  )
);