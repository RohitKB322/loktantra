// TAB 6: Prime Minister's Office (PMO) & National Governance Command Center
import { gameState } from "../core/state.js";
import { governanceEngine, NATIONAL_POLICIES, PARLIAMENTARY_BILLS } from "../engines/governanceEngine.js";
import { financeEngine } from "../engines/financeEngine.js";
import { gameModal } from "./gameModal.js";
import { audioEngine } from "../engines/audioEngine.js";

export const tab6_pmoUI = {
  render() {
    const container = document.getElementById("tab-pane-pmo");
    if (!container) return;

    const player = gameState.getPlayer();
    const gov = gameState.governance || { active: false, role: "OPPOSITION", governingSeats: 0, stability: 80 };
    const m = gameState.macro;
    const isPM = gov.role === "PRIME_MINISTER";
    const isGov = gov.active && (gov.role === "PRIME_MINISTER" || gov.role === "DEPUTY_PM");

    const weeksToNextElection = Math.max(0, (gameState.nextElectionTurn || 24) - gameState.currentTurn);

    container.innerHTML = `
      <div class="space-y-5 animate-fade-in">
        
        <!-- PMO HERO BANNER -->
        <div class="glass-panel p-4 sm:p-6 border-l-4 ${isPM ? 'border-l-amber-500 bg-gradient-to-r from-amber-950/30 to-slate-900/90' : 'border-l-blue-500 bg-slate-900/90'}">
          <div class="flex flex-wrap items-center justify-between gap-4">
            
            <div class="flex items-center gap-3.5">
              <div class="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-lg shrink-0">
                ${isPM ? '🏛️' : '⚖️'}
              </div>

              <div>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider font-mono ${
                    isPM ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  }">
                    ${isPM ? 'Constitutional Executive • Prime Minister' : isGov ? 'Union Cabinet • Deputy Prime Minister' : 'Parliamentary Shadow Cabinet'}
                  </span>
                  <span class="text-xs text-slate-400 font-mono">Term ${gameState.termNumber || 1} • Week ${gov.termWeek || gameState.currentTurn}</span>
                </div>

                <h1 class="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                  ${isPM ? "PRIME MINISTER'S OFFICE (PMO INDIA)" : "PARLIAMENTARY GOVERNANCE & OPPOSITION WAR ROOM"}
                </h1>
                <p class="text-xs text-slate-300 mt-0.5">
                  ${isPM ? `Head of Union Council of Ministers • Leading the ${gov.allianceName || 'National Alliance'} (${gov.governingSeats} Lok Sabha Seats)` : 'Holding the Treasury Benches Accountable in Parliament'}
                </p>
              </div>
            </div>

            <!-- Next General Election Countdown Badge -->
            <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono text-right">
              <div class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Next General Election</div>
              <div class="text-base sm:text-lg font-black ${weeksToNextElection <= 8 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}">
                ${weeksToNextElection > 0 ? `${weeksToNextElection} Weeks to Polls` : 'Election Bell Active!'}
              </div>
              <div class="text-[10px] text-slate-500">Every 54 Weeks Recurring Cycle</div>
            </div>

          </div>
        </div>

        <!-- SECTION 1: MACROECONOMIC INDICATORS & VOTER APPROVAL TELEMETRY -->
        <div>
          <div class="flex items-center justify-between mb-2.5">
            <h2 class="text-xs font-black uppercase tracking-wider text-amber-400 font-mono flex items-center gap-1.5">
              <span>📈</span> National Economic Indicators (Direct Impact on Next Election)
            </h2>
            <span class="text-[10px] text-slate-400 font-mono">Voter Mood: <strong class="text-white">${m.sentiment}</strong></span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            
            <!-- Real GDP Growth -->
            <div class="glass-card p-3.5 border-t-2 border-t-emerald-500">
              <div class="flex items-center justify-between text-[11px] text-slate-400">
                <span>GDP Growth</span>
                <span class="text-xs">📊</span>
              </div>
              <div class="text-xl sm:text-2xl font-black text-emerald-400 mt-1">${m.gdpGrowth}%</div>
              <div class="text-[10px] text-slate-500 mt-1">Annualized Real Growth • Generates ₹${Math.round(m.gdpGrowth * 3.5) + 15}L/wk tax revenue</div>
            </div>

            <!-- CPI Retail Inflation -->
            <div class="glass-card p-3.5 border-t-2 ${m.inflation > 6.0 ? 'border-t-rose-500' : 'border-t-amber-500'}">
              <div class="flex items-center justify-between text-[11px] text-slate-400">
                <span>CPI Inflation</span>
                <span class="text-xs">🏷️</span>
              </div>
              <div class="text-xl sm:text-2xl font-black ${m.inflation > 6.0 ? 'text-rose-400' : 'text-amber-400'} mt-1">${m.inflation}%</div>
              <div class="text-[10px] text-slate-500 mt-1">Target: 4.0% • High inflation reduces voter approval</div>
            </div>

            <!-- Unemployment Rate -->
            <div class="glass-card p-3.5 border-t-2 border-t-blue-500">
              <div class="flex items-center justify-between text-[11px] text-slate-400">
                <span>Unemployment</span>
                <span class="text-xs">👷</span>
              </div>
              <div class="text-xl sm:text-2xl font-black text-blue-400 mt-1">${m.unemployment}%</div>
              <div class="text-[10px] text-slate-500 mt-1">Youth & Urban Labor • Lower via Mega-Projects</div>
            </div>

            <!-- Public Approval Rating -->
            <div class="glass-card p-3.5 border-t-2 border-t-amber-500">
              <div class="flex items-center justify-between text-[11px] text-slate-400">
                <span>National Approval</span>
                <span class="text-xs">⭐</span>
              </div>
              <div class="text-xl sm:text-2xl font-black text-amber-400 mt-1">${player.nationalApproval}%</div>
              <div class="text-[10px] text-slate-500 mt-1">Dictates overall voter conversion at ballot boxes</div>
            </div>

          </div>
        </div>

        <!-- SECTION 2: PRIME MINISTER POLICY DIRECTIVES (NATIONAL MEGA-PROJECTS) -->
        <div class="glass-panel p-4">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h2 class="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                <span>🚀</span> National Policy Levers & Mega-Directives
              </h2>
              <p class="text-xs text-slate-400">
                Sanction landmark executive programs to boost macroeconomic indicators and shift voter swing for the next general election.
              </p>
            </div>
            <div class="text-xs font-mono text-emerald-400">
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

                  <!-- Direct Impact Tags -->
                  <div class="flex flex-wrap gap-1.5 mt-2.5 font-mono text-[10px]">
                    ${pol.impact.gdp ? `<span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">+${pol.impact.gdp}% GDP</span>` : ''}
                    ${pol.impact.inflation ? `<span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">${pol.impact.inflation}% Inflation</span>` : ''}
                    ${pol.impact.unemployment ? `<span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">${pol.impact.unemployment}% Jobless</span>` : ''}
                    ${pol.impact.approval ? `<span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">+${pol.impact.approval}% Approval</span>` : ''}
                    <span class="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">Next Election: +${pol.impact.urbanSwing || pol.impact.ruralSwing || 3.0}% Swing</span>
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

        <!-- SECTION 3: MONETARY POLICY & LEGISLATIVE REFORMS -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <!-- RBI Monetary Policy & Repo Rate -->
          <div class="glass-panel p-4 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <span>🏦</span> RBI Benchmark Repo Rate Setting
                </h3>
                <span class="text-xs font-mono font-bold text-amber-400">${m.repoRate}%</span>
              </div>
              <p class="text-xs text-slate-400 mb-3 leading-relaxed">
                Coordinate with the Reserve Bank of India to adjust benchmark interest rates. Lower rates stimulate corporate investment; higher rates curb rising consumer prices.
              </p>

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

            <div class="mt-4 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400">
              Current Monetary Policy Stance: <strong class="text-amber-400">${m.repoRate < 6.0 ? 'Accommodative (Growth Focus)' : m.repoRate > 7.0 ? 'Hawkish (Inflation Control)' : 'Neutral Stance'}</strong>
            </div>
          </div>

          <!-- Lok Sabha Legislative Chamber -->
          <div class="glass-panel p-4 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <span>📜</span> Table Parliamentary Legislation
                </h3>
                <span class="text-xs font-mono text-emerald-400">Coalition Stability: ${gov.stability || 85}%</span>
              </div>
              <p class="text-xs text-slate-400 mb-3">
                Whip alliance MPs in the Lok Sabha to pass landmark reforms. Solidifies governing majority and elevates public standing.
              </p>

              <div class="space-y-2">
                ${PARLIAMENTARY_BILLS.map(b => `
                  <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                    <div>
                      <div class="text-xs font-bold text-white">${b.title}</div>
                      <div class="text-[10px] text-slate-400">${b.description}</div>
                      <div class="text-[10px] text-amber-400 font-mono mt-0.5">Approval +${b.rewardApproval}% • Stability +${b.rewardStability}%</div>
                    </div>
                    <button class="btn-primary text-xs py-1.5 px-3 rounded-lg font-bold shrink-0 btn-pass-bill" data-bill-id="${b.id}">
                      Table Bill
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="mt-4 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400 flex justify-between">
              <span>Total Enacted Laws: <strong class="text-white">${gov.passedBills || 0}</strong></span>
              <span>Floor Test Readiness: <strong class="text-emerald-400">Ironclad</strong></span>
            </div>
          </div>

        </div>

      </div>
    `;

    this.bindEvents();
  },

  bindEvents() {
    // 1. Enact Policy Buttons
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

    // 2. Repo Rate Controls
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

    // 3. Table Parliamentary Bills
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
  }
};
