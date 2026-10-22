// Autonomous AI Behavior, Campaign Actions, Alliances & Resort Politics (Version 0.4)
import { gameState } from "../core/state.js";
import { FREEBIE_SCHEMES_CATALOG } from "../data/issuesAndEvents.js";
import { mapEngine } from "./mapEngine.js";
import { cadreEngine } from "./cadreEngine.js";

export const aiPartyEngine = {
  // Player Campaign Action 1: Grand Mega-Rally
  launchGrandRally(stateId, districtId, useSlush = false) {
    const player = gameState.getPlayer();
    const discount = cadreEngine.getVolunteerDiscount();
    const whiteCost = Math.round(45 * (1 - discount)); // Volunteer crowd discount
    const slushCost = 65;
    const turnoutBonus = cadreEngine.getBoothTurnoutBonus();

    if (useSlush) {
      if (player.blackMoney < slushCost) return { success: false, message: `Insufficient Slush Funds. Need ₹${slushCost}L cash.` };
      player.blackMoney -= slushCost;
      player.slushExposure = Math.min(100, player.slushExposure + 10);
    } else {
      if (player.whiteMoney < whiteCost) return { success: false, message: `Insufficient White Money. Need ₹${whiteCost}L (Discount applied: ${Math.round(discount * 100)}%).` };
      player.whiteMoney -= whiteCost;
    }

    // 1. Permanent ground shift in target district & state spillover (enhanced by Panna Pramukhs!)
    const targetBoost = Math.round((4.5 + (turnoutBonus * 0.4)) * 10) / 10;
    gameState.applyPersistentVoteShift(stateId, districtId, targetBoost);
    gameState.applyPersistentVoteShift(stateId, null, 1.6);

    // 2. Active visual radar marker for 3 weeks
    gameState.addRally(stateId, districtId, player.id, "grand_rally", 3);
    player.nationalApproval = Math.min(85, player.nationalApproval + 1.8);

    const s = gameState.getState(stateId);
    const d = gameState.getDistrict(stateId, districtId);
    gameState.addBreakingNews(
      `Sea of Supporters: ${player.name} holds mammoth rally in ${d ? d.name : stateId}; ground buzz surges!`,
      "Janata Awaaz",
      "CAMPAIGN"
    );

    mapEngine.recalculateAllProjections();
    gameState.notify("CAMPAIGN_UPDATED");
    return { 
      success: true, 
      message: `Grand Rally held in ${d ? d.name : stateId}!\n\n• Permanent Vote Gain: +${targetBoost}%\n• Volunteer Discount Applied: ${Math.round(discount * 100)}% (Saved ₹${45 - whiteCost}L)\n• Active 3-Week Momentum Engaged.` 
    };
  },

  // Player Campaign Action 2: Grassroots Door-to-Door & Padyatra
  launchDoorToDoor(stateId, districtId) {
    const player = gameState.getPlayer();
    const discount = cadreEngine.getVolunteerDiscount();
    const cost = Math.round(15 * (1 - discount));
    const turnoutBonus = cadreEngine.getBoothTurnoutBonus();

    if (player.whiteMoney < cost) return { success: false, message: `Insufficient White Money. Need ₹${cost}L.` };

    player.whiteMoney -= cost;
    const boost = Math.round((3.2 + (turnoutBonus * 0.3)) * 10) / 10;
    gameState.applyPersistentVoteShift(stateId, districtId, boost);

    gameState.addRally(stateId, districtId, player.id, "door_to_door", 2);

    const s = gameState.getState(stateId);
    const d = gameState.getDistrict(stateId, districtId);
    gameState.addBreakingNews(
      `Cadre Mobilization: ${player.name} volunteers complete intensive door-to-door outreach across ${d ? d.name : stateId}`,
      "Prasar Vani",
      "CAMPAIGN"
    );

    mapEngine.recalculateAllProjections();
    gameState.notify("CAMPAIGN_UPDATED");
    return { 
      success: true, 
      message: `Door-to-Door padyatra concluded in ${d ? d.name : stateId}!\n\n• Permanent Grassroots Gain: +${boost}%\n• Panna Pramukh Turnout Bonus Active.` 
    };
  },

  // Player Campaign Action 3: IT Cell & Social Media Blitz
  launchITCellBlitz(stateId) {
    const player = gameState.getPlayer();
    const cost = 28; // Lakhs
    if (player.whiteMoney < cost) return { success: false, message: "Insufficient White Money (₹28L required)" };

    player.whiteMoney -= cost;
    const s = gameState.getState(stateId);
    
    // Permanent statewide youth & urban shift
    gameState.applyPersistentVoteShift(stateId, null, 2.5);

    if (s && s.districts.length > 0) {
      gameState.addRally(stateId, s.districts[0].id, player.id, "it_cell", 3);
    }

    gameState.addBreakingNews(
      `Viral Storm: ${player.name} IT cell trends #VoteForProgress; youth engagement spikes across ${s ? s.name : stateId}`,
      "The Digital Wire",
      "CAMPAIGN"
    );

    mapEngine.recalculateAllProjections();
    gameState.notify("CAMPAIGN_UPDATED");
    return { success: true, message: `Digital IT Blitz launched across ${s ? s.name : stateId}! Permanent +2.5% statewide youth shift.` };
  },

  // Player Campaign Action 4: Freebie & Welfare Scheme Announcement
  announceFreebieScheme(schemeId) {
    const player = gameState.getPlayer();
    if (player.activeFreebies.includes(schemeId)) {
      return { success: false, message: "This scheme is already announced in your manifesto!" };
    }

    const scheme = FREEBIE_SCHEMES_CATALOG.find(s => s.id === schemeId);
    if (!scheme) return { success: false, message: "Scheme not found" };

    player.activeFreebies.push(schemeId);
    player.nationalApproval = Math.min(85, player.nationalApproval + 3.5);

    // Apply permanent nationwide shifts to all states based on demographic profiles
    gameState.states.forEach(state => {
      state.districts.forEach(d => {
        let delta = 1.5;
        if (d.rural > 60 && (scheme.id === "kisan_karz_mafi" || scheme.id === "free_power")) delta += 3.5;
        if (d.youth > 40 && scheme.id === "youth_laptop") delta += 3.2;
        if (scheme.id === "mahila_samman") delta += 2.8;

        gameState.applyPersistentVoteShift(state.id, d.id, delta);
      });
    });

    gameState.addBreakingNews(
      `MANIFESTO BOMBSHELL: ${player.name} promises '${scheme.name}' if voted to power! Beneficiary surge across states!`,
      "Prasar Vani",
      "MANIFESTO"
    );

    mapEngine.recalculateAllProjections();
    gameState.notify("CAMPAIGN_UPDATED");
    return { success: true, message: `Promised ${scheme.name}! Permanent voter loyalty surge secured.` };
  },

  // Player Campaign Action 5: Covert Politician Poaching / Horse-Trading
  poachRivalCandidate(targetPartyId, stateId) {
    const player = gameState.getPlayer();
    const slushCost = 80;
    if (player.blackMoney < slushCost) return { success: false, message: "Insufficient Slush Funds (₹80L required)" };

    player.blackMoney -= slushCost;
    player.slushExposure = Math.min(100, player.slushExposure + 22);

    const rival = gameState.getParty(targetPartyId);
    if (rival) {
      rival.trustScore = Math.max(0, rival.trustScore - 20);
    }

    // Heavy permanent shift in target state
    gameState.applyPersistentVoteShift(stateId, null, 5.0);

    const s = gameState.getState(stateId);
    if (s && s.districts.length > 0) {
      gameState.addRally(stateId, s.districts[0].id, player.id, "poached_leader", 4);
    }

    gameState.addBreakingNews(
      `RESORT POLITICS: Heavyweight regional leader from opposition defects to ${player.name} along with entire local cadre!`,
      "Bharat Republic TV",
      "DEFECTION"
    );

    mapEngine.recalculateAllProjections();
    gameState.notify("CAMPAIGN_UPDATED");
    return { success: true, message: `Successfully poached influential political heavyweight! Permanent +5.0% boost in state.` };
  },

  // Pre-Poll Alliance (Gathbandhan) Negotiations
  negotiateAlliance(partyId) {
    const player = gameState.getPlayer();
    const targetParty = gameState.getParty(partyId);
    if (!targetParty || targetParty.isPlayer) return { success: false, message: "Invalid party" };

    const econDiff = Math.abs(player.ideology.economic - targetParty.ideology.economic);
    const socialDiff = Math.abs(player.ideology.social - targetParty.ideology.social);
    const totalDiff = econDiff + socialDiff;

    const compatibilityScore = targetParty.trustScore - (totalDiff * 3);

    if (compatibilityScore >= 40) {
      targetParty.trustScore = Math.min(100, targetParty.trustScore + 25);
      targetParty.coalition = player.coalition;

      gameState.addBreakingNews(
        `HISTORIC ALLIANCE: ${player.name} and ${targetParty.name} seal formal seat-sharing pact! Joint campaign launched!`,
        "Prasar Vani",
        "ALLIANCE"
      );

      mapEngine.recalculateAllProjections();
      gameState.notify("ALLIANCE_UPDATED");
      return { success: true, message: `Alliance successfully sealed with ${targetParty.name}! Joint vote-pooling active across all contested seats.` };
    } else {
      targetParty.trustScore = Math.max(10, targetParty.trustScore - 8);
      return {
        success: false,
        message: `${targetParty.name} rejected alliance talks: Ideological rift and mistrust too deep (Trust: ${targetParty.trustScore}/100).`
      };
    }
  },

  // Autonomous Turn Processing for AI Parties (NDA & INDIA)
  processAITurn() {
    const player = gameState.getPlayer();
    const battlegroundStates = ["UP", "MH", "WB", "BR", "KA", "RJ", "MP", "TG", "PB", "HR"];

    // 1. Tick down active visual rallies
    gameState.states.forEach(state => {
      if (state.activeRallies) {
        state.activeRallies.forEach(r => r.turnsRemaining--);
        state.activeRallies = state.activeRallies.filter(r => r.turnsRemaining > 0);
      }
    });

    // 2. Both NDA and INDIA actively compete every week!
    // NDA (BVP) Counter-Campaign
    const bvp = gameState.getParty("BVP");
    if (bvp && bvp.whiteMoney >= 35) {
      const targetStateId = battlegroundStates[Math.floor(Math.random() * battlegroundStates.length)];
      const s = gameState.getState(targetStateId);
      if (s && s.districts.length > 0) {
        const d = s.districts[Math.floor(Math.random() * s.districts.length)];
        bvp.whiteMoney -= 30;
        
        // Permanent AI pushback
        gameState.applyPersistentVoteShift(targetStateId, d.id, -1.2, 2.5, -0.8, -0.5);
        gameState.addRally(targetStateId, d.id, "BVP", "ai_rally", 2);

        gameState.addBreakingNews(
          `NDA Mega Rally: Narendra Vardhan addresses roaring crowd in ${d.name} (${s.name}); pledges infrastructure blitz`,
          "Bharat Republic TV",
          "CAMPAIGN"
        );
      }
    }

    // INDIA (UPC) Counter-Campaign
    const upc = gameState.getParty("UPC");
    if (upc && upc.whiteMoney >= 30) {
      const targetStateId = battlegroundStates[Math.floor(Math.random() * battlegroundStates.length)];
      const s = gameState.getState(targetStateId);
      if (s && s.districts.length > 0) {
        const d = s.districts[Math.floor(Math.random() * s.districts.length)];
        upc.whiteMoney -= 25;

        // Permanent AI pushback
        gameState.applyPersistentVoteShift(targetStateId, d.id, -1.2, -0.8, 2.5, -0.5);
        gameState.addRally(targetStateId, d.id, "UPC", "ai_rally", 2);

        gameState.addBreakingNews(
          `INDIA Jan Aakrosh: Rahul Kharge leads massive padyatra in ${d.name} (${s.name}); targets unemployment & inflation`,
          "Janata Awaaz",
          "CAMPAIGN"
        );
      }
    }

    // Passive cash inflows for AI parties
    gameState.parties.forEach(p => {
      if (!p.isPlayer) {
        p.whiteMoney += Math.floor(Math.random() * 20) + 15;
      }
    });

    // 3. Deduct active freebie scheme costs from player
    let freebieTotalCost = 0;
    player.activeFreebies.forEach(fId => {
      const scheme = FREEBIE_SCHEMES_CATALOG.find(s => s.id === fId);
      if (scheme) freebieTotalCost += scheme.costPerWeek;
    });

    if (freebieTotalCost > 0) {
      if (player.whiteMoney >= freebieTotalCost) {
        player.whiteMoney -= freebieTotalCost;
      } else {
        player.whiteMoney = 0;
        player.nationalApproval = Math.max(5, player.nationalApproval - 3);
        gameState.addBreakingNews(
          `Fiscal Deficit: ${player.name} treasury faces cash crunch to disburse promised welfare subsidies!`,
          "Metro Business 24",
          "CRISIS"
        );
      }
    }

    // 4. Recalculate Seat Projections
    mapEngine.recalculateAllProjections();
  }
};
