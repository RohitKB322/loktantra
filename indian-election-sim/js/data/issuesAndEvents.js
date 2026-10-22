// Turn Events, Scandals, Freebie Manifestos, and Dynamic News Templates

export const RANDOM_EVENTS_POOL = [
  {
    id: "inflation_spike",
    title: "Surging Onion & Fuel Prices Spark Nationwide Backlash",
    description: "Wholesale food inflation breaches 8.4%. Urban middle-class households and rural kitchens are feeling the severe pinch.",
    type: "economy",
    impact: { incumbentPenalty: 3.5, oppositionBonus: 2.5, affectedStates: ["MH", "UP", "RJ", "HR_DL"] },
    newsHeadline: "Inflation Fury: Soaring veggie and diesel rates fuel anger against ruling establishment"
  },
  {
    id: "farm_distress",
    title: "Tractor March: Farmer Unions Demand Legal MSP Guarantee",
    description: "Thousands of farmers camp on national highways demanding statutory minimum support prices and debt relief.",
    type: "agrarian",
    impact: { agrarianShift: 4.0, corporatePenalty: 2.0, affectedStates: ["PB", "HR_DL", "UP", "MH"] },
    newsHeadline: "Highway Siege: Kisan Mahapanchayat threatens poll boycott unless MSP law enacted"
  },
  {
    id: "paper_leak",
    title: "Massive Government Recruitment Exam Paper Leak Uncovered",
    description: "Civil services & teacher eligibility test question papers leaked on Telegram. Millions of furious youth take to the streets.",
    type: "youth",
    impact: { youthTurnoutBonus: 6.0, trustHitIncumbent: 4.5, affectedStates: ["RJ", "BR", "UP", "MP"] },
    newsHeadline: "Aspirants on Fire: Paper leak mafia nexus rocks state capitals; youth demand CBI probe"
  },
  {
    id: "tech_corridor_boom",
    title: "Global Semiconductor Mega-Fab Groundbreaking Announced",
    description: "A \$10 Billion chip fabrication plant kicks off construction with 40,000 promised engineering and supply chain jobs.",
    type: "development",
    impact: { urbanBonus: 4.0, corporateTrust: 15, affectedStates: ["GJ", "KA", "TG_AP", "TN"] },
    newsHeadline: "Silicon Bharat: Landmark semiconductor unit promises tech employment explosion"
  },
  {
    id: "border_standoff",
    title: "Geopolitical Standoff: Border Friction Evokes Nationalist Sentiment",
    description: "High-altitude skirmish reported along northern forward outposts. National pride dominates prime-time news debates.",
    type: "nationalist",
    impact: { nationalistBonus: 5.0, secularPenalty: 1.5, affectedStates: ["JK", "HP_UK", "PB", "NE", "HR_DL"] },
    newsHeadline: "Nation First: Gallant forces repel infiltration attempt; patriotic fervor sweeps heartland"
  },
  {
    id: "ed_liquor_raid",
    title: "Midnight Raids: Central Investigative Agencies Seize Cash Stashes",
    description: "Enforcement Directorate swoops down on hawala conduits linked to illicit campaign funding and liquor cartels.",
    type: "scandal",
    impact: { slushRiskMultiplier: 1.5, affectedStates: ["HR_DL", "CG_JH", "WB", "MH"] },
    newsHeadline: "Midnight Swoop: Suitcases of cash seized in high-profile political hawala trail"
  },
  {
    id: "cyclone_relief",
    title: "Super-Cyclone Threatens Eastern Seaboard: Evacuation War Footing",
    description: "Severe tropical cyclonic storm barrels towards coastal districts. Relief management becomes the ultimate test of leadership.",
    type: "disaster",
    impact: { governanceTest: true, affectedStates: ["OD", "WB", "TN", "TG_AP"] },
    newsHeadline: "Nature's Fury: Disaster management teams deploy as massive cyclone makes landfall"
  },
  {
    id: "maratha_reservation",
    title: "Hunger Strike for Community Reservation Draws Million-Strong Rally",
    description: "Demands for inclusion in backward class quotas shake political alignments across agrarian and semi-urban constituencies.",
    type: "identity",
    impact: { casteShift: 5.0, affectedStates: ["MH", "KA", "GJ"] },
    newsHeadline: "Quota Storm: Mass agitation puts regional alliances in a high-stakes quandary"
  }
];

