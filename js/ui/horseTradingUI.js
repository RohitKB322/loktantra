// UI Component for Post-Election Resort Politics, MLA Auction & 272 Coalition Summit
import { gameState } from "../core/state.js";
import { horseTradingEngine } from "../engines/horseTradingEngine.js";
import { gameModal } from "./gameModal.js";
import { audioEngine } from "../engines/audioEngine.js";

export const horseTradingUI = {
  selectedTargetId: "OTHERS_KINGMAKERS",
  selectedCashLakhs: 40,
  selectedPortfolio: "Cabinet Ministry: Civil Aviation & Tourism",

  // Open the horse trading modal
  open() {
    horseTradingEngine.initSession();
    this.render();
  },

  render() {
    let container = document.getElementById("resort-politics-modal");
    if (!container) {
      container = document.createElement("div");
      container.id = "resort-politics-modal";
      document.body.appendChild(container);
    }

    const pp = horseTradingEngine.getState();
    const player = gameState.getPlayer();

    if (pp.tradingComplete) {
      this.renderSummit(container);
      return;
    }

    const targets = horseTradingEngine.getAvailableAuctionTargets();
    const currentTarget = targets.find(t => t.id === this.selectedTargetId) || targets[0];
    const rivalBid = pp.currentRivalBid;

    const seats = pp.seats;
    const playerSeats = seats.PLAYER;
    const majority = 272;

    // Ensure selected cash is clamped reasonably
    if (this.selectedCashLakhs > player.blackMoney && player.blackMoney > 0) {
      this.selectedCashLakhs = player.blackMoney;
    }

    const portfolioOptions = [
      { value: "Cabinet Ministry: Civil Aviation & Tourism", label: "✈️ Ministry of Civil Aviation & Tourism" },
      { value: "Cabinet Ministry: Railways & Infrastructure", label: "🚆 Ministry of Railways & Heavy Transport" },
      { value: "Cabinet Ministry: Agriculture & Farmer MSP", label: "🌾 Ministry of Agriculture & Rural MSP" },
      { value: "Minister of State (MoS) for Home Affairs", label: "🏛️ Minister of State (MoS) for Home Affairs" },
      { value: "Deputy Speaker of Lok Sabha", label: "⚖️ Deputy Speaker of Lok Sabha" },
      { value: "₹10,000 Cr Special State Development Quota", label: "🏗️ ₹10,000 Cr Special State Development Quota" }
    ];

    container.innerHTML = `
      <div class="fixed inset-0 z-[260] flex items-center justify-center p-2 sm:p-4 bg-slate-950/95 backdrop-blur-xl overflow-y-auto animate-fade-in">
        <div class="modal-content w-full max-w-5xl p-4 sm:p-6 my-auto border-2 border-amber-500/60 shadow-2xl rounded-2xl relative bg-slate-900/95">
          
          <!-- Top Header & Round Progress -->
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div class="flex items-center gap-3">
              <span class="text-3xl sm:text-4xl">🏨</span>
              <div>
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[11px] font-black uppercase tracking-wider font-mono">
                    Round ${pp.round} of 3 • The Midnight Auction
                  </span>
                  ${pp.resortQuarantined ? '<span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">5-STAR RESORT LOCKED</span>' : ''}
                </div>
                <h2 class="text-lg sm:text-2xl font-black text-white tracking-tight mt-0.5">
                  RESORT POLITICS: OPERATION 272
                </h2>
              </div>
            </div>

            <!-- Player War Chest Status -->
            <div class="flex items-center gap-3 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 font-mono text-xs">
              <div>
                <div class="text-[9px] uppercase text-slate-400">Slush Fund</div>
                <div class="text-amber-400 font-bold text-sm">₹${player.blackMoney}L</div>
              </div>
              <div class="border-l border-slate-800 pl-3">
                <div class="text-[9px] uppercase text-slate-400">White Money</div>
                <div class="text-emerald-400 font-bold text-sm">₹${player.whiteMoney}L</div>
              </div>
            </div>
          </div>

          <!-- Visual Parliament Majority Tally Bar -->
          <div class="my-4 bg-slate-950/90 p-3.5 rounded-xl border border-slate-800">
            <div class="flex items-center justify-between text-xs font-mono font-bold mb-1.5">
              <span class="text-white flex items-center gap-1.5">
                <span>Parliament Standings (543 Seats)</span>
                <span class="text-[10px] text-amber-400 font-normal">• 272 to Rule India</span>
              </span>
              <span class="text-amber-400 font-bold">Your Camp: ${playerSeats} MPs</span>
            </div>

            <!-- Multi-party visual progress bar -->
            <div class="w-full bg-slate-800 h-4 rounded-full overflow-hidden flex relative shadow-inner">
              <div class="h-full bg-amber-500 transition-all duration-300" style="width: ${(seats.PLAYER / 543) * 100}%" title="Your Party: ${seats.PLAYER}"></div>
              <div class="h-full bg-orange-600 transition-all duration-300" style="width: ${(seats.NDA / 543) * 100}%" title="NDA: ${seats.NDA}"></div>
              <div class="h-full bg-blue-600 transition-all duration-300" style="width: ${(seats.INDIA / 543) * 100}%" title="INDIA: ${seats.INDIA}"></div>
              <div class="h-full bg-emerald-600 transition-all duration-300" style="width: ${(seats.OTHERS / 543) * 100}%" title="OTHERS: ${seats.OTHERS}"></div>
              <!-- 272 Threshold vertical indicator marker -->
              <div class="absolute top-0 bottom-0 w-0.5 bg-white z-10 shadow-md" style="left: ${(272 / 543) * 100}%" title="272 Majority Mark"></div>
            </div>

            <div class="grid grid-cols-4 gap-2 mt-2 text-center text-[11px] font-mono">
              <div class="text-amber-400 font-bold">You: ${seats.PLAYER}</div>
              <div class="text-orange-400 font-bold">NDA: ${seats.NDA}</div>
              <div class="text-blue-400 font-bold">INDIA: ${seats.INDIA}</div>
              <div class="text-emerald-400 font-bold">OTHERS: ${seats.OTHERS}</div>
            </div>
          </div>

          <!-- Main 2-Column Action Arena: Offense vs Defense -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <!-- LEFT WING: POACH RIVAL MPs / ASK BIDS (Offense) -->
            <div class="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🎯</span> Poach Rival Factions
                  </h3>
                  <span class="text-[10px] px-2 py-0.5 rounded font-mono ${pp.playerPoachedThisRound ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-300'}">
                    ${pp.playerPoachedThisRound ? '✓ Bid Dispatched' : 'Active Bid Ready'}
                  </span>
                </div>

                <!-- Target Faction Selectable Cards -->
                <div class="grid grid-cols-1 gap-2 my-2.5">
                  ${targets.map(t => {
                    const isSelected = this.selectedTargetId === t.id;
                    return `
                      <div class="p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between target-card ${
                        isSelected 
                          ? 'border-amber-400 bg-amber-500/15 ring-1 ring-amber-400/60 shadow-lg' 
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                      }" data-target-id="${t.id}">
                        <div class="flex items-start gap-2.5">
                          <input type="radio" name="auctionTargetRadio" value="${t.id}" ${isSelected ? 'checked' : ''} class="mt-1 target-radio pointer-events-none">
                          <div>
                            <div class="text-xs font-bold ${isSelected ? 'text-amber-400 font-black' : 'text-white'} flex items-center gap-1.5">
                              <span>${t.name}</span>
                              ${isSelected ? '<span class="text-[9px] bg-amber-500/30 text-amber-300 px-1.5 py-0.2 rounded">SELECTED</span>' : ''}
                            </div>
                            <div class="text-[10px] text-slate-400 mt-0.5 leading-tight">${t.description}</div>
                            <div class="text-[10px] text-amber-400/90 font-mono mt-1">Available: ~${t.availableSeats} MPs • ${t.risk}</div>
                          </div>
                        </div>
                        <span class="text-xs font-mono font-bold text-emerald-400 shrink-0">₹${t.minSlushCash}L+</span>
                      </div>
                    `;
                  }).join('')}
                </div>

                <!-- Slush Cash Input & Quick Presets -->
                <div class="mt-3">
                  <div class="flex items-center justify-between text-[11px] font-bold text-slate-300">
                    <span>Suitcase Slush Funds (Black Money)</span>
                    <span class="text-amber-400 font-mono font-black" id="cash-label">₹${this.selectedCashLakhs} Lakhs</span>
                  </div>
                  
                  <input type="range" id="input-bid-cash" min="10" max="${Math.max(20, player.blackMoney)}" step="5" value="${this.selectedCashLakhs}" 
                    class="w-full accent-amber-500 cursor-pointer mt-1" ${pp.playerPoachedThisRound ? 'disabled' : ''}>
                  
                  <!-- Quick Preset Cash Buttons -->
                  <div class="flex items-center gap-1.5 mt-1.5">
                    <span class="text-[10px] text-slate-500 font-mono">Quick:</span>
                    <button type="button" class="btn-preset-cash px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300" data-cash="25">₹25L</button>
                    <button type="button" class="btn-preset-cash px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300" data-cash="50">₹50L</button>
                    <button type="button" class="btn-preset-cash px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300" data-cash="75">₹75L</button>
                    <button type="button" class="btn-preset-cash px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-[10px] font-mono text-amber-300" data-cash="${player.blackMoney}">Max</button>
                  </div>
                </div>

                <!-- Cabinet Portfolio Sweetener Dropdown -->
                <div class="mt-3">
                  <label class="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                    <span>Cabinet Portfolio Sweetener</span>
                    <span class="text-[10px] text-emerald-400 font-mono">+15% Success Chance</span>
                  </label>
                  <select id="select-bid-portfolio" class="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" ${pp.playerPoachedThisRound ? 'disabled' : ''}>
                    ${portfolioOptions.map(opt => `
                      <option value="${opt.value}" ${this.selectedPortfolio === opt.value ? 'selected' : ''}>
                        ${opt.label}
                      </option>
                    `).join('')}
                  </select>
                </div>
              </div>

              <!-- Dispatch Bid Button -->
              <div class="mt-4 pt-3 border-t border-slate-800">
                <button id="btn-dispatch-bid" class="w-full btn-primary py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 ${pp.playerPoachedThisRound ? 'opacity-50 cursor-not-allowed' : ''}">
                  <span>${pp.playerPoachedThisRound ? '✓ Emissary Dispatched This Round' : '💼 Deliver Suitcases & Dispatch Emissary'}</span>
                </button>
              </div>
            </div>

            <!-- RIGHT WING: RIVAL POACHING ALERT & RESORT DEFENSE (Defense) -->
            <div class="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-sm font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🚨</span> Rival Poaching Alert
                  </h3>
                  <span class="text-[10px] px-2 py-0.5 rounded font-mono ${pp.rivalDefendedThisRound ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'}">
                    ${pp.rivalDefendedThisRound ? '✓ Defense Executed' : '⚠️ Defense Required'}
                  </span>
                </div>

                <!-- Active Incursion Details Card -->
                ${rivalBid ? `
                  <div class="p-3.5 rounded-xl bg-slate-900/90 border ${pp.rivalDefendedThisRound ? 'border-emerald-500/40' : 'border-rose-500/40'} mt-2">
                    <div class="flex items-center justify-between text-xs font-bold text-white">
                      <span class="${pp.rivalDefendedThisRound ? 'text-emerald-400' : 'text-rose-400'} font-mono">${rivalBid.rivalName}</span>
                      <span class="text-amber-400 font-mono">Targeting ${rivalBid.targetSeats} of your MPs</span>
                    </div>
                    <p class="text-xs text-slate-300 mt-2 leading-relaxed">
                      Emissaries have secretly approached your <strong class="text-amber-400">${rivalBid.factionLocation}</strong> offering:
                    </p>
                    <div class="mt-2 p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                      <div>💼 Cash Offered: <strong class="text-amber-400">₹${rivalBid.suitcasesLakhs} Lakhs</strong></div>
                      <div>🏛️ Berth: <strong class="text-white">${rivalBid.portfolio}</strong></div>
                    </div>
                  </div>
                ` : `
                  <div class="p-4 text-center text-slate-500 text-xs">No active incursion this round.</div>
                `}

                <!-- Defense Options -->
                <div class="mt-3.5 space-y-2">
                  <div class="text-[11px] font-bold text-slate-300">Choose Your Defensive Counter-Measure:</div>
                  
                  <button type="button" class="w-full text-left p-2.5 rounded-xl border transition-all text-xs btn-defend ${
                    pp.selectedDefenseAction === 'resort_quarantine'
                      ? 'border-emerald-400 bg-emerald-500/20 ring-1 ring-emerald-400'
                      : 'border-slate-700 bg-slate-900/80 hover:border-emerald-400 hover:bg-slate-800'
                  } ${pp.rivalDefendedThisRound ? 'opacity-70' : ''}" 
                    data-action="resort_quarantine">
                    <div class="font-bold text-emerald-400 flex items-center justify-between">
                      <span>🏨 5-Star Resort Lockdown (Bengaluru/Goa)</span>
                      <span class="font-mono text-[10px]">${pp.selectedDefenseAction === 'resort_quarantine' ? '★ ACTIVE' : '₹25L White • 100% Safe'}</span>
                    </div>
                    <div class="text-[10px] text-slate-400 mt-0.5">Charter private planes, seize mobile phones, quarantine MLAs behind resort security.</div>
                  </button>

                  <button type="button" class="w-full text-left p-2.5 rounded-xl border transition-all text-xs btn-defend ${
                    pp.selectedDefenseAction === 'match_cash'
                      ? 'border-amber-400 bg-amber-500/20 ring-1 ring-amber-400'
                      : 'border-slate-700 bg-slate-900/80 hover:border-amber-400 hover:bg-slate-800'
                  } ${pp.rivalDefendedThisRound ? 'opacity-70' : ''}" 
                    data-action="match_cash">
                    <div class="font-bold text-amber-400 flex items-center justify-between">
                      <span>💼 Match Offer with Party Loyalty Bonuses</span>
                      <span class="font-mono text-[10px]">${pp.selectedDefenseAction === 'match_cash' ? '★ ACTIVE' : '~₹30L Slush • 85% Safe'}</span>
                    </div>
                    <div class="text-[10px] text-slate-400 mt-0.5">Disburse emergency suitcase loyalty bonuses directly into MLA accounts.</div>
                  </button>

                  <button type="button" class="w-full text-left p-2.5 rounded-xl border transition-all text-xs btn-defend ${
                    pp.selectedDefenseAction === 'anti_defection_threat'
                      ? 'border-blue-400 bg-blue-500/20 ring-1 ring-blue-400'
                      : 'border-slate-700 bg-slate-900/80 hover:border-blue-400 hover:bg-slate-800'
                  } ${pp.rivalDefendedThisRound ? 'opacity-70' : ''}" 
                    data-action="anti_defection_threat">
                    <div class="font-bold text-blue-400 flex items-center justify-between">
                      <span>📜 Issue 10th Schedule Anti-Defection Whip</span>
                      <span class="font-mono text-[10px]">${pp.selectedDefenseAction === 'anti_defection_threat' ? '★ ACTIVE' : 'Free • 55% Safe'}</span>
                    </div>
                    <div class="text-[10px] text-slate-400 mt-0.5">Threaten immediate disqualification through the Speaker of the House.</div>
                  </button>
                </div>
              </div>

              <!-- Round Progression Indicator -->
              <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span class="text-[11px] text-slate-400 font-mono">
                  ${pp.rivalDefendedThisRound ? '✓ Defense Applied' : '⚠️ Defense Required'}
                </span>
                <button type="button" id="btn-next-trading-round" class="btn-primary py-2.5 px-5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg">
                  ${pp.round < 3 ? `Complete Round ${pp.round} →` : `Enter 272 Coalition Summit 🏛️`}
                </button>
              </div>
            </div>

          </div>

          <!-- Bottom Live Ticker & Operation Feed -->
          <div class="mt-4 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <div class="text-[10px] uppercase font-bold text-slate-400 font-mono mb-1.5 flex items-center justify-between">
              <span>Midnight Teleprompter & Resort Wire Logs</span>
              <span class="text-amber-400 font-mono">LIVE WIRE</span>
            </div>
            <div class="h-16 overflow-y-auto space-y-1 text-[11px] font-mono text-slate-300">
              ${pp.history && pp.history.length > 0 ? pp.history.map(h => `
                <div class="flex items-start gap-2">
                  <span class="text-slate-500">[R${h.round} ${h.time}]</span>
                  <span>${h.text}</span>
                </div>
              `).join('') : '<div class="text-slate-500">All party war rooms are actively tracking luxury hotel bookings in Bengaluru and Jaipur...</div>'}
            </div>
          </div>

        </div>
      </div>
    `;

    this.bindEvents(container);
  },

  bindEvents(container) {
    const pp = horseTradingEngine.getState();
    const player = gameState.getPlayer();
    const targets = horseTradingEngine.getAvailableAuctionTargets();

    // 1. Target Card Click & Selection
    container.querySelectorAll(".target-card").forEach(card => {
      card.addEventListener("click", () => {
        const tid = card.getAttribute("data-target-id");
        if (tid) {
          this.selectedTargetId = tid;
          const t = targets.find(item => item.id === tid);
          if (t && this.selectedCashLakhs < t.minSlushCash) {
            this.selectedCashLakhs = t.minSlushCash;
          }
          this.render();
        }
      });
    });

    // 2. Cash Slider Changes
    const cashInput = document.getElementById("input-bid-cash");
    const cashLabel = document.getElementById("cash-label");
    if (cashInput && cashLabel) {
      cashInput.addEventListener("input", (e) => {
        this.selectedCashLakhs = parseInt(e.target.value);
        cashLabel.textContent = `₹${this.selectedCashLakhs} Lakhs`;
      });
    }

    // 3. Quick Cash Presets
    container.querySelectorAll(".btn-preset-cash").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const val = parseInt(btn.getAttribute("data-cash"));
        this.selectedCashLakhs = Math.max(10, Math.min(player.blackMoney, val));
        const cIn = document.getElementById("input-bid-cash");
        const cLb = document.getElementById("cash-label");
        if (cIn) cIn.value = this.selectedCashLakhs;
        if (cLb) cLb.textContent = `₹${this.selectedCashLakhs} Lakhs`;
      });
    });

    // 4. Portfolio Selection Dropdown
    const portfolioSelect = document.getElementById("select-bid-portfolio");
    if (portfolioSelect) {
      portfolioSelect.addEventListener("change", (e) => {
        this.selectedPortfolio = e.target.value;
      });
    }

    // 5. Dispatch Bid Button
    const btnDispatch = document.getElementById("btn-dispatch-bid");
    if (btnDispatch) {
      btnDispatch.addEventListener("click", () => {
        if (pp.playerPoachedThisRound) {
          gameModal.toast("Emissary already dispatched for this round! Advance to the next round.", "warning");
          return;
        }

        const res = horseTradingEngine.playerBidOnFaction(
          this.selectedTargetId,
          this.selectedCashLakhs,
          this.selectedPortfolio
        );

        gameModal.show({
          title: res.success ? "🏆 Poaching Operation Success!" : "⚠️ Poaching Offer Intercepted",
          message: res.message,
          type: res.success ? "cash" : "warning"
        });

        this.render();
      });
    }

    // 6. Defend Buttons
    container.querySelectorAll(".btn-defend").forEach(btn => {
      btn.addEventListener("click", () => {
        const action = btn.getAttribute("data-action");
        const res = horseTradingEngine.defendRivalBid(action);

        gameModal.show({
          title: res.success ? "🛡️ Defense Successful" : "🚨 Defection Notice",
          message: res.message,
          type: res.success ? "success" : "danger"
        });

        this.render();
      });
    });

    // 7. Complete Round / Next Trading Round Button
    const btnNext = document.getElementById("btn-next-trading-round");
    if (btnNext) {
      btnNext.addEventListener("click", () => {
        if (!pp.rivalDefendedThisRound && pp.currentRivalBid) {
          gameModal.confirm({
            title: "Undefended Defection Risk",
            message: "You haven't chosen a defense against the rival bid! Advancing now will allow rebel MLAs to defect without resistance. Proceed?",
            confirmText: "Advance Anyway",
            cancelText: "Set Defense",
            onConfirm: () => {
              const res = horseTradingEngine.advanceRound();
              if (res.complete) {
                this.renderSummit(container);
              } else {
                this.render();
              }
            }
          });
        } else {
          const res = horseTradingEngine.advanceRound();
          if (res.complete) {
            this.renderSummit(container);
          } else {
            this.render();
          }
        }
      });
    }
  },

  // Render the post-Round-3 Coalition & 272 Majority Summit
  renderSummit(container) {
    const coalitionData = horseTradingEngine.getCoalitionOptions();
    const player = gameState.getPlayer();
    const standings = coalitionData.standings;
    const singleLargest = coalitionData.singleLargest;
    const majority = 272;
    const playerSeats = horseTradingEngine.getState().seats.PLAYER;
    const hasAbsoluteMajority = coalitionData.hasAbsoluteMajority || playerSeats >= majority;
    const isSuperMajority = coalitionData.isSuperMajority || playerSeats >= 362;
    const is400Plus = coalitionData.is400Plus || playerSeats >= 400;
    const singleParty = coalitionData.singlePartyGovernment;

    const canPlayerFormMajority = coalitionData.playerCoalitions && coalitionData.playerCoalitions.length > 0;

    container.innerHTML = `
      <div class="fixed inset-0 z-[260] flex items-center justify-center p-3 sm:p-6 bg-slate-950/95 backdrop-blur-xl overflow-y-auto animate-fade-in">
        <div class="modal-content w-full max-w-4xl p-6 sm:p-8 my-auto border-2 ${hasAbsoluteMajority ? 'border-amber-500/80' : 'border-emerald-500/70'} shadow-2xl rounded-2xl relative bg-slate-900">
          
          <div class="text-center">
            <div class="text-4xl mb-1">${hasAbsoluteMajority ? '👑' : '🏛️'}</div>
            <div class="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-2 ${hasAbsoluteMajority ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'}">
              ${hasAbsoluteMajority ? (is400Plus ? '★ HISTORIC 400+ SEAT TSUNAMI MANDATE' : isSuperMajority ? '★ TWO-THIRDS SUPERMAJORITY MANDATE' : '★ ABSOLUTE SINGLE-PARTY MAJORITY') : 'The 272 Majority Coalition Summit'}
            </div>
            <h2 class="text-2xl sm:text-3xl font-black text-white">
              GOVERNMENT FORMATION AT RASHTRAPATI BHAVAN
            </h2>
            <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl mx-auto">
              ${hasAbsoluteMajority 
                ? (is400Plus 
                    ? 'A historic landslide! The President of India invites you to Rashtrapati Bhavan to take oath as Prime Minister heading an undisputed single-party government.' 
                    : 'You have decisively crossed the 272 majority threshold single-handedly! The President invites you to take oath as Prime Minister heading an independent government.')
                : '3 rounds of intense resort politics and MLA trading have concluded. The President of India invites stakeholders to demonstrate 272 letters of support!'}
            </p>
          </div>

          <!-- Final Seat Tally After Horse Trading -->
          <div class="grid grid-cols-4 gap-2 sm:gap-3 my-6 font-mono text-center">
            ${standings.map(s => `
              <div class="p-3 rounded-xl bg-slate-950 border ${s.isPlayer ? 'border-amber-400 bg-amber-500/10' : 'border-slate-800'}">
                <div class="text-xs font-bold ${s.isPlayer ? 'text-amber-400' : 'text-slate-400'}">${s.name}</div>
                <div class="text-2xl font-black text-white mt-1">${s.seats}</div>
                <div class="text-[10px] text-slate-500">${s.seats >= majority ? '★ MAJORITY' : s.key === singleLargest.key ? 'Single Largest' : 'Seats'}</div>
              </div>
            `).join('')}
          </div>

          <!-- Coalition Options & Alliance Builder -->
          <div class="space-y-4">
            
            <!-- SCENARIO 0: SINGLE-PARTY MAJORITY GOVERNMENT (WHEN PLAYER HAS >= 272 SEATS) -->
            ${hasAbsoluteMajority ? `
              <div class="p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/60 border-2 border-amber-400 shadow-2xl">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <span class="text-2xl">👑</span>
                    <h3 class="text-base font-black text-amber-300 uppercase tracking-wide">
                      ${singleParty ? singleParty.name : `${player.name} Single-Party Majority Government`}
                    </h3>
                  </div>
                  <span class="text-xs font-mono font-bold text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40">
                    ${is400Plus ? '★ 400+ SEATS MANDATE' : isSuperMajority ? '★ TWO-THIRDS MAJORITY' : '★ 272+ ABSOLUTE MAJORITY'}
                  </span>
                </div>

                <p class="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                  ${singleParty ? singleParty.demands : 'You have decisively crossed the 272 mark single-handedly! You do NOT need any coalition partners, outside support, or cabinet compromises.'}
                </p>

                <div class="pt-3 border-t border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div class="text-xs text-amber-200/90 font-mono">
                    <strong>Lok Sabha Strength:</strong> <span class="text-white font-bold text-sm">${playerSeats}</span> / 543 Seats (Independent Mandate)
                  </div>

                  <button type="button" class="btn-primary py-3 px-6 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider shrink-0 btn-seal-coalition shadow-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 border border-amber-300 cursor-pointer"
                    data-alliance-name="${player.name} (Single-Party Government)"
                    data-seats="${playerSeats}"
                    data-role="PRIME_MINISTER"
                    data-allies="">
                    Form Single-Party Government as Prime Minister 🇮🇳
                  </button>
                </div>
              </div>
            ` : ''}

            <!-- SCENARIO 1: PLAYER CAN LEAD THE COALITION (OPTIONAL IF MAJORITY, REQUIRED IF NOT) -->
            ${canPlayerFormMajority ? `
              <div class="p-4 rounded-xl ${hasAbsoluteMajority ? 'bg-slate-950/70 border border-slate-800' : 'bg-emerald-950/40 border border-emerald-500/60'}">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-sm font-black ${hasAbsoluteMajority ? 'text-slate-300' : 'text-emerald-400'} uppercase tracking-wide flex items-center gap-2">
                    <span>${hasAbsoluteMajority ? '🌐' : '👑'}</span>
                    ${hasAbsoluteMajority ? '(Optional) Invite Regional Partners for National Unity Front' : 'Forge Your Governing Coalition (You Become Prime Minister)'}
                  </h3>
                  <span class="text-xs font-mono ${hasAbsoluteMajority ? 'text-slate-400 bg-slate-800' : 'text-emerald-300 bg-emerald-500/20'} px-2 py-0.5 rounded border ${hasAbsoluteMajority ? 'border-slate-700' : 'border-emerald-500/30'}">
                    ${hasAbsoluteMajority ? 'Optional Alliance' : '272+ Achievable'}
                  </span>
                </div>
                <p class="text-xs text-slate-400 mb-3">
                  ${hasAbsoluteMajority 
                    ? 'You already have an absolute majority. However, you may optionally include allies to build a broad national consensus:' 
                    : 'Partner with the closest ideological or regional blocs to surpass the 272 mark and claim the Prime Minister\'s Office:'}
                </p>

                <div class="space-y-2.5">
                  ${coalitionData.playerCoalitions.map(c => `
                    <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div class="text-sm font-bold text-white flex items-center gap-2">
                          <span>${c.name}</span>
                          <span class="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                            ${c.combinedSeats} / 272 Seats
                          </span>
                        </div>
                        <div class="text-[11px] text-slate-400 mt-1">
                          <strong>Allies:</strong> ${c.allies.join(', ')} • <strong>Demands:</strong> ${c.demands}
                        </div>
                      </div>

                      <button type="button" class="btn-primary py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 btn-seal-coalition"
                        data-alliance-name="${c.name}" data-seats="${c.combinedSeats}" data-role="PRIME_MINISTER" data-allies="${c.allies.join(',')}">
                        ${hasAbsoluteMajority ? 'Form National Unity Front 🇮🇳' : 'Swear In as Prime Minister 🇮🇳'}
                      </button>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- SCENARIO 2: RIVAL AI EXTENDS AN INVITATION TO PLAYER (ONLY IF PLAYER DOES NOT HAVE ABSOLUTE MAJORITY) -->
            ${!hasAbsoluteMajority && coalitionData.rivalInviteToPlayer ? `
              <div class="p-4 rounded-xl bg-blue-950/40 border border-blue-500/60">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-sm font-black text-blue-400 uppercase tracking-wide flex items-center gap-2">
                    <span>🤝</span> Official Coalition Offer from ${coalitionData.rivalInviteToPlayer.invitingParty}
                  </h3>
                  <span class="text-xs font-mono text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded">Combined: ${coalitionData.rivalInviteToPlayer.combinedSeats} Seats</span>
                </div>
                <p class="text-xs text-slate-300 leading-relaxed">
                  ${coalitionData.rivalInviteToPlayer.invitingParty} needs your parliamentary weight to seal an iron-clad majority. They formally offer you the position of <strong class="text-white">${coalitionData.rivalInviteToPlayer.offeredRole}</strong>.
                </p>
                <div class="mt-2 text-[11px] text-amber-400 font-mono">
                  ★ Perks: ${coalitionData.rivalInviteToPlayer.benefits}
                </div>

                <div class="flex gap-3 mt-3">
                  <button type="button" class="btn-primary py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider btn-seal-coalition flex-1"
                    data-alliance-name="National Unity Front" data-seats="${coalitionData.rivalInviteToPlayer.combinedSeats}" data-role="DEPUTY_PM" data-allies="NDA">
                    Accept & Enter Government as Deputy PM 🏛️
                  </button>
                </div>
              </div>
            ` : ''}

            <!-- SCENARIO 3: SIT AS PRINCIPAL LEADER OF OPPOSITION (ONLY IF PLAYER DOES NOT HAVE ABSOLUTE MAJORITY) -->
            ${!hasAbsoluteMajority ? `
              <div class="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider">Lead the Opposition in Lok Sabha</h4>
                    <p class="text-[11px] text-slate-400 mt-0.5">
                      Refuse coalition compromises. Sit as the Leader of Opposition, grill the treasury benches, and launch Floor Tests!
                    </p>
                  </div>
                  <button type="button" class="btn-secondary py-2 px-4 rounded-xl text-xs font-bold text-slate-300 hover:text-white shrink-0 btn-seal-coalition"
                    data-alliance-name="Governing Coalition" data-seats="${standings[0].seats}" data-role="OPPOSITION" data-allies="">
                    Take Oath as Opposition Leader ⚖️
                  </button>
                </div>
              </div>
            ` : ''}

          </div>

        </div>
      </div>
    `;

    // Bind Coalition Finalization Buttons
    container.querySelectorAll(".btn-seal-coalition").forEach(btn => {
      btn.addEventListener("click", () => {
        const allianceName = btn.getAttribute("data-alliance-name");
        const governingSeats = parseInt(btn.getAttribute("data-seats"));
        const role = btn.getAttribute("data-role");
        const alliesRaw = btn.getAttribute("data-allies");
        const allies = alliesRaw ? alliesRaw.split(",").filter(Boolean) : [];

        horseTradingEngine.finalizeGovernment({
          role,
          allianceName,
          governingSeats,
          allies
        });

        // Close modal
        container.remove();

        // Switch to PMO tab if player is Prime Minister
        if (role === "PRIME_MINISTER" && window.loktantraApp) {
          window.loktantraApp.switchTab("pmo");
        }

        const isSingleParty = allies.length === 0;

        gameModal.show({
          title: role === "PRIME_MINISTER" ? "🇮🇳 Prime Minister of India" : role === "DEPUTY_PM" ? "🏛️ Union Cabinet Sworn In" : "⚖️ Leader of the Opposition",
          message: role === "PRIME_MINISTER"
            ? (isSingleParty
                ? `Congratulations! You have taken the oath of office at Rashtrapati Bhavan as the Prime Minister of India heading an absolute single-party government (${allianceName}) with an unassailable mandate of ${governingSeats} Lok Sabha seats! Your term of national governance begins now.`
                : `Congratulations! You have taken the oath of office at Rashtrapati Bhavan as the Prime Minister of India heading the ${allianceName} with ${governingSeats} seats! Your first term of governance now begins.`)
            : role === "DEPUTY_PM"
            ? `You have joined the Union Cabinet as Deputy Prime Minister! Managing coalition allies and national governance begins now.`
            : `You have taken your seat in Parliament as the Leader of the Opposition! Hold the government accountable and challenge them on the floor of the House.`,
          type: "success"
        });
      });
    });
  }
};
