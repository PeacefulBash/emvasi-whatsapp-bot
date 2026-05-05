const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const axios = require("axios");
const fs = require("fs");

console.log("Emvasi Bot - Enhanced Version with Web Search...");

// Detect environment
const isWindows = process.platform === "win32";
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

// Puppeteer configuration
const puppeteerConfig = {
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
};

// Windows: use Edge with GUI
if (isWindows) {
    puppeteerConfig.headless = false;
    if (fs.existsSync(edgePath)) {
        puppeteerConfig.executablePath = edgePath;
        console.log("Using Edge browser (Windows)");
    } else {
        console.log("Edge not found, using default Chromium");
    }
} else {
    // Linux/Render: headless Chromium
    puppeteerConfig.headless = "new";
    console.log("Running on Linux - using headless Chromium");
}

const client = new Client({
    authStrategy: new LocalAuth({ dataPath: "./whatsapp-session" }),
    puppeteer: puppeteerConfig
});

// ============================================
// COMPLETE KNOWLEDGE BASE
// ============================================

const knowledge = {
    // ========== LEADERSHIP & GOVERNANCE ==========
    "vice chancellor": "The Vice Chancellor of UNESWA is Professor Justice Thwala. He oversees all academic and administrative operations of the university.",
    "vc": "The Vice Chancellor of UNESWA is Professor Justice Thwala.",
    "pvc": "The Pro Vice Chancellor of UNESWA is Professor Henry Gadaga. He handles academic affairs, research, and innovation.",
    "pro vice chancellor": "The Pro Vice Chancellor of UNESWA is Professor Henry Gadaga.",
    "chancellor": "His Majesty King Mswati III is the Chancellor of UNESWA. As Chancellor, he presides over graduation ceremonies and represents the university's highest authority.",
    "king": "His Majesty King Mswati III is the Chancellor of UNESWA.",
    "ceo": "Mr. Vuli Simelane is the CEO of UNESWA Endowment Fund. He leads the fund's strategic direction and operations.",
    "vuli": "Mr. Vuli Simelane is the CEO of UNESWA Endowment Fund.",
    "mo": "Mr. Musa Simelane is the Chief Marketing Officer of UNESWA Endowment Fund.",
    "marketing officer": "Mr. Musa Simelane is the Marketing Officer for UNESWA Endowment Fund.",
    "cmo": "Mr. Musa Simelane is the Chief Marketing Officer of UNESWA Endowment Fund.",
    "musa": "Mr. Musa Simelane is the CMO of UNESWA Endowment Fund.",
    "boss": "The CEO of UNESWA Endowment Fund is Mr. Vuli Simelane. The VC of UNESWA is Professor Justice Thwala.",
    "board chairperson": "The Board Chairperson of UNESWA Endowment Fund is HRH Dr. Nozizwe Mulela. The VC of UNESWA is Professor Justice Thwala.",
    "chairperson": "The Board Chairperson of UNESWA Endowment Fund is HRH Dr. Nozizwe Mulela.",
    "board chair": "The Board Chairperson of UNESWA Endowment Fund is HRH Dr. Nozizwe Mulela.",
    "board vice chairperson": "Mr. Mbuso Mdluli is the Vice Chairperson of the UNESWA Endowment Fund.",
    "board vice chair": "Mr. Mbuso Mdluli is the Vice Chairperson of the UNESWA Endowment Fund.",
    "vice chairperson": "Mr. Mbuso Mdluli is the Vice Chairperson of the UNESWA Endowment Fund.",
    "board of trustees members": "These are the honorable members currently sitting on the board of trustees:\n- HRH Dr. Nozizwe Mulela - Board Chairperson\n- Mr. Mbuso Mdluli - Vice Chairperson\n- Professor Justice Thwala - University Vice Chancellor\n- Ms. Salaphi Vilane - Board Secretary\n- Ms. Mbali Sibanyoni - Trustee\n- Mr. Mzamo Dlamini - Trustee\n- Ms. Gcinile Mndzebele - Trustee\n- Mr. Vuli Simelane - CEO, UNESWA Endowment Fund",
    "board": "Board of Trustees members:\n- HRH Dr. Nozizwe Mulela (Chairperson)\n- Mr. Mbuso Mdluli (Vice Chairperson)\n- Professor Justice Thwala (VC)\n- Ms. Salaphi Vilane (Secretary)\n- Ms. Mbali Sibanyoni\n- Mr. Mzamo Dlamini\n- Ms. Gcinile Mndzebele\n- Mr. Vuli Simelane (CEO)",
    "trustees": "UNESWA Endowment Fund Trustees:\n1. HRH Dr. Nozizwe Mulela (Chair)\n2. Mr. Mbuso Mdluli (Vice Chair)\n3. Prof. Justice Thwala\n4. Ms. Salaphi Vilane (Secretary)\n5. Ms. Mbali Sibanyoni\n6. Mr. Mzamo Dlamini\n7. Ms. Gcinile Mndzebele\n8. Mr. Vuli Simelane (CEO)",
    "leader": "UNESWA leadership: VC - Prof. Justice Thwala, PVC - Prof. Henry Gadaga, Chancellor - King Mswati III. Endowment Fund: CEO - Vuli Simelane, CMO - Musa Simelane.",
    "leadership": "UNESWA: VC Prof. Justice Thwala, PVC Prof. Henry Gadaga, Chancellor King Mswati III. Endowment Fund: CEO Vuli Simelane.",

    // ========== CASUAL CONVERSATION ==========
    "how are you": "I am doing great, thank you for asking! How can I help you with Emvasi Alumni Club today?",
    "hello": "Hello! Welcome to Emvasi Alumni Club. How can I assist you today? You can ask about membership, events, leadership, or registration!",
    "hi": "Hi there! I am Emvasi, your alumni engagement assistant. What can I help you with?",
    "hey": "Hey! Welcome to Emvasi Alumni Club. Ask me anything about membership, events, UNESWA, or the Endowment Fund!",
    "good morning": "Good morning! Ready to start your day with Emvasi Alumni Club? How can I help?",
    "good afternoon": "Good afternoon! How can Emvasi Alumni Club assist you today?",
    "good evening": "Good evening! Emvasi Alumni Club is here for you. What would you like to know?",
    "thanks": "You're very welcome! Anything else I can help you with?",
    "thank you": "My pleasure! Is there anything else you'd like to know about Emvasi Alumni Club?",

    // ========== EVENTS (WITH SPECIFIC DATES) ==========
    "gala": "The VIP Gala Dinner is a masquerade ball happening this year! Early bird tickets: E800 for individuals, E30,000 for corporates. Follow our social media for discounts!",
    "gala dinner": "The Gala Dinner is a masquerade ball. Date and venue TBA soon! Get your masks ready! Early registration wins ticket discounts.",
    "when is gala": "The Gala Dinner date and venue will be announced soon! Keep an eye on our social media. It will be a spectacular masquerade ball!",
    "event lineup": "Upcoming Emvasi Events:\n- Alumni Mixer - June 20, 2026\n- Annual General Meeting (AGM) - August 15, 2026\n- Gala Dinner - Date TBA (Masquerade Ball)\n- Family Fun Day - September 12, 2026\n- Univibes Music Festival - Date TBA\n- Sports Tournament - Date TBA",
    "events": "Emvasi Events Calendar:\nJune 20: Alumni Mixer\nAugust 15: AGM\nSeptember 12: Family Fun Day\nGala Dinner: Date TBA\nUnivibes Festival: Date TBA\nSports Tournament: Date TBA",
    "calendar": "Emvasi Calendar 2026:\n- June 20 - Alumni Mixer\n- July 5 - Workshop\n- August 15 - AGM\n- October, day TBA - Gala Dinner (tentative)\n- September 12 - Family Fun Day\n- October 3-4 - Music Festival",
    "alumni mixer": "The Alumni Mixer is on June 20, 2026. Great opportunity to network and reconnect with fellow UNESWA graduates!",
    "june 20": "Alumni Mixer on June 20, 2026! Come network, share stories, and enjoy refreshments.",
    "agm": "The Annual General Meeting (AGM) is on August 15, 2026. All members are encouraged to attend.",
    "family fun day": "Family Fun Day is on September 12, 2026. Bring your family for games, food, and entertainment!",

    // ========== ORGANIZATION ==========
    "endowment fund": "The UNESWA Endowment Fund is a legal trust established in 2004 to support university development and financial sustainability. CEO is Mr. Vuli Simelane.",
    "fund": "UNESWA Endowment Fund (est. 2004) supports the university through investments, partnerships, and scholarships. CEO: Vuli Simelane.",
    "alumni club": "Emvasi Alumni Club connects UNESWA graduates worldwide. Launched August 2025. FREE registration for anyone with a UNESWA connection!",
    "club": "Emvasi Alumni Club is UNESWA's official alumni network, launched August 2025. FREE registration!",
    "emvasi": "Emvasi Alumni Club is UNESWA's official alumni engagement platform. We connect, empower, and elevate UNESWA graduates worldwide!",
    "what is emvasi": "Emvasi is UNESWA's official alumni club! We facilitate networking, professional development, and community engagement for all UNESWA graduates.",
    
    // ========== UNESWA UNIVERSITY ==========
    "uneswa": "UNESWA (University of Eswatini) is Eswatini's premier higher education institution. Main campus at Kwaluseni, with campuses at Luyengo and Mbabane.",
    "university of eswatini": "UNESWA was established in 1976 as UBLES, becoming UNESWA in 2018. It has three campuses and serves over 6,000 students.",
    "ubles": "UNESWA was originally founded as the University of Botswana, Lesotho, and Swaziland (UBLES) in 1976.",
    "kwaluseni": "Kwaluseni is UNESWA's main campus, hosting the administration, most faculties, and student residences.",
    "luyengo": "Luyengo Campus hosts the Faculty of Agriculture and is located in the rural area of Eswatini.",
    "mbabane": "Mbabane Campus hosts the Faculty of Health Sciences, including the nursing and medical programs.",

    // ========== HISTORY ==========
    "launched": "Emvasi Alumni Club was launched in October 2025 at Kwaluseni Campus with great enthusiasm from alumni!",
    "established": "UNESWA Endowment Fund established 2004. Emvasi Alumni Club launched October 2025.",
    "founded": "UNESWA was founded as UBLES in 1976, becoming UNESWA in 2018. Endowment Fund est. 2004. Emvasi launched 2025.",
    "when was": "UNESWA founded 1976. Endowment Fund established 2004. Emvasi Alumni Club launched August 2025.",
    "october 2025": "Emvasi Alumni Club launched October 2025 at Kwaluseni Campus.",

    // ========== PURPOSE & MISSION ==========
    "why": "Emvasi Alumni Club was created to reduce UNESWA's dependence on government funding (over 70%) and build sustainable revenue through alumni engagement and commercial activities.",
    "purpose": "To strengthen UNESWA's long-term financial stability through alumni engagement, commercial activities, and diversified revenue streams.",
    "mission": "Emvasi's mission: Unite alumni, students, staff, and friends in mobilizing resources, building networks, and fostering pride in UNESWA.",
    "vision": "Emvasi's vision: To be a leading alumni organization driving sustainable development, innovation, and excellence at UNESWA.",
    "goal": "Build a self-sustaining alumni network that contributes significantly to UNESWA's development and financial independence.",

    // ========== MEMBERSHIP ==========
    "who can join": "Anyone with a connection to UNESWA can join: former students, current students, parents, guardians, staff, and friends of the university!",
    "membership": "FREE registration for anyone with a connection to UNESWA! No fees to join the alumni club.",
    "qualify": "Former students, current students, parents, staff, and friends of UNESWA all qualify for FREE membership!",
    "free registration": "Registration is 100% FREE! No crowdfunding fee required anymore. Just sign up at our website.",
    
    // ========== MEMBERSHIP PLANS ==========
    "plans": "Emvasi Membership Plans:\n\nMONTHLY SUBSCRIPTIONS:\n- Elementary: E180/month\n- Vantage: E220/month\n- Premium: E270/month\n- Quantum: E355/month\n\nSubscribe anytime via our website!",
    "tiers": "Four membership tiers:\n1. Quantum (Premium) - E355/month\n2. Premium - E270/month\n3. Vantage - E220/month\n4. Elementary - E180/month",
    "pricing": "Pricing:\nMonthly: Elementary E180, Vantage E220, Premium E270, Quantum E355",
    "quantum": "Quantum is our premier tier at E355/month. Includes full clubhouse access, VIP events, priority booking, and exclusive benefits!",
    "elementary": "Elementary is our entry tier at E180/month. Includes basic club benefits and access to events.",
    "vantage": "Vantage is E220/month. Mid-tier with enhanced benefits and event access.",
    "premium": "Premium is E270/month. Includes all club facilities and priority access.",
    "monthly": "Monthly subscriptions available for all tiers. Cancel anytime! Elementary E180, Vantage E220, Premium E270, Quantum E355.",

    // ========== SUBSCRIPTION INFO ==========
    "subscribe": "To subscribe, visit our website: https://emvasi-alumni-club.infinityfreeapp.com. Choose monthly or annual billing. Free registration first, then choose your plan!",
    "subscription": "Membership subscriptions available monthly or annually. Visit our website to subscribe after FREE registration.",
    "billing": "Choose monthly or annual billing. Annual plans save you 2 months free! You can upgrade, downgrade, or cancel anytime.",

    // ========== BENEFITS ==========
    "benefits": "Emvasi Member Benefits:\n- Clubhouse access (gym, pool, wellness center)\n- Exclusive events & networking\n- Mentorship opportunities\n- Facility discounts\n- Digital membership card\n- Contribution to UNESWA development",
    "clubhouse": "The Emvasi Alumni Clubhouse at Sports Emporium features: state-of-the-art gym, Olympic swimming pool, wellness center, coffee shop, and restaurant!",
    "facilities": "Clubhouse facilities: Gym, Olympic pool, wellness center, coffee shop, restaurant, and event spaces.",
    "perks": "Members enjoy: digital/physical membership cards, exclusive event access, loyalty rewards, networking opportunities, and mentorship programmes.",

    // ========== LOCATION ==========
    "location": "UNESWA main campus at Kwaluseni, with additional campuses at Luyengo (Agriculture) and Mbabane (Health Sciences).",
    "campuses": "UNESWA has three campuses:\n- Kwaluseni (Main)\n- Luyengo (Agriculture)\n- Mbabane (Health Sciences)",
    "where": "UNESWA main campus is at Kwaluseni, about 15km from Manzini, Eswatini.",
    "sports emporium": "The Emvasi Clubhouse is located at Sports Emporium, Manzini. Features gym, pool, wellness center, and restaurant.",

    // ========== REGISTRATION ==========
    "register": "Register for FREE at: https://emvasi-alumni-club.infinityfreeapp.com\n\nAnyone with a UNESWA connection can join!",
    "registration": "FREE registration at https://emvasi-alumni-club.infinityfreeapp.com\n\nNo fees! Just provide your details.",
    "join": "Join Emvasi Alumni Club for FREE at https://emvasi-alumni-club.infinityfreeapp.com\n\nWelcome to the community!",
    "sign up": "Sign up FREE at https://emvasi-alumni-club.infinityfreeapp.com",

    // ========== CONTACT & WEBSITES ==========
    "contact": "Email: alumni_uf@uneswa.ac.sz\nPhone: +268 76369232\nWebsite: emvasi-alumni-club.infinityfreeapp.com",
    "website": "https://emvasi-alumni-club.infinityfreeapp.com",
    "websites": "Important Links:\n- Emvasi Alumni Club: https://emvasi-alumni-club.infinityfreeapp.com\n- UNESWA: uneswa.ac.sz\n- UNESWA Endowment Fund: uneswaendowmentfund.co.sz",
    "email": "alumni_uf@uneswa.ac.sz",
    "phone": "Contact us at +268 76369232 for assistance.",

    // ========== HELP ==========
    "help": "Emvasi Bot Help - I can answer about:\n\nLEADERSHIP: VC, PVC, CEO, CMO, Board of Trustees\nEVENTS: Gala Dinner, Alumni Mixer, AGM, Family Fun Day\nMEMBERSHIP: Free registration, plans, pricing, benefits\nUNESWA: Campuses, history, Endowment Fund, scholarships\nLINKS: Website, registration, social media\n\nJust ask me anything!",
    "menu": "EMVASI ALUMNI CLUB - MAIN MENU\n\nI can help with:\n- Leadership (VC, PVC, CEO, CMO, Board)\n- Events & Calendar (with dates!)\n- Membership (FREE registration, plans, pricing)\n- Club benefits & facilities\n- UNESWA & Endowment Fund info\n- Registration & contact info\n\nWhat would you like to know?"
};

