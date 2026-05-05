const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

console.log("Emvasi Bot - Final Version...");

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

const knowledge = {
    "vice chancellor": "The Vice Chancellor of UNESWA is Professor Justice Thwala.",
    "vc": "The Vice Chancellor of UNESWA is Professor Justice Thwala.",
    "chancellor": "His Majesty King Mswati III is the Chancellor of UNESWA.",
    "ceo": "Vuli Simelane is the CEO of UNESWA Endowment Fund.",
    "cmo": "Musa Simelane is the Chief Marketing Officer of UNESWA Endowment Fund.",
    "marketing officer": "Musa Simelane is the Chief Marketing Officer.",
    "boss": "The CEO of UNESWA Endowment Fund is Vuli Simelane. The VC of UNESWA is Professor Justice Thwala.",
    "leader": "UNESWA leadership: VC - Prof. Justice Thwala, Chancellor - King Mswati III, Endowment Fund CEO - Vuli Simelane, CMO - Musa Simelane.",
    "endowment fund": "The UNESWA Endowment Fund was established in 2004 as a legal trust to support university development and financial sustainability. CEO is Vuli Simelane.",
    "fund": "The UNESWA Endowment Fund (est. 2004) supports university development through investments, partnerships, and scholarships. CEO: Vuli Simelane.",
    "alumni club": "Emvasi Alumni Club connects UNESWA graduates worldwide. Launched October 2025. FREE registration for all with UNESWA connection.",
    "emvasi": "Emvasi Alumni Club is UNESWAs official alumni network, launched October 2025 to strengthen financial sustainability and alumni engagement.",
    "created": "Emvasi Alumni Club launched October 2025. UNESWA Endowment Fund established 2004.",
    "launched": "Emvasi Alumni Club was launched in October 2025 at Kwaluseni Campus.",
    "established": "UNESWA Endowment Fund established 2004. Emvasi Alumni Club launched October 2025.",
    "founded": "UNESWA was founded as the University of Botswana, Lesotho and Swaziland in 1976, becoming the University of Eswatini in 2018.",
    "university founded": "UNESWA was founded in 1976 as UBLS, became University of Swaziland in 1982, and University of Eswatini in 2018.",
    "when was": "UNESWA founded 1976. Endowment Fund established 2004. Emvasi Alumni Club launched October 2025.",
    "why": "Emvasi Alumni Club was created to reduce UNESWAs dependence on government funding (over 70%) and build sustainable revenue through alumni engagement.",
    "purpose": "To strengthen UNESWAs long-term financial stability through alumni engagement, commercial activities, and diversified revenue streams.",
    "mission": "Unite alumni, students, staff, and friends in mobilizing resources, building networks, and fostering pride in UNESWA.",
    "business units": "The Endowment Fund has 6 business units. Emvasi Alumni Club is one of them.",
    "product lines": "5 product lines: events, registration services, crowdfunding, sports facilities, and alumni engagement programmes.",
    "initiatives": "17 initiatives designed to generate resources from alumni, students, staff, and friends.",
    "who can join": "Anyone with a connection to UNESWA: former students, current students, parents, and friends.",
    "membership": "FREE registration for anyone with a connection to UNESWA.",
    "qualify": "Former students, current students, parents, and friends of UNESWA all qualify.",
    "plans": "Membership Plans:\nElementary: E100/mo | E1,000/yr\nVantage: E120/mo | E1,200/yr\nPremium: E150/mo | E1,500/yr\nQuantum: E170/mo | E1,700/yr",
    "tiers": "Four membership tiers: Quantum, Premium, Vantage, and Elementary.",
    "pricing": "Monthly: Elementary E100, Vantage E120, Premium E150, Quantum E170. Annual plans save 2 months.",
    "quantum": "Quantum is the top tier at E170/month or E1,700/year with full benefits.",
    "elementary": "Elementary is E100/month or E1,000/year.",
    "vantage": "Vantage is E120/month or E1,200/year.",
    "premium": "Premium is E150/month or E1,500/year.",
    "benefits": "Clubhouse access, exclusive events, networking, mentorship opportunities, facility discounts, and contribution to university development.",
    "clubhouse": "The Emvasi Alumni Clubhouse at Sports Emporium features a gym, Olympic pool, wellness center, coffee shop, and restaurant.",
    "facilities": "Gym, Olympic swimming pool, wellness center, coffee shop, and restaurant.",
    "perks": "Digital/physical membership cards, event access, loyalty rewards, and exclusive programmes.",
    "debt": "UNESWA faces over E500 million in debt to service providers, pension funds, and banks.",
    "financial": "The Endowment Fund addresses UNESWAs E500M+ debt through commercial activities including real estate, mining, and food retail.",
    "money": "Funds go to: paying off E500M+ debt, scholarships, infrastructure development, and university sustainability.",
    "funds go": "Funds support debt reduction (E500M+), scholarships (40+ students), campus infrastructure, and financial sustainability.",
    "events": "Upcoming: Gala Dinner, Family Fun Day, Music Festival, Alumni Mixer (June 20), Workshop (July 5), AGM (Aug 15).",
    "gala": "VIP Gala Dinner tickets worth over E500 available as early registration prizes.",
    "calendar": "June 20: Alumni Mixer | July 5: Career Workshop | Aug 15: AGM | Plus Gala, Fun Day, Music Festival.",
    "location": "Main campus at Kwaluseni, with additional campuses at Luyengo and Mbabane.",
    "campuses": "Kwaluseni, Luyengo, and Mbabane campuses.",
    "where": "UNESWA main campus is at Kwaluseni, Eswatini.",
    "register": "Register FREE at: https://emvasi-alumni-club.infinityfreeapp.com",
    "registration": "FREE registration at https://emvasi-alumni-club.infinityfreeapp.com",
    "join": "Visit https://emvasi-alumni-club.infinityfreeapp.com to join for FREE.",
    "sign up": "Sign up FREE at https://emvasi-alumni-club.infinityfreeapp.com",
    "contact": "Email: info@emvasi-alumni-club.infinityfreeapp.com",
    "website": "emvasi-alumni-club.infinityfreeapp.com",
    "websites": "UNESWA: uneswa.ac.sz | Endowment: uneswafoundation.org.sz | Emvasi: emvasi-alumni-club.infinityfreeapp.com",
    "email": "info@emvasi-alumni-club.infinityfreeapp.com",
    "scholarship": "Umfundzate Scholarship Programme has supported about 40 students. Corporate partners: ESRIC and RES Corporation.",
    "umfundzate": "Scholarship programme supporting students outside government programmes.",
    "partners": "Corporate partners include ESRIC (Eswatini Royal Insurance Corporation) and RES Corporation.",
    "esric": "ESRIC is a corporate partner offering scholarship programmes.",
    "res": "RES Corporation partners with UNESWA for scholarships.",
    "help": "I can answer about: VC, CEO, CMO, membership plans, pricing, benefits, events, registration, scholarships, history, purpose, and more! Just ask."
};

