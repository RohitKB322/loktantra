// Weekly Turn Engine: Orchestrates AI turns, finance ticks, events, cadre & dilemmas (Version 0.3)
import { gameState } from "./state.js";
import { aiPartyEngine } from "../engines/aiPartyEngine.js";
import { financeEngine } from "../engines/financeEngine.js";
import { mediaEngine } from "../engines/mediaEngine.js";
import { mapEngine } from "../engines/mapEngine.js";
import { cadreEngine } from "../engines/cadreEngine.js";
import { audioEngine } from "../engines/audioEngine.js";
import { governanceEngine } from "../engines/governanceEngine.js";
import { RANDOM_EVENTS_POOL } from "../data/issuesAndEvents.js";
import { DILEMMAS_POOL } from "../data/dilemmasData.js";
import { saveManager } from "./saveManager.js";

export const turnEngine = {
  // Advance to the next week / turn
  advanceTurn() {
    if (gameState.gameStage === "COUNTING" || gameState.gameStage === "POST_POLL") {
      return { success: false, message: "Election counting complete! Enter Resort Politics & Horse Trading to form the Government." };
    }
    if (gameState.gameStage === "GAME_OVER") {
      return { success: false, message: "Campaign has concluded." };
    }

    const player = gameState.getPlayer();

    // ==========================================
    // STAGE A: POST-POLL GOVERNANCE CONTINUATION
    // ==========================================
    if (gameState.gameStage === "GOVERNANCE") {
      gameState.currentTurn++;
      if (!gameState.governance) {
        gameState.governance = { active: true, termWeek: 1, role: "PRIME_MINISTER", stability: 85 };
      }
      gameState.governance.termWeek = (gameState.governance.termWeek || 1) + 1;

      // 1. Weekly Finance & Cadre allowances tick
      const financeSummary = financeEngine.processTurnTick();
      const cadreSummary = cadreEngine.processTurnTick();

      // 2. Weekly Parliamentary Governance Dynamic Events
      const gov = gameState.governance;
      if (gov.role === "PRIME_MINISTER") {
        const roll = Math.random();
        if (roll < 0.35) {
          // Coalition Partner Demand
          const penalty = Math.floor(Math.random() * 4) + 2;
          gov.stability = Math.max(30, gov.stability - penalty);
          gameState.addBreakingNews(
            `PARLIAMENT BUZZ: Key coalition partners voice dissatisfaction over ministerial portfolio allocations. Floor Test stability shifts to ${gov.stability}%.`,
            "Bharat TV",
            "GOVERNANCE"
          );
        } else if (roll < 0.65) {
          // Landmark Bill Passed
          gov.passedBills = (gov.passedBills || 0) + 1;
          player.nationalApproval = Math.min(95, player.nationalApproval + 1.2);
          gov.stability = Math.min(100, gov.stability + 3);
          audioEngine.playFanfare();
          gameState.addBreakingNews(
            `BILL PASSED: Lok Sabha passes landmark National Infrastructure & Welfare Guarantee Bill by voice vote! Ruling alliance stability stands at ${gov.stability}%.`,
            "Prasar Vani",
            "GOVERNANCE"
          );
        } else {
          // Economic Review
          player.whiteMoney += 40;
          gameState.addBreakingNews(
            `CABINET UPDATE: Union Council of Ministers approves weekly budgetary allocation. Economic momentum steady.`,
            "Metro Biz",
            "GOVERNANCE"
          );
        }
      } else if (gov.role === "DEPUTY_PM") {
        player.whiteMoney += 25;
        gameState.addBreakingNews(
          `COALITION LIAISON: Deputy Prime Minister convenes multi-party coordination committee to resolve state fiscal grants.`,
          "Janata Awaaz",
          "GOVERNANCE"
        );
      } else {
        // Opposition Leader
        const roll = Math.random();
        if (roll < 0.4) {
          player.nationalApproval = Math.min(85, player.nationalApproval + 1.5);
          audioEngine.playDebateBell();
          gameState.addBreakingNews(
            `OPPOSITION RALLY: Leader of Opposition leads fiery walkout in Lok Sabha demanding Joint Parliamentary Committee probe!`,
            "Digital Wire",
            "GOVERNANCE"
          );
        }
      }

      // 3. National Economic Evolution & Recurring Election Check
      governanceEngine.processWeeklyTick();

      // Recalculate Seat Projections & State Mood
      mapEngine.recalculateAllProjections();

      // Auto-save and state notification
      saveManager.autoSave();
      gameState.notify("TURN_ADVANCED");

      return {
        success: true,
        currentTurn: gameState.currentTurn,
        gameStage: gameState.gameStage,
        financeSummary,
        cadreSummary
      };
    }

    // 1. Process Autonomous AI actions & freebie deductions
    aiPartyEngine.processAITurn();

    // 2. Process Finance engine tick (Loan interest, bonds, property fluctuation, ED raid checks)
    const financeSummary = financeEngine.processTurnTick();

    // 3. Process Cadre & MLA Allowances and Defection check
    const cadreSummary = cadreEngine.processTurnTick();

    // 4. Trigger Dynamic Events (Approx. 40% chance per turn)
    if (Math.random() < 0.45 && RANDOM_EVENTS_POOL.length > 0) {
      const event = RANDOM_EVENTS_POOL[Math.floor(Math.random() * RANDOM_EVENTS_POOL.length)];
      gameState.addBreakingNews(event.newsHeadline, "National Wire", "EVENT");
      
      if (event.impact && event.impact.affectedStates) {
        event.impact.affectedStates.forEach(stId => {
          const s = gameState.getState(stId);
          if (s) {
            if (event.impact.incumbentPenalty) {
              const bvp = gameState.getParty("BVP");
              if (bvp) bvp.baseNationalShare = Math.max(10, bvp.baseNationalShare - 0.4);
            }
          }
        });
      }
    }

    // 5. Trigger Turn Dilemma Crisis (Every ~3 turns)
    if (gameState.currentTurn % 3 === 0 && DILEMMAS_POOL.length > 0) {
      const dilemma = DILEMMAS_POOL[(gameState.currentTurn / 3 - 1) % DILEMMAS_POOL.length];
      gameState.activeDilemma = dilemma;
      audioEngine.playBreakingNews();
    }

    // 6. Generate Media Headlines
    mediaEngine.generateWeeklyHeadlines();

    // 7. Increment Turn
    gameState.currentTurn++;

    // 8. Check if Election Day arrived (Week 24)
    if (gameState.currentTurn >= gameState.totalTurns) {
      gameState.gameStage = "COUNTING";
      audioEngine.playFanfare();
      gameState.addBreakingNews(
        "POLLS CLOSE: General Election voting concludes across all 543 Lok Sabha constituencies! Counting commences!",
        "Prasar Vani",
        "ELECTION"
      );
    }

    // 9. Auto-save
    saveManager.autoSave();

    // 10. Recalculate Seat Projections & Notify UI
    mapEngine.recalculateAllProjections();
    gameState.notify("TURN_ADVANCED");

    return {
      success: true,
      currentTurn: gameState.currentTurn,
      gameStage: gameState.gameStage,
      financeSummary,
      cadreSummary
    };
  }
};
