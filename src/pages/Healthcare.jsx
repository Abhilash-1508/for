import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import VoiceAssistantWidget from '../components/VoiceAssistantWidget';
import { MdLocalHospital, MdPhone, MdLocationOn, MdSearch, MdWarning, MdInfo, MdFavorite } from 'react-icons/md';

const FIRST_AID_DATA = [
  {
    id: 'fa1',
    title: 'Snake Bite (పాము కాటు)',
    emoji: '🐍',
    severity: 'Critical',
    steps: [
      'Keep the person calm and still. Do NOT let them walk or run.',
      'Immobilize the bitten limb and keep it below heart level.',
      'Remove rings, bangles, or tight clothing near the bite before swelling starts.',
      'Do NOT cut the wound, suck out venom, or apply tourniquet.',
      'Rush to the nearest PHC/CHC immediately. Call 108 ambulance.',
    ],
    stepsLocal: [
      'వ్యక్తిని ప్రశాంతంగా ఉంచండి. నడవనివ్వకండి.',
      'కాటు వేసిన అవయవాన్ని కదలకుండా గుండె స్థాయి కింద ఉంచండి.',
      'వాపు రాకముందే ఉంగరాలు, గాజులు తీసేయండి.',
      'గాయాన్ని కోయవద్దు, విషం పీల్చవద్దు.',
      'వెంటనే సమీపంలోని ఆసుపత్రికి తీసుకెళ్ళండి. 108 కు కాల్ చేయండి.',
    ]
  },
  {
    id: 'fa2',
    title: 'Bee/Wasp Sting (తేనెటీగ కుట్టడం)',
    emoji: '🐝',
    severity: 'Moderate',
    steps: [
      'Scrape out the stinger with a flat object (credit card, knife edge).',
      'Wash the area with soap and water.',
      'Apply cold compress or wet mud to reduce swelling.',
      'Take antihistamine if available. Watch for allergic reactions (difficulty breathing).',
      'Seek medical help if stung multiple times or if allergic reaction occurs.',
    ],
    stepsLocal: [
      'ముల్లును చెక్కతో గీసి తీయండి.',
      'సబ్బు నీటితో కడగండి.',
      'చల్లని నీటి గుడ్డ లేదా తడి మట్టి పూయండి.',
      'అలెర్జీ మందు ఉంటే తీసుకోండి. శ్వాస ఇబ్బంది ఉంటే వెంటనే వైద్యం చేయండి.',
      'చాలాసార్లు కుడితే వైద్య సహాయం తీసుకోండి.',
    ]
  },
  {
    id: 'fa3',
    title: 'Deep Cut / Wound (లోతైన గాయం)',
    emoji: '🩹',
    severity: 'Moderate',
    steps: [
      'Apply direct pressure with a clean cloth to stop bleeding.',
      'Elevate the injured area above heart level if possible.',
      'Clean the wound with clean water. Do NOT remove embedded objects.',
      'Wrap with clean bandage or cloth strip. Keep it tight but not cutting off circulation.',
      'Get a tetanus shot if the wound is from a rusty object.',
    ],
    stepsLocal: [
      'శుభ్రమైన గుడ్డతో గాయంపై నేరుగా ఒత్తిడి చేయండి.',
      'గాయమైన భాగాన్ని గుండె కంటే పైకి ఎత్తండి.',
      'శుభ్రమైన నీటితో గాయాన్ని కడగండి.',
      'బ్యాండేజ్ కట్టండి.',
      'తుప్పు పట్టిన వస్తువు వల్ల గాయమైతే టెటానస్ ఇంజెక్షన్ వేయించండి.',
    ]
  },
  {
    id: 'fa4',
    title: 'Heat Stroke (వేడి దెబ్బ)',
    emoji: '🌡️',
    severity: 'Critical',
    steps: [
      'Move the person to a cool, shady area immediately.',
      'Remove excess clothing. Fan the person and apply cool water to skin.',
      'Place ice packs or cold cloth on neck, armpits, and groin.',
      'Give small sips of water if the person is conscious.',
      'Call 108 ambulance if the person loses consciousness.',
    ],
    stepsLocal: [
      'వ్యక్తిని వెంటనే చల్లని నీడకు తరలించండి.',
      'అదనపు బట్టలు తీసేయండి. విసనకర్రతో గాలి వీయండి.',
      'మెడ, చంకలు, తొడల్లో చల్లని నీటి గుడ్డ ఉంచండి.',
      'మెలకువగా ఉంటే నీరు ఇవ్వండి.',
      'స్పృహ కోల్పోతే 108 కు కాల్ చేయండి.',
    ]
  }
];

