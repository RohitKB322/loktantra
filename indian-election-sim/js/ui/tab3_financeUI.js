// TAB 3: Financials, Dual-Ledger, Cashflow Statement & Real Estate (Version 0.4)
import { gameState } from "../core/state.js";
import { financeEngine, REAL_ESTATE_MARKET } from "../engines/financeEngine.js";
import { FREEBIE_SCHEMES_CATALOG } from "../data/issuesAndEvents.js";
import { gameModal } from "./gameModal.js";

export const tab3_financeUI = {
  render() {
    const container = document.getElementById("tab-pane-finance");
    if (!container) return;

    const player = gameState.getPlayer();
    const tally = gameState.nationalSeatTally;
    const playerSeats = tally ? tally.PLAYER : 18;

    // Calculate Weekly Cashflow Breakdown
    const goldYield = Math.round(player.bonds.sovereignGold * 0.012);
    const infraYield = Math.round(player.bonds.infraBonds * 0.02);
    const totalWeeklyIncome = goldYield + infraYield;

    const mlaAllowanceBurn = Math.round(playerSeats * (player.mlaAllowancePerWeek || 1.2));
    
    let freebieBurn = 0;
    player.activeFreebies.forEach(fId => {
      const scheme = FREEBIE_SCHEMES_CATALOG.find(s => s.id === fId);
      if (scheme) freebieBurn += scheme.costPerWeek;
    });

    let loanInterestBurn = 0;
    player.loans.forEach(l => {
      loanInterestBurn += (l.weeklyInterest || 0);
    });

    const totalWeeklyExpenses = mlaAllowanceBurn + freebieBurn + loanInterestBurn;
    const netCashflow = totalWeeklyIncome - totalWeeklyExpenses;

    container.innerHTML = `
      <div class="space-y-5">
        
        <!-- SECTION 1: DUAL-LEDGER TREASURY & WEEKLY CASHFLOW -->
        <div class="glass-panel p-4">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h2 class="text-sm font-black uppercase tracking-wider text-white">Party Treasury & Cashflow Statement</h2>
              <p class="text-xs text-slate-400">Balance declared official funds against clandestine slush cash.</p>
            </div>
            <div class="text-xs font-mono text-slate-400">
              EC Vigilance Index: <b class="text-amber-400">${gameState.macro.ecVigilance}%</b>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- White Ledger -->
            <div class="glass-card p-4 border-l-4 border-l-emerald-500 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">White Money (Official)</span>
                  <span class="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300">EC Audited</span>
                </div>
                <div class="text-2xl font-black text-white font-mono mt-2">
                  ₹${player.whiteMoney} <span class="text-xs font-normal text-slate-400">Lakhs</span>
                </div>
                <p class="text-[11px] text-slate-400 mt-1">
                  Declared legitimate treasury. Used for public mega-rallies, legal TV ads, volunteer fuel, and manifesto printing.
                </p>
              </div>

              <!-- Corporate Electoral Trust Pact -->
              <div class="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                <div>
                  <div class="text-xs font-bold text-white">Electoral Trust Donation</div>
                  <div class="text-[10px] text-slate-400">Quid-pro-quo corporate funding</div>
                </div>
                <button id="btn-corporate-trust" class="btn-primary text-xs px-3 py-1.5 rounded-lg">
                  Accept ₹250L
                </button>
              </div>
            </div>

            <!-- Black Slush Fund Ledger -->
            <div class="glass-card p-4 border-l-4 border-l-amber-500 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold uppercase tracking-wider text-amber-400">Black Money (Slush Cash)</span>
                  <span class="text-xs font-mono px-2 py-0.5 rounded ${player.slushExposure > 50 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-400'}">
                    ${player.slushExposure}% ED Raid Danger
                  </span>
                </div>
                <div class="text-2xl font-black text-amber-400 font-mono mt-2">
                  ₹${player.blackMoney} <span class="text-xs font-normal text-slate-400">Lakhs</span>
                </div>
                <p class="text-[11px] text-slate-400 mt-1">
                  Unaccounted suitcase cash. Used for envelope journalism bribes, secret MLA briefcases, and poaching rival heavyweights.
                </p>
              </div>

              <!-- Launder Money -->
              <div class="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                <div>
                  <div class="text-xs font-bold text-white">Launder Through Shells</div>
                  <div class="text-[10px] text-slate-400">30% haircut into White Money</div>
                </div>
                <button id="btn-launder-slush" class="btn-secondary text-xs text-amber-400 px-3 py-1.5 rounded-lg font-semibold hover:bg-amber-500/20">
                  Launder ₹100L
                </button>
              </div>
            </div>
          </div>

          <!-- Weekly Cashflow Statement Bar -->
          <div class="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <div class="flex items-center justify-between mb-2">
              <span class="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Weekly Treasury Cashflow Audit</span>
              <span class="font-bold ${netCashflow >= 0 ? 'text-emerald-400' : 'text-rose-400'}">
                Net: ${netCashflow >= 0 ? '+' : ''}₹${netCashflow}L / week
              </span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-400">
              <div class="p-1.5 bg-slate-950 rounded">
                <div>+ Bond Yields:</div>
                <div class="text-emerald-400 font-bold">+₹${totalWeeklyIncome}L/wk</div>
              </div>
              <div class="p-1.5 bg-slate-950 rounded">
                <div>- Legislator Allowances:</div>
                <div class="text-rose-400 font-bold">-₹${mlaAllowanceBurn}L/wk</div>
              </div>
              <div class="p-1.5 bg-slate-950 rounded">
                <div>- Freebie Subsidies:</div>
                <div class="text-rose-400 font-bold">-₹${freebieBurn}L/wk</div>
              </div>
              <div class="p-1.5 bg-slate-950 rounded">
                <div>- Loan Servicing:</div>
                <div class="text-rose-400 font-bold">-₹${loanInterestBurn}L/wk</div>
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION 2: REAL ESTATE MARKETPLACE & LAND PLOTS -->
        <div class="glass-panel p-4">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h2 class="text-sm font-black uppercase tracking-wider text-white">Real Estate & Landbank</h2>
              <p class="text-xs text-slate-400">Acquire prime land plots across India. Plots fluctuate weekly based on GDP growth and infrastructure announcements.</p>
            </div>
            <span class="text-xs font-mono text-emerald-400 font-bold">
              Owned Plots: ${player.properties.length}
            </span>
          </div>

          <!-- Market Plots -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            ${REAL_ESTATE_MARKET.map(plot => {
              const prev = plot.priceHistory[plot.priceHistory.length - 2] || plot.basePrice;
              const isUp = plot.currentPrice >= prev;
              return `
                <div class="glass-card p-3.5 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-slate-300">
                        ${plot.type} • ${plot.state}
                      </span>
                      <span class="text-xs font-mono font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}">
                        ${isUp ? '▲' : '▼'} ₹${plot.currentPrice}L
                      </span>
                    </div>

                    <h4 class="font-bold text-xs text-white mt-2">${plot.name}</h4>
                    <p class="text-[11px] text-slate-400 mt-1 line-clamp-2">${plot.description}</p>
                  </div>

                  <div class="mt-3 pt-2 border-t border-slate-700/60 flex gap-2">
                    <button class="flex-1 btn-primary py-1.5 text-xs rounded-lg font-bold btn-buy-plot-white" data-plot-id="${plot.id}">
                      Buy (White)
                    </button>
                    <button class="flex-1 btn-secondary py-1.5 text-xs text-amber-400 rounded-lg font-mono btn-buy-plot-slush" data-plot-id="${plot.id}">
                      Buy (Slush)
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Owned Plots Portfolio -->
          ${player.properties.length > 0 ? `
            <div class="mt-5 pt-4 border-t border-slate-700/80">
              <h3 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Owned Land Holdings</h3>
              <div class="space-y-2">
                ${player.properties.map((prop, idx) => {
                  const mkt = REAL_ESTATE_MARKET.find(p => p.id === prop.plotId);
                  const curVal = mkt ? mkt.currentPrice : prop.purchasePrice;
                  const gain = curVal - prop.purchasePrice;
                  return `
                    <div class="glass-card p-3 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div class="font-bold text-xs text-white">${mkt ? mkt.name : prop.plotId}</div>
                        <div class="text-[10px] text-slate-400 font-mono">
                          Bought at ₹${prop.purchasePrice}L • Current: ₹${curVal}L 
                          <span class="${gain >= 0 ? 'text-emerald-400' : 'text-rose-400'} font-bold">(${gain >= 0 ? '+' : ''}${gain}L)</span>
                        </div>
                      </div>

                      <div class="flex gap-2">
                        <button class="btn-primary text-xs px-3 py-1 rounded-lg btn-sell-plot-white" data-prop-index="${idx}">
                          Sell (White -20% Tax)
                        </button>
                        <button class="btn-secondary text-xs text-amber-400 px-3 py-1 rounded-lg btn-sell-plot-slush" data-prop-index="${idx}">
                          Sell (Full Slush)
                        </button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- SECTION 3: BANKING, LOANS & BONDS -->
        <div class="glass-panel p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <!-- Bank Loans -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-xs font-bold uppercase tracking-wider text-white">Commercial Bank Loans</h3>
                <span class="text-xs font-mono text-emerald-400">Credit Score: ${player.creditScore}/850</span>
              </div>
              <p class="text-[11px] text-slate-400 mb-3">Borrow white money at 1.5% weekly interest. Failure to service weekly interest lowers credit rating.</p>
              
              <div class="grid grid-cols-3 gap-2">
                <button class="btn-secondary py-2 text-xs rounded-lg font-bold text-white hover:border-amber-500 btn-take-loan" data-amount="100">
                  Loan ₹100L
                </button>
                <button class="btn-secondary py-2 text-xs rounded-lg font-bold text-white hover:border-amber-500 btn-take-loan" data-amount="300">
                  Loan ₹300L
                </button>
                <button class="btn-secondary py-2 text-xs rounded-lg font-bold text-white hover:border-amber-500 btn-take-loan" data-amount="500">
                  Loan ₹500L
                </button>
              </div>

              <!-- Active Loans -->
              ${player.loans.length > 0 ? `
                <div class="mt-3 space-y-1.5">
                  ${player.loans.map((l, i) => `
                    <div class="bg-slate-900/80 p-2 rounded border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <div class="font-bold text-white">₹${l.remaining}L Debt</div>
                        <div class="text-[10px] text-rose-400 font-mono">Interest: ₹${l.weeklyInterest}L/wk</div>
                      </div>
                      <button class="btn-secondary text-xs px-2.5 py-1 rounded text-emerald-400 btn-repay-loan" data-loan-index="${i}">
                        Repay Full
                      </button>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>

            <!-- Bonds -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-xs font-bold uppercase tracking-wider text-white">Sovereign & Infra Bonds</h3>
                <span class="text-xs font-mono text-amber-400">Yield: 1.2% - 2.0%/wk</span>
              </div>
              <p class="text-[11px] text-slate-400 mb-3">Park party surplus into bonds to generate steady weekly interest dividends.</p>

              <div class="grid grid-cols-2 gap-2">
                <button id="btn-invest-gold" class="btn-secondary py-2 text-xs rounded-lg font-bold text-amber-300 hover:border-amber-500">
                  +₹50L Gold Bonds
                </button>
                <button id="btn-invest-infra" class="btn-secondary py-2 text-xs rounded-lg font-bold text-blue-300 hover:border-blue-500">
                  +₹50L Infra Bonds
                </button>
              </div>

              <div class="mt-3 bg-slate-900/80 p-2.5 rounded border border-slate-800 text-xs font-mono flex justify-between">
                <span>Holdings:</span>
                <span class="text-slate-200">Gold: ₹${player.bonds.sovereignGold}L • Infra: ₹${player.bonds.infraBonds}L</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    `;

    this.bindEvents();
  },

  bindEvents() {
    // Corporate Trust
    const btnTrust = document.getElementById("btn-corporate-trust");
    if (btnTrust) {
      btnTrust.addEventListener("click", () => {
        const res = financeEngine.acceptCorporateTrust(250);
        gameModal.show({ title: "Corporate Donation Received", message: res.message, type: "cash" });
        this.render();
      });
    }

    // Launder Slush
    const btnLaunder = document.getElementById("btn-launder-slush");
    if (btnLaunder) {
      btnLaunder.addEventListener("click", () => {
        const res = financeEngine.launderSlush(100);
        gameModal.show({ 
          title: res.success ? "Hawala Laundering Concluded" : "Laundering Failed", 
          message: res.message, 
          type: res.success ? "cash" : "danger" 
        });
        this.render();
      });
    }

    // Buy Plots White
    document.querySelectorAll(".btn-buy-plot-white").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-plot-id");
        const res = financeEngine.buyPlot(id, false);
        gameModal.show({
          title: res.success ? "Plot Acquired" : "Transaction Failed",
          message: res.message,
          type: res.success ? "success" : "danger"
        });
        this.render();
      });
    });

    // Buy Plots Slush
    document.querySelectorAll(".btn-buy-plot-slush").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-plot-id");
        const res = financeEngine.buyPlot(id, true);
        gameModal.show({
          title: res.success ? "Benami Land Purchased" : "Transaction Failed",
          message: res.message,
          type: res.success ? "cash" : "danger"
        });
        this.render();
      });
    });

    // Sell Plots White
    document.querySelectorAll(".btn-sell-plot-white").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-prop-index"));
        const res = financeEngine.sellPlot(idx, "white");
        gameModal.show({ title: "Property Liquidated", message: res.message, type: "cash" });
        this.render();
      });
    });

    // Sell Plots Slush
    document.querySelectorAll(".btn-sell-plot-slush").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-prop-index"));
        const res = financeEngine.sellPlot(idx, "slush");
        gameModal.show({ title: "Property Sold for Cash", message: res.message, type: "cash" });
        this.render();
      });
    });

    // Loans
    document.querySelectorAll(".btn-take-loan").forEach(btn => {
      btn.addEventListener("click", () => {
        const amt = parseInt(btn.getAttribute("data-amount"));
        const res = financeEngine.takeLoan(amt);
        gameModal.show({
          title: res.success ? "Commercial Loan Disbursed" : "Loan Rejected",
          message: res.message,
          type: res.success ? "cash" : "danger"
        });
        this.render();
      });
    });

    // Repay loan
    document.querySelectorAll(".btn-repay-loan").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-loan-index"));
        const res = financeEngine.repayLoan(idx);
        gameModal.show({
          title: res.success ? "Loan Repaid" : "Repayment Failed",
          message: res.message,
          type: res.success ? "success" : "danger"
        });
        this.render();
      });
    });

    // Bonds
    const btnGold = document.getElementById("btn-invest-gold");
    if (btnGold) {
      btnGold.addEventListener("click", () => {
        const res = financeEngine.investBonds("sovereignGold", 50);
        gameModal.show({
          title: res.success ? "Bonds Purchased" : "Order Failed",
          message: res.message,
          type: res.success ? "success" : "danger"
        });
        this.render();
      });
    }

    const btnInfra = document.getElementById("btn-invest-infra");
    if (btnInfra) {
      btnInfra.addEventListener("click", () => {
        const res = financeEngine.investBonds("infraBonds", 50);
        gameModal.show({
          title: res.success ? "Infra Bonds Purchased" : "Order Failed",
          message: res.message,
          type: res.success ? "success" : "danger"
        });
        this.render();
      });
    }
  }
};
