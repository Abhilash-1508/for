import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { MdSchool, MdOpenInNew, MdInfo } from 'react-icons/md';

const DIGITAL_LITERACY = [
  {
    title: {
      en: 'Using a Smartphone',
      hi: 'स्मार्टफोन का उपयोग',
      te: 'స్మార్ట్‌ఫోన్ వాడటం'
    },
    emoji: '📱',
    topics: [
      { en: 'Turning on/off the phone and charging', hi: 'फोन चालू/बंद करना और चार्ज करना', te: 'ఫోన్ ఆన్/ఆఫ్ చేయడం మరియు ఛార్జింగ్' },
      { en: 'Making and receiving phone calls', hi: 'फोन कॉल करना और प्राप्त करना', te: 'ఫోన్ కాల్స్ చేయడం మరియు స్వీకరించడం' },
      { en: 'Using the camera to take photos', hi: 'तस्वीरें लेने के लिए कैमरे का उपयोग', te: 'ఫోటోలు తీయడానికి కెమెరా వాడటం' },
      { en: 'Opening and using apps', hi: 'ऐप्स खोलना और चलाना', te: 'యాప్స్ తెరవడం మరియు వాడటం' },
      { en: 'Connecting to WiFi networks', hi: 'वाई-फाई से जुड़ना', te: 'వైఫై నెట్‌వర్క్‌లకు కనెక్ట్ అవ్వడం' },
    ]
  },
  {
    title: {
      en: 'Internet Basics',
      hi: 'इंटरनेट की मूल बातें',
      te: 'ఇంటర్నెట్ ప్రాథమికాలు'
    },
    emoji: '🌐',
    topics: [
      { en: 'What is the internet and how it works', hi: 'इंटरनेट क्या है और यह कैसे काम करता है', te: 'ఇంటర్నెట్ అంటే ఏమిటి, ఎలా పనిచేస్తుంది' },
      { en: 'Using a web browser safely', hi: 'वेब ब्राउज़र का सुरक्षित उपयोग', te: 'వెబ్ బ్రౌజర్ సురక్షితంగా వాడటం' },
      { en: 'Searching for information on Google', hi: 'गूगल पर जानकारी खोजना', te: 'గూగుల్‌లో సమాచారం వెతకడం' },
      { en: 'Staying safe online — avoiding scams', hi: 'ऑनलाइन सुरक्षित रहना — धोखाधड़ी से बचाव', te: 'ఆన్‌లైన్ మోసాల నుండి రక్షణ' },
    ]
  },
  {
    title: {
      en: 'Online Payments',
      hi: 'ऑनलाइन भुगतान',
      te: 'ఆన్‌లైన్ చెల్లింపులు'
    },
    emoji: '💳',
    topics: [
      { en: 'Introduction to UPI and PhonePe/GPay', hi: 'यूपीआई और फोनपे/गूगल पे का परिचय', te: 'UPI, PhonePe/GPay పరిచయం' },
      { en: 'Setting up mobile banking', hi: 'मोबाइल बैंकिंग सेट करना', te: 'మొబైల్ బ్యాంకింగ్ సెటప్ చేయడం' },
      { en: 'Sending and receiving money safely', hi: 'सुरक्षित रूप से पैसे भेजना और प्राप्त करना', te: 'డబ్బు సురక్షితంగా పంపడం, స్వీకరించడం' },
      { en: 'Checking bank balance via missed call', hi: 'मिस कॉल से बैंक बैलेंस चेक करना', te: 'మిస్డ్ కాల్ ద్వారా బ్యాంక్ బ్యాలెన్స్ చెక్ చేయడం' },
    ]
  }
];

