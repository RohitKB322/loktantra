// Dynamic Turn Dilemmas & Crisis Decision Events

export const DILEMMAS_POOL = [
  {
    id: "resort_defection",
    title: "🚨 The Midnight Resort Crisis",
    headline: "5 Party MLAs Spotted at 5-Star Goa Resort: Poaching Speculation Mounts!",
    description: "Intelligence reports confirm that 5 of your influential state MLAs have checked into a luxury beach resort chartered by rival party emissaries with stuffed suitcases.",
    image: "🏨",
    options: [
      {
        text: "Send Party Whip & Dispatch ₹40L Slush Cash",
        detail: "Outbid rival bribes to secure their loyalty. Cost: ₹40L Slush Cash, +14% ED Risk, MLAs remain loyal.",
        effect: { blackMoney: -40, slushExposure: 14, mlaLoyalty: 20, approval: 0 },
        outcome: "The MLAs return to party headquarters declaring their unwavering loyalty to your leadership!"
      },
      {
        text: "Issue Show-Cause Notice & Parody Them on Social Media",
        detail: "Hold a press conference condemning 'Resort Politics'. Cost: ₹0, +2.5% National Approval, but 2 MLAs defect.",
        effect: { blackMoney: 0, slushExposure: 0, mlasLost: 2, approval: 2.5 },
        outcome: "The public applauds your anti-corruption stance, though 2 disgruntled MLAs cross over to the opposition."
      }
    ]
  },
  {
    id: "paper_leak_protest",
    title: "🔥 Government Job Paper Leak Outrage",
    headline: "Youth Protest Outside Party HQ: Demands for Strict Anti-Cheat Law Reach Fever Pitch",
    description: "Question papers for the state civil recruitment examination leaked on Telegram. Over 50,000 furious youth and student aspirants are gathering outside the secretariat demanding accountability.",
    image: "📜",
    options: [
      {
        text: "Lead the Agitation & Announce ₹1,000 Monthly Unemployment Allowance",
        detail: "Full solidarity with youth aspirants. Cost: ₹35L White Money, +5% Youth Vote Swing.",
        effect: { whiteMoney: -35, youthBonus: 5, approval: 3.0 },
        outcome: "Student unions erupt in cheers! Your party becomes the darling of the state's youth demographic."
      },
      {
        text: "Call for a Judicial Inquiry & Urge Peaceful Talks",
        detail: "Balanced administrative approach. Cost: ₹0, No approval penalty.",
        effect: { whiteMoney: 0, approval: 0.5 },
        outcome: "A retired High Court judge is appointed. Tensions gradually subside without fiscal expenditure."
      }
    ]
  },
  {
    id: "drought_vs_ads",
    title: "🌾 Severe Drought in Agrarian Heartland",
    headline: "Monsoon Deficit Hits 40%: Wells Run Dry Across Rural Constituencies",
    description: "Severe drought threatens standing crops across rural districts. District collectors appeal for private water tankers, while your media managers demand funds for prime-time TV ads.",
    image: "💧",
    options: [
      {
        text: "Deploy 500 Emergency Water Tankers Under Party Banner",
        detail: "Emergency drought relief directly to villagers. Cost: ₹45L White Money, +6% Rural Vote Swing.",
        effect: { whiteMoney: -45, ruralBonus: 6, approval: 4.0 },
        outcome: "Villagers greet water tankers with party flags! Rural base solidified ahead of polling day."
      },
      {
        text: "Keep Funds for TV Blitz & Blame Ruling Government on News Channels",
        detail: "Maximize media attack narrative. Cost: ₹10L White Money, +2% National Approval.",
        effect: { whiteMoney: -10, approval: 2.0 },
        outcome: "Spokespersons dominate prime-time debates grilling government incompetence on water management."
      }
    ]
  },
  {
    id: "industrialist_deal",
    title: "💼 The Industrialist's Private Jet Offer",
    headline: "Mining Baron Offers ₹120L White Cash in Exchange for Environmental Clearance Promise",
    description: "A prominent industrial conglomerate chief requests a closed-door meeting at his private airstrip. He offers a massive ₹120 Lakhs campaign contribution via Electoral Bonds if you promise to fast-track mining leases.",
    image: "✈️",
    options: [
      {
        text: "Accept the Corporate Electoral Bond Donation",
        detail: "Receive ₹120L White Money. Corporate friendly shift, slight environmental scrutiny.",
        effect: { whiteMoney: 120, corporateBonus: true, approval: -1.0 },
        outcome: "Your treasury receives a massive cash infusion, giving you immense ammunition for upcoming rallies!"
      },
      {
        text: "Reject the Corporate Handshake with Dignity",
        detail: "Prioritize ecological preservation and public trust. +3% Public Approval.",
        effect: { approval: 3.0 },
        outcome: "Word leaks of your incorruptibility. Civil society organizations endorse your ethical manifesto!"
      }
    ]
  },
  {
    id: "factional_feud",
    title: "⚡ State President vs Youth Wing Revolt",
    headline: "Fierce Ticket Distribution Clashes Break Out at State Party Headquarters!",
    description: "Senior party veterans and the energetic student youth wing are hurling chairs at each other over who gets ticket nominations for prestigious urban Lok Sabha seats.",
    image: "⚔️",
    options: [
      {
        text: "Back the Youth Cadre & Retire 3 Entrenched Senior Leaders",
        detail: "Revitalize party leadership with fresh blood. Morale +25, +4% Youth appeal.",
        effect: { cadreMorale: 25, youthBonus: 4, approval: 1.5 },
        outcome: "The youth wing celebrates with firecrackers! Thousands of energetic college students enlist as volunteers."
      },
      {
        text: "Distribute ₹25L Secret Patronage to Appease Senior Veterans",
        detail: "Smooth over ruffled feathers with party allowances. Cost: ₹25L Slush Money, Morale +10.",
        effect: { blackMoney: -25, slushExposure: 6, cadreMorale: 10 },
        outcome: "Senior stalwarts smile and agree to a compromise ticket-sharing formula over tea."
      }
    ]
  }
];