// ============================================
// WEB SEARCH FUNCTION
// ============================================

async function webSearch(query) {
    try {
        const searchUrl = "https://api.duckduckgo.com/?q=" + encodeURIComponent(query) + "&format=json&no_html=1&skip_disambig=1";
        const response = await axios.get(searchUrl, { timeout: 5000 });
        
        if (response.data && response.data.AbstractText) {
            return response.data.AbstractText.substring(0, 500) + "\n\nSource: duckduckgo.com";
        }
        if (response.data && response.data.RelatedTopics && response.data.RelatedTopics[0]) {
            const topic = response.data.RelatedTopics[0];
            if (topic.Text) return topic.Text.substring(0, 500);
        }
        return null;
    } catch (error) {
        console.error("Web search error:", error.message);
        return null;
    }
}

// ============================================
// FIND ANSWER FUNCTION
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
// BOT INITIALIZATION
// ============================================

client.on("qr", (qr) => {
    console.log("\nSCAN QR CODE WITH WHATSAPP:\n");
    qrcode.generate(qr, { small: true });
    console.log("\nOpen WhatsApp > Linked Devices > Link a Device\n");
});

client.on("ready", () => {
    console.log("Emvasi Bot ONLINE at", new Date().toLocaleTimeString());
    console.log("Knowledge base: " + Object.keys(knowledge).length + " topics");
    console.log("Web search: ENABLED (DuckDuckGo)\n");
});

