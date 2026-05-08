const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const axios = require("axios");
const { findMemberByPhone, registerMember } = require("./db");
const fs = require("fs");

console.log("Emvasi Smart Bot - Database + AI + Web Search");

// Bot states
const userStates = new Map();

// Edge path for Windows
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const isWindows = fs.existsSync(edgePath);

const client = new Client({
    authStrategy: new LocalAuth({ dataPath: "./whatsapp-session" }),
    puppeteer: {
        headless: false,
        executablePath: isWindows ? edgePath : undefined,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    }
});

// ============================================
// FULL KNOWLEDGE BASE
// ============================================
// ============================================
// COMPLETE ENHANCED KNOWLEDGE BASE
// ============================================
const knowledge = [
    // ========== LEADERSHIP ==========
    { keys: ["vice chancellor", "vc"], answer: "The Vice Chancellor of UNESWA is Professor Justice Thwala. He oversees all academic and administrative operations of the university." },
    { keys: ["pro vice chancellor", "pvc"], answer: "The Pro Vice Chancellor of UNESWA is Professor Henry Gadaga. He handles academic affairs, research, and innovation." },
    { keys: ["chancellor", "king"], answer: "His Majesty King Mswati III is the Chancellor of UNESWA. As Chancellor, he presides over graduation ceremonies and represents the university's highest authority." },
    { keys: ["chief executive officer", "ceo"], answer: "Mr. Vuli Simelane is the CEO of UNESWA Endowment Fund. He leads the fund's strategic direction and operations." },
    { keys: ["chief marketing officer", "cmo", "marketing officer"], answer: "Mr. Musa Simelane is the Chief Marketing Officer of UNESWA Endowment Fund." },
    { keys: ["board chairperson", "chairperson", "board chair"], answer: "The Board Chairperson of UNESWA Endowment Fund is HRH Dr. Nozizwe Mulela." },
    { keys: ["vice chairperson", "board vice chair"], answer: "Mr. Mbuso Mdluli is the Vice Chairperson of the UNESWA Endowment Fund." },
    { keys: ["board", "trustees", "board members"], answer: "UNESWA Endowment Fund Board of Trustees:\n• HRH Dr. Nozizwe Mulela - Chairperson\n• Mr. Mbuso Mdluli - Vice Chairperson\n• Professor Justice Thwala - University VC\n• Ms. Salaphi Vilane - Board Secretary\n• Ms. Mbali Sibanyoni - Trustee\n• Mr. Mzamo Dlamini - Trustee\n• Ms. Gcinile Mndzebele - Trustee\n• Mr. Vuli Simelane - CEO" },
    { keys: ["leadership", "leaders"], answer: "UNESWA Leadership: VC - Prof. Justice Thwala, PVC - Prof. Henry Gadaga, Chancellor - King Mswati III. Endowment Fund: CEO - Vuli Simelane, CMO - Musa Simelane, Chairperson - HRH Dr. Nozizwe Mulela." },

    // ========== ORGANIZATION ==========
    { keys: ["endowment fund"], answer: "The UNESWA Endowment Fund is a legal trust established in 2004 to support university development and financial sustainability. It operates independently with its own board, audits, and investment policies." },
    { keys: ["emvasi", "alumni club", "what is emvasi"], answer: "Emvasi Alumni Club is UNESWA's official alumni engagement platform, launched in October 2025. We connect, empower, and elevate UNESWA graduates worldwide! Registration is 100% FREE for anyone with a connection to UNESWA." },
    { keys: ["uneswa", "university"], answer: "UNESWA (University of Eswatini) is Eswatini's premier higher education institution, founded in 1976. Main campus at Kwaluseni, with additional campuses at Luyengo (Agriculture) and Mbabane (Health Sciences)." },
    { keys: ["mission", "purpose"], answer: "Emvasi's mission is to unite alumni, students, staff, and friends in mobilizing resources, building professional networks, and fostering pride in UNESWA." },
    { keys: ["why created", "why emvasi"], answer: "Emvasi Alumni Club was created to reduce UNESWA's dependence on government funding (over 70%) and build sustainable revenue through alumni engagement and commercial activities." },

    // ========== REGISTRATION & MEMBERSHIP ==========
    { keys: ["register", "registration", "how to join", "sign up", "join"], answer: "Registration is 100% FREE! Visit https://emvasi-alumni-club.infinityfreeapp.com to register. Membership is open to alumni, current students, parents, staff, and friends of UNESWA!" },
    { keys: ["who can join", "qualify", "eligibility", "who qualifies"], answer: "Anyone with a connection to UNESWA can join! This includes former students, current students, parents, guardians, staff, and friends of the university." },
    { keys: ["free registration", "free to join", "is it free"], answer: "Yes, registration is completely FREE! No crowdfunding fee is required. Simply sign up at our website to become a member of Emvasi Alumni Club." },
    { keys: ["benefits", "why should i register", "why register", "what do i get", "perks", "member benefits", "advantages"], answer: "Emvasi Member Benefits include: 🏋️ Clubhouse access (gym, Olympic pool, wellness center), 🎟️ Exclusive events & networking, 🤝 Mentorship opportunities, 💰 Facility discounts, 📱 Digital membership card, and 🌟 Contribution to UNESWA's development. You also get access to our sports facilities, coffee shop, and premium events!" },
    { keys: ["membership", "subscription", "subscribe"], answer: "Emvasi offers tiered membership subscriptions with exclusive benefits. You can subscribe after FREE registration. Visit our website to choose your plan!" },
    { keys: ["plans", "tiers", "membership plans", "subscription plans"], answer: "📋 Emvasi Membership Plans:\n\n• Elementary: E180/month - Basic club benefits & event access\n• Vantage: E220/month - Enhanced benefits & event access\n• Premium: E270/month - All club facilities & priority access\n• Quantum: E355/month - Full VIP benefits, clubhouse access, exclusive events" },
    { keys: ["pricing", "price", "cost", "how much"], answer: "Monthly Subscriptions:\n• Elementary: E180\n• Vantage: E220\n• Premium: E270\n• Quantum: E355\n\nAll tiers include access to events, networking, and club benefits." },
    { keys: ["quantum"], answer: "Quantum is our premier tier at E355/month. It includes full clubhouse access (gym, pool, wellness center), VIP events, priority booking, exclusive loyalty rewards, and all premium benefits!" },
    { keys: ["elementary"], answer: "Elementary is our entry-level tier at E180/month. It includes basic club benefits, access to events, and networking opportunities." },
    { keys: ["vantage"], answer: "Vantage is our mid-tier plan at E220/month with enhanced benefits, event access, and additional perks." },
    { keys: ["premium"], answer: "Premium is E270/month and includes all club facilities, priority event access, and exclusive member experiences." },

    // ========== EMVASI ALUMNI CLUB PRODUCTS ==========
    { keys: ["sports facilities", "sports", "sport"], answer: "🏟️ Our premium multi-sport complex offers basketball, netball, volleyball, tennis, rugby, futsal, boxing, swimming, aerobics, and dance facilities. Available for tournaments, training camps, recreational activities, and wellness programmes. Perfect for team building and competitive events!" },
    { keys: ["gym", "fitness", "gym facility", "workout"], answer: "💪 Our modern wellness and fitness centre is equipped with professional gym equipment and offers affordable membership plans for students, staff, alumni, and the public. Stay fit while connecting with fellow alumni!" },
    { keys: ["experience centre", "experience center", "engagement hub"], answer: "🏛️ The Experience Centre is an interactive engagement hub designed to provide visitors, alumni, students, and partners with institutional information, support services, networking opportunities, and digital experiences. Come explore what UNESWA has to offer!" },
    { keys: ["event hall", "venue", "hall"], answer: "🎭 Our premium indoor venue is suitable for gala dinners, conferences, concerts, exhibitions, weddings, and corporate events. Features modern sound systems and luxury seating arrangements. Book for your next special occasion!" },
    { keys: ["content hub", "media", "studio", "production"], answer: "🎬 The Content Hub is a professional digital media production facility equipped with advanced cameras, podcast systems, editing suites, and livestreaming capabilities. Available for creators, organizations, and content producers." },
    { keys: ["gala dinner", "gala"], answer: "🎭 The UNESWA Alumni Gala Dinner is a luxury networking and celebration event bringing together alumni, corporates, students, and partners in a prestigious black-tie environment. It's our flagship annual event featuring fine dining, entertainment, and exclusive networking opportunities. Tickets: E800 individual, E30,000 corporate." },
    { keys: ["univibes", "music festival", "festival", "univibes music"], answer: "🎵 Univibes Music Festival is a multi-day music and lifestyle festival featuring top artists, exhibitions, food stalls, accommodation packages, and unforgettable entertainment experiences. It's Eswatini's premier music and lifestyle event! Stay tuned for dates and lineup announcements." },
    { keys: ["family fun day", "family day", "fun day"], answer: "👨‍👩‍👧‍👦 Family Fun Day is a recreational family-oriented event focused on bonding, games, wellness, food experiences, and entertainment. Bring your whole family for a day of laughter, activities, and community spirit!" },
    { keys: ["sports tournament", "tournament"], answer: "🏆 Our professionally organized sports competitions promote talent development, wellness, networking, and sponsorship opportunities. Open to alumni, students, and corporate teams. Showcase your skills and compete for glory!" },
    { keys: ["raffle", "burj khalifa", "competition", "burj"], answer: "🏙️ The Burj Khalifa Raffle Competition is a luxury travel and lifestyle raffle offering members opportunities to win international travel and premium shopping experiences. Purchase raffle tickets for your chance to win the trip of a lifetime!" },
    { keys: ["affiliate", "affiliate programme", "referral"], answer: "🤝 Our Affiliate Programme is a referral and commission-based programme allowing individuals and organizations to promote Emvasi products and services while earning incentives. Join as an affiliate and start earning today!" },

    // ========== UMFUNDZATE INITIATIVE ==========
    { keys: ["umfundzate", "skill", "capability development"], answer: "📚 Umfundzate Skill and Capability Development Initiative provides scholarships, acceleration programmes, and short courses to support academic excellence and professional development for UNESWA students and graduates." },
    { keys: ["scholarship", "undergraduate scholarship"], answer: "🎓 The Undergraduate Scholarship Programme supports academically deserving and financially disadvantaged students through tuition support, mentorship, and leadership development. About 40 students have been supported so far!" },
    { keys: ["acceleration programme", "graduate programme", "accelerator"], answer: "🚀 The Acceleration Programme is a graduate development initiative focused on entrepreneurship, innovation, workplace readiness, digital skills, and practical industry exposure. Launch your career with our intensive training and mentorship." },
    { keys: ["postgraduate scholarship", "postgraduate", "post grad"], answer: "📖 The Postgraduate Scholarship Programme is a specialized funding initiative supporting advanced academic research, innovation, and professional studies. Pursue your masters or PhD with our financial support." },
    { keys: ["short courses", "training", "courses"], answer: "📝 Our Short Courses are professional and industry-relevant training programmes designed to equip individuals with practical and market-driven skills. Upskill and stay competitive in today's job market." },

    // ========== SMART INFRASTRUCTURE ==========
    { keys: ["infrastructure", "renovation", "smart infrastructure", "building"], answer: "🏗️ Smart Infrastructure focuses on modernization projects including classroom renovations, laboratory upgrades, road rehabilitation, accommodation buildings, and enterprise hubs to improve UNESWA's facilities and user experience." },
    { keys: ["accommodation", "rooms", "student housing"], answer: "🏠 We are developing modern accommodation facilities for students, researchers, and conference visitors. Quality living spaces designed for comfort and convenience." },
    { keys: ["laboratories", "labs", "laboratory"], answer: "🔬 We are developing and upgrading science, technology, and innovation laboratories to support research, practical learning, and academic excellence at UNESWA." },

    // ========== ENTERPRISE ==========
    { keys: ["aroma cafe", "coffee", "coffee shop", "cafe", "aroma"], answer: "☕ Aroma Café is our premium coffee shop offering quality coffee, beverages, pastries, and a warm social networking space. The perfect spot for meetings, study sessions, or catching up with fellow alumni!" },
    { keys: ["unimerch", "merchandise", "campus drip", "clothing", "apparel", "merch"], answer: "👕 Unimerch Campus Drip is our modern lifestyle and merchandise brand specializing in apparel, accessories, sportswear, and university-inspired fashion. Wear your UNESWA pride with style!" },
    { keys: ["brands we lv", "advertising", "marketing agency", "brands we love"], answer: "📢 Brands We Lv is our creative marketing and branding agency offering advertising, social media management, digital marketing, and branding solutions for businesses and organizations." },
    { keys: ["autospa", "carwash", "car wash", "car cleaning", "auto spa"], answer: "🚗 Autospa Premium Carwash is a luxury vehicle care and detailing service offering washing, polishing, interior detailing, and premium maintenance experiences. Treat your car to the best care in town!" },
    { keys: ["real estate", "property", "housing", "estate agency"], answer: "🏘️ Our Real Estate Agency specializes in property sales, rentals, management, and investment advisory services. Find your dream home or investment property with us." },

    // ========== INVESTMENTS ==========
    { keys: ["investment", "investments", "collective investment", "cis"], answer: "📈 The Collective Investment Scheme is a professionally managed pooled investment platform enabling collective wealth creation and diversified investment opportunities. Grow your wealth with expert fund management." },
    { keys: ["bonds", "equity", "shares", "stocks"], answer: "📊 Our Bonds and Equity services offer investment opportunities in government bonds, corporate bonds, shares, and equity markets aimed at long-term financial growth and stable returns." },
    { keys: ["esg", "sustainable investment", "green investment", "responsible investment"], answer: "🌱 ESG and Sustainable Investment focuses on responsible investment initiatives supporting sustainability, ethical governance, renewable energy, and long-term social impact. Invest in a better future." },

    // ========== RESEARCH & DEVELOPMENT ==========
    { keys: ["research", "development", "r&d", "innovation"], answer: "🔬 Our Research and Development unit drives innovation through product development, data analytics, AI solutions, business research, and sustainability studies. We transform research into commercial opportunities." },
    { keys: ["artificial intelligence", "ai", "automation"], answer: "🤖 Our AI and Automation team develops AI-powered systems, automation tools, chatbots, and machine learning solutions. We're building the future of intelligent technology right here at UNESWA!" },
    { keys: ["data analytics", "data", "analytics"], answer: "📊 Data Analytics and Intelligence provides advanced analytical services focused on data-driven decision-making, reporting, and predictive intelligence for organizations." },
    { keys: ["renewable energy", "sustainability", "green", "solar"], answer: "☀️ Our Renewable Energy and Sustainability Research focuses on green innovation, environmental conservation, and sustainable development solutions for Eswatini and beyond." },

    // ========== EVENTS ==========
    { keys: ["events", "upcoming events", "what's on", "event calendar", "what events"], answer: "📅 Upcoming Emvasi Events:\n• Alumni Faculty Chapter Meetings - June 2026\n• Annual General Meeting (AGM) - August 15, 2026\n• Family Fun Day - September 12, 2026\n• Gala Dinner - Date TBA (Masquerade Ball!)\n• Univibes Music Festival - Date TBA\n• Sports Tournament - Date TBA\n\nStay tuned for more exciting events!" },
    { keys: ["agm", "annual general meeting"], answer: "The Annual General Meeting (AGM) is scheduled for August 15, 2026. All members are encouraged to attend. It's a great opportunity to hear about our achievements and future plans!" },
    { keys: ["alumni mixer", "mixer", "june 20"], answer: "The Alumni Mixer is on June 20, 2026. A fantastic opportunity to network and reconnect with fellow UNESWA graduates over refreshments and great conversation!" },

    // ========== CLUBHOUSE & FACILITIES ==========
    { keys: ["clubhouse", "sports emporium", "facilities"], answer: "🏋️ The Emvasi Alumni Clubhouse at Sports Emporium, Manzini features a state-of-the-art gym, Olympic-sized swimming pool, wellness center, Aroma Café coffee shop, and restaurant. Premium members get full access!" },
    { keys: ["pool", "swimming"], answer: "🏊 Our Olympic-sized swimming pool at the Clubhouse is available for Premium and Quantum members. Perfect for fitness, training, or leisure swimming!" },
    { keys: ["wellness", "spa"], answer: "🧘 The wellness center at our Clubhouse offers spa services, massage, and relaxation areas. Available for Premium and Quantum members seeking rejuvenation and self-care." },

    // ========== CONTACT ==========
    { keys: ["contact", "email", "phone", "reach"], answer: "📧 Email: alumni_uf@uneswa.ac.sz\n📞 Phone: +268 76369232\n🌐 Website: https://emvasi-alumni-club.infinityfreeapp.com\n📍 Location: UNESWA Kwaluseni Campus, Eswatini" },
    { keys: ["website", "web", "link", "site", "url"], answer: "🌐 https://emvasi-alumni-club.infinityfreeapp.com\n\nAlso visit:\n• UNESWA: https://www.uneswa.ac.sz\n• Endowment Fund: https://www.uneswafoundation.org.sz" },

    // ========== CASUAL CONVERSATION ==========
    { keys: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"], answer: "Hello! 👋 Welcome to Emvasi Alumni Club! How can I assist you today? Ask me about membership, events, our products, or anything about UNESWA!" },
    { keys: ["how are you", "how you doing", "how's it going"], answer: "I'm doing great, thank you for asking! 😊 Ready to help you with anything about Emvasi Alumni Club, our events, membership, or UNESWA. What can I do for you?" },
    { keys: ["thanks", "thank you", "appreciate"], answer: "You're very welcome! 😊 Is there anything else I can help you with? Feel free to ask about our products, events, or membership plans!" },
    { keys: ["who are you", "what are you", "your name", "who am i talking to"], answer: "I'm Emvasi, your friendly AI assistant for Emvasi Alumni Club and UNESWA Endowment Fund! 🤖 I'm here to help you with information about membership, events, our business units, leadership, and everything related to UNESWA. Feel free to ask me anything!" },
    { keys: ["what can you do", "how can you help", "what do you do", "capabilities"], answer: "I can help you with:\n👥 Leadership information\n🎟️ Events & calendar details\n💰 Membership plans & pricing\n🏋️ Clubhouse & sports facilities\n☕ Aroma Café & other enterprises\n📚 Scholarships & research\n🏗️ Infrastructure projects\n💼 Investment opportunities\n📝 Registration help\nAnd much more! Just ask!" },
    { keys: ["menu", "help", "options"], answer: "🏠 EMVASI ALUMNI CLUB - MAIN MENU\n\nI can tell you about:\n• Leadership (VC, CEO, CMO, Board)\n• Events (Gala, Univibes, Family Fun Day)\n• Membership Plans & Benefits\n• Sports Facilities & Gym\n• Clubhouse & Wellness Center\n• Enterprises (Aroma Café, Unimerch, Autospa)\n• Scholarships & Research\n• Registration & Contact Info\n\nWhat would you like to know?" }
];

// ============================================
// SMART ANSWER FINDER
// ============================================
function findAnswer(text) {
    const q = text.toLowerCase().trim();
    
    // Score each knowledge entry by how well it matches
    let bestMatch = null;
    let bestScore = 0;
    
    for (const entry of knowledge) {
        for (const key of entry.keys) {
            // Exact key match
            if (q === key) {
                return entry.answer;
            }
            // Key appears in question
            if (q.includes(key)) {
                const score = key.length; // Longer matches are better
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = entry.answer;
                }
            }
            // Question words appear in keys (partial match)
            const questionWords = q.split(" ");
            for (const word of questionWords) {
                if (word.length > 3 && key.includes(word)) {
                    const score = word.length;
                    if (score > bestScore) {
                        bestScore = score;
                        bestMatch = entry.answer;
                    }
                }
            }
        }
    }
    
    return bestMatch;
}
// ============================================
// WEB SEARCH (DuckDuckGo - Free, no API key)
// ============================================
async function webSearch(query) {
    try {
        const url = "https://api.duckduckgo.com/?q=" + encodeURIComponent(query) + "&format=json&no_html=1&skip_disambig=1";
        const response = await axios.get(url, { timeout: 8000 });
        if (response.data && response.data.AbstractText) {
            return response.data.AbstractText.substring(0, 600);
        }
        if (response.data && response.data.RelatedTopics && response.data.RelatedTopics[0]) {
            return response.data.RelatedTopics[0].Text.substring(0, 600);
        }
        return null;
    } catch (error) {
        return null;
    }
}

