// Application Entry Point, Tab Router & Master Game Loop
import { gameState } from "./core/state.js";
import { saveManager } from "./core/saveManager.js";
import { hudRenderer } from "./ui/hudRenderer.js";
import { tab1_mapUI } from "./ui/tab1_mapUI.js";
import { tab2_partyUI } from "./ui/tab2_partyUI.js";
import { tab3_financeUI } from "./ui/tab3_financeUI.js";
import { tab4_mediaUI } from "./ui/tab4_mediaUI.js";
import { startScreen } from "./ui/startScreen.js";
import { mapEngine } from "./engines/mapEngine.js";

class LoktantraApp {
  constructor() {
    this.currentTab = "map";
  }

  init() {
    console.log("Initializing Loktantra: The Indian Election Simulator...");

    // Check if auto-save exists
    if (!saveManager.hasAutoSave()) {
      // First time launch: open wizard
      startScreen.render();
    } else {
      // Auto-load last session
      saveManager.loadAutoSave();
    }

    // Initial calculations
    mapEngine.recalculateAllProjections();

    // Render components
    this.renderAll();

    // Setup Navigation & Router
    this.setupNavigation();

    // Subscribe to central state changes
    gameState.subscribe((state, changeEvent) => {
      this.handleStateUpdate(state, changeEvent);
    });

    // Keyboard shortcuts (Space = Next turn, 1-4 = Switch Tabs)
    window.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") return;

      if (e.code === "Digit1") this.switchTab("map");
      if (e.code === "Digit2") this.switchTab("campaign");
      if (e.code === "Digit3") this.switchTab("finance");
      if (e.code === "Digit4") this.switchTab("media");
    });
  }

  renderAll() {
    hudRenderer.render();
    this.renderCurrentTab();
    this.updateBreakingTicker();
  }

  renderCurrentTab() {
    switch (this.currentTab) {
      case "map":
        tab1_mapUI.render();
        break;
      case "campaign":
        tab2_partyUI.render();
        break;
      case "finance":
        tab3_financeUI.render();
        break;
      case "media":
        tab4_mediaUI.render();
        break;
    }
  }

  setupNavigation() {
    // Mobile Bottom Nav
    const mobileNavItems = document.querySelectorAll("#mobile-bottom-nav .nav-item");
    mobileNavItems.forEach(item => {
      item.addEventListener("click", () => {
        const tab = item.getAttribute("data-tab");
        if (tab) this.switchTab(tab);
      });
    });

    // Desktop Tab Nav buttons
    const desktopContainer = document.getElementById("desktop-tab-nav");
    if (desktopContainer) {
      desktopContainer.innerHTML = `
        <button class="desktop-nav-btn px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${this.currentTab === 'map' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-slate-400 hover:text-white'}" data-tab="map">
          🗺️ War Room
        </button>
        <button class="desktop-nav-btn px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${this.currentTab === 'campaign' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-slate-400 hover:text-white'}" data-tab="campaign">
          📢 Campaign
        </button>
        <button class="desktop-nav-btn px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${this.currentTab === 'finance' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-slate-400 hover:text-white'}" data-tab="finance">
          💰 Treasury
        </button>
        <button class="desktop-nav-btn px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${this.currentTab === 'media' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-slate-400 hover:text-white'}" data-tab="media">
          📺 Media War
        </button>
      `;

      desktopContainer.querySelectorAll(".desktop-nav-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const tab = btn.getAttribute("data-tab");
          if (tab) this.switchTab(tab);
        });
      });
    }
  }

  switchTab(tabName) {
    this.currentTab = tabName;

    // Toggle Tab Panes visibility
    document.querySelectorAll(".tab-content").forEach(pane => {
      pane.classList.remove("active");
    });
    const activePane = document.getElementById(`tab-pane-${tabName}`);
    if (activePane) activePane.classList.add("active");

    // Toggle active state in mobile nav
    document.querySelectorAll("#mobile-bottom-nav .nav-item").forEach(item => {
      if (item.getAttribute("data-tab") === tabName) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Update Desktop Nav styles
    document.querySelectorAll(".desktop-nav-btn").forEach(btn => {
      if (btn.getAttribute("data-tab") === tabName) {
        btn.className = "desktop-nav-btn px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 transition-all";
      } else {
        btn.className = "desktop-nav-btn px-4 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-all";
      }
    });

    // Render the selected tab content
    this.renderCurrentTab();
  }

  updateBreakingTicker() {
    const ticker = document.getElementById("ticker-text");
    if (ticker && gameState.breakingNews.length > 0) {
      ticker.textContent = gameState.breakingNews.join("  ★  ");
    }
  }

  handleStateUpdate(state, changeEvent) {
    hudRenderer.render();
    this.renderCurrentTab();
    this.updateBreakingTicker();

    // Check if Election Day Live Counting
    if (state.gameStage === "COUNTING") {
      this.renderElectionResultsModal();
    }
  }

  renderElectionResultsModal() {
    const modalContainer = document.getElementById("election-results-modal");
    if (!modalContainer) return;

    const player = gameState.getPlayer();
    const tally = gameState.nationalSeatTally;
    const playerSeats = tally.PLAYER;
    const majority = 272;

    let verdictTitle = "";
    let verdictDesc = "";
    let isVictor = false;

    if (playerSeats >= majority) {
      isVictor = true;
      verdictTitle = "ABSOLUTE HISTORIC MAJORITY!";
      verdictDesc = `${player.name} (${player.acronym}) has decisively crossed the 272 majority line with ${playerSeats} Lok Sabha seats! The President has formally invited you to Rashtrapati Bhavan to take the oath as Prime Minister of India!`;
    } else if (playerSeats + tally.THIRD_FRONT >= majority) {
      verdictTitle = "COALITION GOVERNMENT MANDATE!";
      verdictDesc = `With ${playerSeats} seats won, you forge a governing alliance with regional allies to comfortably surpass 272 seats. You form the Union Cabinet as Prime Minister heading the Gathbandhan!`;
    } else if (tally.NDA >= majority) {
      verdictTitle = "NDA FORMS GOVERNMENT";
      verdictDesc = `The National Democratic Alliance secures ${tally.NDA} seats and crosses the majority threshold. ${player.name} sits as the formidable Leader of the Opposition.`;
    } else {
      verdictTitle = "HUNG PARLIAMENT: RESORT POLITICS!";
      verdictDesc = `No single alliance achieved 272 seats! Chartered jets are ferrying MPs to 5-star luxury resorts in Goa and Bengaluru as midnight horse-trading decides the future of the republic!`;
    }

    modalContainer.innerHTML = `
      <div class="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-lg overflow-y-auto animate-fade-in">
        <div class="modal-content w-full max-w-2xl p-6 sm:p-8 my-auto border border-amber-500/50 shadow-2xl text-center">
          
          <div class="text-4xl sm:text-5xl mb-2">${isVictor ? '🏆' : '🗳️'}</div>
          
          <div class="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-2 ${isVictor ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-slate-800 text-slate-300'}">
            Official ECI Election Results • 543 Seats
          </div>

          <h2 class="text-2xl sm:text-3xl font-black text-white mt-1">${verdictTitle}</h2>
          <p class="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl mx-auto leading-relaxed">
            ${verdictDesc}
          </p>

          <!-- Seat Breakdown Tally Cards -->
          <div class="grid grid-cols-4 gap-2 my-6 text-center font-mono">
            <div class="p-3 rounded-xl bg-slate-900 border border-amber-500/40">
              <div class="text-xs font-bold text-amber-400">${player.acronym}</div>
              <div class="text-xl font-black text-white mt-1">${tally.PLAYER}</div>
              <div class="text-[10px] text-slate-400">Seats</div>
            </div>

            <div class="p-3 rounded-xl bg-slate-900 border border-orange-500/40">
              <div class="text-xs font-bold text-orange-400">NDA</div>
              <div class="text-xl font-black text-white mt-1">${tally.NDA}</div>
              <div class="text-[10px] text-slate-400">Seats</div>
            </div>

            <div class="p-3 rounded-xl bg-slate-900 border border-blue-500/40">
              <div class="text-xs font-bold text-blue-400">INDIA</div>
              <div class="text-xl font-black text-white mt-1">${tally.INDIA}</div>
              <div class="text-[10px] text-slate-400">Seats</div>
            </div>

            <div class="p-3 rounded-xl bg-slate-900 border border-emerald-500/40">
              <div class="text-xs font-bold text-emerald-400">OTHERS</div>
              <div class="text-xl font-black text-white mt-1">${tally.THIRD_FRONT}</div>
              <div class="text-[10px] text-slate-400">Seats</div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col sm:flex-row gap-3">
            <button id="btn-restart-campaign" class="flex-1 btn-primary py-3 rounded-xl font-bold text-sm tracking-wide uppercase">
              Start New Campaign
            </button>
            <button id="btn-close-results" class="flex-1 btn-secondary py-3 rounded-xl font-bold text-sm text-slate-300">
              Inspect Final Map
            </button>
          </div>

        </div>
      </div>
    `;

    document.getElementById("btn-restart-campaign").addEventListener("click", () => {
      modalContainer.innerHTML = "";
      gameState.resetToInitial();
      startScreen.render();
    });

    document.getElementById("btn-close-results").addEventListener("click", () => {
      modalContainer.innerHTML = "";
    });
  }
}

// Bootstrap on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  const app = new LoktantraApp();
  app.init();
});