const HEALTH_CENTERS = [
  { name: 'Utnoor Area Hospital', type: 'CHC', distance: '12 km', phone: '08752-255155', location: 'Utnoor, Adilabad' },
  { name: 'Kerameri PHC', type: 'PHC', distance: '5 km', phone: '08752-244033', location: 'Kerameri, Adilabad' },
  { name: 'Narnoor PHC', type: 'PHC', distance: '8 km', phone: '08752-233122', location: 'Narnoor, Adilabad' },
  { name: 'RIMS Adilabad', type: 'District Hospital', distance: '45 km', phone: '08732-226677', location: 'Adilabad Town' },
  { name: 'Bhadrachalam Area Hospital', type: 'CHC', distance: '15 km', phone: '08743-244200', location: 'Bhadrachalam' },
];

const MEDICINAL_PLANTS = [
  { name: 'Turmeric (పసుపు)', uses: 'Anti-inflammatory, wound healing, immunity booster', preparation: 'Mix with warm milk or apply paste on wounds' },
  { name: 'Neem (వేప)', uses: 'Antibacterial, skin diseases, blood purifier', preparation: 'Boil leaves for skin wash or chew tender twigs for dental hygiene' },
  { name: 'Tulsi / Holy Basil (తులసి)', uses: 'Cold, cough, fever, stress relief', preparation: 'Boil leaves with ginger and honey for herbal tea' },
  { name: 'Aloe Vera (కలబంద)', uses: 'Burns, skin care, digestive health', preparation: 'Apply fresh gel on burns or mix pulp with water for consumption' },
  { name: 'Ashwagandha (అశ్వగంధ)', uses: 'Energy, immunity, stress management', preparation: 'Root powder mixed with warm milk before bed' },
  { name: 'Amla / Gooseberry (ఉసిరి)', uses: 'Vitamin C, hair health, digestion', preparation: 'Eat raw, make juice, or sun-dry for preservation' },
];

