#!/usr/bin/env node
require('dotenv').config();
const readline = require('readline');
const sheetsService = require('../src/services/sheets');
const whatsappService = require('../src/services/whatsapp');
const logger = require('../src/utils/logger');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function sendBroadcast() {
  console.log('\n📢 Emvasi Alumni Club - Broadcast Tool\n');
  
  rl.question('Enter broadcast message: ', async (message) => {
    if (!message || message.trim().length === 0) {
      console.log('❌ Message cannot be empty');
      rl.close();
      return;
    }

    rl.question('Enter secret key: ', async (secret) => {
      if (secret !== process.env.BROADCAST_SECRET_KEY) {
        console.log('❌ Invalid secret key');
        rl.close();
        return;
      }

      console.log('\n📤 Fetching subscribers...');
      const users = await sheetsService.getAllSubscribedUsers();
      
      console.log(`📊 Found ${users.length} subscribers\n`);
      
      rl.question(`Send broadcast to ${users.length} users? (yes/no): `, async (confirm) => {
        if (confirm.toLowerCase() !== 'yes') {
          console.log('❌ Broadcast cancelled');
          rl.close();
          return;
        }

        console.log('\n🚀 Sending broadcast...');
        
        let sent = 0;
        let failed = 0;
        
        for (let i = 0; i < users.length; i++) {
          const phoneNumber = users[i];
          try {
            await whatsappService.sendText(phoneNumber, `📢 *Emvasi Alumni Update*\n\n${message}`);
            sent++;
            console.log(`✅ Sent to ${phoneNumber} (${sent}/${users.length})`);
            
            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
          } catch (error) {
            failed++;
            console.log(`❌ Failed: ${phoneNumber}`);
            logger.error(`Broadcast failed for ${phoneNumber}:`, error.message);
          }
        }
        
        await sheetsService.logBroadcast(message, sent);
        
        console.log('\n📊 Broadcast Complete!');
        console.log(`✅ Sent: ${sent}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`📝 Total: ${users.length}`);
        
        rl.close();
      });
    });
  });
}

sendBroadcast();