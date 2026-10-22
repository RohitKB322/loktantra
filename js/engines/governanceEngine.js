// National Governance Engine: Prime Minister's Office (PMO), Macroeconomics, & Recurring General Election Loop
import { gameState } from "../core/state.js";
import { mapEngine } from "./mapEngine.js";
import { audioEngine } from "./audioEngine.js";

export const NATIONAL_POLICIES = [
  {
    id: "INFRA_CORRIDORS",
    name: "Golden Quadrilateral & Dedicated Freight Corridors",
    tagline: "Mega Expressways & High-Speed Logistics Hubs",
    cost: 80, // Lakhs White
    category: "ECONOMY",
    impact: {
      gdp: +1.4,
      unemployment: -0.6,
      approval: +2.5,
      urbanSwing: 3.2
    },
    description: "Accelerate national highway and industrial corridor connectivity. Sparks commercial activity across Tier-1 and Tier-2 cities."
  },
  {
    id: "LEGAL_MSP_GUARANTEE",
    name: "Comprehensive Agrarian MSP & Mandi Modernization",
    tagline: "Legal Minimum Support Price & Crop Insurance Overhaul",
    cost: 65,
    category: "AGRARIAN",
    impact: {
      gdp: +0.6,
      inflation: -0.5,
      approval: +4.2,
      ruralSwing: 4.5
    },
    description: "Guarantees fair price realization for farmers across Hindi heartland, Punjab, and southern grain belts, ending farmer protest unrest."
  },
  {
    id: "DIRECT_BENEFIT_TRANSFER",
    name: "PM Jan Kalyan Direct Benefit Transfer (DBT)",
    tagline: "Direct Universal Welfare Tranches to 14 Crore Poor Households",
    cost: 95,
    category: "WELFARE",
    impact: {
      gdp: +0.8,
      approval: +5.0,
      generalSwing: 3.5
    },
    description: "Transfer bi-monthly financial support straight into beneficiary bank accounts. Massive grassroots goodwill for the ruling alliance."
  },
  {
    id: "SEMICONDUCTOR_TECH_PARKS",
    name: "National Semiconductor & AI Fab Cluster",
    tagline: "Advanced Chip Manufacturing Subsidies in Gujarat, TN & Karnataka",
    cost: 75,
    category: "INDUSTRY",
    impact: {
      gdp: +1.6,
      unemployment: -0.8,
      approval: +2.0,
      urbanSwing: 2.8
    },
    description: "Attract global semiconductor giants. Boosts Sensex, creates high-skill engineering jobs, and projects technological self-reliance."
  },
  {
    id: "CLEAN_ENERGY_GRID",
    name: "National Solar & Green Hydrogen Mission",
    tagline: "100 GW Rooftop Solar Subsidies & Renewable Supergrid",
    cost: 60,
    category: "ENERGY",
    impact: {
      gdp: +0.9,
      inflation: -0.4,
      approval: +2.8,
      youthSwing: 3.0
    },
    description: "Decarbonize the energy grid while cutting electricity tariffs for middle-class households and rural pump sets."
  }
];

export const PARLIAMENTARY_BILLS = [
  {
    id: "BILL_ANTI_CORRUPTION",
    title: "Lokpal & Transparency in Public Procurement Act",
    majorityNeeded: 272,
    rewardApproval: 4.0,
    rewardStability: 15,
    description: "Establishes independent anti-graft oversight for government tenders, quelling opposition criticism."
  },
  {
    id: "BILL_ONE_NATION_ONE_TAX",
    title: "Interstate Trade & GST Modernization Bill",
    majorityNeeded: 272,
    rewardApproval: 3.2,
    rewardStability: 12,
    description: "Rationalizes tax slabs and accelerates freight clearances across state borders."
  },
  {
    id: "BILL_RURAL_HEALTH_CARE",
    title: "Ayushman Bharat Universal Health Coverage Expansion",
    majorityNeeded: 272,
    rewardApproval: 5.0,
    rewardStability: 18,
    description: "Extends free ₹10 Lakh hospital treatment coverage to all senior citizens and low-income families."
  }
];