// ============================================
// SMART RESPONSE (Knowledge + Web Search)
// ============================================
async function getSmartResponse(text, userName) {
    // Check knowledge base first (with smart matching)
    const kbAnswer = findAnswer(text);
    if (kbAnswer) return kbAnswer;
    
    // Try web search for unknown questions
    const searchResult = await webSearch(text);
    if (searchResult) {
        return searchResult + "\n\n🌐 *Source: DuckDuckGo*\n\nIs there anything about Emvasi Alumni Club I can help with?";
    }
    
    // Friendly casual fallbacks
    const fallbacks = [
        "That's an interesting question! 🤔 I'm still learning about that topic. Is there anything about Emvasi Alumni Club, our products, events, or membership that I can help with?",
        "I don't have that specific information yet, but I'd love to help with something else! 😊 Ask me about our membership plans, upcoming events like the Gala Dinner or Univibes Festival, or how to register.",
        "Hmm, I'm not quite sure about that one! But I know all about Emvasi Alumni Club - our sports facilities, Aroma Café, scholarships, investment opportunities, and exciting events. What interests you most?",
        "Great question! While I look into that, feel free to ask me about UNESWA, the Endowment Fund, our business units, or our exciting events lineup!"
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// ============================================
// CLIENT EVENTS
// ============================================
client.on("qr", (qr) => {
    console.log("\n========================================");
    console.log("SCAN THIS QR CODE NOW WITH WHATSAPP");
    console.log("========================================\n");
    qrcode.generate(qr, { small: true });
    console.log("\nOpen WhatsApp > Settings > Linked Devices > Link a Device");
    console.log("You have 60 seconds to scan!\n");
});

// Handle auth timeout gracefully
process.on("unhandledRejection", (reason) => {
    if (reason === "auth timeout" || (reason && reason.message === "auth timeout")) {
        console.log("\n⚠️ QR code expired! Restarting bot...\n");
        // Don't crash, just log it
    } else {
        console.error("Unhandled error:", reason);
    }
});

client.on("ready", () => {
    console.log("Bot ONLINE at", new Date().toLocaleTimeString());
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
        
        // Get state
        const state = userStates.get(phone);
        let member = await findMemberByPhone(phone);
        
        // Handle registration states
        if (state === "awaiting_name") {
            const nameParts = text.split(" ");
            userStates.set(phone + "_firstName", nameParts[0]);
            userStates.set(phone + "_lastName", nameParts.slice(1).join(" ") || "");
            userStates.set(phone, "awaiting_email");
            await chat.sendMessage("Thanks " + nameParts[0] + "! What is your email address?");
            return;
        }
        
        if (state === "awaiting_email") {
            const firstName = userStates.get(phone + "_firstName") || "";
            const lastName = userStates.get(phone + "_lastName") || "";
            
            await registerMember({
                phone: phone,
                firstName: firstName,
                lastName: lastName,
                email: text,
                memberType: "Alumni",
                tier: "Elementary"
            });
            
            userStates.delete(phone);
            userStates.delete(phone + "_firstName");
            userStates.delete(phone + "_lastName");
            
            await chat.sendMessage("Welcome to Emvasi Alumni Club, " + firstName + "! You are now registered.\n\nAsk me anything about membership, events, or Emvasi Alumni Club leadership!");
            return;
        }
        
        // Returning member greeting
        if (member && (lowerText === "hi" || lowerText === "hello")) {
            await chat.sendMessage("Welcome back, " + member.first_name + "! How can I help you today?");
            return;
        }
        
        // New user - start registration
        if (!member && !state) {
            userStates.set(phone, "awaiting_name");
            await chat.sendMessage("Welcome to Emvasi Alumni Club! Let me register you quickly.\n\nWhat is your full name?");
            return;
        }
        
        // Get smart response
        const response = await getSmartResponse(text, member ? member.first_name : null);
        await chat.sendMessage(response);
        
    } catch (error) {
        console.error("Error:", error.message);
    }
});

client.initialize();