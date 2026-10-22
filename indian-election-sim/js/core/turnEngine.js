// Weekly Turn Engine: Orchestrates AI turns, finance ticks, events & seat shifts
import { gameState } from "./state.js";
import { aiPartyEngine } from "../engines/aiPartyEngine.js";
import { financeEngine } from "../engines/financeEngine.js";
import { mediaEngine } from "../engines/mediaEngine.js";
import { mapEngine } from "../engines/mapEngine.js";
import { RANDOM_EVENTS_POOL } from "../data/issuesAndEvents.js";
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

    // 3. Trigger Dynamic Events (Approx. 40% chance per turn)
    if (Math.random() < 0.45 && RANDOM_EVENTS_POOL.length > 0) {
      const event = RANDOM_EVENTS_POOL[Math.floor(Math.random() * RANDOM_EVENTS_POOL.length)];
      gameState.addBreakingNews(event.newsHeadline, "National Wire", "EVENT");
      
      // If event has affected states, slightly nudge sentiment
      if (event.impact && event.impact.affectedStates) {
        event.impact.affectedStates.forEach(stId => {
          const s = gameState.getState(stId);
          if (s) {
            // Slight boost or penalty
            if (event.impact.incumbentPenalty) {
              const bvp = gameState.getParty("BVP");
              if (bvp) bvp.baseNationalShare = Math.max(10, bvp.baseNationalShare - 0.4);
            }
          }
        });
      }
    }

    // 4. Generate Media Headlines
    mediaEngine.generateWeeklyHeadlines();

    // 5. Increment Turn
    gameState.currentTurn++;

    // 6. Check if Election Day arrived (Week 24)
    if (gameState.currentTurn >= gameState.totalTurns) {
      gameState.gameStage = "COUNTING";
      gameState.addBreakingNews(
        "POLLS CLOSE: General Election voting concludes across all 543 Lok Sabha constituencies! Counting commences!",
        "Prasar Vani",
        "ELECTION"
      );
    }

    // 7. Auto-save
    saveManager.autoSave();

    // 8. Recalculate Seat Projections & Notify UI
    mapEngine.recalculateAllProjections();
    gameState.notify("TURN_ADVANCED");

    return {
      success: true,
      currentTurn: gameState.currentTurn,
      gameStage: gameState.gameStage,
      financeSummary
    };
  }
};
