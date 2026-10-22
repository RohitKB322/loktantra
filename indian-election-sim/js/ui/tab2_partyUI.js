// TAB 2: Party Command, Campaigning, Freebie Manifestos & Alliance Matrix
import { gameState } from "../core/state.js";
import { aiPartyEngine } from "../engines/aiPartyEngine.js";
import { FREEBIE_SCHEMES_CATALOG } from "../data/issuesAndEvents.js";
import { SYMBOLS_SVG } from "../data/initialParties.js";
import { gameModal } from "./gameModal.js";

export const tab2_partyUI = {
  render() {
    const container = document.getElementById("tab-pane-campaign");
    if (!container) return;

    const player = gameState.getPlayer();
    const selState = gameState.getState(gameState.selectedStateId) || gameState.states[0];
    const selDistrict = gameState.getDistrict(selState.id, gameState.selectedDistrictId) || selState.districts[0];

    container.innerHTML = `
      <div class="space-y-5">
        
        <!-- SECTION 1: CAMPAIGN OPERATIONS WAR ROOM -->
        <div class="glass-panel p-4">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h2 class="text-sm font-black uppercase tracking-wider text-white">Election Campaign Operations</h2>
              <p class="text-xs text-slate-400">Target State: <b class="text-amber-400">${selState.name}</b> • Target Constituency: <b class="text-amber-400">${selDistrict.name}</b></p>
            </div>
            
            <!-- Quick State/District Selector -->
            <div class="flex items-center gap-2">
              <select id="campaign-state-select" class="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2 py-1.5 focus:outline-none">
                ${gameState.states.map(s => `
                  <option value="${s.id}" ${s.id === selState.id ? 'selected' : ''}>${s.name} (${s.totalSeats})</option>
                `).join('')}
              </select>

              <select id="campaign-district-select" class="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2 py-1.5 focus:outline-none">
                ${selState.districts.map(d => `
                  <option value="${d.id}" ${d.id === selDistrict.id ? 'selected' : ''}>${d.name}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- Campaign Action Cards Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            <!-- Action 1: Grand Rally -->
            <div class="glass-card p-3 flex flex-col justify-between border-t-2 border-t-amber-500">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-lg">📢</span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono font-bold">Mass Impact</span>
                </div>
                <h4 class="font-bold text-xs text-white mt-1">Grand Public Rally</h4>
                <p class="text-[11px] text-slate-400 mt-1">Massive stage, sound systems, busing in supporters. +8% boost in target constituency & statewide spillover.</p>
              </div>
              <div class="mt-3 pt-2 border-t border-slate-700/60 flex flex-col gap-1.5">
                <button id="btn-rally-white" class="btn-primary py-1.5 text-xs rounded-lg font-semibold">
                  White Fund (₹45L)
                </button>
                <button id="btn-rally-slush" class="btn-secondary py-1 text-[11px] rounded-lg text-amber-400 font-mono">
                  Slush Fund (₹65L, +10% ED)
                </button>
              </div>
            </div>

            <!-- Action 2: Door-to-Door Grassroots -->
            <div class="glass-card p-3 flex flex-col justify-between border-t-2 border-t-emerald-500">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-lg">🚪</span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold">Grassroots</span>
                </div>
                <h4 class="font-bold text-xs text-white mt-1">Door-to-Door & Padyatra</h4>
                <p class="text-[11px] text-slate-400 mt-1">Volunteers visit every household with pamphlets. Steady voter connection, immune to media slander.</p>
              </div>
              <div class="mt-3 pt-2 border-t border-slate-700/60">
                <button id="btn-door-to-door" class="w-full btn-secondary py-1.5 text-xs rounded-lg font-semibold text-emerald-400 hover:bg-emerald-500/20">
                  Launch Padyatra (₹15L)
                </button>
              </div>
            </div>

            <!-- Action 3: IT Cell Social Blitz -->
            <div class="glass-card p-3 flex flex-col justify-between border-t-2 border-t-blue-500">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-lg">⚡</span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono font-bold">Youth Buzz</span>
                </div>
                <h4 class="font-bold text-xs text-white mt-1">IT Cell Digital Blitz</h4>
                <p class="text-[11px] text-slate-400 mt-1">Trend viral memes, WhatsApp community broadcasts & target youth voters across the entire state.</p>
              </div>
              <div class="mt-3 pt-2 border-t border-slate-700/60">
                <button id="btn-it-cell" class="w-full btn-secondary py-1.5 text-xs rounded-lg font-semibold text-blue-400 hover:bg-blue-500/20">
                  Deploy IT Bots (₹28L)
                </button>
              </div>
            </div>

            <!-- Action 4: Resort Politics & Poaching -->
            <div class="glass-card p-3 flex flex-col justify-between border-t-2 border-t-rose-500">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-lg">🏨</span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono font-bold">Covert Operation</span>
                </div>
                <h4 class="font-bold text-xs text-white mt-1">Poach Influential Leader</h4>
                <p class="text-[11px] text-slate-400 mt-1">Lure rival heavyweight MLA/MP with private jet to luxury resort + briefcase. Immediate strong vote shift.</p>
              </div>
              <div class="mt-3 pt-2 border-t border-slate-700/60">
                <button id="btn-poach-leader" class="w-full btn-danger py-1.5 text-xs rounded-lg font-semibold">
                  Poach with Slush (₹80L, +22% ED)
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- SECTION 2: FREEBIE & WELFARE SCHEME MANIFESTO BUILDER -->
        <div class="glass-panel p-4">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h2 class="text-sm font-black uppercase tracking-wider text-white">Freebie & Welfare Scheme Manifesto</h2>
              <p class="text-xs text-slate-400">Promises boost immediate voter turnout, but incur recurring weekly costs & middle-class taxpayer friction.</p>
            </div>
            <span class="text-xs font-mono font-bold text-emerald-400">
              Active Promises: ${player.activeFreebies.length}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            ${FREEBIE_SCHEMES_CATALOG.map(s => {
              const isPromised = player.activeFreebies.includes(s.id);
              return `
                <div class="glass-card p-3.5 flex flex-col justify-between ${isPromised ? 'border-emerald-500/60 bg-emerald-950/20' : ''}">
                  <div>
                    <div class="flex items-center justify-between">
                      <span class="text-2xl">${s.icon}</span>
                      <span class="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${isPromised ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}">
                        ${isPromised ? 'IN MANIFESTO' : 'UNANNOUNCED'}
                      </span>
                    </div>

                    <h4 class="font-bold text-xs text-white mt-2">${s.name}</h4>
                    <p class="text-[11px] text-slate-400 mt-1">${s.tagline}</p>

                    <div class="text-[10px] text-slate-300 font-mono mt-2 space-y-0.5 bg-slate-900/60 p-2 rounded">
                      <div class="flex justify-between">
                        <span>Weekly Cost:</span>
                        <span class="text-rose-400 font-bold">₹${s.costPerWeek}L/wk</span>
                      </div>
                      <div class="flex justify-between">
                        <span>Rural Swing:</span>
                        <span class="text-emerald-400 font-bold">+${s.ruralBonus}%</span>
                      </div>
                      <div class="flex justify-between">
                        <span>Fiscal Debt Load:</span>
                        <span class="text-amber-400 font-bold">₹${s.fiscalBurden} Cr</span>
                      </div>
                    </div>
                  </div>

                  <div class="mt-3">
                    <button class="w-full btn-freebie-announce py-1.5 text-xs rounded-lg font-bold transition-all ${isPromised ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'btn-primary'}"
                      data-scheme-id="${s.id}" ${isPromised ? 'disabled' : ''}>
                      ${isPromised ? 'Active in Manifesto' : 'Announce Scheme to Nation'}
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- SECTION 3: ALLIANCE & COALITION MATRIX (GATHBANDHAN) -->
        <div class="glass-panel p-4">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h2 class="text-sm font-black uppercase tracking-wider text-white">Alliance Matrix (Gathbandhan)</h2>
              <p class="text-xs text-slate-400">Pre-poll seat sharing prevents vote splitting. Post-poll coalitions decide who reaches 272 majority.</p>
            </div>
            <div class="text-xs font-mono text-amber-400 font-bold">
              Your Coalition: ${player.coalition}
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            ${gameState.parties.filter(p => !p.isPlayer).map(party => {
              const isAllied = party.coalition === player.coalition;
              return `
                <div class="glass-card p-3 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-7 h-7 rounded-lg flex items-center justify-center p-1"
                          style="background-color: ${party.color}25; color: ${party.color}">
                          ${SYMBOLS_SVG[party.symbolKey] || '🗳️'}
                        </div>
                        <div>
                          <h4 class="font-bold text-xs text-white">${party.name} (${party.acronym})</h4>
                          <span class="text-[10px] text-slate-400">Leader: ${party.leader}</span>
                        </div>
                      </div>
                      
                      <span class="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${isAllied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}">
                        ${party.coalition}
                      </span>
                    </div>

                    <!-- Trust Meter -->
                    <div class="mt-3">
                      <div class="flex justify-between text-[10px] font-mono mb-1">
                        <span class="text-slate-400">Trust with ${player.acronym}:</span>
                        <span class="${party.trustScore > 60 ? 'text-emerald-400' : 'text-amber-400'} font-bold">${party.trustScore}/100</span>
                      </div>
                      <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-300 ${party.trustScore > 60 ? 'bg-emerald-500' : 'bg-amber-500'}"
                          style="width: ${party.trustScore}%;"></div>
                      </div>
                    </div>

                    <div class="text-[10px] text-slate-400 mt-2 font-mono flex justify-between">
                      <span>Base Share: <b class="text-white">${party.baseNationalShare}%</b></span>
                      <span>Strongholds: <b class="text-amber-400">${party.strongholds.join(', ')}</b></span>
                    </div>
                  </div>

                  <div class="mt-3 pt-2 border-t border-slate-700/60">
                    <button class="w-full btn-negotiate-alliance py-1.5 text-xs rounded-lg font-bold transition-all ${isAllied ? 'bg-slate-800 text-emerald-400 cursor-default' : 'btn-secondary text-amber-400 hover:bg-amber-500/10'}"
                      data-party-id="${party.id}" ${isAllied ? 'disabled' : ''}>
                      ${isAllied ? 'In Active Coalition' : 'Propose Pre-Poll Alliance'}
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>
    `;

    this.bindEvents();
  },

  bindEvents() {
    // State and District selects
    const stateSelect = document.getElementById("campaign-state-select");
    const districtSelect = document.getElementById("campaign-district-select");

    if (stateSelect) {
      stateSelect.addEventListener("change", (e) => {
        gameState.setSelectedState(e.target.value);
        this.render();
      });
    }

    if (districtSelect) {
      districtSelect.addEventListener("change", (e) => {
        gameState.setSelectedDistrict(e.target.value);
        this.render();
      });
    }

    // Campaign Actions
    const btnRallyWhite = document.getElementById("btn-rally-white");
    if (btnRallyWhite) {
      btnRallyWhite.addEventListener("click", () => {
        const res = aiPartyEngine.launchGrandRally(gameState.selectedStateId, gameState.selectedDistrictId, false);
        if (res.success) {
          gameModal.show({ title: "Grand Mega-Rally Launched!", message: res.message, type: "success" });
          this.render();
        } else {
          gameModal.show({ title: "Rally Denied", message: res.message, type: "danger" });
        }
      });
    }

    const btnRallySlush = document.getElementById("btn-rally-slush");
    if (btnRallySlush) {
      btnRallySlush.addEventListener("click", () => {
        const res = aiPartyEngine.launchGrandRally(gameState.selectedStateId, gameState.selectedDistrictId, true);
        if (res.success) {
          gameModal.show({ title: "Clandestine Mega-Rally Launched!", message: res.message, type: "cash" });
          this.render();
        } else {
          gameModal.show({ title: "Slush Insufficient", message: res.message, type: "danger" });
        }
      });
    }

    const btnDoor = document.getElementById("btn-door-to-door");
    if (btnDoor) {
      btnDoor.addEventListener("click", () => {
        const res = aiPartyEngine.launchDoorToDoor(gameState.selectedStateId, gameState.selectedDistrictId);
        if (res.success) {
          gameModal.show({ title: "Padyatra Mobilized!", message: res.message, type: "success" });
          this.render();
        } else {
          gameModal.show({ title: "Cannot Launch Padyatra", message: res.message, type: "danger" });
        }
      });
    }

    const btnIT = document.getElementById("btn-it-cell");
    if (btnIT) {
      btnIT.addEventListener("click", () => {
        const res = aiPartyEngine.launchITCellBlitz(gameState.selectedStateId);
        if (res.success) {
          gameModal.show({ title: "IT Cell Digital Blitz Online!", message: res.message, type: "info" });
          this.render();
        } else {
          gameModal.show({ title: "IT Cell Insufficient Funds", message: res.message, type: "danger" });
        }
      });
    }

    const btnPoach = document.getElementById("btn-poach-leader");
    if (btnPoach) {
      btnPoach.addEventListener("click", () => {
        const res = aiPartyEngine.poachRivalCandidate("BVP", gameState.selectedStateId);
        if (res.success) {
          gameModal.show({ title: "Resort Politics: Heavyweight Poached!", message: res.message, type: "cash" });
          this.render();
        } else {
          gameModal.show({ title: "Poaching Operation Failed", message: res.message, type: "danger" });
        }
      });
    }

    // Freebie announces
    document.querySelectorAll(".btn-freebie-announce").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-scheme-id");
        const res = aiPartyEngine.announceFreebieScheme(id);
        if (res.success) {
          gameModal.show({ title: "Manifesto Promise Declared!", message: res.message, type: "success" });
          this.render();
        } else {
          gameModal.show({ title: "Scheme Already Promised", message: res.message, type: "warning" });
        }
      });
    });

    // Alliance proposals
    document.querySelectorAll(".btn-negotiate-alliance").forEach(btn => {
      btn.addEventListener("click", () => {
        const partyId = btn.getAttribute("data-party-id");
        const res = aiPartyEngine.negotiateAlliance(partyId);
        gameModal.show({
          title: res.success ? "Alliance Sealed!" : "Alliance Rejected",
          message: res.message,
          type: res.success ? "success" : "warning"
        });
        this.render();
      });
    });
  }
};