const Healthcare = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('firstaid');
  const [expandedGuide, setExpandedGuide] = useState(null);

  const tabs = [
    { id: 'firstaid', label: language === 'te' ? 'ప్రథమ చికిత్స' : 'First Aid Guide', icon: '🩺' },
    { id: 'centers', label: language === 'te' ? 'ఆరోగ్య కేంద్రాలు' : 'Health Centers', icon: '🏥' },
    { id: 'plants', label: language === 'te' ? 'ఔషధ మొక్కలు' : 'Medicinal Plants', icon: '🌿' },
    { id: 'emergency', label: language === 'te' ? 'అత్యవసర సంఖ్యలు' : 'Emergency', icon: '🚑' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg-forest">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <Sidebar />
        <main className="flex-1 space-y-6 animate-fade-in">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 font-display">
              {language === 'te' ? 'ఆరోగ్య సేవలు' : 'Healthcare Guidance'}
            </h2>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              {language === 'te' ? 'ప్రథమ చికిత్స, సమీప ఆసుపత్రులు, ఔషధ మొక్కలు' : 'First aid, nearby health centers, and medicinal plant knowledge'}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

          {/* First Aid Tab */}
          {activeTab === 'firstaid' && (
            <div className="space-y-4">
              {FIRST_AID_DATA.map((guide) => (
                <div key={guide.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <button
                    onClick={() => setExpandedGuide(expandedGuide === guide.id ? null : guide.id)}
                    className="w-full p-5 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{guide.emoji}</span>
                      <div>
                        <h3 className="font-bold text-sm text-gray-800 font-display">{guide.title}</h3>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          guide.severity === 'Critical' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>{guide.severity}</span>
                      </div>
                    </div>
                    <span className={`text-gray-400 transition-transform ${expandedGuide === guide.id ? 'rotate-180' : ''}`}>▼</span>
                  </button>

                  {expandedGuide === guide.id && (
                    <div className="px-5 pb-5 pt-0 border-t border-gray-50">
                      <ol className="space-y-2 mt-3">
                        {(language === 'te' ? guide.stepsLocal : guide.steps).map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-gray-700 leading-relaxed">
                            <span className="bg-forest-green text-white text-[9px] font-black w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center mt-0.5">{idx + 1}</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Health Centers Tab */}
          {activeTab === 'centers' && (
            <div className="space-y-4">
              {HEALTH_CENTERS.map((center, idx) => (
                <div key={idx} className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
                      <MdLocalHospital className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-gray-800 font-display">{center.name}</h4>
                      <div className="flex items-center gap-3 text-[10px] font-semibold text-gray-500">
                        <span className="bg-emerald-50 text-forest-green px-2 py-0.5 rounded-full border border-emerald-100/30">{center.type}</span>
                        <span className="flex items-center gap-0.5">
                          <MdLocationOn className="h-3 w-3" />
                          {center.distance}
                        </span>
                        <span>{center.location}</span>
                      </div>
                    </div>
                  </div>
                  <a href={`tel:${center.phone}`} className="flex items-center gap-1 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all border border-red-100">
                    <MdPhone className="h-4 w-4" />
                    <span className="hidden sm:inline">Call</span>
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Medicinal Plants Tab */}
          {activeTab === 'plants' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MEDICINAL_PLANTS.map((plant, idx) => (
                <div key={idx} className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🌿</span>
                    <h4 className="font-bold text-sm text-gray-800 font-display">{plant.name}</h4>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">{language === 'te' ? 'ఉపయోగాలు' : 'Uses'}</p>
                      <p className="font-semibold text-gray-700">{plant.uses}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">{language === 'te' ? 'తయారీ' : 'Preparation'}</p>
                      <p className="font-semibold text-forest-green">{plant.preparation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Emergency Tab */}
          {activeTab === 'emergency' && (
            <div className="space-y-4">
              <div className="bg-red-50 rounded-3xl border border-red-200/50 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-red-700">
                  <MdWarning className="h-5 w-5" />
                  <h3 className="font-extrabold text-sm font-display uppercase tracking-wider">
                    {language === 'te' ? 'అత్యవసర హెల్ప్‌లైన్ నంబర్లు' : 'Emergency Helpline Numbers'}
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { number: '108', label: 'Ambulance (అంబులెన్స్)', desc: 'Free 24/7 emergency medical transport' },
                    { number: '104', label: 'Health Helpline (ఆరోగ్య హెల్ప్‌లైన్)', desc: 'Medical advice and information' },
                    { number: '112', label: 'Emergency (ఎమర్జెన్సీ)', desc: 'All emergencies — police, fire, ambulance' },
                    { number: '1800-599-0019', label: 'Tribal Welfare (గిరిజన సంక్షేమం)', desc: 'TRIFED helpline for tribal support' },
                  ].map((item, idx) => (
                    <a key={idx} href={`tel:${item.number}`} className="bg-white p-4 rounded-2xl border border-red-100 hover:border-red-300 transition-colors flex items-center gap-3 group">
                      <div className="p-3 bg-red-100 group-hover:bg-red-500 text-red-600 group-hover:text-white rounded-xl transition-colors">
                        <MdPhone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-lg font-black text-red-700">{item.number}</p>
                        <p className="text-xs font-bold text-gray-800">{item.label}</p>
                        <p className="text-[10px] text-gray-500 font-semibold">{item.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-50 rounded-3xl border border-emerald-100/50 p-5 flex items-start gap-3 text-xs text-emerald-900 font-semibold leading-relaxed">
                <MdInfo className="h-5 w-5 text-forest-green flex-shrink-0 mt-0.5" />
                <p>
                  {language === 'te'
                    ? 'ఈ నంబర్లు భారతదేశం అంతటా పనిచేస్తాయి. అత్యవసర సమయంలో ఎటువంటి ఛార్జీలు ఉండవు. 108 అంబులెన్స్ సేవ ఉచితం.'
                    : 'These numbers work across India 24/7. 108 ambulance service is completely free. In remote forest areas, alert the nearest forest ranger station if phone connectivity is unavailable.'}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
      <VoiceAssistantWidget />
    </div>
  );
};

export default Healthcare;
