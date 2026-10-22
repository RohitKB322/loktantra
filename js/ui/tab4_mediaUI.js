// TAB 4: Indian Prime-Time TV Studio, Anchor Speech Bubbles & 9 PM Debate Arena (Version 0.3)
import { gameState } from "../core/state.js";
import { mediaEngine, NEWS_CHANNELS } from "../engines/mediaEngine.js";
import { audioEngine } from "../engines/audioEngine.js";
import { gameModal } from "./gameModal.js";

// Illustrated Anchor Profiles with Caricatures & Flavor Quotes
const ANCHOR_PROFILES = {
  bharat_tv: {
    avatar: "🎙️🔥",
    tagline: "THE NATION WANTS TO KNOW!",
    quote: (player) => `Breaking news! Are ${player.name} secret war chests funding election rallies in the heartland? The nation demands answers tonight at 9 PM!`,
    panelist: "Sambit Patra (NDA)",
    expert: "Maj. Gen. GD Bakshi"
  },
  janata_awaaz: {
    avatar: "🌾🚜",
    tagline: "KISAN KI AWAZ, JANATA KA RAAJ",
    quote: (player) => `While corporate jets fly high in New Delhi, grassroots workers of ${player.name} face rising mandi prices and water scarcity. Who will deliver MSP?`,
    panelist: "Rakesh Tikait (BKU)",
    expert: "Yogendra Yadav"
  },
  metro_biz: {
    avatar: "📈💼",
    tagline: "DALAL STREET 24X7",
    quote: (player) => `Sensex gains 450 points on poll stability expectations. Dalal Street closely analyzes fiscal consequences of ${player.name}'s latest manifesto promises.`,
    panelist: "Sanjiv Bhasin (Equities)",
    expert: "Swaminathan Aiyar"
  },
  digital_wire: {
    avatar: "🔍⚡",
    tagline: "INDEPENDENT • INVESTIGATIVE • UNFILTERED",
    quote: (player) => `Exclusive investigative scoop: Leaked documents reveal high-stakes land parcels and campaign slush exposure surrounding upcoming swing constituencies.`,
    panelist: "Prashant Bhushan (SC Lawyer)",
    expert: "Aruna Roy (RTI Activist)"
  },
  prasar_vani: {
    avatar: "📡🏛️",
    tagline: "NATIONAL BROADCASTER • SAMACHAR",
    quote: (player) => `Namaskar. General Election voting arrangements underway across 543 Lok Sabha constituencies. All political parties observe Model Code of Conduct.`,
    panelist: "ECI Spokesperson",
    expert: "SY Quraishi (Ex-CEC)"
  }
};

