require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log('🚀 Starting Emvasi WhatsApp Bot...');

// Find Chrome path
const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe'
];

let chromePath = null;
const fs = require('fs');
for (const path of chromePaths) {
    if (fs.existsSync(path)) {
        chromePath = path;
        console.log('✅ Found Chrome at:', path);
        break;
    }
}

// Create WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: false, // Set to true after first scan
        executablePath: chromePath,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--proxy-server=http://proxy02.uniswa.sz:3128'
        ]
    }
});

// Generate QR code for scanning
client.on('qr', (qr) => {
    console.log('\n📱 ==================================');
    console.log('     SCAN THIS QR CODE WITH WHATSAPP');
    console.log('==================================\n');
    qrcode.generate(qr, { small: true });
    console.log('\n1. Open WhatsApp on your phone');
    console.log('2. Go to Settings > Linked Devices');
    console.log('3. Tap "Link a Device"');
    console.log('4. Scan the QR code above\n');
    console.log('Waiting for scan...\n');
});

client.on('ready', () => {
    console.log('✅ WhatsApp client is ready!');
    console.log('📱 Bot is now listening for messages...\n');
});

client.on('authenticated', () => {
    console.log('✅ WhatsApp authentication successful!');
});

client.on('auth_failure', (msg) => {
    console.error('❌ Authentication failed:', msg);
});

client.on('disconnected', (reason) => {
    console.log('❌ Client disconnected:', reason);
});

// Handle incoming messages
client.on('message', async (message) => {
    // Ignore group messages
    if (message.from.includes('@g.us')) {
        return;
    }

    const phoneNumber = message.from.split('@')[0];
    const messageText = message.body;
    
    console.log(`📱 [${new Date().toLocaleTimeString()}] ${phoneNumber}: ${messageText}`);

    try {
        // Simple responses for testing
        if (messageText.toLowerCase() === 'ping') {
            await message.reply('pong! 🏓');
        } else if (messageText.toLowerCase().includes('hello') || messageText.toLowerCase().includes('hi')) {
            await message.reply('👋 Hello! Welcome to Emvasi Alumni Club!\n\nType *help* to see what I can do.');
        } else if (messageText.toLowerCase() === 'help') {
            await message.reply(`📋 *Available Commands*

• *ping* - Test connection
• *plans* - View membership plans
• *about* - About Emvasi Alumni Club
• *register* - Free registration
• *events* - Upcoming events

Type anything else and I'll try to help!`);
        } else if (messageText.toLowerCase() === 'plans') {
            await message.reply(`📋 *Membership Plans*

*Elementary*
Monthly: E100 | Annual: E1,000

*Vantage*
Monthly: E120 | Annual: E1,200

*Premium*
Monthly: E150 | Annual: E1,500

*Quantum*
Monthly: E170 | Annual: E1,700

Reply *subscribe* to get started!`);
        } else if (messageText.toLowerCase() === 'about') {
            await message.reply(`🏛️ *Emvasi Alumni Club*

We connect UNESWA graduates worldwide.

🌐 Website: https://emvasi-alumni-club.infinityfreeapp.com
🎓 UNESWA: https://www.uneswa.ac.sz/

*Registration is FREE!* Join our growing community today.`);
        } else if (messageText.toLowerCase() === 'events') {
            await message.reply(`📅 *Upcoming Events*

• Alumni Networking Mixer - June 20, 2026
• Career Development Workshop - July 5, 2026
• Annual General Meeting - August 15, 2026

More details coming soon!`);
        } else {
            await message.reply(`Thanks for your message! I'm a demo bot for Emvasi Alumni Club.\n\nType *help* to see what I can do.`);
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
});

// Start the client
client.initialize();

// Keep the process running
process.on('SIGINT', async () => {
    console.log('\n👋 Shutting down...');
    await client.destroy();
    process.exit(0);
});