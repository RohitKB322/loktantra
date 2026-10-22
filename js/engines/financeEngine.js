// Financials, Dual-Ledger Accounting, Banking, Real Estate & Investments
import { gameState } from "../core/state.js";

export const REAL_ESTATE_MARKET = [
  {
    id: "noida_sec150",
    name: "Noida Expressway Commercial Hub",
    state: "UP",
    type: "Commercial",
    basePrice: 240, // in Lakhs
    currentPrice: 240,
    priceHistory: [230, 235, 240],
    appreciationRate: 0.025, // 2.5% avg weekly trend
    volatility: 0.04,
    description: "High-value commercial land adjacent to upcoming Jewar International Airport link."
  },
  {
    id: "navi_mumbai_aero",
    name: "Navi Mumbai Aerocity Zone",
    state: "MH",
    type: "Mixed Use",
    basePrice: 350,
    currentPrice: 350,
    priceHistory: [340, 345, 350],
    appreciationRate: 0.03,
    volatility: 0.05,
    description: "Premium plots near the Trans-Harbour Link and greenfield airport terminal."
  },
  {
    id: "hyd_fin_district",
    name: "Hyderabad Financial District Parcel",
    state: "TG_AP",
    type: "IT SEZ",
    basePrice: 280,
    currentPrice: 280,
    priceHistory: [270, 275, 280],
    appreciationRate: 0.02,
    volatility: 0.03,
    description: "Institutional parcel located right next to global tech headquarters."
  },
  {
    id: "amaravati_farmland",
    name: "Amaravati Riverfront Farmland",
    state: "TG_AP",
    type: "Agricultural",
    basePrice: 180,
    currentPrice: 180,
    priceHistory: [160, 170, 180],
    appreciationRate: 0.04,
    volatility: 0.08,
    description: "Speculative agricultural parcel in the planned state capital masterplan."
  },
  {
    id: "blr_devanahalli",
    name: "Bengaluru Devanahalli Tech Corridor",
    state: "KA",
    type: "Industrial",
    basePrice: 310,
    currentPrice: 310,
    priceHistory: [295, 305, 310],
    appreciationRate: 0.025,
    volatility: 0.04,
    description: "Electronics manufacturing cluster near Kempegowda International Airport."
  },
  {
    id: "dholera_sir",
    name: "Dholera SIR Greenfield Plot",
    state: "GJ",
    type: "Industrial",
    basePrice: 150,
    currentPrice: 150,
    priceHistory: [140, 145, 150],
    appreciationRate: 0.035,
    volatility: 0.07,
    description: "Semiconductor ancillary corridor with heavy central government subsidies."
  }
];

