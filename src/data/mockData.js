// Mock Datasets for ForestConnect AI

export const CATEGORIES = [
  { id: "all", labelKey: "allCategories" },
  { id: "honey", labelKey: "honey" },
  { id: "bamboo", labelKey: "bamboo" },
  { id: "herbs", labelKey: "herbs" },
  { id: "fruits", labelKey: "fruits" },
  { id: "seeds_gums", labelKey: "seeds_gums" },
  { id: "leaves_fibers", labelKey: "leaves_fibers" },
  { id: "handicrafts", labelKey: "handicrafts" },
  { id: "spices", labelKey: "spices" }
];

export const PRODUCTS = [
  {
    id: "p1",
    name: "Organic Wild Honey (అడవి తేనె)",
    category: "honey",
    sellerName: "Somu Pendur",
    sellerPhone: "+91 98480 22310",
    sellerId: "9848022310",
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
    sellerId: "9440511200",
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
    sellerId: "8500299188",
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
    category: "seeds_gums",
    sellerName: "Laxmi Madavi",
    sellerPhone: "+91 96182 33455",
    sellerId: "9618233455",
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
    sellerId: "7382044521",
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
    sellerId: "9122388440",
    location: "Bhadrachalam, Bhadradri Kothagudem",
    quantity: "60 items",
    marketPrice: 180,
    predictedPrice: 220,
    description: "Finely split and hand-woven utility baskets. Made using traditional patterns passed down generations. Sturdy, eco-friendly, and lightweight.",
    gradient: "from-amber-700 to-yellow-900",
    tag: "Artisanal",
    harvestMonth: "Year-Round",
    expectedDemand: "Medium"
  },
  {
    id: "p7",
    name: "Wild Turmeric & Black Pepper (అడవి పసుపు & మిరియాలు)",
    category: "spices",
    sellerName: "Bheemrao Soyam",
    sellerPhone: "+91 98491 55667",
    sellerId: "9849155667",
    location: "Jainoor Forest Range, Adilabad",
    quantity: "95 kg",
    marketPrice: 210,
    predictedPrice: 260,
    description: "Organic forest-grown wild turmeric rhizomes and sun-dried aromatic black pepper. Rich in curcumin and high in natural essential oils.",
    gradient: "from-amber-500 to-orange-700",
    tag: "High Quality",
    harvestMonth: "February",
    expectedDemand: "High"
  },
  {
    id: "p8",
    name: "Tendu Leaves Bundle (తునికి ఆకులు)",
    category: "leaves_fibers",
    sellerName: "Gond Van Sahakari Society",
    sellerPhone: "+91 94901 33211",
    sellerId: "9490133211",
    location: "Asifabad Forest Division",
    quantity: "1500 bundles",
    marketPrice: 45,
    predictedPrice: 55,
    description: "Premium hand-picked season Tendu leaves tied in standard bundles. Clean, dry, flexible leaves stored in climate-controlled godowns.",
    gradient: "from-emerald-700 to-green-900",
    tag: "Bulk Ready",
    harvestMonth: "May",
    expectedDemand: "High"
  }
];

