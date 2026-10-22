// TAB 4: Media, News Channels, Prime-Time Debates & PR Warfare
import { gameState } from "../core/state.js";
import { mediaEngine, NEWS_CHANNELS } from "../engines/mediaEngine.js";

export const tab4_mediaUI = {
  render() {
    const container = document.getElementById("tab-pane-media");
    if (!container) return;

    const player = gameState.getPlayer();

    container.innerHTML = `
      <div class="space-y-5">
        
        <!-- SECTION 1: MEDIA ECOSYSTEM & NEWS CHANNELS -->
        <div class="glass-panel p-4">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h2 class="text-sm font-black uppercase tracking-wider text-white">Broadcast Media Ecosystem & TRP</h2>
              <p class="text-xs text-slate-400">Prime-time television shapes the national narrative. Buy ad slots or participate in hostile studio debates.</p>
            </div>
            <div class="text-xs font-mono text-slate-400">
              Spokesperson Charisma: <b class="text-amber-400">${player.spokespersonCharisma || 60}/100</b>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            ${NEWS_CHANNELS.map(ch => `
              <div class="glass-card p-3.5 flex flex-col justify-between" style="border-top: 3px solid ${ch.color}">
                <div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-white">${ch.name}</span>
                    <span class="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-amber-500/10 text-amber-400">
                      TRP ${ch.trp}
                    </span>
                  </div>

                  <div class="text-[11px] text-slate-400 mt-1">
                    Anchor: <b class="text-slate-200">${ch.anchor}</b>
                  </div>
                  <div class="text-[10px] text-slate-400 mt-0.5">
                    Lean: <span class="text-slate-300 font-medium">${ch.lean}</span>
                  </div>
                  <div class="text-[10px] text-slate-400 mt-0.5">
                    Target: <span class="text-slate-300">${ch.audience}</span>
                  </div>

                  <!-- Integrity Meter -->
                  <div class="mt-2.5">
                    <div class="flex justify-between text-[10px] font-mono mb-1">
                      <span class="text-slate-400">Journalistic Integrity:</span>
                      <span class="${ch.integrity > 70 ? 'text-rose-400' : 'text-emerald-400'} font-bold">
                        ${ch.integrity > 70 ? 'High (Bribe Risk!)' : ch.integrity > 40 ? 'Moderate' : 'Malleable'}
                      </span>
                    </div>
                    <div class="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                      <div class="h-full rounded-full ${ch.integrity > 70 ? 'bg-rose-500' : 'bg-emerald-500'}"
                        style="width: ${ch.integrity}%;"></div>
                    </div>
                  </div>
                </div>

                <!-- Media Operations Buttons -->
                <div class="mt-3 pt-2.5 border-t border-slate-700/60 flex flex-col gap-1.5">
                  <div class="flex gap-2">
                    <button class="flex-1 btn-primary py-1.5 text-xs rounded-lg font-semibold btn-buy-ads" data-channel-id="${ch.id}">
                      Buy Ads (₹${ch.adCostPerWeek * 2}L)
                    </button>
                    <button class="flex-1 btn-secondary py-1.5 text-xs text-blue-300 rounded-lg font-semibold hover:bg-blue-500/20 btn-send-spokesperson" data-channel-id="${ch.id}">
                      9 PM Debate
                    </button>
                  </div>

                  <!-- Covert PR / Envelope Journalism -->
                  <button class="w-full btn-secondary py-1 text-[11px] text-amber-400 rounded-lg font-mono btn-envelope-pr" data-channel-id="${ch.id}">
                    Envelope Journalism (₹60L Slush)
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- SECTION 2: BREAKING NEWS TICKER & WIRE ARCHIVE -->
        <div class="glass-panel p-4">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h2 class="text-sm font-black uppercase tracking-wider text-white">Election Wire & News Log</h2>
              <p class="text-xs text-slate-400">Live coverage of campaign events, financial revelations, and voter swing shifts.</p>
            </div>
            <span class="text-xs font-mono text-slate-400">Updates in real time</span>
          </div>

          <div class="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            ${gameState.newsLog.map(item => `
              <div class="glass-card p-3 border-l-2 ${item.category === 'SCANDAL' ? 'border-l-rose-500' : item.category === 'CAMPAIGN' ? 'border-l-amber-500' : 'border-l-blue-500'}">
                <div class="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span class="font-bold text-amber-400">${item.channel}</span>
                  <span>Week ${item.turn} • ${item.time || ''}</span>
                </div>
                <div class="text-xs font-bold text-white mt-1">${item.headline}</div>
                ${item.impactSummary ? `<div class="text-[11px] text-slate-400 mt-0.5">${item.impactSummary}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;

    this.bindEvents();
  },

  bindEvents() {
    // Buy Ads
    document.querySelectorAll(".btn-buy-ads").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-channel-id");
        const res = mediaEngine.buyAdCampaign(id, 2);
        if (res.success) this.render();
        else alert(res.message);
      });
    });

    // Send Spokesperson to Debate
    document.querySelectorAll(".btn-send-spokesperson").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-channel-id");
        const res = mediaEngine.sendSpokespersonToDebate(id);
        alert(res.message);
        this.render();
      });
    });

    // Covert PR Bribe
    document.querySelectorAll(".btn-envelope-pr").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-channel-id");
        const choice = confirm("Spend ₹60L Slush cash for Envelope Journalism?\n\nOK = Plant smear on opposition.\nCancel = Attempt to suppress pending scandals.");
        const action = choice ? "plant_rival_scandal" : "suppress_scandal";
        const res = mediaEngine.attemptCovertPRBribe(id, action);
        alert(res.message);
        this.render();
      });
    });
  }
};
