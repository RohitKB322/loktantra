// TAB 5: Party HQ, Legislative Wing, MLAs & Cadre Machinery (Version 0.4)
import { gameState } from "../core/state.js";
import { cadreEngine } from "../engines/cadreEngine.js";
import { gameModal } from "./gameModal.js";

export const tab5_partyHQ = {
  selectedDeployStateId: "UP",

  render() {
    const container = document.getElementById("tab-pane-party-hq");
    if (!container) return;

    const player = gameState.getPlayer();
    const tally = gameState.nationalSeatTally;
    const playerSeats = tally ? tally.PLAYER : 0;
    const loyalty = player.mlaLoyalty || 70;
    const allowance = player.mlaAllowancePerWeek || 1.2;
    const weeklyTotalBurn = Math.round(playerSeats * allowance);

    const delegations = cadreEngine.getDynamicStateDelegations();
    const discount = Math.round(cadreEngine.getVolunteerDiscount() * 100);
    const turnoutBonus = cadreEngine.getBoothTurnoutBonus();
    const smearResist = cadreEngine.getSmearResistance();

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
        
        <!-- SECTION 1: LEGISLATIVE WING & DYNAMIC STATE DELEGATIONS -->
        <div class="glass-panel p-4">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h2 class="text-sm font-black uppercase tracking-wider text-white">Legislative Wing & Parliamentary Caucus</h2>
              <p class="text-xs text-slate-400">Seats update dynamically based on ground polling and election math across all 36 states.</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono px-2 py-0.5 rounded border ${riskBadge}">
                ${riskText}
              </span>
            </div>
          </div>

          <!-- Top Stats Row -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            <!-- Card 1: Dynamic National Seats -->
            <div class="glass-card p-3.5 flex flex-col justify-between border-t-2" style="border-top-color: ${player.color}">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Projected Seats</span>
                  <span class="text-xs font-mono font-bold text-amber-400">Target: 272</span>
                </div>
                <div class="text-3xl font-black text-white font-mono mt-2 flex items-baseline gap-2">
                  <span>${playerSeats}</span>
                  <span class="text-xs font-normal text-slate-400">/ 543 Lok Sabha</span>
                </div>
                <div class="text-[11px] text-slate-400 mt-1">
                  Elected legislators currently projected to win their parliamentary constituencies.
                </div>
              </div>
              <div class="mt-3 pt-2 border-t border-slate-700/60 text-[10px] text-slate-400 font-mono">
                Updates in real-time as swing states flip!
              </div>
            </div>

            <!-- Card 2: Loyalty Health & Allowances -->
            <div class="glass-card p-3.5 flex flex-col justify-between border-t-2 border-t-amber-500">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Legislator Loyalty</span>
                  <span class="text-xs font-mono font-bold ${loyalty > 65 ? 'text-emerald-400' : 'text-amber-400'}">${loyalty}%</span>
                </div>
                <div class="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-300 ${loyalty > 65 ? 'bg-emerald-500' : loyalty > 40 ? 'bg-amber-500' : 'bg-rose-500'}"
                    style="width: ${loyalty}%;"></div>
                </div>
                <div class="text-[11px] text-slate-400 mt-2">
                  Weekly Burn: <b class="text-emerald-400 font-mono">₹${weeklyTotalBurn}L / wk</b> (₹${allowance}L per seat)
                </div>
              </div>

              <!-- Allowance Range Slider -->
              <div class="mt-3 pt-2 border-t border-slate-700/60">
                <div class="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                  <span>Weekly Allowance: ₹${allowance}L</span>
                  <span>(₹0.5L - ₹3.5L)</span>
                </div>
                <input id="slider-mla-allowance" type="range" min="0.5" max="3.5" step="0.1" value="${allowance}"
                  class="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer" />
              </div>
            </div>

            <!-- Card 3: Loyalty Actions -->
            <div class="glass-card p-3.5 flex flex-col justify-between border-t-2 border-t-emerald-500">
              <div>
                <span class="text-xs font-bold text-white uppercase tracking-wider">Patronage & Discipline</span>
                <p class="text-[11px] text-slate-400 mt-1">Conclaves boost morale; clandestine briefcases neutralize rival resort poaching attempts.</p>
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

          <!-- Dynamic State Delegations Grid -->
          <div class="mt-4 pt-3 border-t border-slate-700/80">
            <div class="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              <span>State Legislative Delegations Breakdown</span>
              <span class="text-[10px] text-amber-400 font-mono">Live Projections</span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
              ${delegations.map(d => `
                <div class="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div class="text-[10px] text-slate-400 font-bold">${d.name} (${d.code})</div>
                  <div class="text-base font-black text-amber-400 font-mono mt-0.5">${d.seats} <span class="text-[10px] text-slate-500 font-normal">/ ${d.total}</span></div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- SECTION 2: CADRE, BOOTH WORKERS & PANNA PRAMUKHS -->
        <div class="glass-panel p-4">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h2 class="text-sm font-black uppercase tracking-wider text-white">Party Cadre & Booth Machinery (Sangathan)</h2>
              <p class="text-xs text-slate-400">Volunteers and Panna Pramukhs provide real gameplay bonuses: cheaper rallies, higher turnout, and smear defense.</p>
            </div>
            <span class="text-xs font-mono text-emerald-400 font-bold">
              Cadre Morale: ${player.cadreMorale || 75}%
            </span>
          </div>

          <!-- Functional Multiplier Badges -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div class="glass-card p-3 border-l-4 border-l-blue-500">
              <div class="text-[10px] uppercase font-bold text-slate-400">Rally Cost Discount</div>
              <div class="text-xl font-black text-blue-400 font-mono mt-1">${discount}% OFF</div>
              <div class="text-[10px] text-slate-400 mt-0.5">Volunteers handle logistics, saving White cash!</div>
            </div>

            <div class="glass-card p-3 border-l-4 border-l-emerald-500">
              <div class="text-[10px] uppercase font-bold text-slate-400">Booth Turnout Bonus</div>
              <div class="text-xl font-black text-emerald-400 font-mono mt-1">+${turnoutBonus}% Swing</div>
              <div class="text-[10px] text-slate-400 mt-0.5">Panna Pramukhs turn out voters on election day!</div>
            </div>

            <div class="glass-card p-3 border-l-4 border-l-purple-500">
              <div class="text-[10px] uppercase font-bold text-slate-400">Smear Attack Shield</div>
              <div class="text-xl font-black text-purple-400 font-mono mt-1">${smearResist}% Defense</div>
              <div class="text-[10px] text-slate-400 mt-0.5">Youth wing counter-memes blunt rival slander!</div>
            </div>
          </div>

          <!-- Cadre Operations & Deployments -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            <!-- Op 1: Recruitment -->
            <div class="glass-card p-3 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-white uppercase tracking-wider">Recruitment Drive</span>
                  <span class="text-xs font-mono text-emerald-400 font-bold">₹15L</span>
                </div>
                <div class="text-[11px] text-slate-400 mt-1">Enroll +4,500 active youth & +350 trained Panna Pramukhs across colleges and mandis.</div>
              </div>
              <button id="btn-recruit-cadre" class="mt-3 btn-primary py-1.5 text-xs rounded-lg font-bold">
                Launch Drive (₹15L)
              </button>
            </div>

            <!-- Op 2: Deploy Panna Pramukhs -->
            <div class="glass-card p-3 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-white uppercase tracking-wider">Deploy to Swing State</span>
                  <span class="text-xs font-mono text-amber-400 font-bold">300 Chiefs</span>
                </div>
                <div class="text-[11px] text-slate-400 mt-1">Dispatch 300 booth chiefs to a battleground state to permanently boost voter conversion by +3.2%.</div>
                
                <select id="select-deploy-state" class="w-full mt-2 bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-2 py-1 focus:outline-none">
                  ${gameState.states.filter(s => s.totalSeats >= 10).map(s => `
                    <option value="${s.id}" ${s.id === this.selectedDeployStateId ? 'selected' : ''}>${s.name} (${s.totalSeats})</option>
                  `).join('')}
                </select>
              </div>
              <button id="btn-deploy-panna" class="mt-3 btn-secondary text-amber-400 py-1.5 text-xs rounded-lg font-bold hover:bg-amber-500/20">
                Deploy Task Force
              </button>
            </div>

            <!-- Op 3: Student Dharna -->
            <div class="glass-card p-3 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-white uppercase tracking-wider">Student Dharna</span>
                  <span class="text-xs font-mono text-rose-400 font-bold">₹10L</span>
                </div>
                <div class="text-[11px] text-slate-400 mt-1">Mobilize youth wing in public agitation against exam leaks & unemployment (+2.8% youth swing).</div>
              </div>
              <button id="btn-student-dharna" class="mt-3 btn-secondary text-rose-400 py-1.5 text-xs rounded-lg font-bold hover:bg-rose-500/20">
                Stage Dharna (₹10L)
              </button>
            </div>

            <!-- Op 4: Grassroots Crowdfunding -->
            <div class="glass-card p-3 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-white uppercase tracking-wider">Crowdfund Drive</span>
                  <span class="text-xs font-mono text-emerald-400 font-bold">Clean Cash</span>
                </div>
                <div class="text-[11px] text-slate-400 mt-1">Appeal directly to common citizens for micro-donations via UPI. Generates clean declared White funds.</div>
              </div>
              <button id="btn-crowdfund" class="mt-3 btn-secondary text-emerald-400 py-1.5 text-xs rounded-lg font-bold hover:bg-emerald-500/20">
                Crowdfund Now
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
        gameModal.toast(`MLA weekly allowance updated to ₹${e.target.value}L/seat.`, "success");
        this.render();
      });
    }

    // Deploy State selection
    const selState = document.getElementById("select-deploy-state");
    if (selState) {
      selState.addEventListener("change", (e) => {
        this.selectedDeployStateId = e.target.value;
      });
    }

    // Secret briefcase
    const btnBriefcase = document.getElementById("btn-briefcase");
    if (btnBriefcase) {
      btnBriefcase.addEventListener("click", () => {
        const res = cadreEngine.distributeSecretBriefcase();
        gameModal.show({
          title: "Secret Briefcase Distribution",
          message: res.message,
          type: res.success ? "cash" : "danger"
        });
        this.render();
      });
    }

    // Conclave
    const btnConclave = document.getElementById("btn-conclave");
    if (btnConclave) {
      btnConclave.addEventListener("click", () => {
        const res = cadreEngine.holdLegislativeConclave();
        gameModal.show({
          title: "Legislative Conclave",
          message: res.message,
          type: res.success ? "success" : "danger"
        });
        this.render();
      });
    }

    // Recruit cadre
    const btnRecruit = document.getElementById("btn-recruit-cadre");
    if (btnRecruit) {
      btnRecruit.addEventListener("click", () => {
        const res = cadreEngine.launchRecruitmentDrive();
        gameModal.show({
          title: "Membership Expansion Concluded",
          message: res.message,
          type: res.success ? "success" : "danger"
        });
        this.render();
      });
    }

    // Deploy Panna Pramukhs
    const btnDeploy = document.getElementById("btn-deploy-panna");
    if (btnDeploy) {
      btnDeploy.addEventListener("click", () => {
        const res = cadreEngine.deployPannaPramukhsToState(this.selectedDeployStateId);
        gameModal.show({
          title: "Task Force Deployed",
          message: res.message,
          type: res.success ? "success" : "danger"
        });
        this.render();
      });
    }

    // Student Dharna
    const btnDharna = document.getElementById("btn-student-dharna");
    if (btnDharna) {
      btnDharna.addEventListener("click", () => {
        const res = cadreEngine.launchStudentDharna(this.selectedDeployStateId);
        gameModal.show({
          title: "Youth Agitation Mobilized",
          message: res.message,
          type: res.success ? "warning" : "danger"
        });
        this.render();
      });
    }

    // Crowdfunding
    const btnCrowdfund = document.getElementById("btn-crowdfund");
    if (btnCrowdfund) {
      btnCrowdfund.addEventListener("click", () => {
        const res = cadreEngine.launchCrowdfundingDrive();
        gameModal.show({
          title: "Micro-Donations Result",
          message: res.message,
          type: "cash"
        });
        this.render();
      });
    }
  }
};