export const tab4_mediaUI = {
  currentChannelId: "bharat_tv",
  activeDebate: null, // holds state if a debate mini-game is in progress

  render() {
    const container = document.getElementById("tab-pane-media");
    if (!container) return;

    const player = gameState.getPlayer();
    const ch = NEWS_CHANNELS.find(c => c.id === this.currentChannelId) || NEWS_CHANNELS[0];
    const profile = ANCHOR_PROFILES[ch.id] || ANCHOR_PROFILES.bharat_tv;

    container.innerHTML = `
      <div class="space-y-5">
        
        <!-- SECTION 1: INTERACTIVE PRIME-TIME TV STUDIO -->
        <div class="glass-panel p-4 border-2" style="border-color: ${ch.color}50">
          
          <!-- TV Header & Channel Switcher Buttons -->
          <div class="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-700/80">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-rose-600 animate-ping"></span>
              <span class="text-xs font-black uppercase tracking-wider text-rose-500">LIVE PRIME-TIME BROADCAST</span>
            </div>

            <!-- Channel Selector Pills -->
            <div class="flex flex-wrap gap-1.5" id="tv-channel-selector">
              ${NEWS_CHANNELS.map(c => `
                <button class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all btn-switch-channel ${c.id === ch.id ? 'bg-amber-500 text-slate-950 shadow-md scale-105' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}"
                  data-channel-id="${c.id}">
                  ${c.name.split(' ')[0]}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- THE ANIMATED TV SCREEN FRAME -->
          <div class="relative rounded-2xl overflow-hidden border-4 border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-black p-4 sm:p-6 shadow-2xl">
            
            <!-- Channel Watermark & TRP -->
            <div class="flex items-center justify-between mb-3 text-xs font-mono">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded font-black text-white" style="background-color: ${ch.color}">
                  ${ch.name.toUpperCase()}
                </span>
                <span class="text-slate-400 text-[10px] hidden sm:inline">${profile.tagline}</span>
              </div>
              <div class="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-amber-400 font-bold">
                ★ TRP: ${ch.trp} (9 PM Slot)
              </div>
            </div>

            <!-- Anchor Avatar & Dynamic Speech Bubble -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center my-4">
              
              <!-- Anchor Caricature Avatar -->
              <div class="md:col-span-4 flex flex-col items-center text-center">
                <div class="w-24 h-24 rounded-full border-4 flex items-center justify-center text-4xl shadow-xl transition-transform hover:scale-110"
                  style="border-color: ${ch.color}; background: radial-gradient(circle, ${ch.color}30 0%, #090d16 80%)">
                  ${profile.avatar}
                </div>
                <div class="font-black text-sm text-white mt-2">${ch.anchor}</div>
                <div class="text-[10px] text-slate-400 font-mono">${ch.lean}</div>
              </div>

              <!-- Animated Speech Bubble -->
              <div class="md:col-span-8">
                <div class="relative bg-slate-900/90 border-2 rounded-2xl p-4 shadow-lg text-slate-100 text-xs sm:text-sm leading-relaxed"
                  style="border-color: ${ch.color}">
                  <!-- Speech Bubble Arrow -->
                  <div class="hidden md:block absolute -left-3 top-6 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8"
                    style="border-r-color: ${ch.color}"></div>

                  <p class="font-medium italic">
                    "${profile.quote(player)}"
                  </p>

                  <div class="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                    <span>Target Audience: <b class="text-slate-200">${ch.audience}</b></span>
                    <span>Integrity: <b class="${ch.integrity > 65 ? 'text-rose-400' : 'text-emerald-400'}">${ch.integrity}/100</b></span>
                  </div>
                </div>
              </div>

            </div>

            <!-- TV Action Console Bar -->
            <div class="mt-4 pt-3 border-t border-slate-800 flex flex-wrap gap-2 justify-between items-center">
              <div class="flex gap-2">
                <button id="btn-start-debate" class="btn-primary px-3 sm:px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                  <span>🎙️ Join 9 PM Debate Arena</span>
                </button>
                <button id="btn-buy-channel-ads" class="btn-secondary px-3 py-2 rounded-xl text-xs font-bold text-white hover:border-amber-500">
                  Buy Ad Slots (₹${ch.adCostPerWeek * 2}L)
                </button>
              </div>

              <button id="btn-envelope-bribe" class="btn-secondary px-3 py-2 rounded-xl text-xs text-amber-400 font-mono font-bold hover:bg-amber-500/10">
                Envelope Journalism (₹60L Slush)
              </button>
            </div>

          </div>

          <!-- THE 9 PM DEBATE ARENA MODAL / MINI-GAME -->
          ${this.activeDebate ? this.renderDebateArena() : ''}

        </div>

        <!-- SECTION 2: LIVE BROADCAST WIRE & ARCHIVE -->
        <div class="glass-panel p-4">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h2 class="text-sm font-black uppercase tracking-wider text-white">Election News Wire & Live Ticker Log</h2>
              <p class="text-xs text-slate-400">All breaking alerts generated dynamically across the national media ecosystem.</p>
            </div>
            <span class="text-xs font-mono text-slate-400 font-bold">${gameState.newsLog.length} Reports</span>
          </div>

          <div class="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            ${gameState.newsLog.map(item => `
              <div class="glass-card p-3 border-l-4 ${item.category === 'SCANDAL' ? 'border-l-rose-500' : item.category === 'POLL' ? 'border-l-amber-500' : item.category === 'CAMPAIGN' ? 'border-l-emerald-500' : 'border-l-blue-500'}">
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

  // Render Interactive 4-Panel 9 PM Debate Arena Mini-Game
  renderDebateArena() {
    const debate = this.activeDebate;
    const player = gameState.getPlayer();
    const ch = NEWS_CHANNELS.find(c => c.id === this.currentChannelId) || NEWS_CHANNELS[0];
    const profile = ANCHOR_PROFILES[ch.id] || ANCHOR_PROFILES.bharat_tv;

    return `
      <div class="fixed inset-0 z-[220] flex items-center justify-center p-3 sm:p-6 bg-slate-950/95 backdrop-blur-md overflow-y-auto animate-fade-in">
        <div class="modal-content w-full max-w-3xl p-5 sm:p-7 my-auto border-2 border-rose-500/60 shadow-2xl">
          
          <!-- Debate Header -->
          <div class="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
            <div>
              <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600 text-[10px] font-black uppercase tracking-wider text-white">
                <span class="w-2 h-2 rounded-full bg-white animate-ping"></span>
                9 PM PRIME-TIME WAR ROOM
              </div>
              <h3 class="text-lg font-black text-white mt-1">${ch.name}: Super Debate</h3>
            </div>
            <div class="text-right">
              <div class="text-[10px] uppercase font-mono text-slate-400">Decibel / Shouting Level</div>
              <div class="text-sm font-black text-rose-400 font-mono">${debate.decibels} dB 🔊</div>
            </div>
          </div>

          <!-- 4-PANEL SHOUTING SCREEN -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            
            <!-- Panel 1: The Anchor -->
            <div class="bg-slate-900 border-2 border-rose-500/50 rounded-xl p-2.5 text-center flex flex-col justify-between">
              <div>
                <div class="text-2xl">${profile.avatar}</div>
                <div class="font-bold text-xs text-white mt-1">${ch.anchor}</div>
                <div class="text-[9px] text-rose-400 font-mono uppercase font-bold">Anchor (Aggressive)</div>
              </div>
              <div class="text-[10px] text-slate-300 mt-2 italic bg-slate-950 p-1.5 rounded">
                "Answer the direct question! No dodging!"
              </div>
            </div>

            <!-- Panel 2: Player's Spokesperson -->
            <div class="bg-slate-900 border-2 rounded-xl p-2.5 text-center flex flex-col justify-between" style="border-color: ${player.color}">
              <div>
                <div class="text-2xl">🗣️</div>
                <div class="font-bold text-xs text-white mt-1">${player.name}</div>
                <div class="text-[9px] text-amber-400 font-mono uppercase font-bold">Your Spokesperson</div>
              </div>
              <div class="text-[10px] text-slate-300 mt-2 italic bg-slate-950 p-1.5 rounded">
                "We speak for the 140 Crore citizens of India!"
              </div>
            </div>

            <!-- Panel 3: Rival Party Panelist -->
            <div class="bg-slate-900 border-2 border-orange-500/50 rounded-xl p-2.5 text-center flex flex-col justify-between">
              <div>
                <div class="text-2xl">⚡</div>
                <div class="font-bold text-xs text-white mt-1">${profile.panelist}</div>
                <div class="text-[9px] text-orange-400 font-mono uppercase font-bold">Rival Opposition</div>
              </div>
              <div class="text-[10px] text-slate-300 mt-2 italic bg-slate-950 p-1.5 rounded">
                "Complete election stunt! Zero delivery on the ground!"
              </div>
            </div>

            <!-- Panel 4: Neutral Analyst -->
            <div class="bg-slate-900 border-2 border-slate-700 rounded-xl p-2.5 text-center flex flex-col justify-between">
              <div>
                <div class="text-2xl">🧐</div>
                <div class="font-bold text-xs text-white mt-1">${profile.expert}</div>
                <div class="text-[9px] text-blue-400 font-mono uppercase font-bold">Senior Analyst</div>
              </div>
              <div class="text-[10px] text-slate-300 mt-2 italic bg-slate-950 p-1.5 rounded">
                "Swing states will clearly determine who forms government."
              </div>
            </div>

          </div>

          <!-- DEBATE RESPONSE CARDS (3 Tactical Choices) -->
          <div class="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <div class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Anchor asks: <span class="text-amber-300">"${debate.question}"</span>
            </div>

            <div class="space-y-2 mt-3">
              ${debate.options.map((opt, i) => `
                <button class="w-full text-left p-3 rounded-lg border border-slate-700 bg-slate-900 hover:border-amber-400 hover:bg-slate-800/90 transition-all text-xs btn-debate-choice"
                  data-choice-index="${i}">
                  <div class="font-bold text-white flex items-center justify-between">
                    <span>${opt.label}</span>
                    <span class="text-[10px] font-mono text-amber-400">${opt.strategy}</span>
                  </div>
                  <div class="text-[11px] text-slate-400 mt-1">${opt.dialogue}</div>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="mt-4 flex justify-end">
            <button id="btn-abort-debate" class="btn-secondary px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white">
              Walk Out of Studio
            </button>
          </div>

        </div>
      </div>
    `;
  },

  bindEvents() {
    // Switch channel buttons
    document.querySelectorAll(".btn-switch-channel").forEach(btn => {
      btn.addEventListener("click", () => {
        this.currentChannelId = btn.getAttribute("data-channel-id");
        audioEngine.playBreakingNews();
        this.render();
      });
    });

    // Start Debate Mini-Game
    const btnDebate = document.getElementById("btn-start-debate");
    if (btnDebate) {
      btnDebate.addEventListener("click", () => {
        audioEngine.playDebateBell();
        this.activeDebate = {
          decibels: 92,
          question: "How does your party plan to fund its welfare promises without plunging the state treasury into irreversible debt?",
          options: [
            {
              label: "Aggressive Counter-Attack",
              strategy: "Decibel +15 dB • Fires up loyal base",
              dialogue: "Why didn't you ask this question when the ruling party waived corporate loans worth Lakhs of Crores?! The nation is watching your selective journalism!",
              successChance: 0.75,
              approvalGain: 2.5
            },
            {
              label: "Populist Deflection to Farmers & Youth",
              strategy: "Decibel +8 dB • Broad public appeal",
              dialogue: "Welfare for our hardworking kisan and youth is an investment in Bharat's future, not a freebie! We will plug corruption leakages!",
              successChance: 0.85,
              approvalGain: 2.0
            },
            {
              label: "Calm Constitutional & Economic Data Defense",
              strategy: "Decibel -10 dB • Wins educated urban voters",
              dialogue: "Our white-paper strictly adheres to the 3% Fiscal Responsibility FRBM limits by expanding the state GST revenue base.",
              successChance: 0.65,
              approvalGain: 1.5
            }
          ]
        };
        this.render();
      });
    }

    // Handle debate choice
    document.querySelectorAll(".btn-debate-choice").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-choice-index"));
        const opt = this.activeDebate.options[idx];
        const player = gameState.getPlayer();

        if (Math.random() < opt.successChance) {
          audioEngine.playFanfare();
          player.nationalApproval = Math.min(85, player.nationalApproval + opt.approvalGain);
          player.spokespersonCharisma = Math.min(95, (player.spokespersonCharisma || 60) + 4);
          gameModal.show({
            title: "🏆 DEBATE VICTORY!",
            message: `Your spokesperson silenced the panel with thunderous applause! National approval jumped by +${opt.approvalGain}%. Spokesperson Charisma rose to ${player.spokespersonCharisma}.`,
            type: "success"
          });
        } else {
          audioEngine.playDebateBell();
          player.nationalApproval = Math.max(5, player.nationalApproval - 1.5);
          gameModal.show({
            title: "⚠️ SHOUTING OVERWHELMED!",
            message: `The panel ganged up and drowned out your mic with aggressive interruptions. Approval slipped by -1.5%.`,
            type: "warning"
          });
        }

        this.activeDebate = null;
        this.render();
      });
    });

    // Abort debate
    const btnAbort = document.getElementById("btn-abort-debate");
    if (btnAbort) {
      btnAbort.addEventListener("click", () => {
        this.activeDebate = null;
        this.render();
      });
    }

    // Buy Ads
    const btnAds = document.getElementById("btn-buy-channel-ads");
    if (btnAds) {
      btnAds.addEventListener("click", () => {
        const res = mediaEngine.buyAdCampaign(this.currentChannelId, 2);
        gameModal.show({
          title: res.success ? "📺 Campaign Blitz Launched" : "⚠️ Ad Purchase Failed",
          message: res.message,
          type: res.success ? "cash" : "warning"
        });
        this.render();
      });
    }

    // Envelope Bribe
    const btnBribe = document.getElementById("btn-envelope-bribe");
    if (btnBribe) {
      btnBribe.addEventListener("click", () => {
        gameModal.confirm({
          title: "Envelope Journalism (Covert PR)",
          message: "Spend ₹60L Slush Cash to covertly manipulate prime-time broadcasts?\n\nProceed to plant a damaging leak on rival opposition, or cancel to keep your war chest intact.",
          confirmText: "🎯 Plant Rival Leak",
          cancelText: "Keep Cash",
          onConfirm: () => {
            const res = mediaEngine.attemptCovertPRBribe(this.currentChannelId, "plant_rival_scandal");
            gameModal.show({
              title: res.success ? "💼 Covert Op Successful" : "🚨 Whistleblower Alert!",
              message: res.message,
              type: res.success ? "danger" : "warning"
            });
            this.render();
          }
        });
      });
    }
  }
};
