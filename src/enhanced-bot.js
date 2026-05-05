const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const axios = require("axios");

console.log("Emvasi Bot - Enhanced Version with Web Search...");

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const fs = require("fs");

if (!fs.existsSync(edgePath)) {
    console.error("Edge not found!");
    process.exit(1);
}

const client = new Client({
    authStrategy: new LocalAuth({ dataPath: "./whatsapp-session" }),
    puppeteer: {
        headless: false,
        executablePath: edgePath,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    }
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
    "board of trustees members": `These are the honorable members currently sitting on the board of trustees:
• HRH Dr. Nozizwe Mulela - Board Chairperson
• Mr. Mbuso Mdluli - Vice Chairperson
• Professor Justice Thwala - University Vice Chancellor
• Ms. Salaphi Vilane - Board Secretary
• Ms. Mbali Sibanyoni - Trustee
• Mr. Mzamo Dlamini - Trustee
• Ms. Gcinile Mndzebele - Trustee
• Mr. Vuli Simelane - CEO, UNESWA Endowment Fund`,
    "board": `Board of Trustees members:
• HRH Dr. Nozizwe Mulela (Chairperson)
• Mr. Mbuso Mdluli (Vice Chairperson)
• Professor Justice Thwala (VC)
• Ms. Salaphi Vilane (Secretary)
• Ms. Mbali Sibanyoni
• Mr. Mzamo Dlamini
• Ms. Gcinile Mndzebele
• Mr. Vuli Simelane (CEO)`,
    "trustees": `UNESWA Endowment Fund Trustees:
1. HRH Dr. Nozizwe Mulela (Chair)
2. Mr. Mbuso Mdluli (Vice Chair)
3. Prof. Justice Thwala
4. Ms. Salaphi Vilane (Secretary)
5. Ms. Mbali Sibanyoni
6. Mr. Mzamo Dlamini
7. Ms. Gcinile Mndzebele
8. Mr. Vuli Simelane (CEO)`,
    "leader": "UNESWA leadership: VC - Prof. Justice Thwala, PVC - Prof. Henry Gadaga, Chancellor - King Mswati III. Endowment Fund: CEO - Vuli Simelane, CMO - Musa Simelane.",
    "leadership": "UNESWA: VC Prof. Justice Thwala, PVC Prof. Henry Gadaga, Chancellor King Mswati III. Endowment Fund: CEO Vuli Simelane.",

    // ========== CASUAL CONVERSATION ==========
    "how are you": "I am doing great, thank you for asking! 😊 How can I help you with Emvasi Alumni Club today?",
    "hello": "Hello! 👋 Welcome to Emvasi Alumni Club. How can I assist you today? You can ask about membership, events, leadership, or registration!",
    "hi": "Hi there! 🌟 I am Emvasi, your alumni engagement assistant. What can I help you with?",
    "hey": "Hey! 🎉 Welcome to Emvasi Alumni Club. Ask me anything about membership, events, UNESWA, or the Endowment Fund!",
    "good morning": "Good morning! ☀️ Ready to start your day with Emvasi Alumni Club? How can I help?",
    "good afternoon": "Good afternoon! 🌤️ How can Emvasi Alumni Club assist you today?",
    "good evening": "Good evening! 🌙 Emvasi Alumni Club is here for you. What would you like to know?",
    "thanks": "You're very welcome! 😊 Anything else I can help you with?",
    "thank you": "My pleasure! 🙏 Is there anything else you'd like to know about Emvasi Alumni Club?",

    // ========== EVENTS (WITH SPECIFIC DATES) ==========
    "gala": "🎭 The VIP Gala Dinner is a masquerade ball happening this year! Early bird tickets: E800 for individuals, E30,000 for corporates. Follow our social media for discounts!",
    "gala dinner": "🎭 The Gala Dinner is a masquerade ball. Date and venue TBA soon! Get your masks ready! Early registration wins ticket discounts.",
    "when is gala": "The Gala Dinner date and venue will be announced soon! Keep an eye on our social media. It will be a spectacular masquerade ball! ✨",
    "event lineup": `📅 Upcoming Emvasi Events:
• Alumni Mixer - June 20, 2026
• Annual General Meeting (AGM) - August 15, 2026
• Gala Dinner - Date TBA (Masquerade Ball)
• Family Fun Day - September 12, 2026
• Univibes Music Festival - Date TBA
• Sports Tournament - Date TBA`,
    "events": `📅 Emvasi Events Calendar:
🗓️ June 20: Alumni Mixer
🗓️ August 15: AGM
🗓️ September 12: Family Fun Day
🎭 Gala Dinner: Date TBA
🎵 Univibes Festival: Date TBA
⚽ Sports Tournament: Date TBA`,
    "calendar": `📆 Emvasi Calendar 2026:
• June 20 - Alumni Mixer
• July 5 - Workshop
• August 15 - AGM
• August 30 - Gala Dinner (tentative)
• September 12 - Family Fun Day
• October 3-4 - Music Festival`,
    "alumni mixer": "The Alumni Mixer is on June 20, 2026. Great opportunity to network and reconnect with fellow UNESWA graduates! 🎉",
    "june 20": "Alumni Mixer on June 20, 2026! Come network, share stories, and enjoy refreshments.",
    "agm": "The Annual General Meeting (AGM) is on August 15, 2026. All members are encouraged to attend.",
    "family fun day": "Family Fun Day is on September 12, 2026. Bring your family for games, food, and entertainment! 🎪",

    // ========== ORGANIZATION ==========
    "endowment fund": "The UNESWA Endowment Fund is a legal trust established in 2004 to support university development and financial sustainability. CEO is Mr. Vuli Simelane.",
    "fund": "UNESWA Endowment Fund (est. 2004) supports the university through investments, partnerships, and scholarships. CEO: Vuli Simelane.",
    "alumni club": "Emvasi Alumni Club connects UNESWA graduates worldwide. Launched August 2025. FREE registration for anyone with a UNESWA connection! 🎓",
    "club": "Emvasi Alumni Club is UNESWA's official alumni network, launched August 2025. FREE registration!",
    "emvasi": "Emvasi Alumni Club is UNESWA's official alumni engagement platform. We connect, empower, and elevate UNESWA graduates worldwide! 🌍",
    "what is emvasi": "Emvasi is UNESWA's official alumni club! We facilitate networking, professional development, and community engagement for all UNESWA graduates.",
    
    // ========== UNESWA UNIVERSITY ==========
    "uneswa": "UNESWA (University of Eswatini) is Eswatini's premier higher education institution. Main campus at Kwaluseni, with campuses at Luyengo and Mbabane.",
    "university of eswatini": "UNESWA was established in 1976 as UBLES, becoming UNESWA in 2018. It has three campuses and serves over 6,000 students.",
    "ubles": "UNESWA was originally founded as the University of Botswana, Lesotho, and Swaziland (UBLES) in 1976.",
    "kwaluseni": "Kwaluseni is UNESWA's main campus, hosting the administration, most faculties, and student residences.",
    "luyengo": "Luyengo Campus hosts the Faculty of Agriculture and is located in the rural area of Eswatini.",
    "mbabane": "Mbabane Campus hosts the Faculty of Health Sciences, including the nursing and medical programs.",

    // ========== HISTORY ==========
    "created": "Emvasi Alumni Club launched October 2025. UNESWA Endowment Fund established in 2004.",
    "launched": "Emvasi Alumni Club was launched in October 2025 at Kwaluseni Campus with great enthusiasm from alumni! 🎉",
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

    // ========== STRUCTURE ==========
    "business units": "The UNESWA Endowment Fund has 6 business units. Emvasi Alumni Club is one of them, focused on alumni engagement and events.",
    "product lines": "Emvasi's 5 product lines: events, registration services, crowdfunding, sports facilities, and alumni engagement programmes.",
    "initiatives": "Emvasi has 17 initiatives designed to generate resources from alumni, students, staff, and friends of UNESWA.",
    "units": "Endowment Fund units include: Emvasi Alumni Club, Real Estate, Agriculture, Mining, Retail, and Investments.",

    // ========== MEMBERSHIP ==========
    "who can join": "Anyone with a connection to UNESWA can join: former students, current students, parents, guardians, staff, and friends of the university! 🎓",
    "membership": "✅ FREE registration for anyone with a connection to UNESWA! No fees to join the alumni club.",
    "qualify": "Former students, current students, parents, staff, and friends of UNESWA all qualify for FREE membership!",
    "free registration": "Registration is 100% FREE! No crowdfunding fee required anymore. Just sign up at our website.",
    
    // ========== MEMBERSHIP PLANS (MONTHLY & ANNUAL) ==========
    "plans": `📋 Emvasi Membership Plans:

💰 MONTHLY SUBSCRIPTIONS:
• Elementary: E100/month
• Vantage: E120/month
• Premium: E150/month
• Quantum: E170/month

📅 ANNUAL SUBSCRIPTIONS (Save 2 months!):
• Elementary: E1,000/year
• Vantage: E1,200/year
• Premium: E1,500/year
• Quantum: E1,700/year

Subscribe anytime via our website!`,
    "tiers": `Four membership tiers:
1. Quantum (Premium) - E170/mo or E1,700/yr
2. Premium - E150/mo or E1,500/yr
3. Vantage - E120/mo or E1,200/yr
4. Elementary - E100/mo or E1,000/yr`,
    "pricing": `💰 Pricing:
Monthly: Elementary E100, Vantage E120, Premium E150, Quantum E170
Annual: Elementary E1,000, Vantage E1,200, Premium E1,500, Quantum E1,700`,
    "quantum": "Quantum is our premier tier at E170/month or E1,700/year. Includes full clubhouse access, VIP events, priority booking, and exclusive benefits! 👑",
    "elementary": "Elementary is our entry tier at E100/month or E1,000/year. Includes basic club benefits and access to events.",
    "vantage": "Vantage is E120/month or E1,200/year. Mid-tier with enhanced benefits and event access.",
    "premium": "Premium is E150/month or E1,500/year. Includes all club facilities and priority access.",
    "monthly": "Monthly subscriptions available for all tiers. Cancel anytime! Elementary E100, Vantage E120, Premium E150, Quantum E170.",
    "annual": "Annual plans save you 2 months free! E1,000 (Elementary), E1,200 (Vantage), E1,500 (Premium), E1,700 (Quantum).",

    // ========== SUBSCRIPTION INFO ==========
    "subscribe": "To subscribe, visit our website: https://emvasi-alumni-club.infinityfreeapp.com. Choose monthly or annual billing. Free registration first, then choose your plan!",
    "subscription": "Membership subscriptions available monthly or annually. Visit our website to subscribe after FREE registration.",
    "billing": "Choose monthly or annual billing. Annual plans save you 2 months free! You can upgrade, downgrade, or cancel anytime.",

    // ========== BENEFITS ==========
    "benefits": `✨ Emvasi Member Benefits:
• Clubhouse access (gym, pool, wellness center)
• Exclusive events & networking
• Mentorship opportunities
• Facility discounts
• Digital membership card
• Contribution to UNESWA development`,
    "clubhouse": "🏋️ The Emvasi Alumni Clubhouse at Sports Emporium features: state-of-the-art gym, Olympic swimming pool, wellness center, coffee shop, and restaurant!",
    "facilities": "Clubhouse facilities: Gym, Olympic pool, wellness center, coffee shop, restaurant, and event spaces.",
    "perks": "Members enjoy: digital/physical membership cards, exclusive event access, loyalty rewards, networking opportunities, and mentorship programmes.",
    "gym": "🏋️ Access to our state-of-the-art gym at Sports Emporium is included with Premium and Quantum memberships!",
    "pool": "🏊 Olympic-sized swimming pool access for Premium and Quantum members!",
    "wellness": "🧘 Wellness center access includes spa services, massage, and relaxation areas for Premium and Quantum members.",
    "coffee shop": "☕ Exclusive coffee shop at the clubhouse with member discounts!",

    // ========== FINANCIAL ==========
    "debt": "UNESWA faces over E570 million in debt to service providers, pension funds, and banks. The Endowment Fund is addressing this.",
    "financial": "The Endowment Fund addresses UNESWA's E500M+ debt through commercial activities including real estate, mining, and food retail.",
    "money": "💰 Funds go to: paying off E560M+ debt, supporting 40+ scholarship students, infrastructure development, and university sustainability.",
    "funds go": "Funds support: debt reduction (E500M+), scholarships (40+ students), campus infrastructure, and long-term financial sustainability.",
    "debt reduction": "UNESWA is working to reduce over E500 million in debt through endowment initiatives and alumni support.",
    "500 million": "UNESWA faces over E500 million in debt to various service providers and financial institutions.",
    "e500m": "UNESWA's outstanding debt exceeds E500 million (approximately USD 28 million).",

    // ========== SCHOLARSHIPS ==========
    "scholarship": "🎓 Umfundzate Scholarship Programme has supported about 40 students to date. Corporate partners include ESRIC and RES Corporation.",
    "umfundzate": "Umfundzate is the flagship scholarship programme supporting students outside government programmes. About 40 students have benefited!",
    "scholarships": "Umfundzate Scholarship Programme: 40+ students supported. Partners: ESRIC and RES Corporation.",
    "escholarship": "The Umfundzate programme provides financial support to students not covered by government scholarships.",
    "esric": "ESRIC (Eswatini Royal Insurance Corporation) is a proud corporate partner supporting UNESWA scholarship programmes.",
    "res": "RES Corporation partners with UNESWA to provide scholarship opportunities for deserving students.",
    "scholarship support": "The Endowment Fund has supported over 40 students through the Umfundzate Scholarship Programme.",

    // ========== PARTNERS ==========
    "partners": "🤝 Corporate partners include ESRIC (Eswatini Royal Insurance Corporation) and RES Corporation supporting scholarships.",
    "esric": "ESRIC - Eswatini Royal Insurance Corporation. Corporate partner supporting UNESWA scholarship programmes.",
    "res corporation": "RES Corporation partners with UNESWA for Umfundzate scholarship programme and other initiatives.",
    "corporate partners": "Our corporate partners: ESRIC, RES Corporation, and other organizations committed to UNESWA's development.",

    // ========== LOCATION ==========
    "location": "📍 UNESWA main campus at Kwaluseni, with additional campuses at Luyengo (Agriculture) and Mbabane (Health Sciences).",
    "campuses": "UNESWA has three campuses:\n• Kwaluseni (Main)\n• Luyengo (Agriculture)\n• Mbabane (Health Sciences)",
    "where": "UNESWA main campus is at Kwaluseni, about 15km from Manzini, Eswatini.",
    "sports emporium": "The Emvasi Clubhouse is located at Sports Emporium, Manzini. Features gym, pool, wellness center, and restaurant.",

    // ========== REGISTRATION ==========
    "register": "✅ Register for FREE at: https://emvasi-alumni-club.infinityfreeapp.com\n\nAnyone with a UNESWA connection can join!",
    "registration": "FREE registration at https://emvasi-alumni-club.infinityfreeapp.com\n\nNo fees! Just provide your details.",
    "join": "Join Emvasi Alumni Club for FREE at https://emvasi-alumni-club.infinityfreeapp.com\n\nWelcome to the community! 🎓",
    "sign up": "Sign up FREE at https://emvasi-alumni-club.infinityfreeapp.com",
    "register free": "Registration is completely FREE! No payment required. Visit our website to sign up.",

    // ========== CONTACT & WEBSITES ==========
    "contact": "📧 Email: alumni_uf@uneswa.ac.sz\n📞 Phone: +268 76369232\n🌐 Website: emvasi-alumni-club.infinityfreeapp.com",
    "website": "🌐 https://emvasi-alumni-club.replit.app",
    "websites": `🌐 Important Links:
• Emvasi Alumni Club: https://emvasi-alumni-club.replit.app
• UNESWA: uneswa.ac.sz
• UNESWA Endowment Fund: uneswaendowmentfund.co.sz`,
    "email": "📧 alumni_uf@uneswa.ac.sz",
    "phone": "📞 Contact us at +268 76369232 for assistance.",
    "whatsapp": "You're already chatting on WhatsApp! I'm Emvasi, hit me up with some questions Pal. 😊",

    // ========== SOCIAL MEDIA ==========
    "facebook": "Follow Emvasi Alumni Club on Facebook @ https://www.facebook.com/share/18HaxieGro/?mibextid=wwXIfr for updates, events, and community news!",
    "instagram": "Check out @EmvasiAlumni on Instagram for photos, event highlights, and member spotlights!",
    "twitter": "Follow @EmvasiAlumni on X (Twitter) for real-time updates and announcements.",
    "socials": "Connect with us on Facebook, Instagram, and X (Twitter) at @EmvasiAlumniClub!",

    // ========== HELP & MENU ==========
    "help": `📋 Emvasi Bot Help - I can answer about:

👥 LEADERSHIP: VC, PVC, CEO, CMO, Board of Trustees
🎟️ EVENTS: Gala Dinner, Alumni Mixer (June 20), AGM (Aug 15), Family Fun Day (Sept 12)
💰 MEMBERSHIP: Free registration, plans (monthly/annual), pricing, benefits
🏛️ UNESWA: Campuses, history, Endowment Fund, scholarships
📅 CALENDAR: Upcoming dates and event details
🔗 LINKS: Website, registration, social media

Just ask me anything! 😊`,
    "menu": `🏠 EMVASI ALUMNI CLUB - MAIN MENU

I can help with:
• Leadership (VC, PVC, CEO, CMO, Board)
• Events & Calendar (with dates!)
• Membership (FREE registration, plans, pricing)
• Club benefits & facilities
• UNESWA & Endowment Fund info
• Scholarships & partners
• Registration & contact info

What would you like to know? 🎓`,
    "what can you do": `I'm Emvasi, your alumni engagement assistant! 🤖

I can:
✅ Answer questions about UNESWA leadership
✅ Share event dates and details
✅ Explain membership plans (monthly/annual)
✅ Provide registration links
✅ Tell you about club benefits
✅ Share scholarship information
✅ Give you campus locations

Just type your question! 😊`,
    "commands": `📱 Available Commands:
• help - See what I can do
• menu - Show main menu
• events - Upcoming events
• plans - Membership pricing
• register - Registration link
• leadership - UNESWA leaders
• benefits - Member perks
• contact - Get in touch`,

    // ========== DEFAULT RESPONSES ==========
    "who are you": "I'm Emvasi! 🤖 Your AI assistant for Emvasi Alumni Club and UNESWA Endowment Fund. Ask me about membership, events, leadership, or anything about UNESWA!",
    "what are you": "I'm Emvasi, the official AI assistant for UNESWA's alumni engagement platform. Here to help you connect, engage, and support our university! 🎓",
    "who made you": "I'm Emvasi, the official AI assistant for UNESWA's alumni engagement platform. I was created by UNESWA Endowment Fund staff. Here to help you connect, engage, and support our university! 🎓",
    "who created you": "I'm Emvasi, the official AI assistant for UNESWA's alumni engagement platform. I was created by UNESWA Endowment Fund staff. Here to help you connect, engage, and support our university! 🎓",
    "created": "I'm Emvasi, the official AI assistant for UNESWA's alumni engagement platform. I was created by UNESWA Endowment Fund staff. Here to help you connect, engage, and support our university! 🎓"

};

// ============================================
// WEB SEARCH FUNCTION (FREE - DuckDuckGo)
// ============================================

async function webSearch(query) {
    try {
        const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
        const response = await axios.get(searchUrl, { timeout: 5000 });
        
        if (response.data && response.data.AbstractText) {
            return response.data.AbstractText.substring(0, 500) + "\n\n🔗 Source: duckduckgo.com";
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
    
    // Exact keyword matching
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
    console.log("\n🔐 SCAN QR CODE WITH WHATSAPP:\n");
    qrcode.generate(qr, { small: true });
    console.log("\n📱 Open WhatsApp → Linked Devices → Link a Device\n");
});

client.on("ready", () => {
    console.log("✅ Emvasi Bot ONLINE at", new Date().toLocaleTimeString());
    console.log(`📚 Knowledge base: ${Object.keys(knowledge).length} topics`);
    console.log("🌐 Web search: ENABLED (DuckDuckGo)\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🤖 Emvasi is ready to answer your questions!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
});

client.on("message", async (message) => {
    try {
        // Ignore group messages and self-messages
        if (message.from.includes("@g.us") || message.fromMe) return;
        
        const chat = await message.getChat();
        const phone = message.from.split("@")[0];
        const text = message.body.trim();
        const lowerText = text.toLowerCase();
        
        console.log(`📩 [${phone}]: ${text}`);
        
        // Show typing indicator
        await chat.sendStateTyping();
        
        // Check knowledge base first
        let answer = findAnswer(text);
        
        if (answer) {
            await chat.sendMessage(answer);
            return;
        }
        
        // Check for registration keywords
        if (lowerText.includes("register") || lowerText.includes("join") || lowerText.includes("sign up")) {
            await chat.sendMessage("✅ Register for FREE at: https://emvasi-alumni-club.replit.app\n\nMembership is open to alumni, students, parents, staff, and friends of UNESWA!");
            return;
        }
        
        // Check for plan keywords
        if (lowerText.includes("plan") || lowerText.includes("price") || lowerText.includes("cost") || lowerText.includes("pricing")) {
            await chat.sendMessage(`📋 Emvasi Membership Subscription Plans:

💰 MONTHLY:
• Elementary: E180/month
• Vantage: E220/month
• Premium: E280/month
• Quantum: E355/month

Visit our website @ https://emvasi-alumni-club.replit.app to subscribe!`);
            return;
        }
        
        // Check for event keywords
        if (lowerText.includes("event") || lowerText.includes("calendar") || lowerText.includes("upcoming")) {
            await chat.sendMessage(`📅 Upcoming Emvasi Events:

• June, 2026 - Alumni Faculty Chapter Meetings
• August 15, 2026 - AGM
• September 12, 2026 - Family Fun Day
• Date TBA - Gala Dinner (Masquerade Ball)
• Date TBA - Univibes Music Festival
• Date TBA - Sports Tournament


Stay tuned for updates! 🎉`);
            return;
        }
        
        // Try web search for general information
        if (text.length > 5) {
            console.log(`🌐 Searching web for: "${text}"`);
            const searchResult = await webSearch(text);
            if (searchResult) {
                await chat.sendMessage(`🔍 Here's what I found:\n\n${searchResult}\n\nIs this helpful? You can also ask me about Emvasi Alumni club topics!`);
                return;
            }
        }
        
        // Default fallback
        await chat.sendMessage("Interesting remark, unfortunately I don't have that information yet. 😅\n\nTry typing *help* to see what I know about Emvasi Alumni Club, UNESWA leadership, events, membership plans or any other matter related to the Fund and the CLub!");
        
    } catch (error) {
        console.error("❌ Error:", error.message);
        try {
            const chat = await message.getChat();
            await chat.sendMessage("⚠️ Sorry, I am currently encountering an error friend. Please try again later.");
        } catch (e) {
            console.error("Could not send error message:", e.message);
        }
    }
});

client.initialize();