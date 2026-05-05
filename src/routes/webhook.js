const express = require('express');
const router = express.Router();
const messageHandler = require('../handlers/messageHandler');
const subscriptionHandler = require('../handlers/subscription');
const logger = require('../utils/logger');

// Webhook endpoint for Evolution API
router.post('/whatsapp', async (req, res) => {
  try {
    const { data } = req.body;
    
    // Check if it's a message event
    if (data && data.event === 'messages.upsert') {
      const message = data.message;
      
      // Ignore messages from the bot itself
      if (message.fromMe) {
        return res.status(200).json({ status: 'ignored' });
      }

      const phoneNumber = message.remoteJid.split('@')[0];
      const messageText = message.conversation || message.extendedTextMessage?.text || '';
      const senderName = message.pushName || '';

      // Handle payment confirmation
      if (messageText.toLowerCase() === 'done') {
        await subscriptionHandler.confirmPayment(phoneNumber);
        return res.status(200).json({ status: 'processed' });
      }

      // Process message
      await messageHandler.handleIncomingMessage(phoneNumber, messageText, senderName);
    }

    res.status(200).json({ status: 'received' });
  } catch (error) {
    logger.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Broadcast endpoint (admin only)
router.post('/broadcast', async (req, res) => {
  try {
    const { secret, message } = req.body;
    
    if (secret !== process.env.BROADCAST_SECRET_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const sheetsService = require('../services/sheets');
    const whatsappService = require('../services/whatsapp');
    
    const users = await sheetsService.getAllSubscribedUsers();
    
    let sent = 0;
    let failed = 0;
    
    for (const phoneNumber of users) {
      try {
        await whatsappService.sendText(phoneNumber, `📢 *Announcement*\n\n${message}`);
        sent++;
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        failed++;
        logger.error(`Failed to send broadcast to ${phoneNumber}:`, error);
      }
    }
    
    await sheetsService.logBroadcast(message, sent);
    
    res.json({
      success: true,
      stats: { sent, failed, total: users.length }
    });
  } catch (error) {
    logger.error('Broadcast error:', error);
    res.status(500).json({ error: 'Broadcast failed' });
  }
});

module.exports = router;