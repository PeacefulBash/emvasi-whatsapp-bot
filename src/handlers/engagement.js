const sheetsService = require('../services/sheets');
const whatsappService = require('../services/whatsapp');
const stateManager = require('../services/stateManager');
const menuHandler = require('./menuHandler');
const { STATES } = require('../config/constants');
const logger = require('../utils/logger');

class EngagementHandler {
  async showNewsAndEvents(phoneNumber) {
    const events = await sheetsService.getUpcomingEvents();
    
    if (events.length === 0) {
      await whatsappService.sendText(phoneNumber,
        '📢 *Latest News & Events*\n\n' +
        'No upcoming events scheduled at the moment.\n\n' +
        'Check back soon or visit our website for updates:\n' +
        'https://emvasi-alumni-club.infinityfreeapp.com'
      );
    } else {
      let eventsMessage = '📢 *Upcoming Events*\n\n';
      
      events.slice(0, 5).forEach((event, index) => {
        const eventDate = event.date.toLocaleDateString('en-GB', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        eventsMessage += `*${index + 1}. ${event.title}*\n`;
        eventsMessage += `📅 ${eventDate}\n`;
        eventsMessage += `📝 ${event.description}\n\n`;
      });

      eventsMessage += 'Would you like a reminder for any of these events? Reply "reminder" or use the menu.';
      
      await whatsappService.sendText(phoneNumber, eventsMessage);
    }
    
    await menuHandler.showMainMenu(phoneNumber);
  }

  async handleReminderRequest(phoneNumber, user) {
    if (user && user.reminderOptIn) {
      await whatsappService.sendText(phoneNumber,
        '🔔 You\'re already signed up for reminders! You\'ll receive notifications about upcoming events and important updates.'
      );
    } else {
      await sheetsService.createOrUpdateUser({
        phone: phoneNumber,
        reminderOptIn: true
      });

      await whatsappService.sendText(phoneNumber,
        '✅ *Reminders Activated!*\n\n' +
        'You\'ll now receive notifications about:\n' +
        '• Upcoming alumni events\n' +
        '• Important announcements\n' +
        '• Membership renewal dates\n\n' +
        'You can turn off reminders anytime by typing "cancel reminders".'
      );
    }
    
    await menuHandler.showMainMenu(phoneNumber);
  }

  async sendPoll(phoneNumber, pollQuestion, options) {
    stateManager.setState(phoneNumber, STATES.AWAITING_POLL_RESPONSE);
    stateManager.setTempData(phoneNumber, 'pollId', Date.now().toString());
    
    await whatsappService.sendPoll(phoneNumber, pollQuestion, options);
  }

  async handlePollResponse(phoneNumber, response) {
    const pollId = stateManager.getTempData(phoneNumber, 'pollId');
    
    await sheetsService.savePollResponse(phoneNumber, pollId, response);
    await whatsappService.sendText(phoneNumber, 
      '✅ Thank you for your response! Your feedback helps us improve our alumni community.'
    );
    
    stateManager.clearState(phoneNumber);
    await menuHandler.showMainMenu(phoneNumber);
  }
}

module.exports = new EngagementHandler();