export const SCHEMES = [
  {
    id: "s1",
    name: "Pradhan Mantri Van Dhan Yojana (PMVDY)",
    nameHi: "प्रधानमंत्री वन धन योजना (PMVDY)",
    nameTe: "ప్రధాన మంత్రి వన్ ధన్ యోజన (PMVDY)",
    category: "Livelihood",
    eligibility: "Tribal gatherers, members of Van Dhan Self-Help Groups (SHGs) and forest cooperatives.",
    benefits: "Financial grant of ₹15 Lakhs per Van Dhan Vikas Kendra (300 members) for value addition tools, solar dryers, packaging machinery, and skill training.",
    applyProcedure: "Form a Self-Help Group of 15-20 gatherers and register via District Nodal Officer or TRIFED PMVDY Portal.",
    url: "https://pmvdky.trifed.gov.in",
    tag: "Livelihood"
  },
  {
    id: "s2",
    name: "Minimum Support Price (MSP) for Minor Forest Produce (MSP for MFP)",
    nameHi: "लघु वन उपज के लिए न्यूनतम समर्थन मूल्य (MSP for MFP)",
    nameTe: "అటవీ ఉత్పత్తులకు కనీస మద్దతు ధర (MSP for MFP)",
    category: "Financial",
    eligibility: "All registered tribal forest gatherers selling declared Minor Forest Produce items.",
    benefits: "Floor price protection for 87+ notified minor forest products (Honey, Amla, Mahua, Tamarind, Karaya Gum). Direct bank transfer (DBT) to eliminate middleman exploitation.",
    applyProcedure: "Register with the local Primary Procurement Center run by GCC (Girijan Co-operative Corporation) or Forest Department.",
    url: "https://trifed.tribal.gov.in/msp-for-mfp",
    tag: "Financial Support"
  },
  {
    id: "s3",
    name: "Girijan Cooperative Corporation (GCC) Procurement Scheme",
    nameHi: "गिरिजन सहकारी निगम (GCC) खरीद योजना",
    nameTe: "గిరిజన సహకార సంస్థ (GCC) సేకరణ పథకం",
    category: "Financial",
    eligibility: "Tribal gatherers in Telangana & Andhra Pradesh forest regions.",
    benefits: "Guaranteed door-step fair price procurement of forest produce, prompt cash/digital payment, micro-credit access, and seasonal advance payouts.",
    applyProcedure: "Enroll at your nearest GCC Divisional Office or Primary Marketing Society with Aadhar & Bank Passbook.",
    url: "https://girijan.telangana.gov.in",
    tag: "State Guarantee"
  },
  {
    id: "s4",
    name: "PM-JANMAN (Pradhan Mantri Janjati Adivasi Nyaya Maha Abhiyan)",
    nameHi: "पीएम-जनमन (प्रधानमंत्री जनजाति आदिवासी न्याय महा अभियान)",
    nameTe: "పీఎం-జన్మన్ (ప్రధాన మంత్రి జనజాతి ఆదివాసీ న్యాయ్ మహా అభియాన్)",
    category: "Livelihood",
    eligibility: "Particularly Vulnerable Tribal Groups (PVTGs) and tribal habitations across forest belts.",
    benefits: "Comprehensive electrification, Pucca housing (PMAY-G), clean drinking water pipelines, mobile medical units, and VDVK multi-purpose facility centers.",
    applyProcedure: "Applications processed through District Tribal Welfare Nodal Officers and Gram Sabha enumeration camps.",
    url: "https://tribal.gov.in/PMJANMAN.aspx",
    tag: "Priority Mission"
  },
  {
    id: "s5",
    name: "TRIFED Retail & E-Commerce Marketing Linkage",
    nameHi: "ट्राइफेड खुदरा और ई-कॉमर्स विपणन लिंकेज",
    nameTe: "ట్రైఫెడ్ రిటైల్ & ఈ-కామర్స్ మార్కెటింగ్ లింకేజ్",
    category: "Livelihood",
    eligibility: "Tribal artisans, gatherers, SHGs, and forest product producers.",
    benefits: "Listing and direct sale of products on Tribes India retail outlets, Amazon, Flipkart, and GeM portal with zero platform commission for tribal producers.",
    applyProcedure: "Submit sample products and SHG certification to regional TRIFED office for quality auditing and cataloging.",
    url: "https://tribesindia.com",
    tag: "Market Linkage"
  },
  {
    id: "s6",
    name: "National Scheduled Tribes Finance and Development Corporation (NSTFDC) Term Loan Scheme",
    nameHi: "राष्ट्रीय अनुसूचित जनजाति वित्त एवं विकास निगम (NSTFDC) ऋण योजना",
    nameTe: "జాతీయ షెడ్యూల్డ్ తెగల ఆర్థిక మరియు అభివృద్ధి సంస్థ (NSTFDC) రుణాలు",
    category: "Financial",
    eligibility: "Scheduled Tribe individuals or SHGs with annual family income up to ₹3,00,000.",
    benefits: "Concessional loans up to ₹10 Lakhs for setting up agro-processing units, bamboo workshops, and forest produce value-addition business with interest rate as low as 6% p.a.",
    applyProcedure: "Apply through State Channelizing Agencies (SCA) or Scheduled Commercial Banks handling tribal welfare funds.",
    url: "https://nstfdc.tribal.gov.in",
    tag: "Low Interest Loan"
  },
  {
    id: "s7",
    name: "Eklavya Model Residential Schools (EMRS) & Scholarship Scheme",
    nameHi: "एकलव्य मॉडल आवासीय विद्यालय (EMRS) एवं छात्रवृत्ति योजना",
    nameTe: "ఏకలవ్య మోడల్ గురుకుల పాఠశాలలు (EMRS) & స్కాలర్‌షిప్ పథకం",
    category: "Education",
    eligibility: "ST students from Class 6 to 12 and higher education tribal scholars.",
    benefits: "100% free quality boarding education, uniforms, textbooks, computer labs, sports coaching, and full pre/post-matric scholarship grants.",
    applyProcedure: "Apply online via National Scholarship Portal (NSP) or State EMRS Admission Entrance Portal.",
    url: "https://emrs.tribal.gov.in",
    tag: "Education Welfare"
  }
];

