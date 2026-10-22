// Internal Party Management, MLA Allowances, Cadre & Booth Workers Engine
import { gameState } from "../core/state.js";
import { audioEngine } from "./audioEngine.js";

export const cadreEngine = {
  // Update weekly allowance per MLA
  setMlaAllowance(allowanceInLakhs) {
    const player = gameState.getPlayer();
    player.mlaAllowancePerWeek = Math.max(0.2, Math.min(5.0, allowanceInLakhs));
    
    // Higher allowance naturally improves loyalty
    if (player.mlaAllowancePerWeek >= 2.0) {
      player.mlaLoyalty = Math.min(100, player.mlaLoyalty + 5);
    } else if (player.mlaAllowancePerWeek < 0.8) {
      player.mlaLoyalty = Math.max(20, player.mlaLoyalty - 5);
    }

    gameState.notify("CADRE_UPDATED");
  },

  // Distribute Secret Briefcase (Slush Money to Lock in MLA Loyalty)
  distributeSecretBriefcase() {
    const player = gameState.getPlayer();
    const slushCost = 35; // in Lakhs

    if (player.blackMoney < slushCost) {
      return { success: false, message: `Insufficient Slush Money. Need ₹${slushCost}L` };
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
      return { success: false, message: `Insufficient White Money. Need ₹${whiteCost}L` };
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
    return { success: true, message: `Conclave successfully concluded! Party unity fortified and cadre morale boosted.` };
  },

  // Launch Mass Volunteer & Booth Worker Recruitment Drive
  launchRecruitmentDrive() {
    const player = gameState.getPlayer();
    const whiteCost = 15; // Lakhs

    if (player.whiteMoney < whiteCost) {
      return { success: false, message: `Insufficient White Money. Need ₹${whiteCost}L` };
    }

    player.whiteMoney -= whiteCost;
    player.activeMembers += 4500;
    player.boothWorkers += 320;
    player.cadreMorale = Math.min(100, player.cadreMorale + 10);

    audioEngine.playCash();
    gameState.addBreakingNews(
      `Grassroots Expansion: ${player.name} enrolls thousands of youth in nationwide door-to-door membership drive`,
      "Janata Awaaz",
      "ORGANIZATION"
    );

    gameState.notify("CADRE_UPDATED");
    return { success: true, message: `Enrolled +4,500 active members and +320 trained Panna Pramukhs (Booth in-charges)!` };
  },

  // Provide Worker Rations & Fuel Subsidy
  provideWorkerFuelRation() {
    const player = gameState.getPlayer();
    const cost = 12; // Lakhs

    if (player.whiteMoney < cost) {
      return { success: false, message: `Insufficient White Money. Need ₹${cost}L` };
    }

    player.whiteMoney -= cost;
    player.cadreMorale = Math.min(100, player.cadreMorale + 22);

    audioEngine.playCash();
    gameState.notify("CADRE_UPDATED");
    return { success: true, message: `Distributed bike fuel allowances & lunch packets to ground cadre! Morale reached ${player.cadreMorale}%.` };
  },

  // Weekly Turn Tick for Cadre & MLAs
  processTurnTick() {
    const player = gameState.getPlayer();
    const mlaCount = player.totalMlas || 24;
    const weeklyCost = Math.round(mlaCount * (player.mlaAllowancePerWeek || 1.2));

    let mlaDefected = 0;

    // Deduct salary allowance from white treasury
    if (player.whiteMoney >= weeklyCost) {
      player.whiteMoney -= weeklyCost;
      // Stable loyalty
      if (player.mlaLoyalty < 80) player.mlaLoyalty += 1;
    } else {
      // Unpaid allowances cause dissatisfaction!
      player.whiteMoney = 0;
      player.mlaLoyalty = Math.max(10, player.mlaLoyalty - 12);
      player.cadreMorale = Math.max(10, player.cadreMorale - 10);

      gameState.addBreakingNews(
        `Discontent in Ranks: Delay in constituency development funds triggers murmurs inside ${player.name}`,
        "The Digital Wire",
        "PARTY"
      );
    }

    // Check for MLA defection if loyalty is critically low (< 35%)
    if (player.mlaLoyalty < 35 && player.totalMlas > 5) {
      if (Math.random() < 0.45) {
        mlaDefected = Math.floor(Math.random() * 2) + 1;
        player.totalMlas -= mlaDefected;
        player.nationalApproval = Math.max(5, player.nationalApproval - 2.5);

        audioEngine.playSiren();
        gameState.addBreakingNews(
          `BREAKING DEFECTION: ${mlaDefected} disgruntled MLAs resign from ${player.name} citing leadership neglect!`,
          "Bharat Republic TV",
          "SCANDAL"
        );
      }
    }

    return { weeklyCost, mlaDefected };
  }
};
