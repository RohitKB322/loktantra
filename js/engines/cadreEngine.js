// Internal Party Management, MLA Allowances, Cadre & Booth Workers Engine (Version 0.4)
import { gameState } from "../core/state.js";
import { audioEngine } from "./audioEngine.js";
import { mapEngine } from "./mapEngine.js";

export const cadreEngine = {
  // Volunteer & Youth Wing Mechanical Multipliers
  getVolunteerDiscount() {
    const player = gameState.getPlayer();
    const count = player.activeMembers || 18500;
    // Each 5,000 members gives a 5% campaign discount up to max 30%
    return Math.min(0.30, Math.floor(count / 5000) * 0.05);
  },

  getBoothTurnoutBonus() {
    const player = gameState.getPlayer();
    const workers = player.boothWorkers || 1200;
    // Each 400 Panna Pramukhs gives +1.0% ground turnout & vote conversion bonus
    return Math.round((workers / 400) * 1.0 * 10) / 10;
  },

  getSmearResistance() {
    const player = gameState.getPlayer();
    const count = player.activeMembers || 18500;
    // Active youth counter-meme force reduces rival attack effectiveness
    return Math.min(50, Math.floor(count / 1000) * 2.5);
  },

  // Calculate dynamic seats won across states
  getDynamicStateDelegations() {
    const player = gameState.getPlayer();
    const delegations = [];

    gameState.states.forEach(state => {
      const pSeats = state.projectedPartySeats ? state.projectedPartySeats.PLAYER : 0;
      if (pSeats > 0) {
        delegations.push({
          stateId: state.id,
          name: state.name,
          code: state.code,
          seats: pSeats,
          total: state.totalSeats
        });
      }
    });

    // If player hasn't crossed threshold yet in any state, show top 3 battleground contest presence
    if (delegations.length === 0) {
      delegations.push({ stateId: "UP", name: "Uttar Pradesh", code: "UP", seats: 0, total: 80 });
      delegations.push({ stateId: "MH", name: "Maharashtra", code: "MH", seats: 0, total: 48 });
      delegations.push({ stateId: "BR", name: "Bihar", code: "BR", seats: 0, total: 40 });
    }

    return delegations;
  },

  // Update weekly allowance per MLA
  setMlaAllowance(allowanceInLakhs) {
    const player = gameState.getPlayer();
    player.mlaAllowancePerWeek = Math.max(0.2, Math.min(5.0, allowanceInLakhs));
    
    // Higher allowance improves loyalty; stingy allowances cause resentment
    if (player.mlaAllowancePerWeek >= 2.0) {
      player.mlaLoyalty = Math.min(100, player.mlaLoyalty + 6);
    } else if (player.mlaAllowancePerWeek < 0.8) {
      player.mlaLoyalty = Math.max(15, player.mlaLoyalty - 6);
    }

    gameState.notify("CADRE_UPDATED");
  },

  // Distribute Secret Briefcase (Slush Cash to Lock in MLA Loyalty)
  distributeSecretBriefcase() {
    const player = gameState.getPlayer();
    const slushCost = 35; // in Lakhs

    if (player.blackMoney < slushCost) {
      return { success: false, message: `Insufficient Slush Money. You need ₹${slushCost}L in cash.` };
    }

    player.blackMoney -= slushCost;
    player.slushExposure = Math.min(100, player.slushExposure + 12);
    player.mlaLoyalty = Math.min(100, player.mlaLoyalty + 25);

    audioEngine.playCash();
    gameState.addBreakingNews(
      `Internal Parleys: ${player.name} leadership consolidates legislative wing ahead of crucial vote`,
      "Prasar Vani",
      "PARTY"
    );

    gameState.notify("CADRE_UPDATED");
    return { success: true, message: `Distributed ₹${slushCost}L clandestine perks! MLA loyalty surged to ${player.mlaLoyalty}%. (+12% ED risk)` };
  },

  // Hold Grand Parliamentary Conclave
  holdLegislativeConclave() {
    const player = gameState.getPlayer();
    const whiteCost = 20; // Lakhs

    if (player.whiteMoney < whiteCost) {
      return { success: false, message: `Insufficient White Money. You need ₹${whiteCost}L declared funds.` };
    }

    player.whiteMoney -= whiteCost;
    player.mlaLoyalty = Math.min(100, player.mlaLoyalty + 12);
    player.cadreMorale = Math.min(100, player.cadreMorale + 15);

    audioEngine.playFanfare();
    gameState.addBreakingNews(
      `Show of Strength: ${player.name} concludes high-energy National Executive conclave in New Delhi`,
      "Metro Business 24",
      "PARTY"
    );

    gameState.notify("CADRE_UPDATED");
    return { success: true, message: `Conclave successfully concluded! Party unity fortified and cadre morale boosted to ${player.cadreMorale}%.` };
  },

  // Launch Mass Volunteer & Booth Worker Recruitment Drive
  launchRecruitmentDrive() {
    const player = gameState.getPlayer();
    const whiteCost = 15; // Lakhs

    if (player.whiteMoney < whiteCost) {
      return { success: false, message: `Insufficient White Money. You need ₹${whiteCost}L.` };
    }

    player.whiteMoney -= whiteCost;
    player.activeMembers += 4500;
    player.boothWorkers += 350;
    player.cadreMorale = Math.min(100, player.cadreMorale + 10);

    audioEngine.playCash();
    gameState.addBreakingNews(
      `Grassroots Expansion: ${player.name} enrolls thousands of youth in nationwide door-to-door membership drive`,
      "Janata Awaaz",
      "ORGANIZATION"
    );

    gameState.notify("CADRE_UPDATED");
    return { 
      success: true, 
      message: `Enrolled +4,500 active youth members & +350 trained Panna Pramukhs!\n\n• Campaign Cost Discount: ${Math.round(this.getVolunteerDiscount() * 100)}%\n• Turnout Bonus: +${this.getBoothTurnoutBonus()}%` 
    };
  },

  // Deploy Panna Pramukhs directly to a Target Battleground State
  deployPannaPramukhsToState(targetStateId) {
    const player = gameState.getPlayer();
    const workersNeeded = 300;

    if (player.boothWorkers < workersNeeded) {
      return { success: false, message: `Insufficient Panna Pramukhs. You need at least ${workersNeeded} trained booth chiefs.` };
    }

    const s = gameState.getState(targetStateId);
    if (!s) return { success: false, message: "Invalid state." };

    // Apply permanent +3.0% boost in target state due to intense booth management!
    gameState.applyPersistentVoteShift(targetStateId, null, 3.2);

    audioEngine.playFanfare();
    gameState.addBreakingNews(
      `Micro-Targeting: ${player.name} deploys elite task force of Panna Pramukhs across every booth in ${s.name}`,
      "The Digital Wire",
      "STRATEGY"
    );

    mapEngine.recalculateAllProjections();
    gameState.notify("CADRE_UPDATED");
    return { success: true, message: `Deployed 300 Panna Pramukhs to ${s.name}! Permanent +3.2% vote conversion secured at polling booths.` };
  },

  // Launch Student Wing Dharna / Youth Protest
  launchStudentDharna(stateId) {
    const player = gameState.getPlayer();
    const cost = 10; // Lakhs

    if (player.whiteMoney < cost) {
      return { success: false, message: `Insufficient White Money. You need ₹${cost}L.` };
    }

    player.whiteMoney -= cost;
    const s = gameState.getState(stateId);

    // Boost youth swing in this state
    gameState.applyPersistentVoteShift(stateId, null, 2.8);
    player.cadreMorale = Math.min(100, player.cadreMorale + 14);

    audioEngine.playDebateBell();
    gameState.addBreakingNews(
      `Student Uprising: ${player.name} youth wing blocks state secretariat demanding paper leak inquiry and jobs`,
      "Janata Awaaz",
      "YOUTH"
    );

    mapEngine.recalculateAllProjections();
    gameState.notify("CADRE_UPDATED");
    return { success: true, message: `Massive student agitation held in ${s ? s.name : stateId}! Statewide youth swing +2.8%, cadre morale elevated.` };
  },

  // Grassroots Crowdfunding Micro-Donations
  launchCrowdfundingDrive() {
    const player = gameState.getPlayer();
    const members = player.activeMembers || 18500;
    
    // Revenue based on member network and public approval
    const collected = Math.round((members * 0.0018) + (player.nationalApproval * 0.45));
    player.whiteMoney += collected;
    player.cadreMorale = Math.min(100, player.cadreMorale + 8);

    audioEngine.playCash();
    gameState.addBreakingNews(
      `People's War Chest: ${player.name} crowdsources ₹${collected}L in micro-donations from common citizens across India`,
      "Metro Business 24",
      "FINANCE"
    );

    gameState.notify("FINANCE_UPDATED");
    return { success: true, message: `Crowdfunding drive raised ₹${collected}L in clean white funds from ${members.toLocaleString()} citizens!` };
  },

  // Provide Worker Rations & Fuel Subsidy
  provideWorkerFuelRation() {
    const player = gameState.getPlayer();
    const cost = 12; // Lakhs

    if (player.whiteMoney < cost) {
      return { success: false, message: `Insufficient White Money. Need ₹${cost}L.` };
    }

    player.whiteMoney -= cost;
    player.cadreMorale = Math.min(100, player.cadreMorale + 22);

    audioEngine.playCash();
    gameState.notify("CADRE_UPDATED");
    return { success: true, message: `Distributed bike fuel allowances & meal packets to ground cadre! Morale reached ${player.cadreMorale}%.` };
  },

  // Weekly Turn Tick for Cadre & MLAs
  processTurnTick() {
    const player = gameState.getPlayer();
    const tally = gameState.nationalSeatTally;
    // Total elected MPs / MLAs dynamically mirrors current projected seats or base
    const seatsWon = Math.max(tally ? tally.PLAYER : 0, 18);
    const weeklyCost = Math.round(seatsWon * (player.mlaAllowancePerWeek || 0.2));

    let mlaDefected = 0;

    // Deduct salary allowance from white treasury
    if (player.whiteMoney >= weeklyCost) {
      player.whiteMoney -= weeklyCost;
      if (player.mlaLoyalty < 80) player.mlaLoyalty += 1;
    } else {
      player.whiteMoney = 0;
      player.mlaLoyalty = Math.max(10, player.mlaLoyalty - 12);
      player.cadreMorale = Math.max(10, player.cadreMorale - 10);

      gameState.addBreakingNews(
        `Discontent in Ranks: Delay in constituency allowances triggers murmurs inside ${player.name}`,
        "The Digital Wire",
        "PARTY"
      );
    }

    // Check for MLA defection if loyalty is critically low (< 35%)
    if (player.mlaLoyalty < 35 && seatsWon > 5) {
      if (Math.random() < 0.45) {
        mlaDefected = Math.floor(Math.random() * 2) + 1;
        player.nationalApproval = Math.max(5, player.nationalApproval - 2.5);

        audioEngine.playSiren();
        gameState.addBreakingNews(
          `BREAKING DEFECTION: ${mlaDefected} disgruntled legislators resign from ${player.name} citing leadership neglect!`,
          "Bharat Republic TV",
          "SCANDAL"
        );
      }
    }

    return { weeklyCost, mlaDefected, seatsWon };
  }
};
