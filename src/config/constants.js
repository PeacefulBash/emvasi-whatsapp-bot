module.exports = {
  // Menu Options
  MAIN_MENU: {
    PLANS: '📋 Membership Plans',
    REGISTER: '✅ Register Now',
    SUBSCRIBE: '💳 Subscribe',
    ABOUT: '🏛️ About Our Organization',
    NEWS: '📢 Latest News & Events',
    REMINDERS: '🔔 Get Reminders',
    QUESTION: '❓ Ask a Question'
  },

  // Subscription Plans
  PLANS: {
    ELEMENTARY: {
      name: 'Elementary',
      monthly: 100,
      annual: 1000
    },
    VANTAGE: {
      name: 'Vantage',
      monthly: 120,
      annual: 1200
    },
    PREMIUM: {
      name: 'Premium',
      monthly: 150,
      annual: 1500
    },
    QUANTUM: {
      name: 'Quantum',
      monthly: 170,
      annual: 1700
    }
  },

  // Bot Messages
  MESSAGES: {
    WELCOME_FIRST_TIME: '👋 Welcome to Emvasi Alumni Club! I\'m your engagement assistant.\n\nTo get started, what\'s your full name?',
    WELCOME_RETURNING: (name) => `👋 Welcome back, ${name}! How can I help you today?`,
    ASK_EMAIL: '📧 Great! Now, what\'s your email address?',
    REGISTRATION_COMPLETE: (name) => `✅ Thanks ${name}! You\'re now registered with Emvasi Alumni Club.\n\n🎉 Welcome to the community!`,
    CANCEL_MESSAGE: '✅ Operation cancelled. How else can I help you?',
    INVALID_EMAIL: '❌ That doesn\'t look like a valid email. Please try again or type "cancel" to exit.',
    AI_FALLBACK: '🤖 Let me check that for you...',
    GOODBYE: '👋 Thank you for engaging with Emvasi Alumni Club. Have a great day!',
    ERROR_GENERIC: '❌ Sorry, something went wrong. Please try again later.'
  },

  // AI Context
  AI_CONTEXT: `You are Emvasi, the friendly engagement assistant for Emvasi Alumni Club and UNESWA Endowment Fund.

Club info:
- Registration is FREE
- Subscriptions: monthly or annual plans (Elementary E100/E1000, Vantage E120/E1200, Premium E150/E1500, Quantum E170/E1700)
- Website: https://emvasi-alumni-club.infinityfreeapp.com
- UNESWA: https://www.uneswa.ac.sz/
- Foundation: https://www.uneswafoundation.org.sz/

Answer briefly (1-2 sentences). Be warm, helpful, and focused on keeping members engaged. If you don't know, suggest checking the website or asking about events.`,

  // Conversation States
  STATES: {
    IDLE: 'idle',
    AWAITING_NAME: 'awaiting_name',
    AWAITING_EMAIL: 'awaiting_email',
    AWAITING_PLAN_SELECTION: 'awaiting_plan_selection',
    AWAITING_BILLING_CYCLE: 'awaiting_billing_cycle',
    AWAITING_POLL_RESPONSE: 'awaiting_poll_response',
    AWAITING_QUESTION: 'awaiting_question'
  },

  // Payment Links (Replace with actual Google Form links)
  PAYMENT_LINKS: {
    ELEMENTARY_MONTHLY: 'https://forms.gle/elementary-monthly',
    ELEMENTARY_ANNUAL: 'https://forms.gle/elementary-annual',
    VANTAGE_MONTHLY: 'https://forms.gle/vantage-monthly',
    VANTAGE_ANNUAL: 'https://forms.gle/vantage-annual',
    PREMIUM_MONTHLY: 'https://forms.gle/premium-monthly',
    PREMIUM_ANNUAL: 'https://forms.gle/premium-annual',
    QUANTUM_MONTHLY: 'https://forms.gle/quantum-monthly',
    QUANTUM_ANNUAL: 'https://forms.gle/quantum-annual'
  }
};