export const governanceEngine = {
  // Execute a National Policy Directive
  executePolicy(policyId) {
    const player = gameState.getPlayer();
    const policy = NATIONAL_POLICIES.find(p => p.id === policyId);
    if (!policy) return { success: false, message: "Policy directive not found." };

    if (player.whiteMoney < policy.cost) {
      return { success: false, message: `Insufficient White Treasury! Policy requires ₹${policy.cost}L, but you hold ₹${player.whiteMoney}L.` };
    }

    // Check if already active
    if (!gameState.macro.activePolicies) gameState.macro.activePolicies = [];
    const alreadyRun = gameState.macro.activePolicies.find(p => p.id === policyId);
    if (alreadyRun && (gameState.currentTurn - alreadyRun.turnActivated) < 8) {
      return { success: false, message: `Policy "${policy.name}" was recently enacted. Bureaucracy is implementing execution; available again in ${8 - (gameState.currentTurn - alreadyRun.turnActivated)} weeks.` };
    }

    // Deduct cost
    player.whiteMoney -= policy.cost;

    // Apply Macro Impact
    const m = gameState.macro;
    if (policy.impact.gdp) m.gdpGrowth = Math.min(11.5, Math.max(2.0, Math.round((m.gdpGrowth + policy.impact.gdp) * 10) / 10));
    if (policy.impact.inflation) m.inflation = Math.min(12.0, Math.max(1.5, Math.round((m.inflation + policy.impact.inflation) * 10) / 10));
    if (policy.impact.unemployment) m.unemployment = Math.min(12.0, Math.max(3.0, Math.round((m.unemployment + policy.impact.unemployment) * 10) / 10));
    if (policy.impact.approval) player.nationalApproval = Math.min(95, Math.round((player.nationalApproval + policy.impact.approval) * 10) / 10);

    // Apply voter shifts directly to state districts for the NEXT election!
    gameState.states.forEach(st => {
      let swing = 0.8;
      if (policy.impact.urbanSwing) swing += 0.5;
      if (policy.impact.ruralSwing) swing += 0.6;
      if (policy.impact.generalSwing) swing += 0.4;
      gameState.applyPersistentVoteShift(st.id, null, swing);
    });

    // Record active policy
    gameState.macro.activePolicies.unshift({
      id: policy.id,
      name: policy.name,
      turnActivated: gameState.currentTurn
    });

    audioEngine.playFanfare();
    gameState.addBreakingNews(
      `PMO POLICY DIRECTIVE: Prime Minister notifies ${policy.name}; Union Cabinet sanctions ₹${policy.cost}L package`,
      "Prasar Vani",
      "GOVERNANCE"
    );

    mapEngine.recalculateAllProjections();
    gameState.notify("GOVERNANCE_UPDATED");

    return {
      success: true,
      message: `Enacted "${policy.name}"!\n\n• GDP Growth: ${m.gdpGrowth}%\n• Inflation: ${m.inflation}%\n• Public Approval: ${player.nationalApproval}%\n• Next Election Ground Swing: +${policy.impact.urbanSwing || policy.impact.ruralSwing || 2.5}%`
    };
  },

  // Adjust RBI Policy Repo Rate
  adjustRepoRate(action) {
    const m = gameState.macro;
    const player = gameState.getPlayer();

    if (action === "cut") {
      if (m.repoRate <= 4.5) return { success: false, message: "Repo rate is already at historic low of 4.5%." };
      m.repoRate = Math.round((m.repoRate - 0.25) * 100) / 100;
      m.gdpGrowth = Math.min(11.0, Math.round((m.gdpGrowth + 0.3) * 10) / 10);
      m.inflation = Math.min(12.0, Math.round((m.inflation + 0.2) * 10) / 10);

      audioEngine.playCash();
      gameState.addBreakingNews(
        `Monetary Policy: RBI cuts benchmark Repo Rate to ${m.repoRate}%; home loan EMIs fall, corporate borrowing accelerates`,
        "Metro Biz 24",
        "ECONOMY"
      );
      return { success: true, message: `RBI cut Repo Rate to ${m.repoRate}%. Cheaper loans boost GDP to ${m.gdpGrowth}%.` };
    } else {
      if (m.repoRate >= 9.0) return { success: false, message: "Repo rate is already at upper ceiling of 9.0%." };
      m.repoRate = Math.round((m.repoRate + 0.25) * 100) / 100;
      m.inflation = Math.max(2.0, Math.round((m.inflation - 0.4) * 10) / 10);
      m.gdpGrowth = Math.max(3.0, Math.round((m.gdpGrowth - 0.2) * 10) / 10);

      audioEngine.playDebateBell();
      gameState.addBreakingNews(
        `Monetary Policy: RBI hikes Repo Rate to ${m.repoRate}% to aggressively cool consumer food and fuel inflation`,
        "Metro Biz 24",
        "ECONOMY"
      );
      return { success: true, message: `RBI hiked Repo Rate to ${m.repoRate}%. Tighter liquidity cools inflation to ${m.inflation}%.` };
    }
  },

  // Table & Pass a Parliamentary Bill in Lok Sabha
  tableParliamentaryBill(billId) {
    const bill = PARLIAMENTARY_BILLS.find(b => b.id === billId);
    const gov = gameState.governance || { governingSeats: 272, stability: 80 };
    const player = gameState.getPlayer();

    if (!bill) return { success: false, message: "Bill not found." };

    if (gov.governingSeats < 272) {
      return { success: false, message: `You hold only ${gov.governingSeats} seats in the Lok Sabha. You need 272 MPs to pass legislation!` };
    }

    gov.passedBills = (gov.passedBills || 0) + 1;
    gov.stability = Math.min(100, gov.stability + bill.rewardStability);
    player.nationalApproval = Math.min(95, Math.round((player.nationalApproval + bill.rewardApproval) * 10) / 10);

    // Statewide vote bank consolidation
    gameState.states.forEach(st => {
      gameState.applyPersistentVoteShift(st.id, null, 1.2);
    });

    audioEngine.playFanfare();
    gameState.addBreakingNews(
      `PARLIAMENT PASSES LAW: Lok Sabha passes "${bill.title}" with resounding majority! Coalition stability climbs to ${gov.stability}%.`,
      "Prasar Vani",
      "GOVERNANCE"
    );

    mapEngine.recalculateAllProjections();
    gameState.notify("GOVERNANCE_UPDATED");

    return {
      success: true,
      message: `Passed "${bill.title}" in Parliament!\n\n• Public Approval: +${bill.rewardApproval}%\n• Coalition Stability: ${gov.stability}%\n• Next Election Vote Swing: +1.2% nationwide`
    };
  },

  // Process Weekly Governance Tick
  processWeeklyTick() {
    const m = gameState.macro;
    const player = gameState.getPlayer();
    const gov = gameState.governance;

    if (!gov || !gov.active) return;

    // 1. Economic Tax Revenue Collection based on GDP Growth
    const revenueLakhs = Math.round(m.gdpGrowth * 3.5) + 15; // e.g. 7.4% GDP -> +₹41L weekly treasury inflow
    player.whiteMoney += revenueLakhs;

    // 2. High Inflation or High Unemployment penalty
    if (m.inflation > 6.5) {
      player.nationalApproval = Math.max(15, player.nationalApproval - 0.4);
    }
    if (m.unemployment > 7.5) {
      player.nationalApproval = Math.max(15, player.nationalApproval - 0.3);
    }

    // 3. Coalition Partner Stability Drift
    if (gov.stability < 45) {
      gameState.addBreakingNews(
        `GOALPOST CRISIS: Alliance partners issue 48-hour ultimatum on policy differences; Floor Test risk elevated to ${100 - gov.stability}%!`,
        "Bharat TV",
        "GOVERNANCE"
      );
    }

    // 4. Check for Next Recurring General Election (e.g. at Week 54)
    this.checkRecurringElection();
  },

  // Check if it's time for the next General Election
  checkRecurringElection() {
    const nextTurn = gameState.nextElectionTurn || 24;

    if (gameState.currentTurn >= nextTurn) {
      // General Election Arrives!
      gameState.gameStage = "COUNTING";
      gameState.termNumber = (gameState.termNumber || 1) + 1;
      // Schedule the next recurring election in 54 weeks
      gameState.nextElectionTurn = gameState.currentTurn + 54;
      gameState.totalTurns = gameState.nextElectionTurn;

      audioEngine.playFanfare();
      gameState.addBreakingNews(
        `POLLS OPEN: Full 5-Year Constitutional Term Concludes! 543 Lok Sabha Constituencies Head to General Election Ballot!`,
        "Prasar Vani",
        "ELECTION"
      );

      mapEngine.recalculateAllProjections();
      gameState.notify("ELECTION_TRIGGERED");

      return true;
    }

    return false;
  }
};
