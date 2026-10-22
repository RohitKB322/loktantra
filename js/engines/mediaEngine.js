// Simulated Media Ecosystem, TRP Ratings, Dynamic Headlines & Covert PR
import { gameState } from "../core/state.js";

export const NEWS_CHANNELS = [
  {
    id: "bharat_tv",
    name: "Bharat Republic TV",
    anchor: "Arun Goswami",
    trp: 9.4,
    lean: "Nationalist / Pro-Establishment",
    integrity: 35, // 0 to 100 (lower means easier to bribe, higher means leaks bribe attempts)
    audience: "Urban Middle-Class, Hindi Heartland",
    color: "#ea580c",
    adCostPerWeek: 35 // White money in Lakhs
  },
  {
    id: "janata_awaaz",
    name: "Janata Awaaz",
    anchor: "Punya Prasun",
    trp: 8.1,
    lean: "Agrarian / Pro-Farmer & Welfare",
    integrity: 65,
    audience: "Rural Farmers, Mandi Traders, Small Towns",
    color: "#16a34a",
    adCostPerWeek: 25
  },
  {
    id: "metro_biz",
    name: "Metro Business 24",
    anchor: "Shereen Dalal",
    trp: 6.8,
    lean: "Corporate / Dalal Street & Free Market",
    integrity: 50,
    audience: "C-Suite Executives, Investors, Tech Workers",
    color: "#2563eb",
    adCostPerWeek: 40
  },
  {
    id: "digital_wire",
    name: "The Digital Wire",
    anchor: "Siddharth Varadarajan",
    trp: 8.6,
    lean: "Investigative / Anti-Establishment & Civil Rights",
    integrity: 90, // Extremely difficult to bribe!
    audience: "University Students, Academics, Civil Society",
    color: "#dc2626",
    adCostPerWeek: 20
  },
  {
    id: "prasar_vani",
    name: "Prasar Vani (DD Style)",
    anchor: "Shammi Narang",
    trp: 5.2,
    lean: "State Broadcaster / Factual & Government schemes",
    integrity: 75,
    audience: "Senior Citizens, Bureaucrats, Pan-India Public",
    color: "#64748b",
    adCostPerWeek: 15
  }
];

