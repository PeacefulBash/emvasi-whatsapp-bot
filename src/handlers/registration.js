const { STATES, MESSAGES } = require('../config/constants');
const sheetsService = require('../services/sheets');
const whatsappService = require('../services/whatsapp');
const stateManager = require('../services/stateManager');
const menuHandler = require('./menuHandler');
const { validateEmail } = require('../utils/validators');
const logger = require('../utils/logger');

class RegistrationHandler {
  async startRegistration(phoneNumber, user) {
    if (user && user.registered) {
      await whatsappService.sendText(phoneNumber, 
        '✅ You\'re already registered with us! You can now subscribe to any of our membership plans.'
      );
      await menuHandler.showMainMenu(phoneNumber);
      return;
    }

    stateManager.setState(phoneNumber, STATES.AWAITING_NAME);
    await whatsappService.sendText(phoneNumber, 
      '📝 *Free Registration*\n\n' +
      'Let\'s get you registered with Emvasi Alumni Club. This is completely FREE!\n\n' +
      'What\'s your full name?'
    );
  }

  async handleNameResponse(phoneNumber, fullName) {
    if (fullName.length < 3) {
      await whatsappService.sendText(phoneNumber, 
        '❌ Please enter your full name (at least 3 characters) or type "cancel" to exit.'
      );
      return;
    }

    // Store name temporarily
    const firstName = fullName.split(' ')[0];
    stateManager.setTempData(phoneNumber, 'fullName', fullName);
    stateManager.setTempData(phoneNumber, 'firstName', firstName);
    
    stateManager.setState(phoneNumber, STATES.AWAITING_EMAIL);
    await whatsappService.sendText(phoneNumber, MESSAGES.ASK_EMAIL);
  }

  async handleEmailResponse(phoneNumber, email) {
    if (!validateEmail(email)) {
      await whatsappService.sendText(phoneNumber, MESSAGES.INVALID_EMAIL);
      return;
    }

    const fullName = stateManager.getTempData(phoneNumber, 'fullName');
    const firstName = stateManager.getTempData(phoneNumber, 'firstName');

    // Save to Google Sheets
    await sheetsService.createOrUpdateUser({
      phone: phoneNumber,
      firstName: firstName,
      fullName: fullName,
      email: email,
      registered: true
    });

    // Clear state
    stateManager.clearState(phoneNumber);

    // Send confirmation
    await whatsappService.sendText(phoneNumber, MESSAGES.REGISTRATION_COMPLETE(firstName));
    
    const welcomeMessage = `🎉 *Welcome to Emvasi Alumni Club!*

Here's what you can do now:
• Subscribe to membership plans
• Get event reminders
• Access exclusive alumni content
• Network with fellow alumni

Would you like to see our membership plans? Reply "plans" or use the menu below.`;

    await whatsappService.sendText(phoneNumber, welcomeMessage);
    await menuHandler.showMainMenu(phoneNumber);
  }

  async autoRegisterForSubscription(phoneNumber) {
    stateManager.setState(phoneNumber, STATES.AWAITING_NAME);
    stateManager.setTempData(phoneNumber, 'autoRegister', true);
    
    await whatsappService.sendText(phoneNumber,
      '📝 *Quick Registration*\n\n' +
      'To subscribe, we\'ll need to register you first. This is FREE and takes just a moment.\n\n' +
      'What\'s your full name?'
    );
  }
}

module.exports = new RegistrationHandler();