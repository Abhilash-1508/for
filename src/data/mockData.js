// Mock Datasets for ForestConnect AI

export const CATEGORIES = [
  { id: "all", labelKey: "allCategories" },
  { id: "honey", labelKey: "honey" },
  { id: "bamboo", labelKey: "bamboo" },
  { id: "herbs", labelKey: "herbs" },
  { id: "fruits", labelKey: "fruits" },
  { id: "handicrafts", labelKey: "handicrafts" }
];

export const PRODUCTS = [
  {
    id: "p1",
    name: "Organic Wild Honey (అడవి తేనె)",
    category: "honey",
    sellerName: "Somu Pendur",
    sellerPhone: "+91 98480 22310",
    location: "Utnoor Forest, Adilabad District",
    quantity: "45 kg",
    marketPrice: 320,
    predictedPrice: 380,
    description: "Pure, unprocessed honey collected by tribal gatherers from high cliff beehives. Excellent medicinal value, rich in antioxidants and free of artificial additives.",
    gradient: "from-amber-400 to-amber-600",
    tag: "High Demand",
    harvestMonth: "May",
    expectedDemand: "High"
  },
  {
    id: "p2",
    name: "Premium Bamboo Poles (వెదురు కర్రలు)",
    category: "bamboo",
    sellerName: "Kumram Bheem SHG",
    sellerPhone: "+91 94405 11200",
    location: "Gudipadu Village, Adilabad District",
    quantity: "500 pieces",
    marketPrice: 110,
    predictedPrice: 135,
    description: "Strong, seasoned solid bamboo poles ideal for construction, handicrafts, scaffolding, and fencing. Ethically harvested under local community forest management.",
    gradient: "from-green-500 to-emerald-700",
    tag: "Bulk Available",
    harvestMonth: "December",
    expectedDemand: "Medium"
  },
  {
    id: "p3",
    name: "Dried Amla Fruit (ఎండిన ఉసిరి)",
    category: "fruits",
    sellerName: "Jangu Kodapa",
    sellerPhone: "+91 85002 99188",
    location: "Kerameri Hills, Adilabad District",
    quantity: "120 kg",
    marketPrice: 90,
    predictedPrice: 105,
    description: "Sun-dried organic gooseberries, manually harvested from deep forest tracts. High vitamin C content, processed naturally without chemical preservatives.",
    gradient: "from-lime-400 to-lime-600",
    tag: "Best Price Forecast",
    harvestMonth: "January",
    expectedDemand: "High"
  },
  {
    id: "p4",
    name: "Mahua Flowers - Sun-dried (విప్ప పూలు)",
    category: "fruits",
    sellerName: "Laxmi Madavi",
    sellerPhone: "+91 96182 33455",
    location: "Indervelly Forest, Adilabad District",
    quantity: "250 kg",
    marketPrice: 65,
    predictedPrice: 85,
    description: "High-quality, freshly fallen Mahua flowers, collected at dawn and sun-dried on clean mats. Used widely for traditional food products and oil extraction.",
    gradient: "from-yellow-600 to-amber-800",
    tag: "Stable Price",
    harvestMonth: "April",
    expectedDemand: "Medium"
  },
  {
    id: "p5",
    name: "Haritaki / Karakkaya (కరక్కాయ)",
    category: "herbs",
    sellerName: "Ramanji Kodapa",
    sellerPhone: "+91 73820 44521",
    location: "Narnoor Forest, Adilabad District",
    quantity: "80 kg",
    marketPrice: 140,
    predictedPrice: 160,
    description: "A-grade dried Haritaki fruits. Key ingredient in Triphala formulation, highly valued in Ayurvedic and traditional medicine for digestive health.",
    gradient: "from-emerald-800 to-teal-950",
    tag: "Highly Valued",
    harvestMonth: "November",
    expectedDemand: "High"
  },
  {
    id: "p6",
    name: "Handwoven Bamboo Baskets (వెదురు బుట్టలు)",
    category: "handicrafts",
    sellerName: "Koya Craft Cooperative",
    sellerPhone: "+91 91223 88440",
    location: "Bhadrachalam, Bhadradri Kothagudem",
    quantity: "60 items",
    marketPrice: 180,
    predictedPrice: 220,
    description: "Finely split and hand-woven utility baskets. Made using traditional patterns passed down generations. Sturdy, eco-friendly, and lightweight.",
    gradient: "from-amber-700 to-yellow-900",
    tag: "Artisanal",
    harvestMonth: "Year-Round",
    expectedDemand: "Medium"
  }
];