const FOREST_TRAINING = [
  {
    title: {
      en: 'Honey Harvesting',
      hi: 'शहद कटाई तकनीक',
      te: 'తేనె సేకరణ'
    },
    emoji: '🍯',
    tips: [
      { en: 'Best harvest season: March to June when flower bloom peaks', hi: 'सर्वोत्तम कटाई का मौसम: मार्च से जून', te: 'ఉత్తమ సేకరణ సీజన్: మార్చి నుండి జూన్' },
      { en: 'Use smoke (not fire) to calm bees during collection', hi: 'मक्खियों को शांत करने के लिए धुएँ का उपयोग करें', te: 'సేకరణ సమయంలో తేనెటీగలను శాంతపరచడానికి పొగ వాడండి' },
      { en: 'Leave at least 1/3 of comb for bee colony survival', hi: 'मक्खियों के अस्तित्व के लिए 1/3 छत्ता छोड़ दें', te: 'తేనెటీగల మనుగడ కోసం 1/3 తేనెపట్టు వదిలి పెట్టండి' },
      { en: 'Filter using clean muslin cloth, NOT metal strainers', hi: 'साफ कपड़े से छानें, लोहे की छलनी का प्रयोग न करें', te: 'శుభ్రమైన మస్లిన్ గుడ్డతో వడగట్టండి, మెటల్ వాడకండి' },
      { en: 'Store in glass or food-grade plastic containers, never in metal', hi: 'कांच या फूड-ग्रेड प्लास्टिक के डिब्बों में रखें', te: 'గాజు లేదా ఫుడ్-గ్రేడ్ ప్లాస్టిక్ డబ్బాల్లో నిల్వ చేయండి' },
    ]
  },
  {
    title: {
      en: 'Bamboo Processing',
      hi: 'बांस प्रसंस्करण',
      te: 'వెదురు ప్రాసెసింగ్'
    },
    emoji: '🎋',
    tips: [
      { en: 'Harvest bamboo that is 3-5 years old for best strength', hi: '3-5 साल पुराने बांस की कटाई करें', te: '3-5 సంవత్సరాల వెదురును సేకరించండి' },
      { en: 'Cut during dry season (October-February) to prevent insect attack', hi: 'कीड़ों से बचने के लिए सूखे मौसम में कटाई करें', te: 'కీటకాల దాడి నివారించడానికి పొడి సీజన్‌లో కట్ చేయండి' },
      { en: 'Season bamboo by soaking in water for 4-6 weeks or smoking', hi: 'बांस को पानी में भिगोकर या धुएँ में सुखाकर प्रसंस्कृत करें', te: 'వెదురును 4-6 వారాలు నీటిలో నానబెట్టండి' },
      { en: 'Apply borax-boric acid solution for preservation', hi: 'सुरक्षा के लिए बोरेक्स घोल लगाएं', te: 'సంరక్షణ కోసం బోరాక్స్-బోరిక్ ఆసిడ్ ద్రావణం పూయండి' },
    ]
  },
  {
    title: {
      en: 'Herb Drying & Packaging',
      hi: 'जड़ी-बूटी सुखाना एवं पैकेजिंग',
      te: 'మూలికలు ఎండబెట్టడం'
    },
    emoji: '🌿',
    tips: [
      { en: 'Wash herbs gently and dry in indirect sunlight', hi: 'जड़ी-बूटियों को धोकर हल्की धूप में सुखाएं', te: 'మూలికలను మెల్లగా కడిగి, పరోక్ష ఎండలో ఎండబెట్టండి' },
      { en: 'Spread on clean jute mats, not on bare ground', hi: 'साफ जूट की चटाई पर फैलाएं, नंगे फर्श पर नहीं', te: 'శుభ్రమైన జనపనార చాపలపై పరచండి, నేల మీద కాదు' },
      { en: 'Store in moisture-proof bags with proper labeling', hi: 'नमी-रोधी बैगों में लेबल के साथ रखें', te: 'తేమ-నిరోధక సంచుల్లో సరైన లేబులింగ్‌తో నిల్వ చేయండి' },
      { en: 'GCC grading: Remove broken pieces, sort by size for better rates', hi: 'जीसीसी ग्रेडिंग: आकार के अनुसार अलग करें', te: 'GCC గ్రేడింగ్: విరిగిన ముక్కలు తీసేయండి, మంచి ధరల కోసం పరిమాణం ప్రకారం వేరు చేయండి' },
    ]
  }
];

