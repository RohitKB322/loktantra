// TAB 6: Prime Minister's Office (PMO) & National Governance Command Center
import { gameState } from "../core/state.js";
import { governanceEngine, NATIONAL_POLICIES, PARLIAMENTARY_BILLS } from "../engines/governanceEngine.js";
import { gameModal } from "./gameModal.js";
import { audioEngine } from "../engines/audioEngine.js";

export const tab6_pmoUI = {
  render() {
    const container = document.getElementById("tab-pane-pmo");
    if (!container) return;

    const player = gameState.getPlayer();
    const gov = gameState.governance || { active: false, role: "OPPOSITION", rulingPartyKey: "NDA", rulingSeats: 303, stability: 85 };
    const m = gameState.macro;
    const isPM = governanceEngine.isPlayerPM();

    const weeksToNextElection = Math.max(0, (gameState.nextElectionTurn || 24) - gameState.currentTurn);

    container.innerHTML = `
      <div class="space-y-5 animate-fade-in">
        
        <!-- PMO HERO BANNER -->
        <div class="glass-panel p-4 sm:p-6 border-l-4 ${
          isPM 
            ? 'border-l-amber-500 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900' 
            : 'border-l-orange-500 bg-gradient-to-r from-orange-950/20 via-slate-900 to-slate-900'
        }">
          <div class="flex flex-wrap items-center justify-between gap-4">
            
            <div class="flex items-center gap-3.5">
              <div class="w-12 h-12 rounded-2xl ${
                isPM ? 'bg-amber-500/20 border-amber-500/40' : 'bg-orange-500/20 border-orange-500/40'
              } border flex items-center justify-center text-2xl shadow-lg shrink-0">
                ${isPM ? '🇮🇳' : '🏛️'}
              </div>

              <div>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider font-mono ${
                    isPM 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                      : 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                  }">
                    ${isPM ? 'Constitutional Executive • Prime Minister' : 'Incumbent Administration • NDA in Power'}
                  </span>
                  <span class="text-xs text-slate-400 font-mono">Term ${gameState.termNumber || 1} • Week ${gov.termWeek || gameState.currentTurn}</span>
                </div>

                <h1 class="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                  ${isPM ? "PRIME MINISTER'S OFFICE (PMO INDIA)" : "UNION GOVERNMENT OF INDIA (NDA IN POWER)"}
                </h1>
                <p class="text-xs text-slate-300 mt-0.5">
                  ${isPM 
                    ? `Head of Union Council of Ministers • Leading the ${gov.allianceName || 'National Alliance'} (${gov.governingSeats} Lok Sabha Seats)` 
                    : `Ruling Coalition: National Democratic Alliance (NDA - 303 Seats) • Prime Minister: NDA Leadership`}
                </p>
              </div>
            </div>

            <!-- Next General Election Countdown Badge -->
            <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono text-right">
              <div class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">General Election Countdown</div>
              <div class="text-base sm:text-lg font-black ${weeksToNextElection <= 6 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}">
                ${weeksToNextElection > 0 ? `${weeksToNextElection} Weeks to Polls` : 'Election Bell Active!'}
              </div>
              <div class="text-[10px] text-slate-500">Every 54 Weeks Recurring Mandate</div>
            </div>

          </div>
        </div>

        <!-- SECTION 1: MACROECONOMIC INDICATORS (NATIONAL TELEMETRY) -->
        <div>
          <div class="flex items-center justify-between mb-2.5">
            <h2 class="text-xs font-black uppercase tracking-wider text-amber-400 font-mono flex items-center gap-1.5">
              <span>📈</span> National Economic Indicators (Under Current Administration)
            </h2>
            <span class="text-[10px] text-slate-400 font-mono">National Sentiment: <strong class="text-white">${m.sentiment}</strong></span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            
            <!-- Real GDP Growth -->
            <div class="glass-card p-3.5 border-t-2 border-t-emerald-500">
              <div class="flex items-center justify-between text-[11px] text-slate-400">
                <span>GDP Growth</span>
                <span class="text-xs">📊</span>
              </div>
              <div class="text-xl sm:text-2xl font-black text-emerald-400 mt-1">${m.gdpGrowth}%</div>
              <div class="text-[10px] text-slate-500 mt-1">Annualized Real Growth • Target: 8.0%+</div>
            </div>

            <!-- CPI Retail Inflation -->
            <div class="glass-card p-3.5 border-t-2 ${m.inflation > 5.5 ? 'border-t-rose-500' : 'border-t-amber-500'}">
              <div class="flex items-center justify-between text-[11px] text-slate-400">
                <span>CPI Inflation</span>
                <span class="text-xs">🏷️</span>
              </div>
              <div class="text-xl sm:text-2xl font-black ${m.inflation > 5.5 ? 'text-rose-400' : 'text-amber-400'} mt-1">${m.inflation}%</div>
              <div class="text-[10px] text-slate-500 mt-1">Food & Fuel Basket • High inflation fuels anti-incumbency</div>
            </div>

            <!-- Unemployment Rate -->
            <div class="glass-card p-3.5 border-t-2 border-t-blue-500">
              <div class="flex items-center justify-between text-[11px] text-slate-400">
                <span>Unemployment</span>
                <span class="text-xs">👷</span>
              </div>
              <div class="text-xl sm:text-2xl font-black text-blue-400 mt-1">${m.unemployment}%</div>
              <div class="text-[10px] text-slate-500 mt-1">Youth & Urban Jobless Rate</div>
            </div>

            <!-- Benchmark Repo Rate -->
            <div class="glass-card p-3.5 border-t-2 border-t-amber-500">
              <div class="flex items-center justify-between text-[11px] text-slate-400">
                <span>RBI Repo Rate</span>
                <span class="text-xs">🏦</span>
              </div>
              <div class="text-xl sm:text-2xl font-black text-amber-400 mt-1">${m.repoRate}%</div>
              <div class="text-[10px] text-slate-500 mt-1">Monetary Policy Stance</div>
            </div>

          </div>
        </div>

        <!-- CONDITIONAL CONTENT: EITHER PM CONTROLS (IF YOU ARE PM) OR OPPOSITION CHALLENGE SUITE (IF NDA IN POWER) -->

        ${isPM ? `
          <!-- ========================================== -->
          <!-- MODE A: YOU ARE PRIME MINISTER (UNLOCKED) -->
          <!-- ========================================== -->

          <!-- SECTION 2: EXECUTIVE MEGA-DIRECTIVES -->
          <div class="glass-panel p-4">
            <div class="flex items-center justify-between mb-3">
              <div>
                <h2 class="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <span>🚀</span> Prime Minister Policy Directives & Mega-Projects
                </h2>
                <p class="text-xs text-slate-400">
                  Enact landmark central programs to steer the national economy and create massive voter goodwill for your re-election.
                </p>
              </div>
              <div class="text-xs font-mono text-emerald-400 font-bold">
                White Treasury: ₹${player.whiteMoney}L
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              ${NATIONAL_POLICIES.map(pol => `
                <div class="glass-card p-4 flex flex-col justify-between hover:border-amber-500/50 transition-all border border-slate-800">
                  <div>
                    <div class="flex items-start justify-between gap-2">
                      <div>
                        <span class="text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-slate-800 text-slate-300">
                          ${pol.category}
                        </span>
                        <h3 class="text-sm font-bold text-white mt-1">${pol.name}</h3>
                        <div class="text-[11px] text-amber-400 font-mono mt-0.5">${pol.tagline}</div>
                      </div>
                      <div class="text-right shrink-0">
                        <span class="text-xs font-mono font-bold text-emerald-400">₹${pol.cost}L</span>
                      </div>
                    </div>

                    <p class="text-xs text-slate-300 mt-2 leading-relaxed">
                      ${pol.description}
                    </p>

                    <div class="flex flex-wrap gap-1.5 mt-2.5 font-mono text-[10px]">
                      ${pol.impact.gdp ? `<span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">+${pol.impact.gdp}% GDP</span>` : ''}
                      ${pol.impact.inflation ? `<span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">${pol.impact.inflation}% Inflation</span>` : ''}
                      ${pol.impact.approval ? `<span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">+${pol.impact.approval}% Approval</span>` : ''}
                      <span class="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">Next Poll: +${pol.impact.urbanSwing || pol.impact.ruralSwing || 3.0}% Swing</span>
                    </div>
                  </div>

                  <div class="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                    <button class="btn-primary text-xs py-2 px-4 rounded-xl font-bold uppercase tracking-wider btn-enact-policy flex items-center gap-1.5"
                      data-policy-id="${pol.id}">
                      <span>Enact Policy Directive 📜</span>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- SECTION 3: MONETARY CONTROLS & PARLIAMENT LAWS -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <!-- Repo Rate -->
            <div class="glass-panel p-4 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <span>🏦</span> RBI Benchmark Repo Rate
                  </h3>
                  <span class="text-xs font-mono font-bold text-amber-400">${m.repoRate}%</span>
                </div>
                <p class="text-xs text-slate-400 mb-3">Adjust interest rates to stimulate growth or cool inflation.</p>

                <div class="grid grid-cols-2 gap-3 mt-4">
                  <button id="btn-repo-cut" class="btn-secondary py-2.5 px-3 rounded-xl text-xs font-bold text-emerald-300 hover:border-emerald-500 flex flex-col items-center">
                    <span>📉 Cut Rate (-0.25%)</span>
                    <span class="text-[9px] text-slate-400 font-mono mt-0.5">+0.3% GDP Growth</span>
                  </button>
                  <button id="btn-repo-hike" class="btn-secondary py-2.5 px-3 rounded-xl text-xs font-bold text-rose-300 hover:border-rose-500 flex flex-col items-center">
                    <span>📈 Hike Rate (+0.25%)</span>
                    <span class="text-[9px] text-slate-400 font-mono mt-0.5">-0.4% Inflation</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Bills -->
            <div class="glass-panel p-4 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <span>📜</span> Table Parliamentary Legislation
                  </h3>
                  <span class="text-xs font-mono text-emerald-400">Stability: ${gov.stability}%</span>
                </div>
                <div class="space-y-2">
                  ${PARLIAMENTARY_BILLS.map(b => `
                    <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                      <div>
                        <div class="text-xs font-bold text-white">${b.title}</div>
                        <div class="text-[10px] text-amber-400 font-mono">Approval +${b.rewardApproval}% • Stability +${b.rewardStability}%</div>
                      </div>
                      <button class="btn-primary text-xs py-1.5 px-3 rounded-lg font-bold shrink-0 btn-pass-bill" data-bill-id="${b.id}">
                        Table Bill
                      </button>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>

          </div>
        ` : `
          <!-- ======================================================== -->
          <!-- MODE B: NDA IS IN POWER (YOU ARE IN OPPOSITION / CHALLENGER) -->
          <!-- ======================================================== -->

          <!-- EXECUTIVE LOCK NOTICE -->
          <div class="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-start gap-3">
            <span class="text-2xl shrink-0 mt-0.5">🔒</span>
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-amber-400">
                Executive PMO Controls Locked (NDA In Power)
              </h3>
              <p class="text-xs text-slate-300 mt-1 leading-relaxed">
                You are currently in <strong>Opposition</strong>. The <strong>National Democratic Alliance (NDA)</strong> holds the parliamentary majority at the Centre (303 seats). You cannot enact Union Cabinet policies or direct the RBI until you cross 272 seats and take oath as Prime Minister!
              </p>
              <div class="mt-2 text-[11px] text-amber-300/90 font-mono">
                ★ Objective: Build your war chest, organize rallies, attack the NDA's economic track record, and win the upcoming General Election!
              </div>
            </div>
          </div>

          <!-- OPPOSITION ACCOUNTABILITY ACTIONS (ATTACK THE RULING NDA) -->
          <div class="glass-panel p-4">
            <div class="flex items-center justify-between mb-3">
              <div>
                <h2 class="text-sm font-black uppercase tracking-wider text-rose-400 flex items-center gap-2">
                  <span>⚖️</span> Opposition Accountability Actions (Grill the Ruling NDA)
                </h2>
                <p class="text-xs text-slate-400">
                  Leverage the NDA's economic failures (inflation, paper leaks, agrarian distress) to shift voters into your camp!
                </p>
              </div>
              <div class="text-xs font-mono text-emerald-400">
                White Treasury: ₹${player.whiteMoney}L
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              
              <!-- 1. Corner on Inflation -->
              <div class="glass-card p-4 flex flex-col justify-between border-t-2 border-t-rose-500">
                <div>
                  <div class="flex items-center justify-between">
                    <h3 class="text-xs font-bold text-white">📢 Corner Ruling NDA on High Inflation</h3>
                    <span class="text-xs font-mono text-emerald-400">Cost: ₹8L White</span>
                  </div>
                  <p class="text-xs text-slate-300 mt-1 leading-relaxed">
                    Hold a national press conference and media campaign highlighting skyrocketing vegetable and cooking gas prices under NDA rule (${m.inflation}%).
                  </p>
                  <div class="text-[10px] text-amber-400 font-mono mt-2">
                    ★ Impact: Your Approval +2.5% • NDA vote share drops -1.0% in heartland swing states
                  </div>
                </div>
                <div class="mt-4 pt-2 border-t border-slate-800 flex justify-end">
                  <button id="btn-opp-inflation" class="btn-primary text-xs py-1.5 px-3.5 rounded-xl font-bold uppercase">
                    Hold Press Briefing
                  </button>
                </div>
              </div>

              <!-- 2. Champion Farmer MSP -->
              <div class="glass-card p-4 flex flex-col justify-between border-t-2 border-t-emerald-500">
                <div>
                  <div class="flex items-center justify-between">
                    <h3 class="text-xs font-bold text-white">🚜 Champion Agrarian Distress & Legal MSP</h3>
                    <span class="text-xs font-mono text-emerald-400">Cost: ₹12L White</span>
                  </div>
                  <p class="text-xs text-slate-300 mt-1 leading-relaxed">
                    Lead a mega tractor rally demanding statutory Minimum Support Price (MSP) guarantees, mobilizing angry farmers across UP, Punjab, MH, MP, and Bihar.
                  </p>
                  <div class="text-[10px] text-amber-400 font-mono mt-2">
                    ★ Impact: Rural Swing +2.8% for upcoming election • Massive grassroots mobilization
                  </div>
                </div>
                <div class="mt-4 pt-2 border-t border-slate-800 flex justify-end">
                  <button id="btn-opp-msp" class="btn-primary text-xs py-1.5 px-3.5 rounded-xl font-bold uppercase">
                    Organize Tractor March
                  </button>
                </div>
              </div>

              <!-- 3. Adjournment on Unemployment -->
              <div class="glass-card p-4 flex flex-col justify-between border-t-2 border-t-blue-500">
                <div>
                  <div class="flex items-center justify-between">
                    <h3 class="text-xs font-bold text-white">⚡ Move Adjournment Motion on Paper Leaks & Jobs</h3>
                    <span class="text-xs font-mono text-emerald-400">Cost: ₹6L White</span>
                  </div>
                  <p class="text-xs text-slate-300 mt-1 leading-relaxed">
                    Table an emergency adjournment motion in Lok Sabha grilling the NDA treasury benches on recruitment delays and student exam paper leaks (${m.unemployment}% jobless rate).
                  </p>
                  <div class="text-[10px] text-amber-400 font-mono mt-2">
                    ★ Impact: Youth Vote Swing +1.8% • Cadre Morale +16% • National Approval +2.0%
                  </div>
                </div>
                <div class="mt-4 pt-2 border-t border-slate-800 flex justify-end">
                  <button id="btn-opp-unemployment" class="btn-primary text-xs py-1.5 px-3.5 rounded-xl font-bold uppercase">
                    Move Motion
                  </button>
                </div>
              </div>

              <!-- 4. Demand JPC on Cronyism -->
              <div class="glass-card p-4 flex flex-col justify-between border-t-2 border-t-purple-500">
                <div>
                  <div class="flex items-center justify-between">
                    <h3 class="text-xs font-bold text-white">🔍 Expose Corporate Cronyism & Demand JPC</h3>
                    <span class="text-xs font-mono text-emerald-400">Cost: ₹10L White</span>
                  </div>
                  <p class="text-xs text-slate-300 mt-1 leading-relaxed">
                    Release an investigative whitepaper exposing corporate quid-pro-quo tenders, demanding a Joint Parliamentary Committee (JPC) inquiry into ruling NDA leaders.
                  </p>
                  <div class="text-[10px] text-amber-400 font-mono mt-2">
                    ★ Impact: NDA baseline drops -1.2% • Damages incumbent clean governance claims
                  </div>
                </div>
                <div class="mt-4 pt-2 border-t border-slate-800 flex justify-end">
                  <button id="btn-opp-jpc" class="btn-primary text-xs py-1.5 px-3.5 rounded-xl font-bold uppercase">
                    Table Dossier
                  </button>
                </div>
              </div>

            </div>
          </div>

          <!-- READ-ONLY PREVIEW OF EXECUTIVE POLICIES -->
          <div class="glass-panel p-4 opacity-75">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <span>🔒</span> Central Policy Directives (Unlocks When You Form Government as Prime Minister)
              </h3>
              <span class="text-[10px] font-mono text-amber-400">Preview Mode</span>
            </div>
            <p class="text-xs text-slate-500 mb-3">
              Once you win the General Election and take oath at Rashtrapati Bhavan, you will be able to sanction these mega-projects:
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
              ${NATIONAL_POLICIES.slice(0, 3).map(pol => `
                <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div class="text-slate-300 font-bold">${pol.name}</div>
                  <div class="text-[10px] text-slate-500 mt-1">Cost: ₹${pol.cost}L • ${pol.tagline}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `}

      </div>
    `;

    this.bindEvents();
  },

  bindEvents() {
    const isPM = governanceEngine.isPlayerPM();

    if (isPM) {
      // 1. Enact Policy Buttons (PM Only)
      document.querySelectorAll(".btn-enact-policy").forEach(btn => {
        btn.addEventListener("click", () => {
          const policyId = btn.getAttribute("data-policy-id");
          const res = governanceEngine.executePolicy(policyId);

          gameModal.show({
            title: res.success ? "🏛️ Policy Directive Sanctioned" : "⚠️ Policy Deferred",
            message: res.message,
            type: res.success ? "success" : "warning"
          });

          this.render();
        });
      });

      // 2. Repo Rate Controls (PM Only)
      const btnCut = document.getElementById("btn-repo-cut");
      if (btnCut) {
        btnCut.addEventListener("click", () => {
          const res = governanceEngine.adjustRepoRate("cut");
          gameModal.show({ title: "Monetary Policy Update", message: res.message, type: "cash" });
          this.render();
        });
      }

      const btnHike = document.getElementById("btn-repo-hike");
      if (btnHike) {
        btnHike.addEventListener("click", () => {
          const res = governanceEngine.adjustRepoRate("hike");
          gameModal.show({ title: "Monetary Policy Update", message: res.message, type: "warning" });
          this.render();
        });
      }

      // 3. Table Parliamentary Bills (PM Only)
      document.querySelectorAll(".btn-pass-bill").forEach(btn => {
        btn.addEventListener("click", () => {
          const billId = btn.getAttribute("data-bill-id");
          const res = governanceEngine.tableParliamentaryBill(billId);

          gameModal.show({
            title: res.success ? "⚖️ Law Enacted in Parliament" : "⚠️ Legislative Impasse",
            message: res.message,
            type: res.success ? "success" : "danger"
          });

          this.render();
        });
      });
    } else {
      // OPPOSITION ACTIONS BINDINGS (WHEN NDA IS IN POWER)
      const btnOppInf = document.getElementById("btn-opp-inflation");
      if (btnOppInf) {
        btnOppInf.addEventListener("click", () => {
          const res = governanceEngine.grillIncumbentOnInflation();
          gameModal.show({
            title: res.success ? "📢 Press Conference Concluded" : "Action Deferred",
            message: res.message,
            type: res.success ? "success" : "warning"
          });
          this.render();
        });
      }

      const btnOppMsp = document.getElementById("btn-opp-msp");
      if (btnOppMsp) {
        btnOppMsp.addEventListener("click", () => {
          const res = governanceEngine.championFarmerMSPProtest();
          gameModal.show({
            title: res.success ? "🚜 Kisan Tractor March Held" : "Action Deferred",
            message: res.message,
            type: res.success ? "success" : "warning"
          });
          this.render();
        });
      }

      const btnOppUnemp = document.getElementById("btn-opp-unemployment");
      if (btnOppUnemp) {
        btnOppUnemp.addEventListener("click", () => {
          const res = governanceEngine.moveAdjournmentOnUnemployment();
          gameModal.show({
            title: res.success ? "⚡ Adjournment Motion Moved" : "Action Deferred",
            message: res.message,
            type: res.success ? "success" : "warning"
          });
          this.render();
        });
      }

      const btnOppJpc = document.getElementById("btn-opp-jpc");
      if (btnOppJpc) {
        btnOppJpc.addEventListener("click", () => {
          const res = governanceEngine.demandJPCProbeIntoScandals();
          gameModal.show({
            title: res.success ? "🔍 JPC Dossier Tabled" : "Action Deferred",
            message: res.message,
            type: res.success ? "danger" : "warning"
          });
          this.render();
        });
      }
    }
  }
};
