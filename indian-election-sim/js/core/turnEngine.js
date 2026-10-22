// Weekly Turn Engine: Orchestrates AI turns, finance ticks, events, cadre & dilemmas (Version 0.3)
import { gameState } from "./state.js";
import { aiPartyEngine } from "../engines/aiPartyEngine.js";
import { financeEngine } from "../engines/financeEngine.js";
import { mediaEngine } from "../engines/mediaEngine.js";
import { mapEngine } from "../engines/mapEngine.js";
import { cadreEngine } from "../engines/cadreEngine.js";
import { audioEngine } from "../engines/audioEngine.js";
import { RANDOM_EVENTS_POOL } from "../data/issuesAndEvents.js";
import { DILEMMAS_POOL } from "../data/dilemmasData.js";
import { saveManager } from "./saveManager.js";

export const turnEngine = {
  // Advance to the next week / turn
  advanceTurn() {
    if (gameState.gameStage === "COUNTING" || gameState.gameStage === "GAME_OVER") {
      return { success: false, message: "Campaign has concluded. Election results are in." };
    }

    const player = gameState.getPlayer();

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
