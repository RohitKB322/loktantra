// Onboarding Wizard, Party Creation & Save Slot Management UI
import { gameState } from "../core/state.js";
import { saveManager } from "../core/saveManager.js";
import { SYMBOLS_SVG, PLAYER_STARTING_PRESETS } from "../data/initialParties.js";
import { mapEngine } from "../engines/mapEngine.js";

export const startScreen = {
  selectedColor: "#ff9933",
  selectedSymbol: "hand",
  selectedBackground: "grassroots",

  render() {
    const container = document.getElementById("start-screen-modal");
    if (!container) return;

    const hasAutosave = saveManager.hasAutoSave();
    const slots = saveManager.getAllSlots();

    container.innerHTML = `
      <div class="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
        <div class="modal-content w-full max-w-2xl p-6 sm:p-8 my-auto animate-fade-in border border-slate-700/80 shadow-2xl relative">
          
          <!-- Header Banner -->
          <div class="text-center mb-6">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2 tracking-wide uppercase">
              Turn-Based Indian Political Simulation
            </div>
            <h1 class="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 tracking-tight">
              LOKTANTRA
            </h1>
            <p class="text-slate-400 text-xs sm:text-sm mt-1">
              General Election 2026: Forge Alliances, Master the Slush Fund & Win 272 Seats
            </p>
          </div>

          <!-- Tabs: New Game vs Load Game -->
          <div class="flex border-b border-slate-700 mb-6">
            <button id="btn-tab-newgame" class="flex-1 py-2 font-bold text-sm text-amber-400 border-b-2 border-amber-500 pb-2 transition-all">
              New Campaign
            </button>
            <button id="btn-tab-loadgame" class="flex-1 py-2 font-bold text-sm text-slate-400 hover:text-slate-200 border-b-2 border-transparent pb-2 transition-all">
              Load Campaign ${hasAutosave ? '<span class="w-2 h-2 rounded-full bg-emerald-400 inline-block ml-1"></span>' : ''}
            </button>
          </div>

          <!-- TAB CONTENT 1: NEW CAMPAIGN WIZARD -->
          <div id="new-campaign-pane" class="space-y-5">
            <!-- Party Name & Acronym -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div class="sm:col-span-2">
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Party Name</label>
                <input id="input-party-name" type="text" value="Lok Shakti Party" 
                  class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Acronym</label>
                <input id="input-party-acronym" type="text" value="LSP" maxlength="6"
                  class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white uppercase focus:outline-none focus:border-amber-500 font-mono" />
              </div>
            </div>

            <!-- Color & Symbol Selection -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Colors -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Party Color</label>
                <div class="flex items-center gap-2 flex-wrap" id="color-swatches">
                  ${[
                    { color: "#ff9933", label: "Saffron" },
                    { color: "#0284c7", label: "Congress Blue" },
                    { color: "#16a34a", label: "Green" },
                    { color: "#dc2626", label: "Red" },
                    { color: "#eab308", label: "Yellow" },
                    { color: "#8b5cf6", label: "Purple" },
                    { color: "#ec4899", label: "Pink" }
                  ].map(c => `
                    <button type="button" class="color-swatch-btn w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${c.color === '#ff9933' ? 'border-white scale-110' : 'border-transparent'}"
                      style="background-color: ${c.color};" data-color="${c.color}" title="${c.label}"></button>
                  `).join('')}
                </div>
              </div>

              <!-- Symbols -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Election Symbol</label>
                <div class="flex items-center gap-2 flex-wrap" id="symbol-swatches">
                  ${Object.keys(SYMBOLS_SVG).map(key => `
                    <button type="button" class="symbol-swatch-btn w-8 h-8 rounded-lg p-1.5 border transition-all ${key === 'hand' ? 'border-amber-400 bg-amber-500/20 text-amber-400' : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-white'}"
                      data-symbol="${key}">
                      ${SYMBOLS_SVG[key]}
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>

            <!-- Ideology Sliders -->
            <div class="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-3">
              <div class="flex justify-between items-center text-xs">
                <span class="font-bold text-slate-200 uppercase tracking-wider">Ideology Calibration</span>
                <span id="ideology-label" class="text-amber-400 font-semibold text-xs">Social Democratic Centrist</span>
              </div>

              <div>
                <div class="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Socialist Welfare</span>
                  <span id="val-econ" class="font-mono text-amber-300">5</span>
                  <span>Free Market / Capitalist</span>
                </div>
                <input id="slider-econ" type="range" min="1" max="10" value="5" class="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer" />
              </div>

              <div>
                <div class="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Secular Pluralist</span>
                  <span id="val-soc" class="font-mono text-amber-300">5</span>
                  <span>Cultural Traditionalist</span>
                </div>
                <input id="slider-soc" type="range" min="1" max="10" value="5" class="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer" />
              </div>
            </div>

            <!-- Starting Background Preset -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Starting Background</label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                ${Object.keys(PLAYER_STARTING_PRESETS).map(key => {
                  const p = PLAYER_STARTING_PRESETS[key];
                  const isSelected = key === "grassroots";
                  return `
                    <div class="preset-card cursor-pointer p-3 rounded-lg border text-left transition-all ${isSelected ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'}"
                      data-preset="${key}">
                      <div class="font-bold text-xs ${isSelected ? 'text-amber-400' : 'text-white'}">${p.label}</div>
                      <div class="text-[11px] text-slate-400 mt-1 line-clamp-2">${p.description}</div>
                      <div class="text-[10px] text-emerald-400 font-mono mt-2 font-medium">₹${p.whiteMoney}L White • ₹${p.blackMoney}L Slush</div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Submit Button -->
            <button id="btn-start-game" class="w-full btn-primary py-3 rounded-xl text-sm font-bold tracking-wide uppercase mt-4 flex items-center justify-center gap-2">
              <span>Enter Election War Room</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
          </div>

          <!-- TAB CONTENT 2: LOAD GAME / SAVES -->
          <div id="load-campaign-pane" class="space-y-4 hidden">
            <!-- Auto-save Banner -->
            <div class="p-3.5 rounded-xl border border-slate-700 bg-slate-900 flex justify-between items-center">
              <div>
                <div class="text-xs font-bold text-white flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Autosave File
                </div>
                <div class="text-[11px] text-slate-400 mt-0.5">
                  ${hasAutosave ? 'Latest campaign autosaved on turn rollover.' : 'No autosave found.'}
                </div>
              </div>
              <button id="btn-load-autosave" class="btn-primary text-xs px-3 py-1.5 rounded-lg" ${!hasAutosave ? 'disabled' : ''}>
                Resume
              </button>
            </div>

            <!-- Manual Slots 1-3 -->
            <div class="space-y-2.5">
              <div class="text-xs font-bold text-slate-300 uppercase tracking-wider">Manual Save Slots</div>
              ${slots.map(s => `
                <div class="p-3 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
                  <div>
                    <div class="font-bold text-xs text-white">Slot ${s.slotNumber}: ${s.meta ? s.meta.partyName : 'Empty Slot'}</div>
                    <div class="text-[11px] text-slate-400 font-mono">
                      ${s.meta ? `Week ${s.meta.week} • Projected Seats: ${s.meta.projectedSeats} • ₹${s.meta.funds}L` : 'No save data'}
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button class="btn-secondary text-xs px-2.5 py-1 rounded-md btn-load-slot" data-slot="${s.slotNumber}" ${!s.meta ? 'disabled' : ''}>Load</button>
                    <button class="btn-secondary text-xs px-2.5 py-1 rounded-md text-amber-400 btn-save-slot" data-slot="${s.slotNumber}">Overwrite</button>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Import / Export JSON buttons -->
            <div class="pt-4 border-t border-slate-800 flex gap-3">
              <button id="btn-export-json" class="flex-1 btn-secondary py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                Export Save JSON
              </button>
              <label class="flex-1 btn-secondary py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer text-center">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12"/></svg>
                Import Save JSON
                <input type="file" id="input-import-json" accept=".json" class="hidden" />
              </label>
            </div>
          </div>

        </div>
      </div>
    `;

    this.bindEvents();
  },

  bindEvents() {
    // Tab switching between New Game and Load Game
    const btnNew = document.getElementById("btn-tab-newgame");
    const btnLoad = document.getElementById("btn-tab-loadgame");
    const paneNew = document.getElementById("new-campaign-pane");
    const paneLoad = document.getElementById("load-campaign-pane");

    if (btnNew && btnLoad && paneNew && paneLoad) {
      btnNew.addEventListener("click", () => {
        btnNew.className = "flex-1 py-2 font-bold text-sm text-amber-400 border-b-2 border-amber-500 pb-2 transition-all";
        btnLoad.className = "flex-1 py-2 font-bold text-sm text-slate-400 hover:text-slate-200 border-b-2 border-transparent pb-2 transition-all";
        paneNew.classList.remove("hidden");
        paneLoad.classList.add("hidden");
      });

      btnLoad.addEventListener("click", () => {
        btnLoad.className = "flex-1 py-2 font-bold text-sm text-amber-400 border-b-2 border-amber-500 pb-2 transition-all";
        btnNew.className = "flex-1 py-2 font-bold text-sm text-slate-400 hover:text-slate-200 border-b-2 border-transparent pb-2 transition-all";
        paneLoad.classList.remove("hidden");
        paneNew.classList.add("hidden");
      });
    }

    // Color swatches
    document.querySelectorAll(".color-swatch-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".color-swatch-btn").forEach(b => {
          b.classList.remove("border-white", "scale-110");
          b.classList.add("border-transparent");
        });
        btn.classList.add("border-white", "scale-110");
        this.selectedColor = btn.getAttribute("data-color");
      });
    });

    // Symbol swatches
    document.querySelectorAll(".symbol-swatch-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".symbol-swatch-btn").forEach(b => {
          b.className = "symbol-swatch-btn w-8 h-8 rounded-lg p-1.5 border border-slate-700 bg-slate-900 text-slate-400 hover:text-white transition-all";
        });
        btn.className = "symbol-swatch-btn w-8 h-8 rounded-lg p-1.5 border border-amber-400 bg-amber-500/20 text-amber-400 transition-all";
        this.selectedSymbol = btn.getAttribute("data-symbol");
      });
    });

    // Presets
    document.querySelectorAll(".preset-card").forEach(card => {
      card.addEventListener("click", () => {
        document.querySelectorAll(".preset-card").forEach(c => {
          c.className = "preset-card cursor-pointer p-3 rounded-lg border border-slate-800 bg-slate-900/60 hover:border-slate-700 text-left transition-all";
          c.querySelector(".font-bold").className = "font-bold text-xs text-white";
        });
        card.className = "preset-card cursor-pointer p-3 rounded-lg border border-amber-500 bg-amber-500/10 text-left transition-all";
        card.querySelector(".font-bold").className = "font-bold text-xs text-amber-400";
        this.selectedBackground = card.getAttribute("data-preset");
      });
    });

    // Ideology Sliders
    const sEcon = document.getElementById("slider-econ");
    const sSoc = document.getElementById("slider-soc");
    const valEcon = document.getElementById("val-econ");
    const valSoc = document.getElementById("val-soc");
    const lblIdeo = document.getElementById("ideology-label");

    const updateIdeologyLabel = () => {
      if (!sEcon || !sSoc) return;
      const ec = parseInt(sEcon.value);
      const sc = parseInt(sSoc.value);
      valEcon.textContent = ec;
      valSoc.textContent = sc;

      let eText = ec <= 4 ? "Socialist" : ec >= 7 ? "Free-Market" : "Centrist";
      let sText = sc <= 4 ? "Secular" : sc >= 7 ? "Traditionalist" : "Moderate";
      lblIdeo.textContent = `${eText} ${sText}`;
    };

    if (sEcon && sSoc) {
      sEcon.addEventListener("input", updateIdeologyLabel);
      sSoc.addEventListener("input", updateIdeologyLabel);
    }

    // Launch Campaign
    const btnStart = document.getElementById("btn-start-game");
    if (btnStart) {
      btnStart.addEventListener("click", () => {
        const name = document.getElementById("input-party-name").value.trim() || "Lok Shakti Party";
        const acronym = document.getElementById("input-party-acronym").value.trim().toUpperCase() || "LSP";
        const ec = parseInt(sEcon.value);
        const sc = parseInt(sSoc.value);
        const preset = PLAYER_STARTING_PRESETS[this.selectedBackground];

        gameState.setPlayerParty({
          name,
          acronym,
          color: this.selectedColor,
          symbolKey: this.selectedSymbol,
          background: this.selectedBackground,
          whiteMoney: preset.whiteMoney,
          blackMoney: preset.blackMoney,
          slushExposure: preset.slushExposure,
          ideology: { economic: ec, social: sc, focus: 5 }
        });

        mapEngine.recalculateAllProjections();
        this.closeModal();
      });
    }

    // Resume Autosave
    const btnAuto = document.getElementById("btn-load-autosave");
    if (btnAuto) {
      btnAuto.addEventListener("click", () => {
        const res = saveManager.loadAutoSave();
        if (res.success) this.closeModal();
        else alert(res.error || "Failed to load autosave");
      });
    }

    // Load Slots
    document.querySelectorAll(".btn-load-slot").forEach(btn => {
      btn.addEventListener("click", () => {
        const slot = parseInt(btn.getAttribute("data-slot"));
        const res = saveManager.loadFromSlot(slot);
        if (res.success) this.closeModal();
        else alert(res.error || "Failed to load slot");
      });
    });

    // Save Slots
    document.querySelectorAll(".btn-save-slot").forEach(btn => {
      btn.addEventListener("click", () => {
        const slot = parseInt(btn.getAttribute("data-slot"));
        const res = saveManager.saveToSlot(slot);
        if (res.success) {
          alert(`Saved campaign to Slot ${slot}!`);
          this.render(); // refresh metadata
        }
      });
    });

    // Export JSON
    const btnExport = document.getElementById("btn-export-json");
    if (btnExport) {
      btnExport.addEventListener("click", () => saveManager.exportSaveToFile());
    }

    // Import JSON
    const inputImport = document.getElementById("input-import-json");
    if (inputImport) {
      inputImport.addEventListener("change", async (e) => {
        if (e.target.files && e.target.files[0]) {
          const res = await saveManager.importSaveFromFile(e.target.files[0]);
          if (res.success) this.closeModal();
          else alert(res.error || "Invalid save file");
        }
      });
    }
  },

  closeModal() {
    const container = document.getElementById("start-screen-modal");
    if (container) container.innerHTML = "";
  }
};
