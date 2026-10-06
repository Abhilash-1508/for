import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { MdLocalHospital, MdPhone, MdLocationOn, MdWarning, MdInfo } from 'react-icons/md';

const FIRST_AID_DATA = [
  {
    id: 'fa1',
    title: {
      en: 'Snake Bite First Aid',
      hi: 'सांप काटने पर प्राथमिक चिकित्सा',
      te: 'పాము కాటు ప్రథమ చికిత్స'
    },
    emoji: '🐍',
    severity: 'Critical',
    steps: {
      en: [
        'Keep the person calm and still. Do NOT let them walk or run.',
        'Immobilize the bitten limb and keep it below heart level.',
        'Remove rings, bangles, or tight clothing near the bite before swelling starts.',
        'Do NOT cut the wound, suck out venom, or apply tourniquet.',
        'Rush to the nearest PHC/CHC immediately. Call 108 ambulance.',
      ],
      hi: [
        'व्यक्ति को शांत और स्थिर रखें। उन्हें चलने या दौड़ने न दें।',
        'काटे गए अंग को स्थिर रखें और इसे दिल के स्तर से नीचे रखें।',
        'सूजन शुरू होने से पहले डंक के पास की अंगूठियां या तंग कपड़े हटा दें।',
        'घाव को काटें नहीं, जहर न चूसें, न ही कसकर पट्टी बांधें।',
        'तुरंत निकटतम प्राथमिक स्वास्थ्य केंद्र (PHC) पहुंचें। 108 एम्बुलेंस को कॉल करें।',
      ],
      te: [
        'వ్యక్తిని ప్రశాంతంగా ఉంచండి. నడవనివ్వకండి.',
        'కాటు వేసిన అవయవాన్ని కదలకుండా గుండె స్థాయి కింద ఉంచండి.',
        'వాపు రాకముందే ఉంగరాలు, గాజులు తీసేయండి.',
        'గాయాన్ని కోయవద్దు, విషం పీల్చవద్దు.',
        'వెంటనే సమీపంలోని ఆసుపత్రికి తీసుకెళ్ళండి. 108 కు కాల్ చేయండి.',
      ]
    }
  },
  {
    id: 'fa2',
    title: {
      en: 'Bee / Wasp Sting',
      hi: 'मधुमक्खी / ततैया का डंक',
      te: 'తేనెటీగ / తుమ్మెద కుట్టడం'
    },
    emoji: '🐝',
    severity: 'Moderate',
    steps: {
      en: [
        'Scrape out the stinger gently with a flat card or blunt edge.',
        'Wash the area thoroughly with soap and clean water.',
        'Apply cold compress or clean wet cloth to reduce swelling.',
        'Take antihistamine if available. Watch for severe breathing reactions.',
        'Seek medical help immediately if stung multiple times.',
      ],
      hi: [
        'डंक को किसी समतल कार्ड या कुंद किनारे से धीरे से खुरच कर निकालें।',
        'क्षेत्र को साबुन और साफ पानी से अच्छी तरह धोएं।',
        'सूजन कम करने के लिए ठंडी सिकाई या साफ गीला कपड़ा लगाएं।',
        'यदि उपलब्ध हो तो एंटीहिस्टामाइन लें। सांस लेने में तकलीफ पर ध्यान दें।',
        'यदि कई बार डंक मारा गया हो तो तुरंत चिकित्सा सहायता लें।',
      ],
      te: [
        'ముల్లును చెక్కతో లేదా కార్డ్‌తో గీసి తీయండి.',
        'సబ్బు నీటితో శుభ్రంగా కడగండి.',
        'చల్లని నీటి గుడ్డ లేదా తడి మట్టి పూయండి.',
        'అలెర్జీ మందు ఉంటే తీసుకోండి. శ్వాస ఇబ్బంది ఉంటే జాగ్రత్తపడండి.',
        'చాలాసార్లు కుడితే వెంటనే వైద్య సహాయం తీసుకోండి.',
      ]
    }
  },
  {
    id: 'fa3',
    title: {
      en: 'Deep Cut / Bleeding Wound',
      hi: 'गहरा घाव और रक्तस्राव',
      te: 'లోతైన గాయం & రక్తం కారడం'
    },
    emoji: '🩹',
    severity: 'Moderate',
    steps: {
      en: [
        'Apply direct pressure with a clean cloth to stop bleeding.',
        'Elevate the injured area above heart level if possible.',
        'Clean the wound with clean water. Do NOT remove embedded deep objects.',
        'Wrap with clean bandage. Keep firm but not cutting off circulation.',
        'Get a tetanus injection if the wound is from rusty metal or soil.',
      ],
      hi: [
        'रक्तस्राव रोकने के लिए साफ कपड़े से सीधा दबाव डालें।',
        'यदि संभव हो तो घायल हिस्से को दिल के स्तर से ऊपर उठाएं।',
        'घाव को साफ पानी से धोएं। गहराई में धंसी वस्तुओं को न निकालें।',
        'साफ पट्टी से बांधें। मजबूती से रखें लेकिन रक्त संचार न रोकें।',
        'जंग लगे लोहे से घाव होने पर टेटनस का टीका लगवाएं।',
      ],
      te: [
        'శుభ్రమైన గుడ్డతో గాయంపై నేరుగా ఒత్తిడి చేయండి.',
        'గాయమైన భాగాన్ని గుండె కంటే పైకి ఎత్తండి.',
        'శుభ్రమైన నీటితో గాయాన్ని కడగండి.',
        'శుభ్రమైన బ్యాండేజ్ కట్టండి.',
        'తుప్పు పట్టిన వస్తువు వల్ల గాయమైతే టెటానస్ ఇంజెక్షన్ వేయించండి.',
      ]
    }
  },
  {
    id: 'fa4',
    title: {
      en: 'Heat Stroke / Exhaustion',
      hi: 'लू और हीट स्ट्रोक',
      te: 'వడదెబ్బ / హీట్ స్ట్రోక్'
    },
    emoji: '🌡️',
    severity: 'Critical',
    steps: {
      en: [
        'Move the person to a cool, shaded area immediately.',
        'Remove heavy clothing. Fan the person and sponge with cool water.',
        'Place ice packs or cold damp cloth on neck, armpits, and forehead.',
        'Give small sips of ORS or electrolyte water if conscious.',
        'Call 108 ambulance immediately if the person faints.',
      ],
      hi: [
        'व्यक्ति को तुरंत ठंडे, छायादार स्थान पर ले जाएं।',
        'भारी कपड़े उतारें। हवा करें और ठंडे पानी से स्पंज करें।',
        'गर्दन, बगल और माथे पर ठंडी पट्टी रखें।',
        'होश में होने पर ओआरएस या पानी की छोटी घूंट दें।',
        'यदि व्यक्ति बेहोश हो जाए तो तुरंत 108 पर कॉल करें।',
      ],
      te: [
        'వ్యక్తిని వెంటనే చల్లని నీడకు తరలించండి.',
        'అదనపు బట్టలు తీసేయండి. విసనకర్రతో గాలి వీయండి.',
        'మెడ, చంకలు, నుదుటిపై చల్లని నీటి గుడ్డ ఉంచండి.',
        'స్పృహలో ఉంటే ORS లేదా నీరు ఇవ్వండి.',
        'స్పృహ కోల్పోతే వెంటనే 108 కు కాల్ చేయండి.',
      ]
    }
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
  {
    name: { en: 'Turmeric (Haldi)', hi: 'हल्दी (Turmeric)', te: 'పసుపు (Turmeric)' },
    uses: { en: 'Anti-inflammatory, wound healing, immunity booster', hi: 'सूजन रोधी, घाव भरना, रोग प्रतिरोधक क्षमता', te: 'వాపు నివారిణి, గాయాలు మానడం, రోగ నిరోధక శక్తి' },
    preparation: { en: 'Mix with warm milk or apply paste on wounds', hi: 'गर्म दूध में मिलाकर पिएं या घाव पर लेप लगाएं', te: 'వేడి పాలలో కలపండి లేదా గాయాలపై పేస్ట్ పూయండి' }
  },
  {
    name: { en: 'Neem', hi: 'नीम (Neem)', te: 'వేప (Neem)' },
    uses: { en: 'Antibacterial, skin diseases, blood purifier', hi: 'जीवाणुरोधी, त्वचा रोग, रक्त शोधक', te: 'బ్యాక్టీరియా నివారిణి, చర్మ వ్యాధులు, రక్త శుద్ధి' },
    preparation: { en: 'Boil leaves for skin wash or chew tender twigs', hi: 'पत्तियों को पानी में उबालें या कोमल टहनियां चबाएं', te: 'ఆకులను మరిగించి కడగండి లేదా లేత రెమ్మలను నమలండి' }
  },
  {
    name: { en: 'Tulsi / Holy Basil', hi: 'तुलसी (Tulsi)', te: 'తులసి (Tulsi)' },
    uses: { en: 'Cold, cough, fever, stress relief', hi: 'सर्दी, खांसी, बुखार, तनाव राहत', te: 'జలుబు, దగ్గు, జ్వరం, మానసిక ఒత్తిడి నివారణ' },
    preparation: { en: 'Boil leaves with ginger and honey for herbal tea', hi: 'अदरक और शहद के साथ पत्तियां उबालकर काढ़ा बनाएं', te: 'అల్లం, తేనెతో ఆకులను మరిగించి టీ తయారు చేయండి' }
  },
  {
    name: { en: 'Aloe Vera', hi: 'घृतकुमारी / एलोवेरा (Aloe Vera)', te: 'కలబంద (Aloe Vera)' },
    uses: { en: 'Burns, skin care, digestive health', hi: 'जलन, त्वचा की देखभाल, पाचन स्वास्थ्य', te: 'కాలిన గాయాలు, చర్మ సంరక్షణ, జీర్ణ ఆరోగ్యం' },
    preparation: { en: 'Apply fresh gel on burns or consume pulp', hi: 'ताजा जेल त्वचा पर लगाएं या गुदा पानी में मिलाएं', te: 'తాజా జెల్ పూయండి లేదా గుజ్జును నీటిలో కలిపి తీసుకోండి' }
  },
  {
    name: { en: 'Ashwagandha', hi: 'अश्वगंधा (Ashwagandha)', te: 'అశ్వగంధ (Ashwagandha)' },
    uses: { en: 'Energy, immunity, stress management', hi: 'ऊर्जा, प्रतिरक्षा, तनाव प्रबंधन', te: 'శక్తి, రోగనిరోధక శక్తి, ఒత్తిడి నిర్వహణ' },
    preparation: { en: 'Root powder mixed with warm milk before bed', hi: 'सोने से पहले गर्म दूध के साथ जड़ों का चूर्ण लें', te: 'పడుకునే ముందు వేడి పాలలో వేరు పొడి కలపండి' }
  },
  {
    name: { en: 'Amla / Gooseberry', hi: 'आंवला (Amla)', te: 'ఉసిరి (Amla)' },
    uses: { en: 'Vitamin C, hair health, digestion', hi: 'विटामिन सी, बालों का स्वास्थ्य, पाचन', te: 'విటమిన్ సి, జుట్టు ఆరోగ్యం, జీర్ణక్రియ' },
    preparation: { en: 'Eat raw, make juice, or sun-dry for preservation', hi: 'कच्चा खाएं, रस बनाएं या सुखाकर रखें', te: 'పచ్చిగా తినండి, రసం చేయండి లేదా ఎండబెట్టండి' }
  }
];

const EMERGENCY_NUMBERS = [
  { number: '108', label: { en: 'Ambulance', hi: 'एम्बुलेंस', te: 'అంబులెన్స్' }, desc: { en: 'Free 24/7 emergency medical transport', hi: 'मुफ्त 24/7 आपातकालीन चिकित्सा परिवहन', te: 'ఉచిత 24/7 అత్యవసర వైద్య రవాణా' } },
  { number: '104', label: { en: 'Health Helpline', hi: 'स्वास्थ्य हेल्पलाइन', te: 'ఆరోగ్య హెల్ప్‌లైన్' }, desc: { en: 'Medical advice and information', hi: 'चिकित्सा सलाह और जानकारी', te: 'వైద్య సలహా మరియు సమాచారం' } },
  { number: '112', label: { en: 'Emergency Call Center', hi: 'आपातकालीन कॉल सेंटर', te: 'ఎమర్జెన్సీ కాల్ సెంటర్' }, desc: { en: 'All emergencies — police, fire, ambulance', hi: 'सभी आपात स्थिति — पुलिस, आग, एम्बुलेंस', te: 'అన్ని అత్యవసర పరిస్థితులు — పోలీస్, ఫైర్, అంబులెన్స్' } },
  { number: '1800-599-0019', label: { en: 'Tribal Welfare Helpline', hi: 'जनजातीय कल्याण हेल्पलाइन', te: 'గిరిజన సంక్షేమ హెల్ప్‌లైన్' }, desc: { en: 'TRIFED helpline for tribal support', hi: 'जनजातीय सहायता के लिए ट्राइफेड हेल्पलाइन', te: 'గిరిజన సహాయం కోసం ట్రైఫెడ్ హెల్ప్‌లైన్' } },
];

const Healthcare = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('firstaid');
  const [expandedGuide, setExpandedGuide] = useState(null);

  const tabs = [
    { id: 'firstaid', label: language === 'te' ? 'ప్రథమ చికిత్స' : language === 'hi' ? 'प्राथमिक चिकित्सा' : 'First Aid Guide', icon: '🩺' },
    { id: 'centers', label: language === 'te' ? 'ఆరోగ్య కేంద్రాలు' : language === 'hi' ? 'स्वास्थ्य केंद्र' : 'Health Centers', icon: '🏥' },
    { id: 'plants', label: language === 'te' ? 'ఔషధ మొక్కలు' : language === 'hi' ? 'औषधीय पौधे' : 'Medicinal Plants', icon: '🌿' },
    { id: 'emergency', label: language === 'te' ? 'అత్యవసర సంఖ్యలు' : language === 'hi' ? 'आपातकालीन नंबर' : 'Emergency', icon: '🚑' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg-forest">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <Sidebar />
        <main className="flex-1 space-y-6 animate-fade-in">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 font-display">
              {t('healthcareTitle')}
            </h2>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              {t('healthcareSubtitle')}
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
                        <h3 className="font-bold text-sm text-gray-800 font-display">
                          {guide.title[language] || guide.title.en}
                        </h3>
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
                        {(guide.steps[language] || guide.steps.en).map((step, idx) => (
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
                    <h4 className="font-bold text-sm text-gray-800 font-display">
                      {plant.name[language] || plant.name.en}
                    </h4>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                        {language === 'te' ? 'ఉపయోగాలు' : language === 'hi' ? 'उपयोग' : 'Uses'}
                      </p>
                      <p className="font-semibold text-gray-700">{plant.uses[language] || plant.uses.en}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                        {language === 'te' ? 'తయారీ' : language === 'hi' ? 'तैयारी' : 'Preparation'}
                      </p>
                      <p className="font-semibold text-forest-green">{plant.preparation[language] || plant.preparation.en}</p>
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
                    {language === 'te' ? 'అత్యవసర హెల్ప్‌లైన్ నంబర్లు' : language === 'hi' ? 'आपातकालीन हेल्पलाइन नंबर' : 'Emergency Helpline Numbers'}
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {EMERGENCY_NUMBERS.map((item, idx) => (
                    <a key={idx} href={`tel:${item.number}`} className="bg-white p-4 rounded-2xl border border-red-100 hover:border-red-300 transition-colors flex items-center gap-3 group">
                      <div className="p-3 bg-red-100 group-hover:bg-red-500 text-red-600 group-hover:text-white rounded-xl transition-colors">
                        <MdPhone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-lg font-black text-red-700">{item.number}</p>
                        <p className="text-xs font-bold text-gray-800">{item.label[language] || item.label.en}</p>
                        <p className="text-[10px] text-gray-500 font-semibold">{item.desc[language] || item.desc.en}</p>
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
                    : language === 'hi'
                    ? 'ये नंबर पूरे भारत में 24/7 काम करते हैं। 108 एम्बुलेंस सेवा पूरी तरह से निःशुल्क है।'
                    : 'These numbers work across India 24/7. 108 ambulance service is completely free. In remote forest areas, alert the nearest forest ranger station if phone connectivity is unavailable.'}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Healthcare;