export const financeEngine = {
  // Buy Real Estate Plot
  buyPlot(plotId, useSlush = false) {
    const player = gameState.getPlayer();
    const plot = REAL_ESTATE_MARKET.find(p => p.id === plotId);
    if (!plot) return { success: false, message: "Plot not found" };

    const cost = plot.currentPrice;
    if (useSlush) {
      if (player.blackMoney < cost) return { success: false, message: "Insufficient Black Money" };
      player.blackMoney -= cost;
      player.slushExposure = Math.min(100, player.slushExposure + 15);
    } else {
      if (player.whiteMoney < cost) return { success: false, message: "Insufficient White Money" };
      player.whiteMoney -= cost;
    }

    player.properties.push({
      plotId: plot.id,
      purchasePrice: cost,
      purchaseTurn: gameState.currentTurn,
      useSlush
    });

    gameState.notify("FINANCE_UPDATED");
    return { success: true, message: `Successfully purchased ${plot.name} for ₹${cost}L` };
  },

  // Sell Real Estate Plot
  sellPlot(plotIndex, cashType = "white") {
    const player = gameState.getPlayer();
    if (plotIndex < 0 || plotIndex >= player.properties.length) {
      return { success: false, message: "Invalid property index" };
    }

    const owned = player.properties[plotIndex];
    const plot = REAL_ESTATE_MARKET.find(p => p.id === owned.plotId);
    const saleValue = plot ? plot.currentPrice : owned.purchasePrice;

    if (cashType === "white") {
      // 20% capital gains tax deduction
      const postTax = Math.round(saleValue * 0.8);
      player.whiteMoney += postTax;
    } else {
      // Slush Fund receives full value but increases exposure
      player.blackMoney += saleValue;
      player.slushExposure = Math.min(100, player.slushExposure + 18);
    }

    player.properties.splice(plotIndex, 1);
    gameState.notify("FINANCE_UPDATED");
    return { success: true, message: `Sold property for ₹${saleValue}L` };
  },

  // Banking: Take Bank Loan
  takeLoan(amount, tenureWeeks = 12) {
    const player = gameState.getPlayer();
    if (player.creditScore < 600) {
      return { success: false, message: "Loan rejected: Credit score below 600" };
    }

    const weeklyInterest = Math.round(amount * 0.015); // 1.5% weekly interest
    player.whiteMoney += amount;
    player.loans.push({
      id: "LOAN_" + Date.now(),
      principal: amount,
      remaining: amount,
      weeklyInterest,
      tenureWeeks,
      weeksElapsed: 0
    });

    player.creditScore = Math.max(500, player.creditScore - 15);
    gameState.notify("FINANCE_UPDATED");
    return { success: true, message: `Sanctioned loan of ₹${amount}L at ₹${weeklyInterest}L/wk interest` };
  },

  // Repay Loan
  repayLoan(loanIndex) {
    const player = gameState.getPlayer();
    if (loanIndex < 0 || loanIndex >= player.loans.length) return { success: false, message: "Loan not found" };

    const loan = player.loans[loanIndex];
    if (player.whiteMoney < loan.remaining) {
      return { success: false, message: `Insufficient White Money. Need ₹${loan.remaining}L` };
    }

    player.whiteMoney -= loan.remaining;
    player.loans.splice(loanIndex, 1);
    player.creditScore = Math.min(850, player.creditScore + 30);

    gameState.notify("FINANCE_UPDATED");
    return { success: true, message: `Fully repaid loan of ₹${loan.remaining}L! Credit score raised.` };
  },

  // Invest in Bonds
  investBonds(type, amount) {
    const player = gameState.getPlayer();
    if (player.whiteMoney < amount) return { success: false, message: "Insufficient White Money" };

    player.whiteMoney -= amount;
    if (type === "sovereignGold") {
      player.bonds.sovereignGold += amount;
    } else {
      player.bonds.infraBonds += amount;
    }

    gameState.notify("FINANCE_UPDATED");
    return { success: true, message: `Invested ₹${amount}L in ${type === "sovereignGold" ? "Sovereign Gold Bonds" : "Infrastructure Bonds"}` };
  },

  // Corporate Donation / Electoral Trust Pact (Rebalanced with cooldown & caps)
  acceptCorporateTrust(amount = 250) {
    const player = gameState.getPlayer();

    if (player.corporateTrustCooldown && player.corporateTrustCooldown > 0) {
      return { 
        success: false, 
        message: `Corporate funding quota on cooldown! Industrial donors require regulatory clearance. Available in ${player.corporateTrustCooldown} weeks.` 
      };
    }

    if ((player.corporateTranchesTaken || 0) >= 4) {
      return { 
        success: false, 
        message: "Maximum corporate donor contributions reached for this term! Further donations risk severe anti-cronyism backlash." 
      };
    }

    player.corporateTrustCooldown = 5; // 5-turn cooldown
    player.corporateTranchesTaken = (player.corporateTranchesTaken || 0) + 1;

    player.whiteMoney += amount;

    // Quid-pro-quo: Corporate donors demand pro-business stance
    player.ideology.economic = Math.min(10, player.ideology.economic + 1);
    player.nationalApproval = Math.max(10, player.nationalApproval - 1.2);
    
    gameState.addBreakingNews(
      `Mega Industrial Conglomerate donates ₹${amount}L via Electoral Trust to ${player.name} (Tranche ${player.corporateTranchesTaken}/4)`,
      "Metro Business 24",
      "FINANCE"
    );

    gameState.notify("FINANCE_UPDATED");
    return { success: true, message: `Received ₹${amount}L corporate funding via Electoral Trust (Tranche ${player.corporateTranchesTaken}/4). Next tranche available in 5 weeks.` };
  },

  // ==========================================
  // SLUSH FUND (BLACK MONEY) EARNING OPERATIONS
  // ==========================================

  // 1. Highway & Infra Tender Kickbacks (Cut on public works)
  awardInfrastructureKickback() {
    const player = gameState.getPlayer();
    const yieldLakhs = Math.floor(Math.random() * 40) + 70; // ₹70L - ₹110L
    const exposureRisk = 16;

    player.blackMoney += yieldLakhs;
    player.slushExposure = Math.min(100, player.slushExposure + exposureRisk);

    gameState.addBreakingNews(
      `State Infrastructure Drive: Construction contractors funnel ₹${yieldLakhs}L cash tribute into party coffers`,
      "The Digital Wire",
      "EXPOSURE"
    );

    gameState.notify("FINANCE_UPDATED");
    return {
      success: true,
      amount: yieldLakhs,
      message: `Pocketed ₹${yieldLakhs}L Slush Funds via infrastructure contractor commissions! ED Risk +${exposureRisk}%.`
    };
  },

  // 2. Real Estate Builder Syndicate Suitcase
  realEstateSyndicateSuitcase() {
    const player = gameState.getPlayer();
    const yieldLakhs = Math.floor(Math.random() * 30) + 55; // ₹55L - ₹85L
    const exposureRisk = 12;

    player.blackMoney += yieldLakhs;
    player.slushExposure = Math.min(100, player.slushExposure + exposureRisk);

    gameState.addBreakingNews(
      `Urban Land Clearance: Real estate developers deliver ₹${yieldLakhs}L in discreet suitcases following commercial rezoning`,
      "Metro Business 24",
      "SCANDAL"
    );

    gameState.notify("FINANCE_UPDATED");
    return {
      success: true,
      amount: yieldLakhs,
      message: `Secured ₹${yieldLakhs}L Slush Funds from real estate developer syndicate! ED Risk +${exposureRisk}%.`
    };
  },

  // 3. Mining & Mineral Syndicate Tribute
  miningSyndicateTribute() {
    const player = gameState.getPlayer();
    const yieldLakhs = Math.floor(Math.random() * 25) + 40; // ₹40L - ₹65L
    const exposureRisk = 9;

    player.blackMoney += yieldLakhs;
    player.slushExposure = Math.min(100, player.slushExposure + exposureRisk);

    gameState.addBreakingNews(
      `Resource Extraction: River sand and mineral transport fleets disburse ₹${yieldLakhs}L cash royalty to party operatives`,
      "Janata Awaaz",
      "EXPOSURE"
    );

    gameState.notify("FINANCE_UPDATED");
    return {
      success: true,
      amount: yieldLakhs,
      message: `Collected ₹${yieldLakhs}L Slush Funds from regional mining transport operators! ED Risk +${exposureRisk}%.`
    };
  },

  // 4. Hawala Channel Overseas Remittance
  hawalaRemittanceInflow() {
    const player = gameState.getPlayer();
    const yieldLakhs = Math.floor(Math.random() * 35) + 65; // ₹65L - ₹100L
    const exposureRisk = 14;

    player.blackMoney += yieldLakhs;
    player.slushExposure = Math.min(100, player.slushExposure + exposureRisk);

    gameState.addBreakingNews(
      `Hawala Drop: Angadia network delivers ₹${yieldLakhs}L undeclared remittances from foreign trading desks`,
      "National Wire",
      "FINANCE"
    );

    gameState.notify("FINANCE_UPDATED");
    return {
      success: true,
      amount: yieldLakhs,
      message: `Received ₹${yieldLakhs}L Slush Cash via Angadia hawala couriers! ED Risk +${exposureRisk}%.`
    };
  },

  // ==========================================
  // ED / IT RAID RISK REDUCTION OPERATIONS
  // ==========================================

  // 1. Appoint Compliant ED Director (Transfer Investigative Chief)
  appointCompliantEDDirector() {
    const player = gameState.getPlayer();
    const isPM = !!(gameState.governance && gameState.governance.role === "PRIME_MINISTER");

    if (!isPM) {
      return { 
        success: false, 
        message: "🔒 Action locked! The NDA holds power at the Centre. Only the ruling Prime Minister has the executive constitutional authority to transfer central investigative agency directors. Win the General Election first!" 
      };
    }

    const cost = 25; // Lakhs White

    if (player.whiteMoney < cost) {
      return { success: false, message: `Insufficient White Money. Administrative transfer lobbying costs ₹${cost}L.` };
    }

    player.whiteMoney -= cost;
    player.slushExposure = Math.max(0, player.slushExposure - 32);

    gameState.addBreakingNews(
      `Administrative Reshuffle: Ministry appoints compliant bureaucrat to head central investigative agency; probes re-oriented`,
      "Prasar Vani",
      "GOVERNANCE"
    );

    gameState.notify("FINANCE_UPDATED");
    return {
      success: true,
      message: `Appointed friendly investigative chief! Enforcement Directorate (ED) raid risk slashed by -32%! Current ED Risk: ${player.slushExposure}%.`
    };
  },

  // 2. Midnight File Shredder / Destroys Evidence
  shredAuditTrails() {
    const player = gameState.getPlayer();
    const cost = 15; // Lakhs Slush

    if (player.blackMoney < cost) {
      return { success: false, message: `Insufficient Slush Cash. Bribery for file suppression requires ₹${cost}L.` };
    }

    player.blackMoney -= cost;
    player.slushExposure = Math.max(0, player.slushExposure - 22);

    gameState.addBreakingNews(
      `Secretariat Incident: Peculiar short-circuit reported in state audit records archive; pending scrutiny files untraceable`,
      "Digital Wire",
      "SCANDAL"
    );

    gameState.notify("FINANCE_UPDATED");
    return {
      success: true,
      message: `Suppressed pending audit trails! Slush Exposure lowered by -22%! Current ED Risk: ${player.slushExposure}%.`
    };
  },

  // 3. Offshore Shell Trust Audit Scrub
  offshoreHawalaScrub() {
    const player = gameState.getPlayer();
    const cost = 20; // Lakhs White

    if (player.whiteMoney < cost) {
      return { success: false, message: `Insufficient White Money. International shell retainer costs ₹${cost}L.` };
    }

    player.whiteMoney -= cost;
    player.slushExposure = Math.max(0, player.slushExposure - 25);

    gameState.notify("FINANCE_UPDATED");
    return {
      success: true,
      message: `Auditors scrubbed domestic trail through Mauritius holding structures! ED Risk lowered by -25%! Current ED Risk: ${player.slushExposure}%.`
    };
  },

  // 4. Temple & Charitable Foundation Funnel
  templeTrustFunnel() {
    const player = gameState.getPlayer();
    const cost = 14; // Lakhs White

    if (player.whiteMoney < cost) {
      return { success: false, message: `Insufficient White Money. Charitable endowment requires ₹${cost}L.` };
    }

    player.whiteMoney -= cost;
    player.slushExposure = Math.max(0, player.slushExposure - 18);
    player.nationalApproval = Math.min(90, player.nationalApproval + 1.2);

    gameState.notify("FINANCE_UPDATED");
    return {
      success: true,
      message: `Routed campaign assets through tax-exempt charitable religious endowments! ED Risk lowered by -18%! Current ED Risk: ${player.slushExposure}%.`
    };
  },

  // Launder Slush to White (Hawala / Shell Companies)
  launderSlush(amount) {
    const player = gameState.getPlayer();
    if (player.blackMoney < amount) return { success: false, message: "Insufficient Black Money" };

    const cleanCash = Math.round(amount * 0.7); // 30% haircut
    player.blackMoney -= amount;
    player.whiteMoney += cleanCash;
    player.slushExposure = Math.min(100, player.slushExposure + 12);

    gameState.notify("FINANCE_UPDATED");
    return { success: true, message: `Laundered ₹${amount}L into ₹${cleanCash}L white funds (30% haircut). Exposure +12%.` };
  },

  // Process Turn Finance Tick
  processTurnTick() {
    const player = gameState.getPlayer();

    // 1. Process Bank Loans interest & tenure
    let totalInterestPaid = 0;
    for (let i = player.loans.length - 1; i >= 0; i--) {
      const loan = player.loans[i];
      loan.weeksElapsed++;

      if (player.whiteMoney >= loan.weeklyInterest) {
        player.whiteMoney -= loan.weeklyInterest;
        totalInterestPaid += loan.weeklyInterest;
      } else {
        // Default penalty
        player.creditScore = Math.max(300, player.creditScore - 35);
        loan.remaining += loan.weeklyInterest * 2; // penalty interest
      }
    }

    // 2. Process Bond Yields
    const goldYield = Math.round(player.bonds.sovereignGold * 0.012); // 1.2% weekly
    const infraYield = Math.round(player.bonds.infraBonds * 0.02); // 2.0% weekly
    player.whiteMoney += (goldYield + infraYield);

    // 3. Process Real Estate Appreciation/Depreciation
    REAL_ESTATE_MARKET.forEach(plot => {
      const delta = (Math.random() * 2 - 0.95) * plot.volatility + plot.appreciationRate;
      plot.currentPrice = Math.max(50, Math.round(plot.currentPrice * (1 + delta)));
      plot.priceHistory.push(plot.currentPrice);
      if (plot.priceHistory.length > 10) plot.priceHistory.shift();
    });

    // 4. ED & Income Tax Raid Check based on slush exposure
    let raidOccurred = false;
    if (player.slushExposure > 40) {
      const raidChance = (player.slushExposure - 35) / 100; // e.g. 60% exposure = 25% chance per turn
      if (Math.random() < raidChance) {
        raidOccurred = true;
        const seizedCash = Math.round(player.blackMoney * 0.65);
        player.blackMoney -= seizedCash;
        player.slushExposure = 20; // reset lower post-raid
        player.nationalApproval = Math.max(5, player.nationalApproval - 6);

        gameState.addBreakingNews(
          `BREAKING: Enforcement Directorate (ED) conducts midnight raids on ${player.name} offices; ₹${seizedCash}L seized!`,
          "Bharat Republic TV",
          "SCANDAL"
        );
      }
    }

    // Slush exposure naturally cools down slowly each turn if no new illicit acts
    if (!raidOccurred && player.slushExposure > 5) {
      player.slushExposure = Math.max(5, player.slushExposure - 2);
    }

    // 5. Decrement corporate trust cooldown
    if (player.corporateTrustCooldown && player.corporateTrustCooldown > 0) {
      player.corporateTrustCooldown--;
    }

    // 6. Weekly Passive Revenue Streams (Rebalances expenses so treasury doesn't rapidly drain)
    const memberDues = Math.round((player.activeMembers || 18500) * 0.00045) + 6; // ₹14L - ₹16L
    player.whiteMoney += memberDues;

    let pmGrant = 0;
    if (gameState.governance && gameState.governance.active && gameState.governance.role === "PRIME_MINISTER") {
      pmGrant = 30; // ₹30L weekly central government executive grant
      player.whiteMoney += pmGrant;
    }

    return { 
      totalInterestPaid, 
      yields: goldYield + infraYield, 
      raidOccurred,
      inflow: memberDues + pmGrant + (goldYield + infraYield)
    };
  }
};
