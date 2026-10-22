// Central Reactive State Store for Loktantra (Version 0.2)
import { INDIA_STATES_DATA } from "../data/indiaMapData.js";
import { INITIAL_AI_PARTIES } from "../data/initialParties.js";

class GameStateStore {
  constructor() {
    this.listeners = new Set();
    this.resetToInitial();
  }

  resetToInitial() {
    // Current turn progression: Week 1 to 24 (Week 24 = General Election Counting Day)
    this.currentTurn = 1;
    this.totalTurns = 24;
    this.nextElectionTurn = 24; // Recurring general elections (e.g. Week 24, Week 78 / 54 wks later)
    this.termNumber = 1;
    this.gameStage = "CAMPAIGN"; // "ONBOARDING", "CAMPAIGN", "COUNTING", "POST_POLL", "GOVERNANCE", "GAME_OVER"

    // Player Party Setup
    this.player = {
      id: "PLAYER",
      name: "Lok Shakti Party",
      acronym: "LSP",
      leader: "You",
      color: "#ff9933", // Saffron / Electric Amber
      symbolKey: "hand",
      coalition: "Player Coalition",
      isPlayer: true,
      background: "grassroots",
      whiteMoney: 250, // in Lakhs
      blackMoney: 80, // in Lakhs
      slushExposure: 10, // 0 to 100% (ED/IT raid probability)
      nationalApproval: 34.0,
      ideology: { economic: 5, social: 5, focus: 5 },
      activeFreebies: [],
      properties: [], // owned real estate plots
      bonds: { sovereignGold: 0, infraBonds: 0 },
      loans: [],
      creditScore: 740,
      spokespersonCharisma: 65,
      volunteerCount: 12000,
      corporateTrustCooldown: 0, // Weeks until next corporate funding tranche is allowed
      corporateTranchesTaken: 0, // Cap on corporate tranches
      // Internal Party Cadre & Legislative Wing (Rebalanced sustainable expenses)
      totalMlas: 24,
      mlaLoyalty: 75, // 0 to 100%
      mlaAllowancePerWeek: 0.2, // Lakhs per MLA per week (Sustainable ₹4-6L/wk instead of ₹30L+)
      activeMembers: 18500,
      boothWorkers: 1200,
      cadreMorale: 78 // 0 to 100%
    };

    // Active Crisis Dilemma popup
    this.activeDilemma = null;

    // Post-Election Resort Politics, MLA Trading & Governance (Version 0.4)
    this.postPoll = {
      round: 1,
      maxRounds: 3,
      tradingComplete: false,
      seats: { PLAYER: 0, NDA: 0, INDIA: 0, OTHERS: 0 },
      resortQuarantined: false,
      resortLocation: null,
      playerPoachedThisRound: false,
      rivalDefendedThisRound: false,
      currentRivalBid: null,
      history: []
    };

    this.governance = {
      active: false,
      termWeek: 1,
      role: "OPPOSITION", // "PRIME_MINISTER", "DEPUTY_PM", "OPPOSITION"
      allianceName: "National Alliance",
      allies: [],
      governingSeats: 0,
      stability: 85, // 0 - 100%
      passedBills: 0
    };

    // Parties List: Player + Clone of AI Parties
    this.parties = [
      this.player,
      ...JSON.parse(JSON.stringify(INITIAL_AI_PARTIES))
    ];

    // Initialize States & Districts with Persistent Balanced Vote Banks
    this.states = JSON.parse(JSON.stringify(INDIA_STATES_DATA)).map(state => {
      const isHomeState = state.id === "UP";
      return {
        ...state,
        activeRallies: [], // [{ partyId, districtId, turnsRemaining, type }]
        districts: state.districts.map(d => {
          // Calculate realistic initial vote shares based on district baseline
          const base = d.base || { NDA: 45, INDIA: 45, OTHERS: 10 };
          
          // Player starts with a healthy fighting baseline (14-22%)
          let pShare = 16.0;
          if (isHomeState) pShare = 24.0;
          if (d.youth > 44) pShare += 3.0;
          
          // Deduct proportionally from NDA and INDIA so total is always 100%
          const ndaRatio = base.NDA / (base.NDA + base.INDIA + 0.001);
          const indiaRatio = base.INDIA / (base.NDA + base.INDIA + 0.001);
          
          const ndaShare = Math.max(8, Math.round((base.NDA - (pShare * ndaRatio)) * 10) / 10);
          const indiaShare = Math.max(8, Math.round((base.INDIA - (pShare * indiaRatio)) * 10) / 10);
          const othShare = Math.max(4, Math.round((100 - (pShare + ndaShare + indiaShare)) * 10) / 10);

          return {
            ...d,
            voteShares: {
              PLAYER: pShare,
              NDA: ndaShare,
              INDIA: indiaShare,
              OTHERS: othShare
            },
            projectedWinner: ndaShare >= indiaShare ? "NDA" : "INDIA",
            turnoutEstimate: 67.2,
            voterMood: "Competitive"
          };
        }),
        projectedLeadParty: "NDA",
        projectedPartySeats: {
          PLAYER: 0,
          NDA: Math.round(state.totalSeats * 0.48),
          INDIA: Math.round(state.totalSeats * 0.44),
          OTHERS: Math.max(0, state.totalSeats - (Math.round(state.totalSeats * 0.48) + Math.round(state.totalSeats * 0.44)))
        }
      };
    });

    // Macro-Economic Indicators & National Policy Dashboard
    this.macro = {
      inflation: 5.2, // % CPI Inflation
      gdpGrowth: 7.4, // % Annualized GDP Growth
      unemployment: 6.8, // % Unemployment Rate
      fiscalDeficit: 5.1, // % of GDP
      repoRate: 6.5, // % RBI Policy Repo Rate
      ecVigilance: 45, // 0-100% scale
      governanceScore: 78, // Overall governance index
      sentiment: "Economic Momentum & Welfare Delivery",
      activePolicies: [] // [{ id, name, turnActivated, type }]
    };

    // Rich Breaking News Ticker Items
    this.breakingNews = [
      "Election Commission of India notifies 7-phase General Election across 543 Lok Sabha constituencies",
      "National Poll Tracker: NDA projected at 265, INDIA at 225, fiercely contested battle in swing heartlands",
      "Dalal Street rallies on robust corporate earnings; rural agrarian leaders reiterate legal MSP guarantee demand",
      "Youth voter registration crosses record 1.8 Crore; digital social media war rooms activate in state capitals",
      "Election Commission deploys central observers to monitor Model Code of Conduct and curb illicit cash flows"
    ];

    this.newsLog = [
      {
        turn: 1,
        headline: "General Election 2026 Battle Begins: Mega Poll Contest Across 543 Constituencies Officially Kicks Off",
        channel: "Prasar Vani",
        category: "POLITICS",
        impactSummary: "All national and regional war rooms activate ground campaign networks."
      },
      {
        turn: 1,
        headline: "Mega Pre-Poll Survey: Fierce Multi-Cornered Contest as Regional Strongholds Hold Key to 272 Majority",
        channel: "Bharat Republic TV",
        category: "POLL",
        impactSummary: "NDA leads in Hindi heartland, INDIA maintains heavy bastions in South and East."
      }
    ];

    // Global Seat Projections Total
    this.nationalSeatTally = {
      PLAYER: 28,
      NDA: 262,
      INDIA: 220,
      THIRD_FRONT: 33
    };

    this.selectedStateId = "UP";
    this.selectedDistrictId = "varanasi";
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  notify(changeEvent = "STATE_UPDATED") {
    for (const fn of this.listeners) {
      try {
        fn(this, changeEvent);
      } catch (err) {
        console.error("State listener error:", err);
      }
    }
  }

  getPlayer() {
    return this.parties.find(p => p.isPlayer);
  }

  getParty(partyId) {
    return this.parties.find(p => p.id === partyId);
  }

  getState(stateId) {
    return this.states.find(s => s.id === stateId);
  }

  getDistrict(stateId, districtId) {
    const s = this.getState(stateId);
    if (!s) return null;
    return s.districts.find(d => d.id === districtId);
  }

  setPlayerParty(config) {
    const player = this.getPlayer();
    if (!player) return;
    Object.assign(player, config);

    // Re-adjust baseline vote shares based on chosen background
    this.states.forEach(state => {
      const isHome = state.id === "UP";
      state.districts.forEach(d => {
        let pBase = 16.0;
        if (config.background === "grassroots") {
          pBase = 18.0 + (d.youth > 42 ? 4.0 : 0);
        } else if (config.background === "regional_strongman") {
          pBase = isHome ? 34.0 : 12.0;
        } else if (config.background === "industrialist") {
          pBase = d.urban > 60 ? 24.0 : 12.0;
        }

        const rem = 100 - pBase;
        const curNda = d.voteShares.NDA;
        const curIndia = d.voteShares.INDIA;
        const curOth = d.voteShares.OTHERS;
        const totalOpp = curNda + curIndia + curOth + 0.001;

        d.voteShares.PLAYER = pBase;
        d.voteShares.NDA = Math.round((curNda / totalOpp) * rem * 10) / 10;
        d.voteShares.INDIA = Math.round((curIndia / totalOpp) * rem * 10) / 10;
        d.voteShares.OTHERS = Math.max(2, Math.round((100 - (pBase + d.voteShares.NDA + d.voteShares.INDIA)) * 10) / 10);
      });
    });

    this.notify("PLAYER_INITIALIZED");
  }

  // Persistent Vote Share Modifier
  applyPersistentVoteShift(stateId, districtId, playerDelta, ndaDelta = 0, indiaDelta = 0, othDelta = 0) {
    const s = this.getState(stateId);
    if (!s) return;

    const applyToDistrict = (d) => {
      const vs = d.voteShares;
      vs.PLAYER = Math.max(1, Math.min(85, vs.PLAYER + playerDelta));
      
      // If competitor deltas not explicitly provided, distribute symmetrically
      if (ndaDelta === 0 && indiaDelta === 0) {
        const half = playerDelta / 2;
        vs.NDA = Math.max(5, vs.NDA - half);
        vs.INDIA = Math.max(5, vs.INDIA - half);
      } else {
        vs.NDA = Math.max(5, vs.NDA + ndaDelta);
        vs.INDIA = Math.max(5, vs.INDIA + indiaDelta);
        vs.OTHERS = Math.max(2, vs.OTHERS + othDelta);
      }

      // Re-normalize to exactly 100%
      const total = vs.PLAYER + vs.NDA + vs.INDIA + vs.OTHERS;
      vs.PLAYER = Math.round((vs.PLAYER / total) * 1000) / 10;
      vs.NDA = Math.round((vs.NDA / total) * 1000) / 10;
      vs.INDIA = Math.round((vs.INDIA / total) * 1000) / 10;
      vs.OTHERS = Math.max(1, Math.round((100 - (vs.PLAYER + vs.NDA + vs.INDIA)) * 10) / 10);
    };

    if (districtId) {
      const d = s.districts.find(item => item.id === districtId);
      if (d) applyToDistrict(d);
    } else {
      // Statewide shift across all districts
      s.districts.forEach(d => applyToDistrict(d));
    }
  }

  updatePlayerTreasury(whiteDelta = 0, blackDelta = 0, exposureDelta = 0) {
    const player = this.getPlayer();
    if (!player) return;
    player.whiteMoney = Math.max(0, player.whiteMoney + whiteDelta);
    player.blackMoney = Math.max(0, player.blackMoney + blackDelta);
    player.slushExposure = Math.max(0, Math.min(100, player.slushExposure + exposureDelta));
    this.notify("TREASURY_UPDATED");
  }

  addBreakingNews(headline, channel = "National Wire", category = "GENERAL") {
    // Keep most recent 12 breaking ticker items
    this.breakingNews.unshift(headline);
    if (this.breakingNews.length > 12) this.breakingNews.pop();

    this.newsLog.unshift({
      turn: this.currentTurn,
      headline,
      channel,
      category,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    if (this.newsLog.length > 80) this.newsLog.pop();

    this.notify("NEWS_UPDATED");
  }

  addRally(stateId, districtId, partyId, type = "rally", duration = 3) {
    const s = this.getState(stateId);
    if (!s) return;
    s.activeRallies.push({
      partyId,
      districtId,
      type,
      turnsRemaining: duration
    });
    this.notify("RALLY_ADDED");
  }

  setSelectedState(stateId) {
    this.selectedStateId = stateId;
    const s = this.getState(stateId);
    if (s && s.districts.length > 0) {
      this.selectedDistrictId = s.districts[0].id;
    }
    this.notify("SELECTION_CHANGED");
  }

  setSelectedDistrict(districtId) {
    this.selectedDistrictId = districtId;
    this.notify("SELECTION_CHANGED");
  }
}

export const gameState = new GameStateStore();
