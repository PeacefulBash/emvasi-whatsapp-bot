const { MAIN_MENU } = require('../config/constants');
const whatsappService = require('../services/whatsapp');
const logger = require('../utils/logger');

class MenuHandler {
  async showMainMenu(phoneNumber) {
    const menuMessage = `*Main Menu*

Please select an option:

1️⃣ ${MAIN_MENU.PLANS}
2️⃣ ${MAIN_MENU.REGISTER}
3️⃣ ${MAIN_MENU.SUBSCRIBE}
4️⃣ ${MAIN_MENU.ABOUT}
5️⃣ ${MAIN_MENU.NEWS}
6️⃣ ${MAIN_MENU.REMINDERS}
7️⃣ ${MAIN_MENU.QUESTION}

Reply with the number or keyword. Type "cancel" anytime to exit any process.`;

    // Send as buttons for better UX if supported
    const buttons = [
      { buttonText: { displayText: '1. Plans' } },
      { buttonText: { displayText: '2. Register' } },
      { buttonText: { displayText: '3. Subscribe' } }
    ];

    try {
      await whatsappService.sendButtons(phoneNumber, '📱 *Emvasi Alumni Club*', buttons);
      await whatsappService.sendText(phoneNumber, menuMessage);
    } catch (error) {
      // Fallback to text if buttons fail
      await whatsappService.sendText(phoneNumber, menuMessage);
    }
  }
}

module.exports = new MenuHandler();