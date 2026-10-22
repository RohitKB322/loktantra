// TAB 1: Interactive SVG India Map, Parliament Hemicycle & District Drilldown
import { gameState } from "../core/state.js";
import { mapEngine } from "../engines/mapEngine.js";
import { aiPartyEngine } from "../engines/aiPartyEngine.js";
import { gameModal } from "./gameModal.js";

export const tab1_mapUI = {
  render() {
    const container = document.getElementById("tab-pane-map");
    if (!container) return;

    const tally = gameState.nationalSeatTally;
    const player = gameState.getPlayer();
    const selState = gameState.getState(gameState.selectedStateId) || gameState.states[0];

    // Majority calculation
    const playerPct = Math.round((tally.PLAYER / 543) * 100);
    const ndaPct = Math.round((tally.NDA / 543) * 100);
    const indiaPct = Math.round((tally.INDIA / 543) * 100);
    const thirdPct = Math.max(0, 100 - (playerPct + ndaPct + indiaPct));

    container.innerHTML = `
      <div class="space-y-4">
        
        <!-- PARLIAMENT HEMICYCLE & 272 MAJORITY BAR -->
        <div class="glass-panel p-4">
          <div class="flex items-center justify-between mb-2">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-slate-300">543 Lok Sabha Seats Projection</span>
              <span class="text-[10px] text-slate-400 ml-2 font-mono">First-Past-The-Post Swing Math</span>
            </div>
            <div class="text-xs font-mono font-bold text-rose-400">
              Majority Mark: 272 Seats
            </div>
          </div>

          <!-- Hemicycle Multi-Segment Bar with 272 Majority Pin -->
          <div class="relative w-full h-8 bg-slate-900 rounded-xl overflow-hidden border border-slate-700/80 flex shadow-inner">
            <!-- 272 Majority Vertical Needle -->
            <div class="majority-marker-line"></div>
            <div class="majority-label-tag">272 LINE</div>

            <!-- Player Coalition -->
            <div class="h-full transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden px-1"
              style="width: ${(tally.PLAYER / 543) * 100}%; background-color: ${player.color};" title="Player: ${tally.PLAYER} Seats">
              ${tally.PLAYER > 12 ? `${player.acronym} ${tally.PLAYER}` : ''}
            </div>

            <!-- NDA Coalition -->
            <div class="h-full bg-orange-600 transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden px-1"
              style="width: ${(tally.NDA / 543) * 100}%;" title="NDA: ${tally.NDA} Seats">
              ${tally.NDA > 20 ? `NDA ${tally.NDA}` : ''}
            </div>

            <!-- INDIA Coalition -->
            <div class="h-full bg-blue-600 transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden px-1"
              style="width: ${(tally.INDIA / 543) * 100}%;" title="INDIA: ${tally.INDIA} Seats">
              ${tally.INDIA > 20 ? `INDIA ${tally.INDIA}` : ''}
            </div>

            <!-- Third Front / Others -->
            <div class="h-full bg-emerald-700 transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden px-1"
              style="width: ${(tally.THIRD_FRONT / 543) * 100}%;" title="Third Front & Regional: ${tally.THIRD_FRONT} Seats">
              ${tally.THIRD_FRONT > 15 ? `OTH ${tally.THIRD_FRONT}` : ''}
            </div>
          </div>

          <!-- Coalition Legend Summary -->
          <div class="flex flex-wrap items-center justify-between text-xs mt-3 gap-2 font-mono">
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${player.color}"></span>
              <span class="text-white font-bold">${player.acronym}: ${tally.PLAYER}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span class="text-slate-300">NDA: ${tally.NDA}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span class="text-slate-300">INDIA: ${tally.INDIA}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span class="text-slate-300">Third Front: ${tally.THIRD_FRONT}</span>
            </div>
          </div>
        </div>

        <!-- MAIN INTERACTIVE INDIA MAP & STATE DRILLDOWN LAYOUT -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          <!-- SVG MAP CONTAINER (7 cols on Desktop) -->
          <div class="lg:col-span-7 glass-panel p-4 flex flex-col items-center">
            <div class="w-full flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-slate-300 uppercase tracking-wider">National Electoral Map</span>
              <span class="text-[11px] text-amber-400 font-medium">Tap state to inspect districts</span>
            </div>

            <div id="india-svg-container">
              <svg id="india-svg" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="map-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                <!-- State Paths -->
                <g id="states-group">
                  ${gameState.states.map(state => {
                    const isSelected = state.id === gameState.selectedStateId;
                    const fillColor = mapEngine.getStateFillColor(state);
                    return `
                      <path 
                        d="${state.path}" 
                        id="state-path-${state.id}"
                        data-state-id="${state.id}"
                        class="state-path ${isSelected ? 'selected' : ''}" 
                        style="fill: ${fillColor}; opacity: ${isSelected ? '1' : '0.88'};"
                      />
                    `;
                  }).join('')}
                </g>

                <!-- State Labels & Seat Counts (Only for states with ample space) -->
                <g id="labels-group">
                  ${gameState.states.filter(s => s.totalSeats >= 4).map(state => `
                    <text x="${state.labelCoords.x}" y="${state.labelCoords.y}" class="state-label">
                      ${state.code} ${state.totalSeats}
                    </text>
                  `).join('')}
                </g>

                <!-- Animated Active Rally Radar Rings -->
                <g id="rallies-group" class="rally-marker-group">
                  ${gameState.states.filter(s => s.activeRallies && s.activeRallies.length > 0).map(s => {
                    const latest = s.activeRallies[0];
                    const isPlayer = latest.partyId === player.id;
                    const color = isPlayer ? player.color : (latest.partyId === 'UPC' ? '#3b82f6' : '#f97316');
                    return `
                      <circle cx="${s.labelCoords.x}" cy="${s.labelCoords.y}" r="8" fill="${color}" class="rally-core-dot" />
                      <circle cx="${s.labelCoords.x}" cy="${s.labelCoords.y}" r="22" stroke="${color}" class="animate-radar" />
                    `;
                  }).join('')}
                </g>
              </svg>

              <!-- Floating Tooltip -->
              <div id="map-tooltip"></div>
            </div>
          </div>

          <!-- STATE DRILL-DOWN & DISTRICT VIEW (5 cols on Desktop) -->
          <div class="lg:col-span-5 glass-panel p-4 space-y-4">
            
            <!-- State Header Card -->
            <div class="border-b border-slate-700/80 pb-3">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-base font-black text-white flex items-center gap-2">
                    <span>${selState.name}</span>
                    <span class="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 font-mono border border-slate-700">
                      ${selState.totalSeats} Lok Sabha Seats
                    </span>
                  </h3>
                  <div class="text-[11px] text-slate-400 mt-0.5">Capital: ${selState.capital}</div>
                </div>

                <div class="text-right">
                  <div class="text-[10px] text-slate-400 uppercase font-mono">Projected Lead</div>
                  <div class="text-xs font-black" style="color: ${mapEngine.getStateFillColor(selState)}">
                    ${selState.projectedLeadParty === 'PLAYER' ? player.name : selState.projectedLeadParty}
                  </div>
                </div>
              </div>

              <!-- State Seat Share Bar -->
              <div class="grid grid-cols-4 gap-2 mt-3 text-center text-xs font-mono">
                <div class="p-1.5 rounded bg-slate-900 border border-slate-800">
                  <div class="text-[10px] text-slate-400">${player.acronym}</div>
                  <div class="font-bold text-amber-400">${selState.projectedPartySeats.PLAYER}</div>
                </div>
                <div class="p-1.5 rounded bg-slate-900 border border-slate-800">
                  <div class="text-[10px] text-slate-400">NDA</div>
                  <div class="font-bold text-orange-400">${selState.projectedPartySeats.NDA}</div>
                </div>
                <div class="p-1.5 rounded bg-slate-900 border border-slate-800">
                  <div class="text-[10px] text-slate-400">INDIA</div>
                  <div class="font-bold text-blue-400">${selState.projectedPartySeats.INDIA}</div>
                </div>
                <div class="p-1.5 rounded bg-slate-900 border border-slate-800">
                  <div class="text-[10px] text-slate-400">OTH</div>
                  <div class="font-bold text-emerald-400">${selState.projectedPartySeats.OTHERS}</div>
                </div>
              </div>
            </div>

            <!-- District / Constituency Cards Grid -->
            <div>
              <div class="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                <span>Constituencies / Districts (${selState.districts.length})</span>
                <span class="text-[10px] text-slate-400 font-normal">Demographics & Swing</span>
              </div>

              <div class="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                ${selState.districts.map(d => {
                  const vs = d.voteShares || { PLAYER: 15, NDA: 44, INDIA: 35, OTHERS: 6 };
                  const isPlayerWinning = d.projectedWinner === "PLAYER";
                  const borderColor = isPlayerWinning ? player.color : (d.projectedWinner === 'NDA' ? '#ea580c' : d.projectedWinner === 'INDIA' ? '#2563eb' : '#10b981');
                  return `
                    <div class="district-card" style="border-left: 4px solid ${borderColor}">
                      <div class="flex items-center justify-between">
                        <div class="font-bold text-xs text-white">${d.name}</div>
                        <div class="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold"
                          style="background-color: ${borderColor}20; color: ${borderColor}">
                          Lead: ${d.projectedWinner === 'PLAYER' ? player.acronym : d.projectedWinner}
                        </div>
                      </div>

                      <div class="text-[11px] text-slate-400 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                        <span>Urban: <b class="text-slate-200 font-mono">${d.urban}%</b></span>
                        <span>Youth: <b class="text-slate-200 font-mono">${d.youth}%</b></span>
                        <span class="text-amber-300">Issue: ${d.issue}</span>
                      </div>

                      <!-- Vote Share Progress Bar -->
                      <div class="w-full h-1.5 bg-slate-800 rounded-full flex overflow-hidden mt-2">
                        <div style="width: ${vs.PLAYER}%; background-color: ${player.color};" title="${player.acronym}: ${vs.PLAYER}%"></div>
                        <div style="width: ${vs.NDA}%; background-color: #ea580c;" title="NDA: ${vs.NDA}%"></div>
                        <div style="width: ${vs.INDIA}%; background-color: #2563eb;" title="INDIA: ${vs.INDIA}%"></div>
                        <div style="width: ${vs.OTHERS}%; background-color: #10b981;" title="OTH: ${vs.OTHERS}%"></div>
                      </div>

                      <!-- Action Button inside District -->
                      <div class="mt-2 pt-2 border-t border-slate-700/50 flex justify-between items-center text-[11px]">
                        <div class="flex gap-2 text-[10px] text-slate-400 font-mono">
                          <span style="color: ${player.color}">${player.acronym}: ${vs.PLAYER}%</span>
                          <span class="text-orange-400">NDA: ${vs.NDA}%</span>
                          <span class="text-blue-400">IND: ${vs.INDIA}%</span>
                        </div>
                        <button class="btn-primary text-[10px] px-2.5 py-1 rounded-md font-semibold btn-quick-rally"
                          data-state="${selState.id}" data-district="${d.id}">
                          Hold Rally (₹45L)
                        </button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

          </div>

        </div>

      </div>
    `;

    this.bindEvents();
  },

  bindEvents() {
    // State Path Click & Hover
    const paths = document.querySelectorAll(".state-path");
    const tooltip = document.getElementById("map-tooltip");

    paths.forEach(p => {
      p.addEventListener("click", () => {
        const stateId = p.getAttribute("data-state-id");
        if (stateId) {
          gameState.setSelectedState(stateId);
          this.render();
        }
      });

      p.addEventListener("mouseenter", (e) => {
        const stateId = p.getAttribute("data-state-id");
        const s = gameState.getState(stateId);
        if (s && tooltip) {
          const lead = s.projectedLeadParty === 'PLAYER' ? gameState.getPlayer().acronym : s.projectedLeadParty;
          tooltip.innerHTML = `
            <div class="font-bold text-white">${s.name}</div>
            <div class="text-[10px] text-amber-400 font-mono">${s.totalSeats} Seats • Leading: ${lead}</div>
          `;
          tooltip.classList.add("visible");
        }
      });

      p.addEventListener("mousemove", (e) => {
        if (tooltip) {
          const container = document.getElementById("india-svg-container");
          if (container) {
            const rect = container.getBoundingClientRect();
            tooltip.style.left = `${e.clientX - rect.left}px`;
            tooltip.style.top = `${e.clientY - rect.top}px`;
          }
        }
      });

      p.addEventListener("mouseleave", () => {
        if (tooltip) tooltip.classList.remove("visible");
      });
    });

    // Quick Rally in district button
    document.querySelectorAll(".btn-quick-rally").forEach(btn => {
      btn.addEventListener("click", () => {
        const stateId = btn.getAttribute("data-state");
        const districtId = btn.getAttribute("data-district");
        const res = aiPartyEngine.launchGrandRally(stateId, districtId, false);
        if (res.success) {
          gameModal.toast(res.message, "success");
          this.render();
        } else {
          gameModal.show({
            title: "Cannot Launch Rally",
            message: res.message,
            type: "danger"
          });
        }
      });
    });
  }
};
