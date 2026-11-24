const { GoogleGenAI } = require('@google/genai');
const env = require('../../config/env');
const ApiError = require('../../shared/ApiError');
const { Product, Variant, Addon, Branch, Inventory } = require('../../models');

// Initialize with the API key from your .env file
const ai = env.geminiKey ? new GoogleGenAI({ apiKey: env.geminiKey }) : null;

async function buildContext(branchId) {
  const [products, variants, addons, branches, inventory] = await Promise.all([
    Product.find({ isActive: true }).lean(),
    Variant.find({ isActive: true }).lean(),
    Addon.find({ isActive: true }).lean(),
    Branch.find({ isActive: true }).lean(),
    branchId ? Inventory.find({ branchId }).lean() : [],
  ]);

  return {
    products: products.map((p) => ({ name: p.name, desc: p.description, isVIP: p.isVIP })),
    variants: variants.map((v) => ({ name: v.name, pricePkr: v.price / 100 })),
    addons: addons.map((a) => ({ name: a.name, pricePkr: a.price / 100 })),
    branches: branches.map((b) => ({ name: b.name, address: b.address, phone: b.phone })),
    inventory: inventory.filter(i => i.availableQuantity > 0).map((i) => i.productId),
  };
}

async function chat({ message, branchId, history = [] }) {
  if (!message || typeof message !== 'string' || !message.trim()) {
    throw new ApiError(400, 'Message is required');
  }

  if (!ai) {
    console.error('❌ CHATBOT ERROR: GEMINI_API_KEY is missing in .env');
    return { reply: 'The AI assistant is currently offline (Missing API Key).', grounded: false };
  }

  try {
    const context = await buildContext(branchId);
    
    const systemPrompt = `You are Black Cafe's AI assistant. Answer ONLY using the LIVE BUSINESS DATA below. 
If you don't know the answer, tell the customer to call the branch.
Keep replies friendly, short, and under 80 words.

LIVE DATA: 
${JSON.stringify(context).slice(0, 8000)}`;

    // Format the history correctly for the new SDK
    const contents = history.map(h => ({
      role: h.role === 'assistant' || h.role === 'model' ? 'model' : 'user',
      parts: [{ text: h.content }]
    }));

    // Add the current user message
    contents.push({ role: 'user', parts: [{ text: message }] });

    // Inject the system prompt into the first message
    if (contents.length > 0) {
      contents[0].parts[0].text = `${systemPrompt}\n\nCustomer: ${contents[0].parts[0].text}`;
    }

    // Use the exact method and model from the official SDK docs
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001', 
      contents: contents,
    });

    return { 
      reply: response.text, 
      grounded: true 
    };
  } catch (err) {
    console.error('\n=============================================');
    console.error('❌ GEMINI API ERROR:', err.message);
    console.error('=============================================\n');
    
    return { reply: 'Sorry, my AI brain is having trouble connecting right now.', grounded: false };
  }
}

module.exports = { chat, buildContext };