const EDUCATIONAL_LINKS = [
  { name: 'DIKSHA Portal', desc: 'Free e-learning platform by Government of India', url: 'https://diksha.gov.in', icon: '📚' },
  { name: 'PM e-Vidya', desc: 'Multi-mode digital education access (TV, Radio, Internet)', url: 'https://www.swayam.gov.in', icon: '🎓' },
  { name: 'National Scholarship Portal', desc: 'Find and apply for scholarships for tribal students', url: 'https://scholarships.gov.in', icon: '💰' },
  { name: 'Tribal Affairs Ministry', desc: 'Official schemes, reports, and resources for tribal communities', url: 'https://tribal.nic.in', icon: '🏛️' },
  { name: 'Forest Rights Act Resources', desc: 'Learn about your forest rights under FRA 2006', url: 'https://tribal.nic.in/fra.aspx', icon: '📜' },
  { name: 'Van Dhan Portal', desc: 'TRIFED Van Dhan Yojana resources and registration', url: 'https://trifed.tribal.gov.in', icon: '🌳' },
];

const SCHOLARSHIP_ITEMS = [
  {
    en: 'Post-Matric Scholarship (ST Students): ₹10,000-₹25,000/year',
    hi: 'पोस्ट-मैट्रिक छात्रवृत्ति (एसटी छात्र): ₹10,000-₹25,000/वर्ष',
    te: 'పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్ (ST విద్యార్థులకు): ₹10,000-₹25,000/సంవత్సరం'
  },
  {
    en: 'Pre-Matric Scholarship: For Classes 1 to 10 ST students',
    hi: 'प्री-मैट्रिक छात्रवृत्ति: कक्षा 1 से 10 के एसटी छात्रों के लिए',
    te: 'ప్రీ-మెట్రిక్ స్కాలర్‌షిప్: 1-10 తరగతుల ST విద్యార్థులకు'
  },
  {
    en: 'Eklavya Model Residential Schools (EMRS) — Free quality boarding education',
    hi: 'एकलव्य मॉडल आवासीय विद्यालय (EMRS) — निःशुल्क गुणवत्तापूर्ण शिक्षा',
    te: 'ఏకలవ్య మోడల్ గురుకుల పాఠశాలలు (EMRS) — ఉచిత నాణ్యమైన బోర్డింగ్ విద్య'
  }
];