export const SCHEMES = [
  {
    id: "s1",
    name: "Pradhan Mantri Van Dhan Yojana (PMVDY)",
    nameLocal: "ప్రధాన మంత్రి వన్ ధన్ యోజన",
    category: "livelihood",
    eligibility: "Tribal gatherers, members of Van Dhan Self-Help Groups (SHGs).",
    benefits: "Funding of ₹15 Lakhs per Van Dhan Vikas Kendra (300 members) for value addition infrastructure, tools, packaging machinery, and skill development training.",
    applyProcedure: "Form a Self-Help Group of 15-20 gatherers and register via District Nodal Officer or Tribal Development Department portal.",
    tag: "Recommended"
  },
  {
    id: "s2",
    name: "Minimum Support Price (MSP) for MFP",
    nameLocal: "అటవీ ఉత్పత్తులకు కనీస మద్దతు ధర",
    category: "economic",
    eligibility: "All registered tribal forest gatherers selling declared Minor Forest Produce.",
    benefits: "Ensures floor prices for 73+ minor forest products (including Honey, Amla, Mahua, Tamarind). Direct bank transfer (DBT) to prevent exploitation by middlemen.",
    applyProcedure: "Register with the local Primary Procurement Center run by GCC (Girijan Co-operative Corporation) or forest department.",
    tag: "Financial Support"
  },
  {
    id: "s3",
    name: "National Bamboo Mission (NBM)",
    nameLocal: "జాతీయ వెదురు మిషన్",
    category: "agriculture",
    eligibility: "Farmers, artisans, and cooperatives owning suitable land for bamboo plantation.",
    benefits: "Up to 50% subsidy (₹50,000 per hectare) for raising bamboo nurseries and plantations, along with technical support and marketing assistance.",
    applyProcedure: "Submit application with land records and layout plan to state horticulture/forest nodal officers.",
    tag: "Subsidy"
  },
  {
    id: "s4",
    name: "FRA (Forest Rights Act) Community Title Benefits",
    nameLocal: "అటవీ హక్కుల చట్టం ప్రయోజనాలు",
    category: "welfare",
    eligibility: "Traditional forest dwellers and Scheduled Tribes residing in forest lands prior to Dec 2005.",
    benefits: "Legal recognition of rights to use, manage, and sell minor forest produce, construct minor check dams, and access community forest resources.",
    applyProcedure: "Submit claim form through local Gram Sabha (Village Committee) to Sub-Divisional Committee.",
    tag: "Legal Title"
  }
];

export const WEATHER_ADVISORY = {
  temp: "29°C",
  condition: "Scattered Showers (జల్లులు కురిసే అవకాశం)",
  humidity: "82%",
  wind: "14 km/h",
  advisory: {
    en: "High humidity is expected. Ensure gathered Mahua flowers and herbs are kept covered in dry, elevated areas to prevent mold formation. Ideal weather for planting bamboo saplings.",
    te: "అధిక తేమ నమోదయ్యే అవకాశం ఉంది. సేకరించిన విప్ప పువ్వులు, మూలికలు బూజు పట్టకుండా పొడిగా ఉండే ఎత్తైన ప్రదేశాలలో భద్రపరచండి. వెదురు మొక్కలు నాటడానికి అనుకూలమైన వాతావరణం."
  },
  forecast: [
    { day: "Today", temp: "29°C", icon: "cloud-rain" },
    { day: "Thu", temp: "30°C", icon: "cloud" },
    { day: "Fri", temp: "32°C", icon: "sun" },
    { day: "Sat", temp: "31°C", icon: "cloud-sun" },
    { day: "Sun", temp: "28°C", icon: "cloud-rain" }
  ]
};

export const AI_PREDICTIONS = {
  honey: {
    expectedPrice: "₹380 / kg",
    demandLevel: "High (ఎక్కువ)",
    bestTime: "Late July (జూలై చివర)",
    historicalData: [310, 320, 315, 330, 320, 380], // Last 6 months
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  },
  bamboo: {
    expectedPrice: "₹135 / piece",
    demandLevel: "Medium (మధ్యస్థం)",
    bestTime: "September (సెప్టెంబర్)",
    historicalData: [110, 112, 115, 110, 110, 135],
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  },
  fruits: {
    expectedPrice: "₹105 / kg (Amla)",
    demandLevel: "High (ఎక్కువ)",
    bestTime: "Mid August (ఆగస్టు మధ్య)",
    historicalData: [85, 90, 88, 92, 90, 105],
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  },
  herbs: {
    expectedPrice: "₹160 / kg (Haritaki)",
    demandLevel: "High (ఎక్కువ)",
    bestTime: "Late October (అక్టోబర్ చివర)",
    historicalData: [135, 140, 142, 139, 140, 160],
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  }
};
