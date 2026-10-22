// In-Game Native Modal, Confirmation & Toast Notification System (Zero Browser Alerts)
import { audioEngine } from "../engines/audioEngine.js";

class GameModalManager {
  constructor() {
    this.container = null;
    this.toastContainer = null;
    this.initContainers();
  }

  initContainers() {
    if (typeof document === "undefined") return;

    if (!document.getElementById("game-modal-root")) {
      this.container = document.createElement("div");
      this.container.id = "game-modal-root";
      document.body.appendChild(this.container);
    } else {
      this.container = document.getElementById("game-modal-root");
    }

    if (!document.getElementById("game-toast-root")) {
      this.toastContainer = document.createElement("div");
      this.toastContainer.id = "game-toast-root";
      this.toastContainer.className = "fixed top-12 right-4 z-[300] flex flex-col gap-2 max-w-sm pointer-events-none";
      document.body.appendChild(this.toastContainer);
    } else {
      this.toastContainer = document.getElementById("game-toast-root");
    }
  }

  // Show a sleek in-game dialog (Replaces window.alert)
  show({
    title = "Notice",
    message = "",
    type = "info", // "info", "success", "warning", "danger", "cash"
    confirmText = "Understood",
    onConfirm = null,
    details = ""
  }) {
    this.initContainers();
    
    // Play appropriate sound
    if (type === "success") audioEngine.playFanfare();
    else if (type === "cash") audioEngine.playCash();
    else if (type === "danger") audioEngine.playSiren();
    else if (type === "warning") audioEngine.playDebateBell();

    const icons = {
      info: "📢",
      success: "🏆",
      warning: "⚠️",
      danger: "🚨",
      cash: "💼"
    };

    const borderColors = {
      info: "border-blue-500/60",
      success: "border-emerald-500/70",
      warning: "border-amber-500/70",
      danger: "border-rose-500/80",
      cash: "border-amber-400/80"
    };

    const icon = icons[type] || icons.info;
    const border = borderColors[type] || borderColors.info;

    this.container.innerHTML = `
      <div class="fixed inset-0 z-[280] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
        <div class="modal-content w-full max-w-md p-6 my-auto border-2 ${border} shadow-2xl text-center">
          
          <div class="text-4xl mb-2">${icon}</div>
          <h3 class="text-lg font-black text-white tracking-tight">${title}</h3>
          
          <div class="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed whitespace-pre-line text-left bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 font-mono">
            ${message}
          </div>

          ${details ? `<div class="text-[11px] text-amber-400/90 mt-2 text-left font-mono">${details}</div>` : ''}

          <div class="mt-5">
            <button id="btn-modal-confirm" class="w-full btn-primary py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg">
              ${confirmText}
            </button>
          </div>

        </div>
      </div>
    `;

    const btn = document.getElementById("btn-modal-confirm");
    if (btn) {
      btn.focus();
      btn.addEventListener("click", () => {
        this.close();
        if (onConfirm) onConfirm();
      });
    }

    // Keyboard support: Escape or Enter closes
    const keyHandler = (e) => {
      if (e.key === "Escape" || e.key === "Enter") {
        window.removeEventListener("keydown", keyHandler);
        this.close();
        if (onConfirm) onConfirm();
      }
    };
    window.addEventListener("keydown", keyHandler, { once: true });
  }

  // Interactive Confirmation Dialog (Replaces window.confirm)
  confirm({
    title = "Confirm Action",
    message = "",
    type = "warning",
    confirmText = "Proceed",
    cancelText = "Cancel",
    onConfirm = null,
    onCancel = null
  }) {
    this.initContainers();
    audioEngine.playDebateBell();

    this.container.innerHTML = `
      <div class="fixed inset-0 z-[280] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
        <div class="modal-content w-full max-w-md p-6 my-auto border-2 border-amber-500/70 shadow-2xl text-center">
          
          <div class="text-3xl mb-2">⚡</div>
          <h3 class="text-lg font-black text-white tracking-tight">${title}</h3>
          
          <p class="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed whitespace-pre-line bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-left">
            ${message}
          </p>

          <div class="grid grid-cols-2 gap-3 mt-5">
            <button id="btn-modal-cancel" class="btn-secondary py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white">
              ${cancelText}
            </button>
            <button id="btn-modal-action" class="btn-primary py-2 rounded-xl text-xs font-bold uppercase tracking-wider">
              ${confirmText}
            </button>
          </div>

        </div>
      </div>
    `;

    document.getElementById("btn-modal-cancel").addEventListener("click", () => {
      this.close();
      if (onCancel) onCancel();
    });

    document.getElementById("btn-modal-action").addEventListener("click", () => {
      this.close();
      if (onConfirm) onConfirm();
    });
  }

  // Non-blocking corner toast notification
  toast(message, type = "info", duration = 3200) {
    this.initContainers();
    const item = document.createElement("div");

    const bgColors = {
      info: "bg-slate-900 border-blue-500/60 text-white",
      success: "bg-slate-900 border-emerald-500/70 text-emerald-300",
      warning: "bg-slate-900 border-amber-500/70 text-amber-300",
      danger: "bg-slate-900 border-rose-500/80 text-rose-300"
    };

    item.className = `p-3 rounded-xl border shadow-xl text-xs font-semibold flex items-center gap-2 pointer-events-auto transition-all duration-300 translate-x-full ${bgColors[type] || bgColors.info}`;
    item.innerHTML = `
      <span>${type === 'success' ? '✓' : type === 'danger' ? '✕' : '★'}</span>
      <span class="flex-1">${message}</span>
    `;

    this.toastContainer.appendChild(item);

    // Slide in
    setTimeout(() => {
      item.classList.remove("translate-x-full");
    }, 20);

    // Slide out and remove
    setTimeout(() => {
      item.classList.add("translate-x-full", "opacity-0");
      setTimeout(() => item.remove(), 350);
    }, duration);
  }

  close() {
    if (this.container) {
      this.container.innerHTML = "";
    }
  }
}

export const gameModal = new GameModalManager();
