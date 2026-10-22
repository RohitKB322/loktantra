// TAB 5: Party HQ, Legislative Wing, MLAs & Cadre Management
import { gameState } from "../core/state.js";
import { cadreEngine } from "../engines/cadreEngine.js";

export const tab5_partyHQ = {
  render() {
    const container = document.getElementById("tab-pane-party-hq");
    if (!container) return;

    const player = gameState.getPlayer();
    const mlaCount = player.totalMlas || 24;
    const loyalty = player.mlaLoyalty || 70;
    const allowance = player.mlaAllowancePerWeek || 1.2;
    const weeklyTotalBurn = Math.round(mlaCount * allowance);

    // Defection Risk Badge
    let riskBadge = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    let riskText = "Low Defection Risk";
    if (loyalty < 40) {
      riskBadge = "bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse";
      riskText = "CRITICAL: Poaching Vulnerability High!";
    } else if (loyalty < 65) {
      riskBadge = "bg-amber-500/20 text-amber-400 border-amber-500/30";
      riskText = "Moderate: Watch for Resort Politics";
    }

    container.innerHTML = `
      <div class="space-y-5">
        
        <!-- SECTION 1: LEGISLATIVE WING & MLA MANAGEMENT -->
        <div class="glass-panel p-4">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h2 class="text-sm font-black uppercase tracking-wider text-white">Legislative Wing & MLA Council</h2>
              <p class="text-xs text-slate-400">Keep your elected representatives well-funded and loyal to prevent rival poaching in luxury resorts.</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono px-2 py-0.5 rounded border ${riskBadge}">
                ${riskText}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            <!-- Card 1: Elected Strength -->
            <div class="glass-card p-3.5 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Elected MLAs</span>
                  <span class="text-xs font-mono font-bold text-amber-400">4 States</span>
                </div>
                <div class="text-3xl font-black text-white font-mono mt-2">${mlaCount} <span class="text-xs font-normal text-slate-400">Seats</span></div>
                <div class="text-[11px] text-slate-400 mt-1">Elected legislators in state assemblies ready to be mobilized as campaign vanguards.</div>
              </div>
              <div class="mt-3 pt-2 border-t border-slate-700/60 text-[10px] text-slate-400 font-mono">
                UP: 12 • MH: 6 • BR: 4 • KA: 2
              </div>
            </div>

            <!-- Card 2: Loyalty Health & Allowances -->
            <div class="glass-card p-3.5 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">MLA Loyalty Meter</span>
                  <span class="text-xs font-mono font-bold ${loyalty > 65 ? 'text-emerald-400' : 'text-amber-400'}">${loyalty}%</span>
                </div>
                <div class="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-300 ${loyalty > 65 ? 'bg-emerald-500' : loyalty > 40 ? 'bg-amber-500' : 'bg-rose-500'}"
                    style="width: ${loyalty}%;"></div>
                </div>
                <div class="text-[11px] text-slate-400 mt-2">
                  Weekly Burn: <b class="text-emerald-400 font-mono">₹${weeklyTotalBurn}L / wk</b> (₹${allowance}L per MLA)
                </div>
              </div>

              <!-- Allowance Range Slider -->
              <div class="mt-3 pt-2 border-t border-slate-700/60">
                <div class="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                  <span>Allowance: ₹${allowance}L/wk</span>
                  <span>(0.5L - 3.5L)</span>
                </div>
                <input id="slider-mla-allowance" type="range" min="0.5" max="3.5" step="0.1" value="${allowance}"
                  class="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer" />
              </div>
            </div>

            <!-- Card 3: Loyalty Actions -->
            <div class="glass-card p-3.5 flex flex-col justify-between">
              <div>
                <span class="text-xs font-bold text-white uppercase tracking-wider">Patronage & Discipline</span>
                <p class="text-[11px] text-slate-400 mt-1">Distribute special constituency slush briefcases or organize official conclaves to ensure zero rebellion.</p>
              </div>

              <div class="mt-3 flex flex-col gap-2">
                <button id="btn-conclave" class="w-full btn-primary py-1.5 text-xs rounded-lg font-semibold">
                  Hold Conclave (₹20L White)
                </button>
                <button id="btn-briefcase" class="w-full btn-secondary text-amber-400 py-1.5 text-xs rounded-lg font-mono font-semibold hover:bg-amber-500/20">
                  Secret Briefcases (₹35L Slush)
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- SECTION 2: CADRE, BOOTH WORKERS & GRASSROOTS MACHINERY -->
        <div class="glass-panel p-4">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h2 class="text-sm font-black uppercase tracking-wider text-white">Party Cadre & Booth Network (Sangathan)</h2>
              <p class="text-xs text-slate-400">Panna Pramukhs (Page In-charges) turn out voters at polling booths on election day.</p>
            </div>
            <span class="text-xs font-mono text-emerald-400 font-bold">
              Cadre Morale: ${player.cadreMorale || 75}%
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            <div class="glass-card p-3">
              <div class="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Enrolled Volunteers</div>
              <div class="text-xl font-black text-white font-mono mt-1">${(player.activeMembers || 18500).toLocaleString()}</div>
              <div class="text-[10px] text-emerald-400 mt-0.5">Active across 36 States/UTs</div>
            </div>

            <div class="glass-card p-3">
              <div class="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Panna Pramukhs (Booth Chiefs)</div>
              <div class="text-xl font-black text-amber-400 font-mono mt-1">${(player.boothWorkers || 1200).toLocaleString()}</div>
              <div class="text-[10px] text-slate-400 mt-0.5">Assigned to polling stations</div>
            </div>

            <div class="glass-card p-3 flex flex-col justify-between">
              <div>
                <div class="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Recruitment Drive</div>
                <div class="text-[11px] text-slate-400 mt-0.5">Enroll +4,500 students & local youth.</div>
              </div>
              <button id="btn-recruit-cadre" class="mt-2 btn-primary py-1 text-xs rounded-lg font-semibold">
                Recruit (+₹15L)
              </button>
            </div>

            <div class="glass-card p-3 flex flex-col justify-between">
              <div>
                <div class="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Worker Fuel & Food Subsidy</div>
                <div class="text-[11px] text-slate-400 mt-0.5">Free lunch & bike petrol to boost morale.</div>
              </div>
              <button id="btn-cadre-fuel" class="mt-2 btn-secondary text-emerald-400 py-1 text-xs rounded-lg font-semibold hover:bg-emerald-500/20">
                Distribute (+₹12L)
              </button>
            </div>

          </div>
        </div>

      </div>
    `;

    this.bindEvents();
  },

  bindEvents() {
    // Slider for MLA allowances
    const slider = document.getElementById("slider-mla-allowance");
    if (slider) {
      slider.addEventListener("change", (e) => {
        cadreEngine.setMlaAllowance(parseFloat(e.target.value));
        this.render();
      });
    }

    // Secret briefcase
    const btnBriefcase = document.getElementById("btn-briefcase");
    if (btnBriefcase) {
      btnBriefcase.addEventListener("click", () => {
        const res = cadreEngine.distributeSecretBriefcase();
        alert(res.message);
        this.render();
      });
    }

    // Conclave
    const btnConclave = document.getElementById("btn-conclave");
    if (btnConclave) {
      btnConclave.addEventListener("click", () => {
        const res = cadreEngine.holdLegislativeConclave();
        alert(res.message);
        this.render();
      });
    }

    // Recruit cadre
    const btnRecruit = document.getElementById("btn-recruit-cadre");
    if (btnRecruit) {
      btnRecruit.addEventListener("click", () => {
        const res = cadreEngine.launchRecruitmentDrive();
        alert(res.message);
        this.render();
      });
    }

    // Fuel subsidy
    const btnFuel = document.getElementById("btn-cadre-fuel");
    if (btnFuel) {
      btnFuel.addEventListener("click", () => {
        const res = cadreEngine.provideWorkerFuelRation();
        alert(res.message);
        this.render();
      });
    }
  }
};