const Education = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('digital');
  const [expandedSection, setExpandedSection] = useState(null);

  const tabs = [
    { id: 'digital', labelKey: 'digitalLiteracy', defaultLabel: 'Digital Literacy', icon: '📱' },
    { id: 'forest', labelKey: 'forestTraining', defaultLabel: 'Forest Product Training', icon: '🌲' },
    { id: 'govt', labelKey: 'govtResources', defaultLabel: 'Government Resources', icon: '🏛️' },
    { id: 'children', labelKey: 'childrenEducation', defaultLabel: "Children's Education", icon: '🎓' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg-forest">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <Sidebar />
        <main className="flex-1 space-y-6 animate-fade-in">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 font-display">
              {t('educationTitle')}
            </h2>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              {t('educationSubtitle')}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setExpandedSection(null); }}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-forest-green text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{t(tab.labelKey) || tab.defaultLabel}</span>
              </button>
            ))}
          </div>

          {/* Digital Literacy Tab */}
          {activeTab === 'digital' && (
            <div className="space-y-4">
              {DIGITAL_LITERACY.map((section, idx) => (
                <div key={idx} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(expandedSection === idx ? null : idx)}
                    className="w-full p-5 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{section.emoji}</span>
                      <h3 className="font-bold text-sm text-gray-800 font-display">
                        {section.title[language] || section.title.en}
                      </h3>
                    </div>
                    <span className={`text-gray-400 transition-transform ${expandedSection === idx ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {expandedSection === idx && (
                    <div className="px-5 pb-5 border-t border-gray-50">
                      <ul className="space-y-2 mt-3">
                        {section.topics.map((topic, tidx) => (
                          <li key={tidx} className="flex items-start gap-2 text-xs font-semibold text-gray-700">
                            <span className="text-forest-green mt-0.5">✓</span>
                            <span>{topic[language] || topic.en}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Forest Product Training Tab */}
          {activeTab === 'forest' && (
            <div className="space-y-4">
              {FOREST_TRAINING.map((section, idx) => (
                <div key={idx} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(expandedSection === idx ? null : idx)}
                    className="w-full p-5 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{section.emoji}</span>
                      <h3 className="font-bold text-sm text-gray-800 font-display">
                        {section.title[language] || section.title.en}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] bg-emerald-50 text-forest-green font-extrabold px-2 py-0.5 rounded-full border border-emerald-100/30 uppercase">
                        {section.tips.length} tips
                      </span>
                      <span className={`text-gray-400 transition-transform ${expandedSection === idx ? 'rotate-180' : ''}`}>▼</span>
                    </div>
                  </button>
                  {expandedSection === idx && (
                    <div className="px-5 pb-5 border-t border-gray-50">
                      <ol className="space-y-3 mt-3">
                        {section.tips.map((tip, tidx) => (
                          <li key={tidx} className="flex items-start gap-2 text-xs font-semibold text-gray-700 leading-relaxed">
                            <span className="bg-forest-green text-white text-[9px] font-black w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center mt-0.5">{tidx + 1}</span>
                            <span>{tip[language] || tip.en}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Government Resources Tab */}
          {(activeTab === 'govt' || activeTab === 'children') && (
            <div className="space-y-4">
              {activeTab === 'govt' && (
                <div className="bg-emerald-50 rounded-3xl border border-emerald-100/50 p-5 flex items-start gap-3 text-xs text-emerald-900 font-semibold leading-relaxed">
                  <MdInfo className="h-5 w-5 text-forest-green flex-shrink-0 mt-0.5" />
                  <p>
                    {language === 'te'
                      ? 'ఈ వనరులు భారత ప్రభుత్వ అధికారిక వెబ్‌సైట్ల నుండి సేకరించబడ్డాయి. ఆఫ్‌లైన్‌లో కూడా చదవగలిగేలా ముఖ్యమైన సమాచారం భద్రపరచబడింది.'
                      : language === 'hi'
                      ? 'ये संसाधन भारत सरकार के आधिकारिक पोर्टलों से लिए गए हैं। दूरस्थ वन क्षेत्रों में ऑफ़लाइन पहुँच के लिए महत्वपूर्ण जानकारी सहेजी गई है।'
                      : 'These resources are from official Government of India portals. Key information is cached for offline access in remote forest regions.'}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {EDUCATIONAL_LINKS.filter(link => {
                  if (activeTab === 'children') return ['DIKSHA Portal', 'PM e-Vidya', 'National Scholarship Portal'].includes(link.name);
                  return true;
                }).map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all hover:border-emerald-100 group flex items-start gap-4"
                  >
                    <span className="text-3xl">{link.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-gray-800 font-display group-hover:text-forest-green transition-colors flex items-center gap-1">
                        {link.name}
                        <MdOpenInNew className="h-3.5 w-3.5 text-gray-400 group-hover:text-forest-green" />
                      </h4>
                      <p className="text-[10px] text-gray-500 font-semibold mt-1 leading-relaxed">{link.desc}</p>
                    </div>
                  </a>
                ))}
              </div>

              {activeTab === 'children' && (
                <div className="bg-amber-50 rounded-3xl border border-amber-200/50 p-5 space-y-3">
                  <h4 className="font-extrabold text-sm text-amber-800 font-display flex items-center gap-2">
                    <MdSchool className="h-5 w-5" />
                    {language === 'te' ? 'స్కాలర్‌షిప్ అవకాశాలు' : language === 'hi' ? 'छात्रवृत्ति के अवसर' : 'Scholarship Opportunities'}
                  </h4>
                  <ul className="space-y-2 text-xs font-semibold text-amber-900">
                    {SCHOLARSHIP_ITEMS.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-600 mt-0.5">•</span>
                        <span>{item[language] || item.en}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Education;
