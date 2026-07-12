import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Navbar
    home: "Home",
    marketplace: "Marketplace",
    pricePrediction: "Price Prediction",
    schemes: "Government Schemes",
    weather: "Weather",
    voiceAssistant: "Voice Assistant",
    profile: "Profile",
    login: "Login",
    register: "Register",
    logout: "Logout",
    adminDashboard: "Admin Dashboard",
    
    // Buttons & Actions
    submit: "Submit",
    cancel: "Cancel",
    search: "Search",
    filter: "Filter",
    sortBy: "Sort By",
    viewDetails: "View Details",
    contactSeller: "Contact Seller",
    addProduct: "Add Product",
    myProducts: "My Products",
    upload: "Upload",
    edit: "Edit",
    delete: "Delete",
    backToMarketplace: "Back to Marketplace",
    
    // Home Page
    heroTitle: "Empowering Forest Communities through Intelligent Technology",
    heroSubtitle: "Direct market access, AI-driven price prediction, weather updates, and personalized government schemes in your preferred language.",
    getStarted: "Get Started",
    learnMore: "Learn More",
    aboutTitle: "About ForestConnect AI",
    aboutText1: "ForestConnect AI is a digital platform designed to improve the livelihoods of tribal and forest-dependent communities by bridging the digital divide.",
    aboutText2: "By integrating essential agricultural services, machine learning-based price forecasts, government welfare programs, and multilingual speech assistance, we enable tribal gatherers to sell forest produce like honey, bamboo, amla, and herbs directly to buyers, bypassing intermediaries.",
    featuresTitle: "Core Features",
    featureMarketplaceTitle: "Direct Marketplace",
    featureMarketplaceDesc: "List and sell minor forest produce directly at fair, standardized rates.",
    featurePredictionTitle: "AI Price Forecasting",
    featurePredictionDesc: "Predict seasonal product demand and optimal market selling times using ML.",
    featureSchemesTitle: "Scheme Advisor",
    featureSchemesDesc: "Discover government welfare and subsidy programs personalized to your profile.",
    featureVoiceTitle: "Voice Assistant",
    featureVoiceDesc: "Navigate the system using speech in local languages, making it accessible to all.",
    contactTitle: "Get in Touch",
    contactName: "Full Name",
    contactEmail: "Email Address",
    contactMessage: "Message",
    contactSend: "Send Message",
    
    // Login & Register Pages
    loginTitle: "Welcome Back",
    loginSubtitle: "Sign in to access your ForestConnect dashboard",
    emailOrMobile: "Mobile Number or Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot Password?",
    noAccount: "Don't have an account?",
    alreadyAccount: "Already have an account?",
    registerTitle: "Create Account",
    registerSubtitle: "Join the forest community marketplace",
    fullName: "Full Name",
    mobileNumber: "Mobile Number",
    emailAddress: "Email Address (Optional)",
    village: "Village",
    district: "District",
    state: "State",
    preferredLanguage: "Preferred Language",
    registerBtn: "Register Now",
    
    // Dashboard Page
    welcome: "Welcome back",
    dashboardTitle: "Your Livelihood Dashboard",
    weatherSummary: "Today's Weather",
    priceTrend: "AI Price Forecast",
    schemesSummary: "Eligible Welfare Schemes",
    profileSummary: "Profile Summary",
    location: "Location",
    activeUploads: "Active Uploads",
    predictedTrendText: "Market prices are currently stable. Best time to sell: Late July.",
    
    // Marketplace & Details Page
    searchPlaceholder: "Search honey, bamboo, herbs...",
    allCategories: "All Categories",
    honey: "Honey",
    bamboo: "Bamboo",
    herbs: "Medicinal Herbs",
    fruits: "Forest Fruits",
    handicrafts: "Handicrafts",
    quantity: "Quantity",
    marketPrice: "Market Price",
    predictedPrice: "AI Predicted Price",
    sellerName: "Seller Name",
    sellerContact: "Seller Contact",
    description: "Description",
    buyNow: "Call to Buy",
    noProducts: "No products found matching your filters.",
    
    // AI Prediction Page
    predictTitle: "AI Price & Demand Predictor",
    predictSubtitle: "Select parameters to project harvest pricing",
    selectProduct: "Select Forest Produce",
    enterQuantity: "Quantity (in kg/pieces)",
    selectMonth: "Month of Sale",
    predictBtn: "Calculate Prediction",
    resultExpectedPrice: "Expected Market Price",
    resultDemand: "Expected Demand Level",
    resultBestTime: "Best Selling Time",
    high: "High",
    medium: "Medium",
    low: "Low",
    
    // Government Schemes Page
    schemesTitle: "Government Schemes Portal",
    schemesSubtitle: "Find welfare programs you qualify for",
    inputAge: "Age",
    inputOccupation: "Occupation",
    inputIncome: "Annual Income (₹)",
    inputState: "State",
    findSchemesBtn: "Find Eligible Schemes",
    schemeEligibility: "Eligibility",
    schemeBenefits: "Key Benefits",
    applyNow: "How to Apply",
    
    // Voice Assistant Page
    voiceTitle: "Voice Assistant Portal",
    voiceSubtitle: "Tap the microphone to navigate using speech",
    voicePrompt: "Press and speak (e.g., 'Show me market prices', 'Find PM Van Dhan Yojana')",
    listening: "Listening... Speak now.",
    processing: "Processing voice input...",
    assistantGreeting: "Hello! How can I help you manage your forest products today?",
    voiceResponse: "I found 3 eligible schemes for you, including PM Van Dhan Yojana. Would you like to read about them?",

    // Healthcare & Education Pages
    healthcare: "Healthcare",
    education: "Education",
    healthcareTitle: "Healthcare Guidance",
    educationTitle: "Education & Training",

    // Offline
    offlineMessage: "You are offline. Data will sync when connection returns.",
    syncingMessage: "Syncing offline data...",
    syncedMessage: "All data synced successfully!"
  },
  te: {
    // Navbar
    home: "హోమ్",
    marketplace: "మార్కెట్‌ప్లేస్",
    pricePrediction: "ధర అంచనా",
    schemes: "ప్రభుత్వ పథకాలు",
    weather: "వాతావరణం",
    voiceAssistant: "వాయిస్ అసిస్టెంట్",
    profile: "ప్రొఫైల్",
    login: "లాగిన్",
    register: "నమోదు",
    logout: "లాగ్అవుట్",
    adminDashboard: "అడ్మిన్ డాష్‌బోర్డ్",
    
    // Buttons & Actions
    submit: "సమర్పించు",
    cancel: "రద్దు చేయి",
    search: "వెతకండి",
    filter: "ఫిల్టర్",
    sortBy: "క్రమబద్ధీకరించు",
    viewDetails: "వివరాలు చూడు",
    contactSeller: "విక్రేతను సంప్రదించండి",
    addProduct: "ఉత్పత్తిని జోడించు",
    myProducts: "నా ఉత్పత్తులు",
    upload: "అప్‌లోడ్",
    edit: "సవరించు",
    delete: "తొలగించు",
    backToMarketplace: "తిరిగి మార్కెట్‌ప్లేస్ కి",
    
    // Home Page
    heroTitle: "ఇంటెలిజెంట్ టెక్నాలజీ ద్వారా అటవీ సంఘాల సాధికారత",
    heroSubtitle: "ప్రత్యక్ష మార్కెట్ ప్రాప్యత, AI-ఆధారిత ధర అంచనా, వాతావరణ అప్‌డేట్లు మరియు మీ ప్రాధాన్యత భాషలో వ్యక్తిగతీకరించిన ప్రభుత్వ పథకాలు.",
    getStarted: "ప్రారంభించండి",
    learnMore: "మరింత తెలుసుకోండి",
    aboutTitle: "ఫారెస్ట్‌కనెక్ట్ AI గురించి",
    aboutText1: "ఫారెస్ట్‌కనెక్ట్ AI అనేది డిజిటల్ విభజనను అధిగమించడం ద్వారా గిరిజన మరియు అటవీ ఆధారిత వర్గాల జీవనోపాధిని మెరుగుపరచడానికి రూపొందించబడిన డిజిటల్ ప్లాట్‌ఫారమ్.",
    aboutText2: "అటవీ సేకరణదారులు మధ్యవర్తులు లేకుండా తేనె, వెదురు, ఉసిరి మరియు మూలికలను నేరుగా కొనుగోలుదారులకు విక్రయించేందుకు మేము సహాయం చేస్తాము.",
    featuresTitle: "ప్రధాన ఫీచర్లు",
    featureMarketplaceTitle: "ప్రత్యక్ష మార్కెట్ స్థలం",
    featureMarketplaceDesc: "అటవీ ఉత్పత్తులను సరసమైన, ప్రామాణికమైన ధరలకు నేరుగా జాబితా చేసి విక్రయించండి.",
    featurePredictionTitle: "AI ధర అంచనా",
    featurePredictionDesc: "మెషిన్ లెర్నింగ్ ఉపయోగించి ఉత్పత్తుల డిమాండ్ మరియు సరైన విక్రయ సమయాన్ని అంచనా వేయండి.",
    featureSchemesTitle: "పథకాల సలహాదారు",
    featureSchemesDesc: "మీ ప్రొఫైల్‌కు వ్యక్తిగతీకరించిన ప్రభుత్వ సంక్షేమ మరియు సబ్సిడీ కార్యక్రమాలను కనుగొనండి.",
    featureVoiceTitle: "వాయిస్ అసిస్టెంట్",
    featureVoiceDesc: "స్థానిక భాషలలో వాయిస్ ఆదేశాల ద్వారా సిస్టమ్‌ను సులభంగా ఉపయోగించండి.",
    contactTitle: "మమ్మల్ని సంప్రదించండి",
    contactName: "పూర్తి పేరు",
    contactEmail: "ఇమెయిల్ చిరునామా",
    contactMessage: "సందేశం",
    contactSend: "సందేశం పంపండి",
    
    // Login & Register Pages
    loginTitle: "మళ్లీ స్వాగతం",
    loginSubtitle: "మీ ఫారెస్ట్‌కనెక్ట్ డాష్‌బోర్డ్‌ను యాక్సెస్ చేయడానికి సైన్ ఇన్ చేయండి",
    emailOrMobile: "మొబైల్ సంఖ్య లేదా ఇమెయిల్",
    password: "పాస్‌వర్డ్",
    confirmPassword: "పాస్‌వర్డ్ నిర్ధారించండి",
    rememberMe: "నన్ను గుర్తుంచుకో",
    forgotPassword: "పాస్‌వర్డ్ మర్చిపోయారా?",
    noAccount: "ఖాతా లేదా? ఇక్కడ నమోదు చేసుకోండి",
    alreadyAccount: "ఇప్పటికే ఖాతా ఉందా?",
    registerTitle: "ఖాతాను సృష్టించండి",
    registerSubtitle: "అటవీ సంఘం మార్కెట్ స్థలంలో చేరండి",
    fullName: "పూర్తి పేరు",
    mobileNumber: "మొబైల్ సంఖ్య",
    emailAddress: "ఇమెయిల్ చిరునామా (ఐచ్ఛికం)",
    village: "గ్రామం",
    district: "జిల్లా",
    state: "రాష్ట్రం",
    preferredLanguage: "ప్రాధాన్యత భాష",
    registerBtn: "ఇప్పుడే నమోదు చేసుకోండి",
    
    // Dashboard Page
    welcome: "స్వాగతం",
    dashboardTitle: "మీ జీవనోపాధి డాష్‌బోర్డ్",
    weatherSummary: "నేటి వాతావరణం",
    priceTrend: "AI ధర అంచనా",
    schemesSummary: "అర్హత గల సంక్షేమ పథకాలు",
    profileSummary: "ప్రొఫైల్ సారాంశం",
    location: "ప్రదేశం",
    activeUploads: "సక్రియ అప్‌లోడ్‌లు",
    predictedTrendText: "మార్కెట్ ధరలు ప్రస్తుతం స్థిరంగా ఉన్నాయి. విక్రయించడానికి ఉత్తమ సమయం: జూలై చివరిలో.",
    
    // Marketplace & Details Page
    searchPlaceholder: "తేనె, వెదురు, మూలికల కోసం వెతకండి...",
    allCategories: "అన్ని వర్గాలు",
    honey: "తేనె",
    bamboo: "వెదురు",
    herbs: "ఔషధ మూలికలు",
    fruits: "అటవీ పండ్లు",
    handicrafts: "చేతిపనులు",
    quantity: "పరిమాణం",
    marketPrice: "మార్కెట్ ధర",
    predictedPrice: "AI అంచనా ధర",
    sellerName: "విక్రేత పేరు",
    sellerContact: "విక్రేత సంప్రదింపు",
    description: "వివరణ",
    buyNow: "కొనడానికి కాల్ చేయండి",
    noProducts: "మీ ఫిల్టర్‌లకు సరిపోయే ఉత్పత్తులు ఏవీ కనుగొనబడలేదు.",
    
    // AI Prediction Page
    predictTitle: "AI ధర & డిమాండ్ అంచనా",
    predictSubtitle: "ధర అంచనాలను తెలుసుకోవడానికి పారామితులను ఎంచుకోండి",
    selectProduct: "అటవీ ఉత్పత్తిని ఎంచుకోండి",
    enterQuantity: "పరిమాణం (కిలోలు/ముక్కలలో)",
    selectMonth: "విక్రయించే నెల",
    predictBtn: "అంచనాను లెక్కించండి",
    resultExpectedPrice: "ఆశించిన మార్కెట్ ధర",
    resultDemand: "ఆశించిన డిమాండ్ స్థాయి",
    resultBestTime: "అత్యుత్తమ విక్రయ సమయం",
    high: "ఎక్కువ",
    medium: "మధ్యస్థం",
    low: "తక్కువ",
    
    // Government Schemes Page
    schemesTitle: "ప్రభుత్వ పథకాల పోర్టల్",
    schemesSubtitle: "మీరు అర్హత పొందే సంక్షేమ పథకాలను కనుగొనండి",
    inputAge: "వయస్సు",
    inputOccupation: "వృత్తి",
    inputIncome: "సంవత్సర ఆదాయం (₹)",
    inputState: "రాష్ట్రం",
    findSchemesBtn: "అర్హత గల పథకాలను కనుగొనండి",
    schemeEligibility: "అర్హత",
    schemeBenefits: "ప్రధాన ప్రయోజనాలు",
    applyNow: "దరఖాస్తు విధానం",
    
    // Voice Assistant Page
    voiceTitle: "వాయిస్ అసిస్టెంట్ పోర్టల్",
    voiceSubtitle: "వాయిస్ ఉపయోగించడానికి మైక్రోఫోన్‌ను నొక్కండి",
    voicePrompt: "నొక్కి మాట్లాడండి (ఉదా., 'మార్కెట్ ధరలు చూపించు', 'PM వన్ ధన్ యోజన కనుగొను')",
    listening: "వింటున్నాము... ఇప్పుడు మాట్లాడండి.",
    processing: "వాయిస్ ఇన్‌పుట్‌ను ప్రాసెస్ చేస్తున్నాము...",
    assistantGreeting: "నమస్కారం! ఈరోజు మీ అటవీ ఉత్పత్తులను నిర్వహించడంలో నేను మీకు ఎలా సహాయపడగలను?",
    voiceResponse: "మీ కోసం PM వన్ ధన్ యోజనతో సహా 3 పథకాలను కనుగొన్నాను. వాటి గురించి చదవాలనుకుంటున్నారా?",

    // Healthcare & Education Pages
    healthcare: "ఆరోగ్య సేవలు",
    education: "విద్య & శిక్షణ",
    healthcareTitle: "ఆరోగ్య మార్గదర్శకం",
    educationTitle: "విద్య & శిక్షణ",

    // Offline
    offlineMessage: "మీరు ఆఫ్‌లైన్‌లో ఉన్నారు. కనెక్షన్ వచ్చినప్పుడు డేటా సింక్ అవుతుంది.",
    syncingMessage: "ఆఫ్‌లైన్ డేటా సింక్ అవుతోంది...",
    syncedMessage: "మొత్తం డేటా సింక్ అయింది!"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Default to English

  const t = (key) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