export const FREEBIE_SCHEMES_CATALOG = [
  {
    id: "free_power",
    name: "Bijli Swaraj: 200 Units Free Electricity",
    tagline: "Zero power bills for all domestic consumers",
    costPerWeek: 35, // in Lakhs
    fiscalBurden: 850, // Post-election debt index
    urbanBonus: 2.5,
    ruralBonus: 4.0,
    middleClassPenalty: 1.5,
    icon: "⚡"
  },
  {
    id: "kisan_karz_mafi",
    name: "Kisan Karz Mafi: Complete Farm Debt Waiver",
    tagline: "Total waiver of crop loans up to ₹2 Lakh for smallholders",
    costPerWeek: 55,
    fiscalBurden: 1600,
    urbanBonus: -0.5,
    ruralBonus: 7.5,
    middleClassPenalty: 3.0,
    icon: "🌾"
  },
  {
    id: "mahila_samman",
    name: "Mahila Samman: ₹2,500/Month Direct Cash Transfer",
    tagline: "Unconditional basic income into every woman head-of-household account",
    costPerWeek: 45,
    fiscalBurden: 1200,
    urbanBonus: 3.0,
    ruralBonus: 5.5,
    middleClassPenalty: 2.0,
    icon: "👩"
  },
  {
    id: "youth_laptop",
    name: "Yuva Udaan: Free Laptops & 5G Data Vouchers",
    tagline: "Digital laptops for every class 12 pass-out and college entrant",
    costPerWeek: 30,
    fiscalBurden: 700,
    urbanBonus: 4.5,
    ruralBonus: 3.0,
    middleClassPenalty: 0.5,
    icon: "💻"
  },
  {
    id: "ayush_health",
    name: "Arogya Kavach: ₹10 Lakh Cashless Health Cover",
    tagline: "Universal coverage in public and private multi-specialty hospitals",
    costPerWeek: 40,
    fiscalBurden: 950,
    urbanBonus: 3.5,
    ruralBonus: 4.5,
    middleClassPenalty: 0.0,
    icon: "🏥"
  },
  {
    id: "old_pension_scheme",
    name: "OPS Restoration: Guaranteed Old Pension Scheme",
    tagline: "Restore non-contributory defined pensions for government employees",
    costPerWeek: 50,
    fiscalBurden: 2200,
    urbanBonus: 4.0,
    ruralBonus: 1.5,
    middleClassPenalty: 4.0,
    icon: "👴"
  }
];

export const SCANDAL_TEMPLATES = [
  {
    title: "Hawala Audio Tape Leak: Slush Fund Payoffs Caught on Wire",
    severity: "CRITICAL",
    trustLoss: 18,
    slushPenalty: 120,
    description: "An undercover sting operation releases recordings allegedly discussing suitcase cash transfers for rally crowds."
  },
  {
    title: "Benami Real Estate Plot Seized by Income Tax Vigilance",
    severity: "HIGH",
    trustLoss: 12,
    slushPenalty: 80,
    description: "Commercial land registered under proxy domestic staff surfaces in regulatory audit."
  },
  {
    title: "Paid News Sting: Envelope Journalism Shakes Campaign Spokespersons",
    severity: "MEDIUM",
    trustLoss: 8,
    slushPenalty: 45,
    description: "A digital media portal exposes leaked WhatsApp chats negotiating prime-time softball questions for hard cash."
  }
];
