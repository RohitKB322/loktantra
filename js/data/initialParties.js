// National and Regional AI Parties, Ideologies, Alliances and Base Vote Banks

export const SYMBOLS_SVG = {
  lotus: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C10.5 5 8 8 6 11C4 14 4.5 17 6.5 19C8.5 21 11.5 21 12 21C12.5 21 15.5 21 17.5 19C19.5 17 20 14 18 11C16 8 13.5 5 12 2Z"/></svg>`,
  hand: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 3A2 2 0 0 1 10 5V11H11V3A2 2 0 0 1 13 1A2 2 0 0 1 15 3V11H16V5A2 2 0 0 1 18 3A2 2 0 0 1 20 5V15A7 7 0 0 1 13 22H11A7 7 0 0 1 4 15V9A2 2 0 0 1 6 7A2 2 0 0 1 8 9V3Z"/></svg>`,
  broom: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.5 3.5L16.5 6.5L14 4L11 7L13.5 9.5L4 19L5 20L14.5 10.5L17 13L20 10L17.5 7.5L20.5 4.5L19.5 3.5Z"/></svg>`,
  bicycle: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5.5" cy="17.5" r="3.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="18.5" cy="17.5" r="3.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5.5 17.5L10 10H14L18.5 17.5M10 10L12 17.5M8 6H12" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2"/></svg>`,
  elephant: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 19V9A5 5 0 0 1 9 4H15A5 5 0 0 1 20 9V12H18V9A3 3 0 0 0 15 6H9A3 3 0 0 0 6 9V19H4M15 19V14H18V19H15M8 19V14H11V19H8Z"/></svg>`,
  scale: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 2H13V5.07C16.39 5.56 19 8.47 19 12H21C21 7.03 16.97 3 12 3C7.03 3 3 7.03 3 12H5C5 8.47 7.61 5.56 11 5.07V2M12 7L7 17H17L12 7M12 20C10.9 20 10 20.9 10 22H14C14 20.9 13.1 20 12 20Z"/></svg>`,
  torch: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 21H15V19H9V21M17 7L15 2H9L7 7H17M8 9L9.5 17H14.5L16 9H8Z"/></svg>`
};

