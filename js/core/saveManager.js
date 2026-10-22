// Save & Load Manager for Loktantra (LocalStorage & JSON Export/Import)
import { gameState } from "./state.js";

const AUTOSAVE_KEY = "loktantra_autosave";
const SLOT_KEY_PREFIX = "loktantra_slot_";

export const saveManager = {
  // Serialize current state into clean JSON
  serializeState() {
    return JSON.stringify({
      version: "1.0",
      timestamp: new Date().toISOString(),
      currentTurn: gameState.currentTurn,
      totalTurns: gameState.totalTurns,
      gameStage: gameState.gameStage,
      player: gameState.getPlayer(),
      parties: gameState.parties,
      states: gameState.states,
      macro: gameState.macro,
      breakingNews: gameState.breakingNews,
      newsLog: gameState.newsLog,
      nationalSeatTally: gameState.nationalSeatTally,
      selectedStateId: gameState.selectedStateId,
      selectedDistrictId: gameState.selectedDistrictId
    });
  },

  // Restore state from serialized JSON string
  restoreState(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data.player || !data.parties || !data.states) {
        throw new Error("Invalid save file structure");
      }

      gameState.currentTurn = data.currentTurn || 1;
      gameState.totalTurns = data.totalTurns || 24;
      gameState.gameStage = data.gameStage || "CAMPAIGN";
      gameState.parties = data.parties;
      gameState.player = data.parties.find(p => p.isPlayer) || data.player;
      gameState.states = data.states;
      gameState.macro = data.macro || gameState.macro;
      gameState.breakingNews = data.breakingNews || [];
      gameState.newsLog = data.newsLog || [];
      gameState.nationalSeatTally = data.nationalSeatTally || gameState.nationalSeatTally;
      gameState.selectedStateId = data.selectedStateId || "UP";
      gameState.selectedDistrictId = data.selectedDistrictId || "varanasi";

      gameState.notify("STATE_LOADED");
      return { success: true };
    } catch (err) {
      console.error("Save load failed:", err);
      return { success: false, error: err.message };
    }
  },

  // Auto-save
  autoSave() {
    try {
      const serialized = this.serializeState();
      localStorage.setItem(AUTOSAVE_KEY, serialized);
    } catch (e) {
      console.warn("Autosave failed:", e);
    }
  },

  hasAutoSave() {
    return !!localStorage.getItem(AUTOSAVE_KEY);
  },

  loadAutoSave() {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if (!raw) return { success: false, error: "No autosave found" };
    return this.restoreState(raw);
  },

  // Manual Save Slots 1, 2, 3
  saveToSlot(slotNumber) {
    if (slotNumber < 1 || slotNumber > 3) return { success: false, error: "Invalid slot" };
    try {
      const serialized = this.serializeState();
      localStorage.setItem(`${SLOT_KEY_PREFIX}${slotNumber}`, serialized);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  loadFromSlot(slotNumber) {
    const raw = localStorage.getItem(`${SLOT_KEY_PREFIX}${slotNumber}`);
    if (!raw) return { success: false, error: `Slot ${slotNumber} is empty` };
    return this.restoreState(raw);
  },

  getSlotMetadata(slotNumber) {
    const raw = localStorage.getItem(`${SLOT_KEY_PREFIX}${slotNumber}`);
    if (!raw) return null;
    try {
      const data = JSON.parse(raw);
      const player = data.player || (data.parties && data.parties.find(p => p.isPlayer));
      return {
        slotNumber,
        timestamp: new Date(data.timestamp).toLocaleString(),
        week: data.currentTurn,
        partyName: player ? player.name : "Unknown",
        acronym: player ? player.acronym : "N/A",
        funds: player ? player.whiteMoney : 0,
        projectedSeats: data.nationalSeatTally ? data.nationalSeatTally.PLAYER : 0
      };
    } catch (e) {
      return null;
    }
  },

  getAllSlots() {
    return [1, 2, 3].map(n => ({
      slotNumber: n,
      meta: this.getSlotMetadata(n)
    }));
  },

  // Export JSON file download
  exportSaveToFile() {
    try {
      const serialized = this.serializeState();
      const player = gameState.getPlayer();
      const filename = `Loktantra_${player ? player.acronym : "Save"}_Week${gameState.currentTurn}.json`;
      const blob = new Blob([serialized], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  // Import JSON file
  importSaveFromFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = this.restoreState(event.target.result);
        resolve(res);
      };
      reader.onerror = () => resolve({ success: false, error: "Failed to read file" });
      reader.readAsText(file);
    });
  }
};
