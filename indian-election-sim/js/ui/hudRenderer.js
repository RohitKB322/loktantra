// Top HUD: Treasury Counters, Projected Seats Progress & Next Turn Control
import { gameState } from "../core/state.js";
import { turnEngine } from "../core/turnEngine.js";
import { startScreen } from "./startScreen.js";
import { audioEngine } from "../engines/audioEngine.js";
import { horseTradingUI } from "./horseTradingUI.js";

export const hudRenderer = {
  render() {
    const hudContainer = document.getElementById("top-hud");
    if (!hudContainer) return;

    const player = gameState.getPlayer();
    const tally = gameState.nationalSeatTally;
    const playerSeats = tally ? tally.PLAYER : 0;
    const weeksRemaining = gameState.totalTurns - gameState.currentTurn;

    // Slush Exposure Color Class
    let exposureBadge = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (player.slushExposure > 55) {
      exposureBadge = "bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse";
    } else if (player.slushExposure > 30) {
      exposureBadge = "bg-amber-500/20 text-amber-400 border-amber-500/30";
    }

    hudContainer.innerHTML = `
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        
        <!-- Left: Party Identity & Week Counter -->
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shadow-md border"
            style="background-color: ${player.color}; color: #ffffff; border-color: rgba(255,255,255,0.3);">
            ${player.acronym || 'LSP'}
          </div>

          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-xs sm:text-sm text-white">${player.name}</span>
              ${gameState.gameStage === "GOVERNANCE" && gameState.governance ? `
                <span class="text-[10px] px-2 py-0.5 rounded font-black font-mono uppercase tracking-wider ${
                  gameState.governance.role === 'PRIME_MINISTER' 
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
                    : gameState.governance.role === 'DEPUTY_PM'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }">
                  ${gameState.governance.role === 'PRIME_MINISTER' ? '🇮🇳 Prime Minister' : gameState.governance.role === 'DEPUTY_PM' ? '🏛️ Deputy PM' : '⚖️ Opposition'}
                </span>
              ` : `
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  ${player.nationalApproval}% Appr
                </span>
              `}
            </div>
            <div class="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
              ${gameState.gameStage === "GOVERNANCE" && gameState.governance ? `
                <span class="text-amber-400 font-semibold">Term 1 • Week ${gameState.governance.termWeek}</span>
                <span>•</span>
                <span class="text-emerald-400 font-bold">${gameState.governance.governingSeats}/272 Seats (${gameState.governance.stability}% Stability)</span>
              ` : gameState.gameStage === "COUNTING" || gameState.gameStage === "POST_POLL" ? `
                <span class="text-rose-400 font-bold animate-pulse">Polls Closed • Resort Politics Active</span>
              ` : `
                <span class="text-amber-400 font-semibold">Week ${gameState.currentTurn} / ${gameState.totalTurns}</span>
                <span>•</span>
                <span class="${weeksRemaining <= 4 ? 'text-rose-400 font-bold animate-pulse' : 'text-slate-400'}">
                  ${weeksRemaining > 0 ? `${weeksRemaining} wks to Polls` : 'Election Day!'}
                </span>
              `}
            </div>
          </div>
        </div>

        <!-- Center: Dual Treasury & Slush Exposure -->
        <div class="flex items-center gap-2 sm:gap-4">
          <!-- White Money (Official Treasury) -->
          <div class="bg-slate-900/90 border border-slate-700/80 px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm">
            <span class="text-xs sm:text-sm">🏛️</span>
            <div>
              <div class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">White Treasury</div>
              <div class="text-xs sm:text-sm font-black text-emerald-400 font-mono">
                ₹${player.whiteMoney}L
              </div>
            </div>
          </div>

          <!-- Black Money (Slush Fund) -->
          <div class="bg-slate-900/90 border border-slate-700/80 px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm">
            <span class="text-xs sm:text-sm">💼</span>
            <div>
              <div class="flex items-center gap-1">
                <span class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Slush Fund</span>
                <span class="text-[9px] px-1 rounded border font-mono ${exposureBadge}" title="Enforcement Directorate Raid Risk">
                  ${player.slushExposure}% ED Risk
                </span>
              </div>
              <div class="text-xs sm:text-sm font-black text-amber-400 font-mono">
                ₹${player.blackMoney}L
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Seat Progress & Action Buttons -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Seats Gauge towards 272 -->
          <div class="hidden md:flex flex-col items-end min-w-[120px]">
            <div class="text-[10px] text-slate-300 font-bold font-mono">
              <span class="text-amber-400 font-black text-sm">${playerSeats}</span> / 272 Seats
            </div>
            <div class="w-full bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
              <div class="h-full rounded-full transition-all duration-300" 
                style="width: ${Math.min(100, (playerSeats / 272) * 100)}%; background-color: ${player.color};"></div>
            </div>
          </div>

          <!-- Sound Mute Toggle -->
          <button id="btn-toggle-sound" class="btn-secondary p-2 rounded-xl text-slate-400 hover:text-white" title="Toggle Sound">
            <span id="sound-icon">${audioEngine.muted ? '🔇' : '🔊'}</span>
          </button>

          <!-- Menu / Settings button -->
          <button id="btn-open-menu" class="btn-secondary p-2 rounded-xl text-slate-400 hover:text-white" title="Campaign Menu / Load Save">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>

          <!-- Turn Advancement Button -->
          ${gameState.gameStage === "COUNTING" || gameState.gameStage === "POST_POLL" ? `
            <button id="btn-open-resort-politics" class="btn-primary px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg border border-amber-400">
              <span>🏨 Resort Politics</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
            </button>
          ` : `
            <button id="btn-next-turn" class="btn-primary px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2">
              <span>${gameState.gameStage === "GOVERNANCE" ? 'Govern Week 🏛️' : 'Advance Week'}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
            </button>
          `}
        </div>

      </div>
    `;

    this.bindEvents();
  },

  bindEvents() {
    const btnResort = document.getElementById("btn-open-resort-politics");
    if (btnResort) {
      btnResort.addEventListener("click", () => {
        horseTradingUI.open();
      });
    }
    const btnNext = document.getElementById("btn-next-turn");
    if (btnNext) {
      btnNext.addEventListener("click", () => {
        btnNext.disabled = true;
        btnNext.innerHTML = `<span class="inline-block animate-spin">⏳</span> Processing...`;
        setTimeout(() => {
          turnEngine.advanceTurn();
          btnNext.disabled = false;
        }, 120);
      });
    }

    const btnMenu = document.getElementById("btn-open-menu");
    if (btnMenu) {
      btnMenu.addEventListener("click", () => {
        startScreen.render();
      });
    }

    const btnSound = document.getElementById("btn-toggle-sound");
    if (btnSound) {
      btnSound.addEventListener("click", () => {
        const isMuted = audioEngine.toggleMute();
        const icon = document.getElementById("sound-icon");
        if (icon) icon.textContent = isMuted ? '🔇' : '🔊';
        if (!isMuted) audioEngine.playCash();
      });
    }
  }
};
