// Horse Trading & Resort Politics Engine: Post-Poll MLA/MP Auction & Coalition Builder
import { gameState } from "../core/state.js";
import { audioEngine } from "./audioEngine.js";

export const horseTradingEngine = {
  // Initialize the 3-round post-poll horse trading session
  initSession() {
    const tally = gameState.nationalSeatTally || { PLAYER: 35, NDA: 250, INDIA: 215, THIRD_FRONT: 43 };

    gameState.postPoll = {
      round: 1,
      maxRounds: 3,
      tradingComplete: false,
      seats: {
        PLAYER: tally.PLAYER || 35,
        NDA: tally.NDA || 250,
        INDIA: tally.INDIA || 215,
        OTHERS: tally.THIRD_FRONT || 43
      },
      resortQuarantined: false,
      resortLocation: null,
      playerPoachedThisRound: false,
      rivalDefendedThisRound: false,
      selectedDefenseAction: null,
      currentRivalBid: null,
      history: []
    };

    gameState.gameStage = "POST_POLL";
    this.generateRivalBidForCurrentRound();
    this.logEvent(`General Election counting concludes! Hung Parliament atmosphere: No single alliance holds an untouchable supermajority. Chartered planes activated!`);
    
    return gameState.postPoll;
  },

  getState() {
    if (!gameState.postPoll) {
      this.initSession();
    }
    return gameState.postPoll;
  },

  // Generate an aggressive rival attempt to poach player MLAs
  generateRivalBidForCurrentRound() {
    const pp = gameState.postPoll;
    if (!pp || pp.round > pp.maxRounds) return null;

    const rivalParties = ["NDA", "INDIA"];
    // Whichever rival has fewer seats or randomly selected
    const rival = pp.seats.NDA >= pp.seats.INDIA ? (Math.random() < 0.65 ? "NDA" : "INDIA") : (Math.random() < 0.65 ? "INDIA" : "NDA");
    const rivalName = rival === "NDA" ? "National Democratic Alliance (NDA)" : "I.N.D.I.A. Opposition Bloc";

    const targetSeats = Math.min(Math.max(3, Math.floor(pp.seats.PLAYER * 0.18)), 14);
    const suitcases = targetSeats * 4; // ₹ Lakhs per seat approx

    const portfolios = [
      "Minister of State (MoS) for Railways & Heavy Industries",
      "Cabinet Portfolio: Civil Aviation & Tourism",
      "Chairmanship of Parliamentary Public Accounts Committee",
      "MoS Surface Transport & National Highways",
      "Special State Infrastructure Development Quota"
    ];
    const portfolio = portfolios[Math.floor(Math.random() * portfolios.length)];

    const locations = [
      "Uttar Pradesh & Hindi Heartland delegation",
      "Western India commercial hub MLAs",
      "Southern regional caucus MPs",
      "Eastern swing belt representatives"
    ];
    const factionLocation = locations[Math.floor(Math.random() * locations.length)];

    pp.currentRivalBid = {
      rival,
      rivalName,
      targetSeats,
      suitcasesLakhs: suitcases * 10,
      portfolio,
      factionLocation
    };

    pp.rivalDefendedThisRound = false;
    return pp.currentRivalBid;
  },

  // Available rival factions the player can target for poaching / bidding
  getAvailableAuctionTargets() {
    const pp = gameState.postPoll;
    return [
      {
        id: "NDA_REBELS",
        partyKey: "NDA",
        name: "Disgruntled NDA Rebel MPs",
        description: "Hardline agrarian & regional allies upset over ministerial portfolio allocations.",
        availableSeats: Math.min(14, Math.max(4, Math.floor(pp.seats.NDA * 0.05))),
        minSlushCash: 35, // in Lakhs
        recommendedCash: 80,
        risk: "High Slush Risk (CBI/ED Surveillance)"
      },
      {
        id: "INDIA_DISSIDENTS",
        partyKey: "INDIA",
        name: "INDIA Bloc Dissident Faction",
        description: "State-level leaders seeking plum central cabinet berths or special state status.",
        availableSeats: Math.min(12, Math.max(4, Math.floor(pp.seats.INDIA * 0.06))),
        minSlushCash: 25,
        recommendedCash: 60,
        risk: "Medium Ideological Friction"
      },
      {
        id: "OTHERS_KINGMAKERS",
        partyKey: "OTHERS",
        name: "Independent & Regional Kingmakers",
        description: "Uncommitted MPs, independents, and regional single-state outfits looking for development packages.",
        availableSeats: Math.min(18, Math.max(6, Math.floor(pp.seats.OTHERS * 0.35))),
        minSlushCash: 20,
        recommendedCash: 50,
        risk: "Low Risk (Pragmatic Bargainers)"
      }
    ];
  },

  // Player bids on a rival/independent faction
  playerBidOnFaction(targetId, cashLakhs, ministryPortfolio) {
    const pp = this.getState();
    const player = gameState.getPlayer();

    if (pp.playerPoachedThisRound) {
      return { success: false, message: "You have already dispatched an emissary this round! Advance to the next round." };
    }

    const targets = this.getAvailableAuctionTargets();
    const target = targets.find(t => t.id === targetId);
    if (!target) return { success: false, message: "Invalid target faction." };

    if (player.blackMoney < cashLakhs) {
      return { success: false, message: `Insufficient Slush Funds! You have ₹${player.blackMoney}L, but bid requires ₹${cashLakhs}L.` };
    }

    // Deduct slush funds and increase exposure
    player.blackMoney -= cashLakhs;
    player.slushExposure = Math.min(100, player.slushExposure + Math.round(cashLakhs * 0.1));

    // Calculate success chance
    const cashRatio = cashLakhs / (target.recommendedCash || 60);
    const charismaFactor = (player.spokespersonCharisma || 65) / 100;
    const portfolioBonus = ministryPortfolio ? 0.20 : 0.05;

    const successProb = Math.min(0.92, (cashRatio * 0.45) + (charismaFactor * 0.25) + portfolioBonus);
    const roll = Math.random();

    let seatsGained = 0;
    if (roll < successProb) {
      // Success! Seats transferred
      const seatsToTake = Math.min(target.availableSeats, Math.max(2, Math.round(target.availableSeats * (0.6 + Math.random() * 0.5))));
      seatsGained = Math.min(seatsToTake, pp.seats[target.partyKey]);

      pp.seats[target.partyKey] -= seatsGained;
      pp.seats.PLAYER += seatsGained;
      player.totalMlas = (player.totalMlas || 24) + seatsGained;

      audioEngine.playCash();
      audioEngine.playFanfare();

      this.logEvent(`🎯 POACHING TRIUMPH: Emissaries deliver ₹${cashLakhs}L suitcases + "${ministryPortfolio}". Secured ${seatsGained} MPs from ${target.name}!`);
      pp.playerPoachedThisRound = true;

      return {
        success: true,
        seatsGained,
        message: `Success! ${seatsGained} MPs from ${target.name} pledged allegiance to your party! (+${seatsGained} seats)`
      };
    } else {
      // Failed bid
      audioEngine.playDebateBell();
      this.logEvent(`⚠️ AUCTION REJECTED: Party high command discovered the secret meeting. ₹${cashLakhs}L slush cash expended, but MPs stayed with ${target.name}.`);
      pp.playerPoachedThisRound = true;

      return {
        success: false,
        seatsGained: 0,
        message: `Bargain rejected! The high command intercepted your emissaries. Slush funds were lost in negotiations.`
      };
    }
  },

  // Player responds to rival poaching attack on player's MLAs
  defendRivalBid(action) {
    const pp = this.getState();
    const player = gameState.getPlayer();
    const bid = pp.currentRivalBid;

    if (!bid) {
      return { success: false, message: "No active rival bid to defend against." };
    }
    if (pp.rivalDefendedThisRound) {
      return { success: false, message: "You have already defended against the rival bid for this round." };
    }

    pp.selectedDefenseAction = action;

    if (action === "resort_quarantine") {
      // 5-Star Resort Lockdown: ₹25L White Money. 100% blocks poaching!
      const cost = 25;
      if (player.whiteMoney < cost) {
        return { success: false, message: `Insufficient White Money! Resort quarantine requires ₹${cost}L for chartered aircraft and luxury villa booking.` };
      }

      player.whiteMoney -= cost;
      pp.resortQuarantined = true;
      const resorts = ["Eagleton Golf Resort, Bengaluru", "Taj Fort Aguada, Goa", "Fairmont Palace, Jaipur", "Mayfair Lagoon, Bhubaneswar"];
      pp.resortLocation = resorts[Math.floor(Math.random() * resorts.length)];

      audioEngine.playCash();
      this.logEvent(`🏨 RESORT LOCKDOWN: Dispatched chartered planes! ${bid.targetSeats} MLAs safely quarantined at ${pp.resortLocation} with mobile jammers! ${bid.rivalName} poachers turned away at the gates!`);
      pp.rivalDefendedThisRound = true;

      return {
        success: true,
        seatsLost: 0,
        message: `100% PROTECTED! All ${bid.targetSeats} MLAs flown to ${pp.resortLocation}. Rival emissaries blocked completely!`
      };
    } else if (action === "match_cash") {
      // Match with Slush Cash: 85% success
      const cost = Math.min(player.blackMoney, Math.max(15, Math.round(bid.suitcasesLakhs * 0.35)));
      if (player.blackMoney < cost) {
        return { success: false, message: `Insufficient Slush Cash! You need ₹${cost}L to counter-match rival cash offers.` };
      }

      player.blackMoney -= cost;
      const roll = Math.random();
      pp.rivalDefendedThisRound = true;

      if (roll < 0.85) {
        audioEngine.playCash();
        this.logEvent(`💼 LOYALTY BONUS PAID: Paid ₹${cost}L cash bonuses to ${bid.factionLocation}. The rebellion was quelled! 0 seats lost.`);
        return {
          success: true,
          seatsLost: 0,
          message: `Loyalty bonuses accepted! Your MLAs declined ${bid.rivalName}'s offer and remain firmly in your camp.`
        };
      } else {
        const lost = Math.max(1, Math.floor(bid.targetSeats * 0.35));
        pp.seats.PLAYER = Math.max(0, pp.seats.PLAYER - lost);
        pp.seats[bid.rival] += lost;
        player.totalMlas = Math.max(1, (player.totalMlas || 24) - lost);

        audioEngine.playSiren();
        this.logEvent(`🚨 ROGUE DEFECTION: Despite ₹${cost}L payout, ${lost} rogue MLAs took the money and defected to ${bid.rivalName}!`);
        return {
          success: false,
          seatsLost: lost,
          message: `Partial betrayal! ${lost} MLAs secretly boarded ${bid.rivalName}'s midnight convoy and defected!`
        };
      }
    } else if (action === "anti_defection_threat") {
      // Threaten 10th Schedule Disqualification: 50% success, Free
      const roll = Math.random();
      pp.rivalDefendedThisRound = true;

      if (roll < 0.55) {
        audioEngine.playFanfare();
        this.logEvent(`📜 WHIP ENFORCED: Threat of disqualification under the 10th Schedule scared rebels into submission! ${bid.targetSeats} MLAs reaffirmed loyalty.`);
        return {
          success: true,
          seatsLost: 0,
          message: `Strict Party Whip worked! Rebels feared losing their legislative seats and rejected ${bid.rivalName}'s advance.`
        };
      } else {
        const lost = Math.max(2, Math.floor(bid.targetSeats * 0.7));
        pp.seats.PLAYER = Math.max(0, pp.seats.PLAYER - lost);
        pp.seats[bid.rival] += lost;
        player.totalMlas = Math.max(1, (player.totalMlas || 24) - lost);

        audioEngine.playSiren();
        this.logEvent(`⚡ DEFIANCE UNDER ANTI-DEFECTION: ${lost} MLAs claimed a 2/3rd split and joined ${bid.rivalName} anyway!`);
        return {
          success: false,
          seatsLost: lost,
          message: `Whip defied! ${lost} rebel MLAs held a rogue press conference and merged with ${bid.rivalName}!`
        };
      }
    } else {
      // Let them defect
      const lost = Math.min(pp.seats.PLAYER, bid.targetSeats);
      pp.seats.PLAYER = Math.max(0, pp.seats.PLAYER - lost);
      pp.seats[bid.rival] += lost;
      player.totalMlas = Math.max(1, (player.totalMlas || 24) - lost);

      pp.rivalDefendedThisRound = true;
      audioEngine.playDebateBell();
      this.logEvent(`🚪 UNCONTESTED DEFECTION: ${lost} MLAs from ${bid.factionLocation} walked over to ${bid.rivalName} unchallenged.`);
      return {
        success: false,
        seatsLost: lost,
        message: `${lost} MLAs defected to ${bid.rivalName}. You saved your treasury for the final coalition battle.`
      };
    }
  },

  // AI parties bid against each other & OTHERS in the background
  simulateAITurn() {
    const pp = this.getState();
    
    // NDA bids on OTHERS
    if (pp.seats.OTHERS > 8 && Math.random() < 0.7) {
      const poached = Math.floor(Math.random() * 4) + 1;
      pp.seats.OTHERS -= poached;
      pp.seats.NDA += poached;
      this.logEvent(`📰 SAMACHAR SCOOP: NDA emissaries secure letter of support from ${poached} independent MPs from coastal belt.`);
    }

    // INDIA bids on OTHERS
    if (pp.seats.OTHERS > 6 && Math.random() < 0.65) {
      const poached = Math.floor(Math.random() * 3) + 1;
      pp.seats.OTHERS -= poached;
      pp.seats.INDIA += poached;
      this.logEvent(`📰 PARLIAMENT CORRIDORS: INDIA leadership announces coalition pact with ${poached} regional state lawmakers.`);
    }

    // Ensure sum is always exactly 543
    const sum = pp.seats.PLAYER + pp.seats.NDA + pp.seats.INDIA + pp.seats.OTHERS;
    if (sum !== 543) {
      const diff = 543 - sum;
      pp.seats.OTHERS = Math.max(2, pp.seats.OTHERS + diff);
    }
  },

  // Advance to next round (Round 1 -> 2 -> 3 -> Summit)
  advanceRound() {
    const pp = this.getState();

    // Auto-resolve rival bid if player didn't defend
    if (!pp.rivalDefendedThisRound && pp.currentRivalBid) {
      this.defendRivalBid("let_defect");
    }

    // Simulate AI rival transactions
    this.simulateAITurn();

    if (pp.round < pp.maxRounds) {
      pp.round++;
      pp.playerPoachedThisRound = false;
      pp.rivalDefendedThisRound = false;
      pp.selectedDefenseAction = null;
      pp.resortQuarantined = false;
      this.generateRivalBidForCurrentRound();
      audioEngine.playBreakingNews();
      this.logEvent(`🔔 ROUND ${pp.round} COMMENCES: Midnight stakes intensify! Bidding wars spread across luxury hotels.`);
      return { complete: false, round: pp.round };
    } else {
      // 3 rounds completed! Move to Summit
      pp.tradingComplete = true;
      audioEngine.playFanfare();
      this.logEvent(`🏛️ ROUND 3 CONCLUDED: The auction dust settles. All parties convene for the 272 Majority Summit!`);
      return { complete: true, round: pp.round };
    }
  },

  // Evaluate final standings and generate coalition options
  getCoalitionOptions() {
    const pp = this.getState();
    const seats = pp.seats;
    const majority = 272;

    // Sort parties by highest seats
    const standings = [
      { key: "PLAYER", name: gameState.getPlayer().name + ` (${gameState.getPlayer().acronym})`, seats: seats.PLAYER, isPlayer: true },
      { key: "NDA", name: "National Democratic Alliance (NDA)", seats: seats.NDA, isPlayer: false },
      { key: "INDIA", name: "I.N.D.I.A. Coalition", seats: seats.INDIA, isPlayer: false },
      { key: "OTHERS", name: "Regional Front & Independents", seats: seats.OTHERS, isPlayer: false }
    ].sort((a, b) => b.seats - a.seats);

    const singleLargest = standings[0];

    // Check Player's potential coalition partners
    const playerCoalitions = [];

    // Option 1: Player + OTHERS
    if (seats.PLAYER + seats.OTHERS >= majority) {
      playerCoalitions.push({
        id: "PLAYER_OTHERS",
        name: "Federal Peoples Gathbandhan",
        allies: ["OTHERS"],
        combinedSeats: seats.PLAYER + seats.OTHERS,
        majorityReached: true,
        demands: "2 Key Cabinet Portfolios (Railways & Agriculture) + ₹15,000 Cr Special Category State Grant",
        role: "Prime Minister of India (Head of Government)"
      });
    }

    // Option 2: Player + INDIA
    if (seats.PLAYER + seats.INDIA >= majority) {
      playerCoalitions.push({
        id: "PLAYER_INDIA",
        name: "United Democratic Alliance",
        allies: ["INDIA"],
        combinedSeats: seats.PLAYER + seats.INDIA,
        majorityReached: true,
        demands: "Joint Steering Committee + Common Minimum Program + Deputy Prime Ministership to INDIA Leader",
        role: "Prime Minister of India"
      });
    }

    // Option 3: Player + INDIA + OTHERS (Broad Secular Front)
    if (seats.PLAYER + seats.INDIA + seats.OTHERS >= majority) {
      playerCoalitions.push({
        id: "GRAND_SECULAR_FRONT",
        name: "Grand Federal Front",
        allies: ["INDIA", "OTHERS"],
        combinedSeats: seats.PLAYER + seats.INDIA + seats.OTHERS,
        majorityReached: true,
        demands: "Equal distribution of economic & social portfolios + Decentralized Governance",
        role: "Prime Minister of India"
      });
    }

    // Option 4: Player + NDA (National Unity)
    if (seats.PLAYER + seats.NDA >= majority) {
      playerCoalitions.push({
        id: "PLAYER_NDA",
        name: "National Vikas Mahagathbandhan",
        allies: ["NDA"],
        combinedSeats: seats.PLAYER + seats.NDA,
        majorityReached: true,
        demands: "Focus on economic growth, industrial corridor expansion, and foreign trade",
        role: seats.PLAYER >= seats.NDA ? "Prime Minister of India" : "Deputy Prime Minister + Home Ministry"
      });
    }

    // AI Rival Coalition Strategy:
    // Highest AI party automatically finds nearest partner to reach 272
    let rivalFormedCoalition = null;
    let rivalInviteToPlayer = null;

    if (!singleLargest.isPlayer) {
      const leadAI = singleLargest.key; // "NDA" or "INDIA"
      const partnerAI = leadAI === "NDA" ? "INDIA" : "NDA";

      // 1. Can lead AI reach 272 with OTHERS?
      if (seats[leadAI] + seats.OTHERS >= majority) {
        rivalFormedCoalition = {
          leaderKey: leadAI,
          leaderName: singleLargest.name,
          allies: ["OTHERS"],
          combinedSeats: seats[leadAI] + seats.OTHERS,
          outcome: "AI forms Government with Regional Front"
        };
      }

      // 2. Does lead AI need Player to reach 272 or prefer Player as coalition partner?
      if (seats[leadAI] + seats.PLAYER >= majority) {
        rivalInviteToPlayer = {
          invitingParty: singleLargest.name,
          invitingKey: leadAI,
          combinedSeats: seats[leadAI] + seats.PLAYER,
          offeredRole: "Deputy Prime Minister of India + Union Home Ministry",
          benefits: "+₹200L Central Infrastructure Funds + 4 Cabinet Portfolios"
        };
      }
    }

    return {
      standings,
      singleLargest,
      playerCoalitions,
      rivalFormedCoalition,
      rivalInviteToPlayer,
      playerHasAbsoluteMajority: seats.PLAYER >= majority
    };
  },

  // Finalize government formation & smoothly transition into GOVERNANCE era
  finalizeGovernment({ role, allianceName, governingSeats, allies }) {
    const player = gameState.getPlayer();

    // Set governance state
    gameState.governance = {
      active: true,
      termWeek: 1,
      role: role, // "PRIME_MINISTER", "DEPUTY_PM", "OPPOSITION"
      allianceName: allianceName || "Governing Alliance",
      allies: allies || [],
      governingSeats: governingSeats || 272,
      stability: 85, // 0 - 100%
      passedBills: 0,
      approvalBonus: role === "PRIME_MINISTER" ? 15 : 5
    };

    if (role === "PRIME_MINISTER") {
      player.nationalApproval = Math.min(95, (player.nationalApproval || 50) + 12);
      player.whiteMoney += 150; // Central discretionary grant
      audioEngine.playFanfare();
      gameState.addBreakingNews(
        `GOVERNMENT FORMED: ${player.name} (${player.acronym}) takes oath as Prime Minister of India heading the ${gameState.governance.allianceName} with ${governingSeats} Lok Sabha seats!`,
        "Prasar Vani",
        "GOVERNANCE"
      );
    } else if (role === "DEPUTY_PM") {
      player.nationalApproval = Math.min(90, (player.nationalApproval || 50) + 6);
      player.whiteMoney += 80;
      audioEngine.playFanfare();
      gameState.addBreakingNews(
        `CABINET SWORN IN: ${player.name} enters Union Government as Deputy Prime Minister in coalition with ${allianceName}!`,
        "Bharat TV",
        "GOVERNANCE"
      );
    } else {
      player.nationalApproval = Math.min(85, (player.nationalApproval || 50) + 3);
      audioEngine.playDebateBell();
      gameState.addBreakingNews(
        `NEW PARLIAMENT ASSEMBLES: ${allianceName} forms government. ${player.name} assumes role as Leader of the Opposition!`,
        "Janata Awaaz",
        "GOVERNANCE"
      );
    }

    // Switch game stage into GOVERNANCE
    gameState.gameStage = "GOVERNANCE";
    // Total turns expands to recurring 54-week constitutional election cycle!
    gameState.nextElectionTurn = gameState.currentTurn + 54;
    gameState.totalTurns = gameState.nextElectionTurn;

    gameState.notify("GOVERNANCE_INITIALIZED");
    return gameState.governance;
  },

  logEvent(text) {
    const pp = this.getState();
    pp.history.unshift({
      round: pp.round,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text
    });
    if (pp.history.length > 30) pp.history.pop();
  }
};
