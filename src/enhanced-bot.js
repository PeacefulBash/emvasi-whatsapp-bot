const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const axios = require("axios");
const fs = require("fs");
const { Pool } = require("pg");

console.log("Emvasi Bot - Starting with PostgreSQL...");

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgres://localhost/emvasi",
    ssl: { rejectUnauthorized: false }
});

// Initialize session table
async function initDB() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS whatsapp_session (
            id TEXT PRIMARY KEY DEFAULT 'default',
            session_data JSONB,
            updated_at TIMESTAMP DEFAULT NOW()
        )
    `);
    console.log("Database ready");
}

// Load session from PostgreSQL
async function loadSession() {
    const result = await pool.query("SELECT session_data FROM whatsapp_session WHERE id = 'default'");
    if (result.rows[0] && result.rows[0].session_data) {
        console.log("Session loaded from database");
        return result.rows[0].session_data;
    }
    return null;
}

// Save session to PostgreSQL
async function saveSession(session) {
    await pool.query(
        `INSERT INTO whatsapp_session (id, session_data, updated_at) 
         VALUES ('default', $1, NOW()) 
         ON CONFLICT (id) 
         DO UPDATE SET session_data = $1, updated_at = NOW()`,
        [JSON.stringify(session)]
    );
}

// Environment detection
const isWindows = process.platform === "win32";

async function getPuppeteerConfig() {
    if (isWindows) {
        const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
        console.log("Using Edge (Windows)");
        return {
            headless: false,
            executablePath: fs.existsSync(edgePath) ? edgePath : undefined,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        };
    } else {
        const chromium = require("@sparticuz/chromium");
        const execPath = await chromium.executablePath();
        console.log("Using Chromium (Linux) at:", execPath);
        return {
            headless: chromium.headless,
            executablePath: execPath,
            args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"]
        };
    }
}

// Custom auth strategy that uses PostgreSQL
class PostgresAuthStrategy {
    constructor() {
        this.session = null;
    }
    
    async save(data) {
        this.session = data;
        await saveSession(data);
    }
    
    async load() {
        if (this.session) return this.session;
        this.session = await loadSession();
        return this.session;
    }
    
    async remove() {
        this.session = null;
        await pool.query("DELETE FROM whatsapp_session WHERE id = 'default'");
    }
}

// ============================================
// COMPLETE KNOWLEDGE BASE
// ============================================

const knowledge = {
    "vice chancellor": "The Vice Chancellor of UNESWA is Professor Justice Thwala.",
    "vc": "The Vice Chancellor of UNESWA is Professor Justice Thwala.",
    "pvc": "The Pro Vice Chancellor of UNESWA is Professor Henry Gadaga.",
    "chancellor": "His Majesty King Mswati III is the Chancellor of UNESWA.",
    "ceo": "Mr. Vuli Simelane is the CEO of UNESWA Endowment Fund.",
    "cmo": "Mr. Musa Simelane is the Chief Marketing Officer of UNESWA Endowment Fund.",
    "board chairperson": "The Board Chairperson is HRH Dr. Nozizwe Mulela.",
    "board": "Board: HRH Dr. Nozizwe Mulela (Chair), Mr. Mbuso Mdluli (Vice Chair), Prof. Justice Thwala, Ms. Salaphi Vilane, Ms. Mbali Sibanyoni, Mr. Mzamo Dlamini, Ms. Gcinile Mndzebele, Mr. Vuli Simelane (CEO).",
    "trustees": "Trustees: HRH Dr. Nozizwe Mulela (Chair), Mr. Mbuso Mdluli (Vice Chair), Prof. Justice Thwala, Ms. Salaphi Vilane, Ms. Mbali Sibanyoni, Mr. Mzamo Dlamini, Ms. Gcinile Mndzebele, Mr. Vuli Simelane.",
    
    "hello": "Hello! Welcome to Emvasi Alumni Club. How can I assist you today?",
    "hi": "Hi there! I am Emvasi, your alumni engagement assistant.",
    "how are you": "I am doing great, thank you! How can I help you with Emvasi Alumni Club today?",
    "thanks": "You're very welcome! Anything else I can help with?",
    
    "gala": "The VIP Gala Dinner is a masquerade ball happening this year! Tickets: E800 individual, E30,000 corporate.",
    "events": "Events: Alumni Mixer (June 20), AGM (Aug 15), Family Fun Day (Sept 12), Gala Dinner (TBA), Music Festival (TBA).",
    "agm": "The Annual General Meeting is on August 15, 2026.",
    
    "endowment fund": "The UNESWA Endowment Fund was established in 2004. CEO is Mr. Vuli Simelane.",
    "emvasi": "Emvasi Alumni Club connects UNESWA graduates worldwide. Launched October 2025. FREE registration!",
    "uneswa": "UNESWA is Eswatini's premier university, founded 1976. Three campuses: Kwaluseni, Luyengo, Mbabane.",
    
    "plans": "Membership Plans:\nElementary: E180/mo\nVantage: E220/mo\nPremium: E270/mo\nQuantum: E355/mo",
    "pricing": "Monthly: Elementary E180, Vantage E220, Premium E270, Quantum E355.",
    "quantum": "Quantum is our premier tier at E355/month with full benefits.",
    
    "register": "Register FREE at: https://emvasi-alumni-club.infinityfreeapp.com",
    "registration": "FREE registration at https://emvasi-alumni-club.infinityfreeapp.com",
    
    "benefits": "Benefits: Clubhouse access, events, networking, mentorship, facility discounts.",
    "clubhouse": "The Clubhouse at Sports Emporium features gym, Olympic pool, wellness center, coffee shop, and restaurant.",
    
    "contact": "Email: alumni_uf@uneswa.ac.sz | Phone: +268 76369232",
    "website": "https://emvasi-alumni-club.infinityfreeapp.com",
    
    "help": "I can answer about: Leadership, Events, Membership Plans, Registration, Benefits, UNESWA, and more!",
    "menu": "EMVASI ALUMNI CLUB\n\nAsk me about: Leadership, Events, Plans, Registration, Benefits, UNESWA!"
};

// ============================================
// WEB SEARCH
// ============================================

async function webSearch(query) {
    try {
        const url = "https://api.duckduckgo.com/?q=" + encodeURIComponent(query) + "&format=json&no_html=1";
        const response = await axios.get(url, { timeout: 5000 });
        if (response.data && response.data.AbstractText) {
            return response.data.AbstractText.substring(0, 500);
        }
        return null;
    } catch (error) {
        return null;
    }
}

// ============================================
// FIND ANSWER
// ============================================

function findAnswer(question) {
    const q = question.toLowerCase().trim();
    for (let key in knowledge) {
        if (q.includes(key)) {
            return knowledge[key];
        }
    }
    return null;
}

// ============================================
// START BOT
// ============================================

async function startBot() {
    // Initialize database
    await initDB();
    
    // Get puppeteer config
    const config = await getPuppeteerConfig();
    
    // Create client with PostgreSQL auth
    const authStrategy = new PostgresAuthStrategy();
    
    const client = new Client({
        authStrategy: {
            save: (data) => authStrategy.save(data),
            load: () => authStrategy.load(),
            remove: () => authStrategy.remove()
        },
        puppeteer: config
    });
    
    client.on("qr", (qr) => {
        console.log("\nSCAN QR CODE:\n");
        qrcode.generate(qr, { small: true });
    });
    
    client.on("ready", () => {
        console.log("Emvasi Bot ONLINE at", new Date().toLocaleTimeString());
    });
    
    client.on("message", async (message) => {
        try {
            if (message.from.includes("@g.us") || message.fromMe) return;
            
            const chat = await message.getChat();
            const text = message.body.trim();
            const lowerText = text.toLowerCase();
            
            console.log("[" + message.from.split("@")[0] + "]: " + text);
            
            await chat.sendStateTyping();
            
            let answer = findAnswer(text);
            if (answer) {
                await chat.sendMessage(answer);
                return;
            }
            
            if (lowerText.includes("register") || lowerText.includes("join")) {
                await chat.sendMessage("Register FREE at: https://emvasi-alumni-club.infinityfreeapp.com");
                return;
            }
            
            if (lowerText.includes("plan") || lowerText.includes("price")) {
                await chat.sendMessage("Plans: Elementary E180/mo, Vantage E220/mo, Premium E270/mo, Quantum E355/mo");
                return;
            }
            
            if (lowerText.includes("event")) {
                await chat.sendMessage("Events: Alumni Mixer (June 20), AGM (Aug 15), Family Fun Day (Sept 12), Gala (TBA)");
                return;
            }
            
            if (text.length > 5) {
                const searchResult = await webSearch(text);
                if (searchResult) {
                    await chat.sendMessage("Here's what I found:\n\n" + searchResult);
                    return;
                }
            }
            
            await chat.sendMessage("Type *help* to see what I know about Emvasi Alumni Club!");
            
        } catch (error) {
            console.error("Error:", error.message);
        }
    });
    
    await client.initialize();
    console.log("Bot initialized successfully");
}

startBot().catch(err => {
    console.error("Failed to start bot:", err);
});

// ============================================
// HTTP SERVER (Render port binding)
// ============================================
const http = require("http");
const PORT = process.env.PORT || 10000;

http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Emvasi Bot is Running</h1>");
}).listen(PORT, () => {
    console.log("Web server listening on port " + PORT);
});