export const WEATHER_ADVISORY = {
  temp: "29°C",
  feelsLike: "31°C",
  condition: "Scattered Showers",
  humidity: "82%",
  wind: "14 km/h",
  advisory: {
    en: "High humidity is expected. Ensure gathered Mahua flowers and herbs are kept covered in dry, elevated areas to prevent mold formation. Ideal weather for planting bamboo saplings.",
    hi: "उच्च आर्द्रता की संभावना है। बची हुई महुआ फूलों और जड़ी-बूटियों को फफूंद से बचाने के लिए सूखे, ऊंचे स्थानों पर ढककर रखें। बांस के पौधे लगाने के लिए अनुकूल मौसम है।",
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
    demandLevel: "High",
    bestTime: "May to July (Peak Wild Honey Bloom)",
    historicalData: [310, 325, 340, 355, 370, 380],
    labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
    chartLabels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"]
  },
  bamboo: {
    expectedPrice: "₹135 / piece",
    demandLevel: "Medium",
    bestTime: "October to December (Post-Monsoon Harvest)",
    historicalData: [110, 115, 118, 122, 128, 135],
    labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
    chartLabels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"]
  },
  fruits: {
    expectedPrice: "₹105 / kg (Amla)",
    demandLevel: "High",
    bestTime: "December to February (Winter Harvest)",
    historicalData: [85, 88, 92, 95, 98, 105],
    labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
    chartLabels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"]
  },
  herbs: {
    expectedPrice: "₹160 / kg (Haritaki)",
    demandLevel: "High",
    bestTime: "October to November (Herb Processing Peak)",
    historicalData: [135, 140, 145, 150, 155, 160],
    labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
    chartLabels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"]
  },
  seeds_gums: {
    expectedPrice: "₹95 / kg (Mahua/Gum)",
    demandLevel: "High",
    bestTime: "April to June (Spring Harvest)",
    historicalData: [65, 72, 80, 85, 90, 95],
    labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
    chartLabels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"]
  },
  leaves_fibers: {
    expectedPrice: "₹55 / bundle",
    demandLevel: "Medium",
    bestTime: "May to June (Tendu Season)",
    historicalData: [35, 40, 42, 48, 52, 55],
    labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
    chartLabels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"]
  },
  handicrafts: {
    expectedPrice: "₹450 / item",
    demandLevel: "High",
    bestTime: "October to December (Festival Artisanal Demand)",
    historicalData: [380, 395, 410, 425, 440, 450],
    labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
    chartLabels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"]
  },
  spices: {
    expectedPrice: "₹260 / kg (Turmeric)",
    demandLevel: "High",
    bestTime: "February to April (Post-Harvest Season)",
    historicalData: [190, 205, 220, 235, 250, 260],
    labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
    chartLabels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"]
  }
};