function findAnswer(question) {
    const q = question.toLowerCase();
    for (let key in knowledge) {
        if (q.includes(key)) {
            return knowledge[key];
        }
    }
    return null;
}

const mainMenu = "Emvasi Alumni Club\n\nI can answer questions about:\n- Leadership (VC, CEO, CMO)\n- Membership plans & pricing\n- Club benefits & facilities\n- Events & scholarships\n- Registration & contact info\n\nJust ask me anything!";

client.on("qr", (qr) => {
    console.log("\nSCAN QR CODE:\n");
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("Bot ONLINE at", new Date().toLocaleTimeString());
    console.log("Knowledge base: 60+ topics\n");
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
        
        if (lowerText === "menu" || lowerText === "help" || lowerText === "hi" || lowerText === "hello") {
            await chat.sendMessage(mainMenu);
            return;
        }
        
        const answer = findAnswer(text);
        if (answer) {
            await chat.sendMessage(answer);
            return;
        }
        
        if (lowerText.includes("register") || lowerText.includes("join") || lowerText.includes("sign up")) {
            await chat.sendMessage("Register for FREE at: https://emvasi-alumni-club.infinityfreeapp.com\n\nMembership open to alumni, students, parents, and friends of UNESWA!");
            return;
        }
        
        if (lowerText.includes("plan") || lowerText.includes("price") || lowerText.includes("cost") || lowerText.includes("subscription")) {
            await chat.sendMessage("Membership Plans:\n\nElementary: E100/mo | E1,000/yr\nVantage: E120/mo | E1,200/yr\nPremium: E150/mo | E1,500/yr\nQuantum: E170/mo | E1,700/yr\n\nAnnual plans save 2 months!");
            return;
        }
        
        await chat.sendMessage("I do not have that specific information yet.\n\nTry asking about:\n- VC, CEO, or CMO\n- Membership plans\n- Club benefits\n- Events\n- Registration\n\nOr type *menu* for help.");
        
    } catch (error) {
        console.error("Error:", error.message);
    }
});

client.initialize();
