const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');

console.log('🚀 Emvasi Alumni Bot Starting...');

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('auth');
    
    const sock = makeWASocket({
        printQRInTerminal: false,
        auth: state
    });

    sock.ev.on('connection.update', ({ connection, qr }) => {
        if (qr) {
            console.log('\n📱 SCAN WITH WHATSAPP:\n');
            qrcode.generate(qr, { small: true });
        }
        if (connection === 'open') {
            console.log('✅ Connected!\n');
        }
        if (connection === 'close') {
            console.log('❌ Disconnected. Restarting...');
            start();
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;
        
        const text = msg.message.conversation || '';
        const sender = msg.key.remoteJid;
        
        console.log(`📱 ${sender.split('@')[0]}: ${text}`);

        // Simple responses
        if (text.toLowerCase() === 'ping') {
            await sock.sendMessage(sender, { text: 'pong! 🏓' });
        } else if (text.toLowerCase().includes('plan')) {
            await sock.sendMessage(sender, { 
                text: '📋 *Membership Plans*\n\nElementary: E100/mo or E1000/yr\nVantage: E120/mo or E1200/yr\nPremium: E150/mo or E1500/yr\nQuantum: E170/mo or E1700/yr'
            });
        } else {
            await sock.sendMessage(sender, { 
                text: '👋 Welcome to Emvasi Alumni Club!\n\nType:\n• *plans* - View membership\n• *ping* - Test connection'
            });
        }
    });
}

start();