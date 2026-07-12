import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import VoiceAssistantWidget from '../components/VoiceAssistantWidget';
import { MdSchool, MdPlayCircle, MdOpenInNew, MdInfo, MdForest, MdPhoneAndroid, MdAccountBalance } from 'react-icons/md';

const DIGITAL_LITERACY = [
  {
    title: 'Using a Smartphone (స్మార్ట్‌ఫోన్ వాడటం)',
    emoji: '📱',
    topics: [
      { en: 'Turning on/off the phone and charging', te: 'ఫోన్ ఆన్/ఆఫ్ చేయడం మరియు ఛార్జింగ్' },
      { en: 'Making and receiving phone calls', te: 'ఫోన్ కాల్స్ చేయడం మరియు స్వీకరించడం' },
      { en: 'Using the camera to take photos', te: 'ఫోటోలు తీయడానికి కెమెరా వాడటం' },
      { en: 'Opening and using apps', te: 'యాప్స్ తెరవడం మరియు వాడటం' },
      { en: 'Connecting to WiFi networks', te: 'వైఫై నెట్‌వర్క్‌లకు కనెక్ట్ అవ్వడం' },
    ]
  },
  {
    title: 'Internet Basics (ఇంటర్నెట్ ప్రాథమికాలు)',
    emoji: '🌐',
    topics: [
      { en: 'What is the internet and how it works', te: 'ఇంటర్నెట్ అంటే ఏమిటి, ఎలా పనిచేస్తుంది' },
      { en: 'Using a web browser safely', te: 'వెబ్ బ్రౌజర్ సురక్షితంగా వాడటం' },
      { en: 'Searching for information on Google', te: 'గూగుల్‌లో సమాచారం వెతకడం' },
      { en: 'Staying safe online — avoiding scams', te: 'ఆన్‌లైన్ మోసాల నుండి రక్షణ' },
    ]
  },
  {
    title: 'Online Payments (ఆన్‌లైన్ చెల్లింపులు)',
    emoji: '💳',
    topics: [
      { en: 'Introduction to UPI and PhonePe/GPay', te: 'UPI, PhonePe/GPay పరిచయం' },
      { en: 'Setting up mobile banking', te: 'మొబైల్ బ్యాంకింగ్ సెటప్ చేయడం' },
      { en: 'Sending and receiving money safely', te: 'డబ్బు సురక్షితంగా పంపడం, స్వీకరించడం' },
      { en: 'Checking bank balance via missed call', te: 'మిస్డ్ కాల్ ద్వారా బ్యాంక్ బ్యాలెన్స్ చెక్ చేయడం' },
    ]
  }
];

