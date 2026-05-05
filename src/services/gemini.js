const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');
const { AI_CONTEXT } = require('../config/constants');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async getResponse(userQuestion) {
    try {
      const prompt = `${AI_CONTEXT}\n\nUser question: ${userQuestion}\n\nYour response:`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      logger.info(`AI response generated for: "${userQuestion.substring(0, 50)}..."`);
      return text;
    } catch (error) {
      logger.error('Error generating AI response:', error);
      return "I'm having trouble answering that right now. You can check our website at https://emvasi-alumni-club.infinityfreeapp.com or ask about events and membership!";
    }
  }
}

module.exports = new GeminiService();