export const INITIAL_AI_PARTIES = [
  {
    id: "BVP",
    name: "Bharatiya Vikas Party",
    acronym: "BVP",
    leader: "Narendra Vardhan",
    color: "#f97316", // Saffron / Orange
    symbolKey: "lotus",
    coalition: "NDA",
    isPlayer: false,
    whiteMoney: 1250, // in Lakhs / Crores
    blackMoney: 850,
    slushExposure: 18,
    ideology: { economic: 8, social: 8, focus: 8 }, // 1-10: Capitalist, Traditionalist, Infrastructure
    baseNationalShare: 37.5,
    strongholds: ["GJ", "UP", "MP", "RJ", "HP", "UK", "CT"],
    rivals: ["UPC", "AVM", "TLP", "SLD"],
    trustScore: 40 // Trust with Player (0-100)
  },
  {
    id: "UPC",
    name: "United Progressive Congress",
    acronym: "UPC",
    leader: "Rahul Kharge",
    color: "#2563eb", // Royal Navy Blue
    symbolKey: "hand",
    coalition: "INDIA",
    isPlayer: false,
    whiteMoney: 680,
    blackMoney: 420,
    slushExposure: 12,
    ideology: { economic: 4, social: 3, focus: 4 }, // Socialist, Secular, Welfare
    baseNationalShare: 24.0,
    strongholds: ["KA", "KL", "PB", "TG", "JH", "MH"],
    rivals: ["BVP"],
    trustScore: 50
  },
  {
    id: "TLP",
    name: "Trinamool Lok Party",
    acronym: "TLP",
    leader: "Mamata Banerjee",
    color: "#10b981", // Emerald Green
    symbolKey: "sun",
    coalition: "INDIA",
    isPlayer: false,
    whiteMoney: 320,
    blackMoney: 290,
    slushExposure: 25,
    ideology: { economic: 3, social: 4, focus: 3 },
    baseNationalShare: 4.8,
    strongholds: ["WB"],
    rivals: ["BVP"],
    trustScore: 45
  },
  {
    id: "DMS",
    name: "Dravida Munnetra Samaj",
    acronym: "DMS",
    leader: "M.K. Stalin",
    color: "#dc2626", // Red
    symbolKey: "sun",
    coalition: "INDIA",
    isPlayer: false,
    whiteMoney: 410,
    blackMoney: 340,
    slushExposure: 20,
    ideology: { economic: 5, social: 2, focus: 5 },
    baseNationalShare: 4.2,
    strongholds: ["TN", "PY"],
    rivals: ["BVP"],
    trustScore: 55
  },
  {
    id: "AVM",
    name: "Aam Vikas Morcha",
    acronym: "AVM",
    leader: "Arvind Kejriwal",
    color: "#eab308", // Yellow
    symbolKey: "broom",
    coalition: "INDIA",
    isPlayer: false,
    whiteMoney: 210,
    blackMoney: 90,
    slushExposure: 35,
    ideology: { economic: 4, social: 4, focus: 2 },
    baseNationalShare: 3.5,
    strongholds: ["DL", "PB"],
    rivals: ["BVP"],
    trustScore: 60
  },
  {
    id: "SRS",
    name: "Shiv Rashtriya Sena",
    acronym: "SRS",
    leader: "Eknath Thackeray",
    color: "#ea580c",
    symbolKey: "torch",
    coalition: "NDA",
    isPlayer: false,
    whiteMoney: 260,
    blackMoney: 220,
    slushExposure: 22,
    ideology: { economic: 6, social: 7, focus: 6 },
    baseNationalShare: 3.2,
    strongholds: ["MH"],
    rivals: ["UPC"],
    trustScore: 50
  },
  {
    id: "SLD",
    name: "Samajwadi Lok Dal",
    acronym: "SLD",
    leader: "Akhilesh Yadav",
    color: "#e11d48",
    symbolKey: "bicycle",
    coalition: "INDIA",
    isPlayer: false,
    whiteMoney: 310,
    blackMoney: 280,
    slushExposure: 26,
    ideology: { economic: 3, social: 3, focus: 3 },
    baseNationalShare: 4.5,
    strongholds: ["UP"],
    rivals: ["BVP"],
    trustScore: 52
  },
  {
    id: "YRD",
    name: "Yuvajana Rythu Dal",
    acronym: "YRD",
    leader: "Jagan Reddy",
    color: "#0284c7",
    symbolKey: "scale",
    coalition: "Third Front",
    isPlayer: false,
    whiteMoney: 340,
    blackMoney: 310,
    slushExposure: 24,
    ideology: { economic: 4, social: 5, focus: 2 },
    baseNationalShare: 2.8,
    strongholds: ["AP"],
    rivals: ["UPC"],
    trustScore: 50
  },
  {
    id: "JVM",
    name: "Janata Vikas Manch",
    acronym: "JVM",
    leader: "Nitish Kumar",
    color: "#059669",
    symbolKey: "scale",
    coalition: "NDA",
    isPlayer: false,
    whiteMoney: 190,
    blackMoney: 140,
    slushExposure: 15,
    ideology: { economic: 5, social: 5, focus: 5 },
    baseNationalShare: 2.4,
    strongholds: ["BR"],
    rivals: ["UPC"],
    trustScore: 58
  }
];

export const PLAYER_STARTING_PRESETS = {
  grassroots: {
    label: "Grassroots Activist",
    description: "Built from local agitation and people's movements. High public trust, media underdog, but very limited corporate cash.",
    whiteMoney: 150, // in Lakhs
    blackMoney: 40,
    trustBonus: 25,
    slushExposure: 5,
    volunteerForce: 85
  },
  industrialist: {
    label: "Industrialist Backed",
    description: "Backed by corporate conglomerates and Dalal Street. Massive official campaign funding and PR machinery, but seen with suspicion in rural agrarian belts.",
    whiteMoney: 950,
    blackMoney: 450,
    trustBonus: -10,
    slushExposure: 28,
    volunteerForce: 40
  },
  regional_strongman: {
    label: "Regional Strongman",
    description: "Dominates one home state through deep community networks and local muscle. Tremendous home bastion, moderate finances.",
    whiteMoney: 420,
    blackMoney: 280,
    trustBonus: 10,
    slushExposure: 20,
    volunteerForce: 70
  }
};