const FOREST_TRAINING = [
  {
    title: 'Honey Harvesting (తేనె సేకరణ)',
    emoji: '🍯',
    tips: [
      { en: 'Best harvest season: March to June when flower bloom peaks', te: 'ఉత్తమ సేకరణ సీజన్: మార్చి నుండి జూన్' },
      { en: 'Use smoke (not fire) to calm bees during collection', te: 'సేకరణ సమయంలో తేనెటీగలను శాంతపరచడానికి పొగ వాడండి' },
      { en: 'Leave at least 1/3 of comb for bee colony survival', te: 'తేనెటీగల మనుగడ కోసం 1/3 తేనెపట్టు వదిలి పెట్టండి' },
      { en: 'Filter using clean muslin cloth, NOT metal strainers', te: 'శుభ్రమైన మస్లిన్ గుడ్డతో వడగట్టండి, మెటల్ వాడకండి' },
      { en: 'Store in glass or food-grade plastic containers, never in metal', te: 'గాజు లేదా ఫుడ్-గ్రేడ్ ప్లాస్టిక్ డబ్బాల్లో నిల్వ చేయండి' },
    ]
  },
  {
    title: 'Bamboo Processing (వెదురు ప్రాసెసింగ్)',
    emoji: '🎋',
    tips: [
      { en: 'Harvest bamboo that is 3-5 years old for best strength', te: '3-5 సంవత్సరాల వెదురును సేకరించండి' },
      { en: 'Cut during dry season (October-February) to prevent insect attack', te: 'కీటకాల దాడి నివారించడానికి పొడి సీజన్‌లో కట్ చేయండి' },
      { en: 'Season bamboo by soaking in water for 4-6 weeks or smoking', te: 'వెదురును 4-6 వారాలు నీటిలో నానబెట్టండి' },
      { en: 'Apply borax-boric acid solution for preservation', te: 'సంరక్షణ కోసం బోరాక్స్-బోరిక్ ఆసిడ్ ద్రావణం పూయండి' },
    ]
  },
  {
    title: 'Herb Drying & Packaging (మూలికలు ఎండబెట్టడం)',
    emoji: '🌿',
    tips: [
      { en: 'Wash herbs gently and dry in indirect sunlight', te: 'మూలికలను మెల్లగా కడిగి, పరోక్ష ఎండలో ఎండబెట్టండి' },
      { en: 'Spread on clean jute mats, not on bare ground', te: 'శుభ్రమైన జనపనార చాపలపై పరచండి, నేల మీద కాదు' },
      { en: 'Store in moisture-proof bags with proper labeling', te: 'తేమ-నిరోధక సంచుల్లో సరైన లేబులింగ్‌తో నిల్వ చేయండి' },
      { en: 'GCC grading: Remove broken pieces, sort by size for better rates', te: 'GCC గ్రేడింగ్: విరిగిన ముక్కలు తీసేయండి, మంచి ధరల కోసం పరిమాణం ప్రకారం వేరు చేయండి' },
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

const Education = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('digital');
  const [expandedSection, setExpandedSection] = useState(null);

  const tabs = [
    { id: 'digital', label: language === 'te' ? 'డిజిటల్ అక్షరాస్యత' : 'Digital Literacy', icon: '📱' },
    { id: 'forest', label: language === 'te' ? 'అటవీ శిక్షణ' : 'Forest Product Training', icon: '🌲' },
    { id: 'govt', label: language === 'te' ? 'ప్రభుత్వ వనరులు' : 'Government Resources', icon: '🏛️' },
    { id: 'children', label: language === 'te' ? 'పిల్లల విద్య' : "Children's Education", icon: '🎓' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg-forest">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <Sidebar />
        <main className="flex-1 space-y-6 animate-fade-in">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 font-display">
              {language === 'te' ? 'విద్య & శిక్షణ' : 'Education & Training'}
            </h2>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              {language === 'te' ? 'డిజిటల్ అక్షరాస్యత, అటవీ ఉత్పత్తుల శిక్షణ, ప్రభుత్వ వనరులు' : 'Digital literacy, forest product best practices, and government resources'}
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
                <span>{tab.label}</span>
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
                      <h3 className="font-bold text-sm text-gray-800 font-display">{section.title}</h3>
                    </div>
                    <span className={`text-gray-400 transition-transform ${expandedSection === idx ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {expandedSection === idx && (
                    <div className="px-5 pb-5 border-t border-gray-50">
                      <ul className="space-y-2 mt-3">
                        {section.topics.map((topic, tidx) => (
                          <li key={tidx} className="flex items-start gap-2 text-xs font-semibold text-gray-700">
                            <span className="text-forest-green mt-0.5">✓</span>
                            <span>{language === 'te' ? topic.te : topic.en}</span>
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
                      <h3 className="font-bold text-sm text-gray-800 font-display">{section.title}</h3>
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
                            <span>{language === 'te' ? tip.te : tip.en}</span>
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
                    {language === 'te' ? 'స్కాలర్‌షిప్ అవకాశాలు' : 'Scholarship Opportunities'}
                  </h4>
                  <ul className="space-y-2 text-xs font-semibold text-amber-900">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">•</span>
                      <span>{language === 'te' ? 'పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్ (ST విద్యార్థులకు): ₹10,000-₹25,000/సంవత్సరం' : 'Post-Matric Scholarship (ST Students): ₹10,000-₹25,000/year'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">•</span>
                      <span>{language === 'te' ? 'ప్రీ-మెట్రిక్ స్కాలర్‌షిప్: తరగతి 1-10 కోసం' : 'Pre-Matric Scholarship: For Classes 1-10'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">•</span>
                      <span>{language === 'te' ? 'ఏకలవ్య మోడల్ రెసిడెన్షియల్ పాఠశాలలు (EMRS)' : 'Eklavya Model Residential Schools (EMRS) — Free quality education'}</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      <VoiceAssistantWidget />
    </div>
  );
};

export default Education;