export const mediaEngine = {
  // Buy Official Legal TV Ad Campaign
  buyAdCampaign(channelId, weeks = 2) {
    const player = gameState.getPlayer();
    const ch = NEWS_CHANNELS.find(c => c.id === channelId);
    if (!ch) return { success: false, message: "Channel not found" };

    const totalCost = ch.adCostPerWeek * weeks;
    if (player.whiteMoney < totalCost) {
      return { success: false, message: `Insufficient White Money. Need ₹${totalCost}L` };
    }

    player.whiteMoney -= totalCost;
    player.nationalApproval = Math.min(85, player.nationalApproval + Math.round(ch.trp * 0.4));

    gameState.addBreakingNews(
      `${player.name} rolls out blitzkrieg ad campaign across ${ch.name} prime-time slots`,
      ch.name,
      "CAMPAIGN"
    );

    gameState.notify("MEDIA_UPDATED");
    return { success: true, message: `Purchased ${weeks} weeks of ad slots on ${ch.name} for ₹${totalCost}L!` };
  },

  // Prime-Time Debate Show Mini-Event
  sendSpokespersonToDebate(channelId) {
    const player = gameState.getPlayer();
    const ch = NEWS_CHANNELS.find(c => c.id === channelId);
    if (!ch) return { success: false, message: "Channel not found" };

    const charisma = player.spokespersonCharisma || 60;
    const roll = Math.floor(Math.random() * 50) + (charisma * 0.5);

    let outcome = "";
    let approvalShift = 0;

    if (roll > 65) {
      outcome = `VICTORY! Your party spokesperson completely dismantled rival narratives on ${ch.name}'s 9 PM prime-time debate!`;
      approvalShift = +2.5;
      player.spokespersonCharisma = Math.min(95, charisma + 4);
    } else if (roll > 40) {
      outcome = `HONORABLE DRAW: Spokesperson defended party manifesto well amid loud shouting matches on ${ch.name}.`;
      approvalShift = +0.5;
    } else {
      outcome = `DISASTER: The anchor and rival panelists ganged up on your spokesperson. Audio clip went viral as a meme!`;
      approvalShift = -2.0;
      player.spokespersonCharisma = Math.max(30, charisma - 5);
    }

    player.nationalApproval = Math.max(5, Math.min(85, player.nationalApproval + approvalShift));
    gameState.addBreakingNews(
      `Heated 9 PM Clash on ${ch.name}: ${outcome}`,
      ch.name,
      "DEBATE"
    );

    gameState.notify("MEDIA_UPDATED");
    return { success: true, message: outcome, approvalShift };
  },

  // Covert PR Bribe / Envelope Journalism (Spend Black Cash)
  attemptCovertPRBribe(channelId, targetAction = "plant_rival_scandal") {
    const player = gameState.getPlayer();
    const ch = NEWS_CHANNELS.find(c => c.id === channelId);
    if (!ch) return { success: false, message: "Channel not found" };

    const bribeCost = 60; // in Lakhs slush cash
    if (player.blackMoney < bribeCost) {
      return { success: false, message: `Insufficient Slush Cash. Need ₹${bribeCost}L` };
    }

    player.blackMoney -= bribeCost;

    // Check if channel leaks the bribe attempt (based on integrity)
    const leakChance = ch.integrity / 100;
    if (Math.random() < leakChance) {
      // LEAKED! Double scandal!
      player.slushExposure = Math.min(100, player.slushExposure + 30);
      player.nationalApproval = Math.max(5, player.nationalApproval - 7);

      gameState.addBreakingNews(
        `STING BOMBSHELL: ${ch.name} exposes undercover bribe offer from ${player.name} operatives! Leaked tapes broadcast live!`,
        ch.name,
        "SCANDAL"
      );
      gameState.notify("MEDIA_UPDATED");
      return { success: false, message: `DISASTER! ${ch.name} refused the envelope and broadcast the hidden camera sting! Approval dropped sharply.` };
    }

    // Bribe Succeeded!
    player.slushExposure = Math.min(100, player.slushExposure + 8);
    let resultMsg = "";

    if (targetAction === "suppress_scandal") {
      player.slushExposure = Math.max(5, player.slushExposure - 15);
      resultMsg = `Successfully spiked embarrassing investigative story on ${ch.name}. Slush exposure mitigated.`;
    } else {
      // Smear rival party
      const rival = gameState.parties.find(p => !p.isPlayer && (p.id === "BVP" || p.id === "UPC"));
      if (rival) {
        rival.baseNationalShare = Math.max(5, rival.baseNationalShare - 1.5);
      }
      player.nationalApproval = Math.min(85, player.nationalApproval + 2.0);
      resultMsg = `Covert package accepted: ${ch.name} launched aggressive hour-long expose on rival party misconduct!`;

      gameState.addBreakingNews(
        `Exclusive Investigation on ${ch.name}: Massive financial irregularity questions raised against opposition leaders`,
        ch.name,
        "STING"
      );
    }

    gameState.notify("MEDIA_UPDATED");
    return { success: true, message: resultMsg };
  },

  // Generate dynamic headlines at turn rollover (Version 0.2: Abundant, rich & varied)
  generateWeeklyHeadlines() {
    const player = gameState.getPlayer();
    const tally = gameState.nationalSeatTally;
    const headlines = [];

    // 1. National Opinion Poll & Seat Projection Headline
    const pollAgencies = ["Axis My-India", "C-Voter", "Matrize News", "Chanakya Polls", "India Today Mood"];
    const agency = pollAgencies[Math.floor(Math.random() * pollAgencies.length)];
    
    if (tally.PLAYER > 50) {
      headlines.push({
        channel: "Bharat Republic TV",
        headline: `${agency} Poll Shock: ${player.name} surges to ${tally.PLAYER} projected seats, disrupting traditional coalitions!`,
        category: "POLL"
      });
    } else {
      headlines.push({
        channel: "Prasar Vani",
        headline: `${agency} Survey: NDA projected at ${tally.NDA}, INDIA at ${tally.INDIA}; swing battlegrounds poised on knife-edge`,
        category: "POLL"
      });
    }

    // 2. Economic & Dalal Street Headline
    const econHeadlines = [
      "Dalal Street Hits All-Time High: Sensex gains 450 pts as foreign investors price in political stability",
      "Kisan Mandi Alert: Wholesale vegetable and edible oil rates fluctuate amid unseasonal regional rain",
      "Rupee Stays Resilient: RBI foreign exchange reserves touch record $680 Billion ahead of polls",
      "Industrial Output Jumps: Core infrastructure sectors record 6.8% annual expansion"
    ];
    headlines.push({
      channel: "Metro Business 24",
      headline: econHeadlines[Math.floor(Math.random() * econHeadlines.length)],
      category: "ECONOMY"
    });

    // 3. Agrarian & Grassroots Voices
    const ruralHeadlines = [
      "Kisan Mahapanchayat: Sanyukt Kisan Morcha demands statutory MSP guarantee in election manifestos",
      "Rural Demand Surge: Direct bank transfers and welfare subsidies lift consumer spending in two-tier towns",
      "Water Table Warning: Ground water depletion prompts calls for micro-irrigation subsidies in peninsula"
    ];
    headlines.push({
      channel: "Janata Awaaz",
      headline: ruralHeadlines[Math.floor(Math.random() * ruralHeadlines.length)],
      category: "AGRARIAN"
    });

    // 4. Youth, Tech & University Buzz
    const youthHeadlines = [
      "Aspirants Mobilize: Over 2 Crore first-time youth voters demand zero application fees for state recruitment tests",
      "Digital War Rooms: AI-generated election campaign memes clock over 100 Million views on short video apps",
      "Campus Polls Heated: University student unions debate job creation vs populist welfare handouts"
    ];
    headlines.push({
      channel: "The Digital Wire",
      headline: youthHeadlines[Math.floor(Math.random() * youthHeadlines.length)],
      category: "YOUTH"
    });

    // 5. Investigative & Election Commission Vigilance
    const ecHeadlines = [
      "EC Model Code Crackdown: Flying surveillance squads seize unaccounted cash and liquor consignments at state borders",
      "Backdoor Parleys: Regional satraps hold marathon late-night consultations ahead of candidate list deadline",
      "Voter Turnout Drive: Election Commission enlists sports icons and cinema stars to boost voting percentage"
    ];
    headlines.push({
      channel: "Prasar Vani",
      headline: ecHeadlines[Math.floor(Math.random() * ecHeadlines.length)],
      category: "ELECTION"
    });

    // 6. Player Specific Trigger Headlines
    if (player.properties.length > 2) {
      headlines.push({
        channel: "The Digital Wire",
        headline: `Asset Scrutiny: Opposition questions exponential land holdings of ${player.name} leadership`,
        category: "SCRUTINY"
      });
    }

    if (player.activeFreebies.length > 2) {
      headlines.push({
        channel: "Metro Business 24",
        headline: `Fiscal Prudence Debate: Economists warn against escalating state debt from welfare scheme promises`,
        category: "MANIFESTO"
      });
    }

    // Push all headlines to state store
    headlines.forEach(h => gameState.addBreakingNews(h.headline, h.channel, h.category));
  }
};