client.on("message", async (message) => {
    try {
        if (message.from.includes("@g.us") || message.fromMe) return;
        
        const chat = await message.getChat();
        const phone = message.from.split("@")[0];
        const text = message.body.trim();
        const lowerText = text.toLowerCase();
        
        console.log("[" + phone + "]: " + text);
        
        await chat.sendStateTyping();
        
        let answer = findAnswer(text);
        
        if (answer) {
            await chat.sendMessage(answer);
            return;
        }
        
        if (lowerText.includes("register") || lowerText.includes("join") || lowerText.includes("sign up")) {
            await chat.sendMessage("Register for FREE at: https://emvasi-alumni-club.infinityfreeapp.com\n\nMembership is open to alumni, students, parents, staff, and friends of UNESWA!");
            return;
        }
        
        if (lowerText.includes("plan") || lowerText.includes("price") || lowerText.includes("cost") || lowerText.includes("pricing")) {
            await chat.sendMessage("Emvasi Membership Subscription Plans:\n\nMONTHLY:\n- Elementary: E180/month\n- Vantage: E220/month\n- Premium: E270/month\n- Quantum: E355/month\n\nVisit our website to subscribe!");
            return;
        }
        
        if (lowerText.includes("event") || lowerText.includes("calendar") || lowerText.includes("upcoming")) {
            await chat.sendMessage("Upcoming Emvasi Events:\n\n- June, 2026 - Alumni Faculty Chapter Meetings\n- August 15, 2026 - AGM\n- September 12, 2026 - Family Fun Day\n- Date TBA - Gala Dinner (Masquerade Ball)\n- Date TBA - Univibes Music Festival\n- Date TBA - Sports Tournament\n\nStay tuned for updates!");
            return;
        }
        
        if (text.length > 5) {
            console.log("Searching web for: " + text);
            const searchResult = await webSearch(text);
            if (searchResult) {
                await chat.sendMessage("Here's what I found:\n\n" + searchResult + "\n\nIs this helpful? You can also ask me about Emvasi Alumni club topics!");
                return;
            }
        }
        
        await chat.sendMessage("Interesting remark, unfortunately I don't have that information yet.\n\nTry typing *help* to see what I know about Emvasi Alumni Club, UNESWA leadership, events, membership plans or any other matter related to the Fund and the Club!");
        
    } catch (error) {
        console.error("Error:", error.message);
    }
});

client.initialize();