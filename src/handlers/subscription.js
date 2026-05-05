const { STATES, PLANS, PAYMENT_LINKS } = require('../config/constants');
const sheetsService = require('../services/sheets');
const whatsappService = require('../services/whatsapp');
const stateManager = require('../services/stateManager');
const registrationHandler = require('./registration');
const menuHandler = require('./menuHandler');
const logger = require('../utils/logger');

class SubscriptionHandler {
  async startSubscription(phoneNumber, user) {
    // Check if user is registered
    if (!user || !user.registered) {
      await whatsappService.sendText(phoneNumber,
        '📝 You\'ll need to register first. Let\'s do that now - it\'s FREE!'
      );
      await registrationHandler.autoRegisterForSubscription(phoneNumber);
      return;
    }

    // Show plans
    await this.showPlans(phoneNumber);
  }

  async showPlans(phoneNumber) {
    stateManager.setState(phoneNumber, STATES.AWAITING_PLAN_SELECTION);
    
    const plansMessage = `💳 *Choose Your Plan*

Reply with the number of your preferred plan:

1️⃣ *Elementary*
   Monthly: E100 | Annual: E1,000

2️⃣ *Vantage*
   Monthly: E120 | Annual: E1,200

3️⃣ *Premium*
   Monthly: E150 | Annual: E1,500

4️⃣ *Quantum*
   Monthly: E170 | Annual: E1,700

Type the number (1-4) to select.`;

    await whatsappService.sendText(phoneNumber, plansMessage);
  }

  async handlePlanSelection(phoneNumber, selection) {
    const planMap = {
      '1': 'ELEMENTARY',
      '2': 'VANTAGE',
      '3': 'PREMIUM',
      '4': 'QUANTUM'
    };

    const selectedPlan = planMap[selection];
    
    if (!selectedPlan) {
      await whatsappService.sendText(phoneNumber,
        '❌ Please select a valid plan (1-4) or type "cancel" to exit.'
      );
      return;
    }

    // Store selected plan
    stateManager.setTempData(phoneNumber, 'selectedPlan', selectedPlan);
    stateManager.setState(phoneNumber, STATES.AWAITING_BILLING_CYCLE);

    const planDetails = PLANS[selectedPlan];
    
    const billingMessage = `📅 *Billing Cycle*

You selected: *${planDetails.name}*

Choose your billing cycle:

1️⃣ Monthly - E${planDetails.monthly}/month
2️⃣ Annual - E${planDetails.annual}/year (Save E${planDetails.monthly * 12 - planDetails.annual}!)

Reply with 1 for Monthly or 2 for Annual.`;

    await whatsappService.sendText(phoneNumber, billingMessage);
  }

  async handleBillingCycle(phoneNumber, selection) {
    const cycleMap = {
      '1': 'monthly',
      '2': 'annual'
    };

    const selectedCycle = cycleMap[selection];
    
    if (!selectedCycle) {
      await whatsappService.sendText(phoneNumber,
        '❌ Please select 1 for Monthly or 2 for Annual.'
      );
      return;
    }

    const planKey = stateManager.getTempData(phoneNumber, 'selectedPlan');
    const planDetails = PLANS[planKey];
    
    // Store billing cycle
    stateManager.setTempData(phoneNumber, 'billingCycle', selectedCycle);

    // Get payment link
    const paymentKey = `${planKey}_${selectedCycle.toUpperCase()}`;
    const paymentLink = PAYMENT_LINKS[paymentKey] || 'https://forms.gle/generic-payment-form';

    const amount = selectedCycle === 'monthly' ? planDetails.monthly : planDetails.annual;
    
    const paymentMessage = `💳 *Complete Your Subscription*

*Plan:* ${planDetails.name}
*Billing:* ${selectedCycle}
*Amount:* E${amount}${selectedCycle === 'monthly' ? '/month' : '/year'}

📎 *Payment Link:*
${paymentLink}

After completing payment, reply *DONE* to confirm and activate your subscription.

You'll receive a confirmation once verified.`;

    await whatsappService.sendText(phoneNumber, paymentMessage);
    
    // Update user record with pending subscription
    await sheetsService.createOrUpdateUser({
      phone: phoneNumber,
      subscriptionPlan: planDetails.name,
      billingCycle: selectedCycle,
      subscriptionStatus: 'pending'
    });

    // Clear state
    stateManager.clearState(phoneNumber);
  }

  async confirmPayment(phoneNumber) {
    await sheetsService.createOrUpdateUser({
      phone: phoneNumber,
      subscriptionStatus: 'active'
    });

    await whatsappService.sendText(phoneNumber,
      '✅ *Subscription Activated!*\n\n' +
      'Thank you for subscribing to Emvasi Alumni Club. You now have access to exclusive member benefits!'
    );

    await menuHandler.showMainMenu(phoneNumber);
  }
}

module.exports = new SubscriptionHandler();