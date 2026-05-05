const { STATES, MESSAGES, MAIN_MENU } = require('../config/constants');
const sheetsService = require('../services/sheets');
const whatsappService = require('../services/whatsapp');
const geminiService = require('../services/gemini');
const stateManager = require('../services/stateManager');
const registrationHandler = require('./registration');
const subscriptionHandler = require('./subscription');
const engagementHandler = require('./engagement');
const menuHandler = require('./menuHandler');
const logger = require('../utils/logger');
const { validateEmail } = require('../utils/validators');

class MessageHandler {
  async handleIncomingMessage(phoneNumber, message, name = '') {
    try {
      const messageLower = message.toLowerCase().trim();
      
      // Check for cancel command first (highest priority)
      if (messageLower === 'cancel') {
        return await this.handleCancel(phoneNumber);
      }

      // Get current user state
      const currentState = stateManager.getState(phoneNumber);
      
      // Route based on state
      if (currentState !== STATES.IDLE) {
        return await this.handleStatefulResponse(phoneNumber, message, currentState);
      }

      // Handle menu options and commands
      return await this.handleMenuSelection(phoneNumber, message);
      
    } catch (error) {
      logger.error('Error handling message:', error);
      await whatsappService.sendText(phoneNumber, MESSAGES.ERROR_GENERIC);
    }
  }

  async handleStatefulResponse(phoneNumber, message, state) {
    switch (state) {
      case STATES.AWAITING_NAME:
        await registrationHandler.handleNameResponse(phoneNumber, message);
        break;
        
      case STATES.AWAITING_EMAIL:
        await registrationHandler.handleEmailResponse(phoneNumber, message);
        break;
        
      case STATES.AWAITING_PLAN_SELECTION:
        await subscriptionHandler.handlePlanSelection(phoneNumber, message);
        break;
        
      case STATES.AWAITING_BILLING_CYCLE:
        await subscriptionHandler.handleBillingCycle(phoneNumber, message);
        break;
        
      case STATES.AWAITING_POLL_RESPONSE:
        await engagementHandler.handlePollResponse(phoneNumber, message);
        break;
        
      case STATES.AWAITING_QUESTION:
        await this.handleAIQuestion(phoneNumber, message);
        break;
        
      default:
        await this.handleMenuSelection(phoneNumber, message);
    }
  }

  async handleMenuSelection(phoneNumber, message) {
    const user = await sheetsService.findUser(phoneNumber);
    
    // Check if this is first interaction
    if (!user) {
      stateManager.setState(phoneNumber, STATES.AWAITING_NAME);
      await whatsappService.sendText(phoneNumber, MESSAGES.WELCOME_FIRST_TIME);
      return;
    }

    // Update visit count
    await sheetsService.createOrUpdateUser({ phone: phoneNumber });

    const messageLower = message.toLowerCase();
    
    // Route based on message content
    if (messageLower.includes('plan') || messageLower === '1') {
      await this.showMembershipPlans(phoneNumber);
    } else if (messageLower.includes('register') || messageLower === '2') {
      await registrationHandler.startRegistration(phoneNumber, user);
    } else if (messageLower.includes('subscribe') || messageLower === '3') {
      await subscriptionHandler.startSubscription(phoneNumber, user);
    } else if (messageLower.includes('about') || messageLower === '4') {
      await this.showAbout(phoneNumber);
    } else if (messageLower.includes('news') || messageLower.includes('event') || messageLower === '5') {
      await engagementHandler.showNewsAndEvents(phoneNumber);
    } else if (messageLower.includes('reminder') || messageLower === '6') {
      await engagementHandler.handleReminderRequest(phoneNumber, user);
    } else if (messageLower.includes('question') || messageLower === '7') {
      await this.startAIQuestion(phoneNumber);
    } else {
      // Treat as AI question
      await this.handleAIQuestion(phoneNumber, message);
    }
  }

  async handleCancel(phoneNumber) {
    stateManager.clearState(phoneNumber);
    await whatsappService.sendText(phoneNumber, MESSAGES.CANCEL_MESSAGE);
    await menuHandler.showMainMenu(phoneNumber);
  }

  async showMembershipPlans(phoneNumber) {
    const plansList = `
📋 *Membership Plans*

Choose monthly or annual billing:

*Elementary*
• Monthly: E100
• Annual: E1,000

*Vantage*
• Monthly: E120
• Annual: E1,200

*Premium*
• Monthly: E150
• Annual: E1,500

*Quantum*
• Monthly: E170
• Annual: E1,700

Reply with "subscribe" to get started!`;

    await whatsappService.sendText(phoneNumber, plansList);
    await menuHandler.showMainMenu(phoneNumber);
  }

  async showAbout(phoneNumber) {
    const aboutMessage = `🏛️ *About Emvasi Alumni Club*

We are the official alumni engagement platform for UNESWA graduates. Our mission is to keep alumni connected, informed, and involved with their alma mater.

*What we offer:*
• Networking opportunities
• Exclusive events and reunions
• Mentorship programs
• News and updates from UNESWA
• Support for the UNESWA Endowment Fund

🌐 Website: https://emvasi-alumni-club.infinityfreeapp.com
🎓 UNESWA: https://www.uneswa.ac.sz/

Join us in building a stronger alumni community!`;

    await whatsappService.sendText(phoneNumber, aboutMessage);
    await menuHandler.showMainMenu(phoneNumber);
  }

  async startAIQuestion(phoneNumber) {
    stateManager.setState(phoneNumber, STATES.AWAITING_QUESTION);
    await whatsappService.sendText(phoneNumber, 
      '🤖 *Ask Me Anything*\n\n' +
      'I\'m here to help with questions about:\n' +
      '• Membership and subscriptions\n' +
      '• Upcoming events\n' +
      '• UNESWA news\n' +
      '• Alumni benefits\n\n' +
      'What would you like to know?'
    );
  }

  async handleAIQuestion(phoneNumber, question) {
    await whatsappService.sendText(phoneNumber, MESSAGES.AI_FALLBACK);
    
    const answer = await geminiService.getResponse(question);
    await whatsappService.sendText(phoneNumber, answer);
    
    stateManager.clearState(phoneNumber);
    await menuHandler.showMainMenu(phoneNumber);
  }
}

module.exports = new MessageHandler();