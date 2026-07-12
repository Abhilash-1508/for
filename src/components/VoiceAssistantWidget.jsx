import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { MdMic, MdClose, MdVolumeUp, MdArrowForward, MdMicOff } from 'react-icons/md';

const VoiceAssistantWidget = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, listening, processing, speaking
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const recognitionRef = useRef(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const voicesRef = useRef([]);

  // Pre-load available voices (async - fires after voiceschanged event)
  useEffect(() => {
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    if ('speechSynthesis' in window) {
      loadVoices();
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
      return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    }
  }, []);

  // Check for Web Speech API support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
    }
  }, []);

  // Command matching and routing
  const processCommand = (text) => {
    const lowerText = text.toLowerCase();

    // Price / Market commands
    if (lowerText.includes('price') || lowerText.includes('market') || lowerText.includes('ధరలు') || lowerText.includes('మార్కెట్')) {
      return {
        response: language === 'te'
          ? 'నేను మిమ్మల్ని మార్కెట్ ధరల పేజీకి మళ్లిస్తున్నాను. అడవి తేనె అంచనా ధర కిలోకి ₹380గా ఉంది.'
          : 'Redirecting to marketplace. Wild Honey predicted price is ₹380/kg.',
        action: () => navigate('/marketplace')
      };
    }

    // Weather commands
    if (lowerText.includes('weather') || lowerText.includes('వాతావరణ') || lowerText.includes('rain') || lowerText.includes('వర్షం')) {
      return {
        response: language === 'te'
          ? 'నేటి వాతావరణం: జల్లులు పడే అవకాశం ఉంది. మూలికలను వర్షం నుండి రక్షించండి.'
          : "Today's weather advisory: scattered showers expected. Keep harvested herbs under cover.",
        action: () => navigate('/weather')
      };
    }

    // Scheme commands
    if (lowerText.includes('scheme') || lowerText.includes('పథకాలు') || lowerText.includes('yojana') || lowerText.includes('యోజన') || lowerText.includes('government') || lowerText.includes('ప్రభుత్వ')) {
      return {
        response: language === 'te'
          ? 'మీ కోసం ప్రధాన మంత్రి వన్ ధన్ యోజన సహా నాలుగు పథకాలు అందుబాటులో ఉన్నాయి.'
          : 'I found 4 schemes for you, including PM Van Dhan Yojana.',
        action: () => navigate('/schemes')
      };
    }

    // Prediction commands
    if (lowerText.includes('predict') || lowerText.includes('అంచనా') || lowerText.includes('forecast') || lowerText.includes('honey') || lowerText.includes('తేనె')) {
      return {
        response: language === 'te'
          ? 'AI ధర అంచనా పేజీకి మళ్లిస్తున్నాను. మీ ఉత్పత్తికి ఉత్తమ విక్రయ సమయాన్ని తెలుసుకోండి.'
          : 'Opening AI price predictor. Find the best selling time for your produce.',
        action: () => navigate('/prediction')
      };
    }

    // Healthcare commands
    if (lowerText.includes('health') || lowerText.includes('doctor') || lowerText.includes('hospital') || lowerText.includes('ఆరోగ్యం') || lowerText.includes('ఆసుపత్రి') || lowerText.includes('snake') || lowerText.includes('పాము')) {
      return {
        response: language === 'te'
          ? 'ఆరోగ్య సేవల పేజీని తెరుస్తున్నాను. ప్రథమ చికిత్స, సమీప ఆసుపత్రులు అందుబాటులో ఉన్నాయి.'
          : 'Opening healthcare guidance. First aid guides and nearest health centers available.',
        action: () => navigate('/healthcare')
      };
    }

    // Education commands
    if (lowerText.includes('education') || lowerText.includes('learn') || lowerText.includes('training') || lowerText.includes('విద్య') || lowerText.includes('శిక్షణ')) {
      return {
        response: language === 'te'
          ? 'విద్య & శిక్షణ పేజీని తెరుస్తున్నాను.'
          : 'Opening education and training resources.',
        action: () => navigate('/education')
      };
    }

    // Dashboard
    if (lowerText.includes('dashboard') || lowerText.includes('home') || lowerText.includes('హోమ్')) {
      return {
        response: language === 'te' ? 'డాష్‌బోర్డ్‌కు మళ్లిస్తున్నాను.' : 'Taking you to your dashboard.',
        action: () => navigate('/dashboard')
      };
    }

    // Default
    return {
      response: language === 'te'
        ? 'అభ్యర్థనను అర్థం చేసుకోలేకపోయాను. దయచేసి "ధరలు చూపించు", "వాతావరణం", "పథకాలు" వంటి ఆదేశాలను ప్రయత్నించండి.'
        : 'I didn\'t understand that. Try commands like "show prices", "weather update", "find schemes", or "predict honey price".',
      action: null
    };
  };

  // Start real speech recognition
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'te' ? 'te-IN' : 'en-IN';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      setStatus('listening');
      setTranscript('');
      setResponse('');
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);

      if (finalTranscript) {
        handleProcessCommand(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.log('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        setStatus('idle');
        setResponse(language === 'te' ? 'మాట్లాడటం వినబడలేదు. మళ్ళీ ప్రయత్నించండి.' : 'No speech detected. Please try again.');
        setStatus('speaking');
      } else {
        setStatus('idle');
      }
    };

    recognition.onend = () => {
      if (status === 'listening' && !transcript) {
        setStatus('idle');
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // Process the recognized command
  const handleProcessCommand = (text) => {
    setStatus('processing');
    setTranscript(text);

    setTimeout(() => {
      const result = processCommand(text);
      setResponse(result.response);
      setStatus('speaking');

      // Speak the response using Text-to-Speech
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // stop any previous speech

        let textToSpeak = result.response;
        let langToUse = language === 'te' ? 'te-IN' : 'en-IN';
        let voiceToUse = null;

        if (language === 'te') {
          // Look for a Telugu voice from the pre-loaded list
          const voices = voicesRef.current.length > 0
            ? voicesRef.current
            : window.speechSynthesis.getVoices();
          voiceToUse = voices.find(v =>
            v.lang && (v.lang.startsWith('te') || v.lang.includes('te-IN'))
          ) || voices.find(v => v.name.toLowerCase().includes('telugu'));

          if (!voiceToUse) {
            // No Telugu voice available — speak fallback in English
            textToSpeak = 'Telugu voice is not installed on this device. Please go to System Settings and install the Telugu language voice pack.';
            langToUse = 'en-US';
          }
        }

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = langToUse;
        if (voiceToUse) utterance.voice = voiceToUse;
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }

      // Navigate after a delay
      if (result.action) {
        setTimeout(() => result.action(), 2000);
      }
    }, 800);
  };

  // Simulate speech for click-based commands (fallback)
  const handleSimulateSpeech = (cmd) => {
    setTranscript(cmd.text);
    handleProcessCommand(cmd.text);
  };

  // Sample quick commands
  const getSampleCommands = () => {
    if (language === 'te') {
      return [
        { label: 'మార్కెట్ ధరలు చూపించు', text: 'మార్కెట్ ధరలు చూపించు' },
        { label: 'వాతావరణ సమాచారం', text: 'నాకు వాతావరణ సమాచారం కావాలి' },
        { label: 'సంక్షేమ పథకాలు', text: 'సంక్షేమ పథకాలు చూపించు' },
        { label: 'ధర అంచనా', text: 'తేనె ధర అంచనా వేయి' },
        { label: 'ఆరోగ్య సేవలు', text: 'ఆరోగ్యం గురించి సహాయం' },
        { label: 'విద్య శిక్షణ', text: 'విద్య శిక్షణ చూపించు' },
      ];
    }
    return [
      { label: 'Show market prices', text: 'Show market prices' },
      { label: "Check today's weather", text: "Check today's weather" },
      { label: 'Find eligible schemes', text: 'Find eligible schemes' },
      { label: 'Predict honey price', text: 'Predict honey price' },
      { label: 'Healthcare guide', text: 'Show healthcare guide' },
      { label: 'Education resources', text: 'Show education resources' },
    ];
  };

  const handleReset = () => {
    setStatus('idle');
    setTranscript('');
    setResponse('');
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      handleReset();
    }
  }, [isOpen]);

  return (
    <>
      {/* Floating Microphone Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-forest-green hover:bg-forest-dark text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center border-4 border-white animate-bounce"
        title={t('voiceAssistant')}
      >
        <MdMic className="h-7 w-7" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
        </span>
      </button>

      {/* Voice Interface Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
            
            {/* Header */}
            <div className="bg-forest-green text-white p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <MdMic className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg font-display">{t('voiceTitle')}</h3>
                  <p className="text-xs text-emerald-100">
                    {speechSupported
                      ? (language === 'te' ? 'మైక్రోఫోన్ నొక్కి మాట్లాడండి' : 'Press mic and speak your command')
                      : t('voiceSubtitle')}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 transition-colors text-white"
              >
                <MdClose className="h-6 w-6" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 flex-1 flex flex-col items-center justify-center min-h-[300px] space-y-6">
              
              {status === 'idle' && (
                <div className="text-center space-y-4 w-full">
                  {/* Real Mic Button (if Speech API supported) */}
                  {speechSupported && (
                    <button
                      onClick={startListening}
                      className="mx-auto w-20 h-20 bg-forest-green hover:bg-forest-dark text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
                    >
                      <MdMic className="h-10 w-10" />
                    </button>
                  )}
                  
                  {!speechSupported && (
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 text-xs font-semibold">
                      <MdMicOff className="h-4 w-4 inline mr-1" />
                      {language === 'te'
                        ? 'మీ బ్రౌజర్ స్పీచ్ రికగ్నిషన్‌ను సపోర్ట్ చేయడం లేదు. దయచేసి క్రింది బటన్లను వాడండి.'
                        : 'Your browser does not support Speech Recognition. Use the buttons below instead.'}
                    </div>
                  )}

                  <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-gray-600 text-sm text-left">
                    <p className="font-semibold text-gray-800 mb-1">{t('assistantGreeting')}</p>
                    <p className="text-xs text-gray-500">{speechSupported ? (language === 'te' ? 'మైక్రోఫోన్ బటన్ నొక్కి మాట్లాడండి' : 'Tap the microphone button and speak') : t('voicePrompt')}</p>
                  </div>
                  
                  {/* Quick Command Buttons */}
                  <div className="space-y-2 text-left">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">
                      {speechSupported ? (language === 'te' ? 'లేదా ఎంచుకోండి:' : 'Or select a command:') : (language === 'te' ? 'ఆదేశాన్ని ఎంచుకోండి:' : 'Select a command:')}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {getSampleCommands().map((cmd, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSimulateSpeech(cmd)}
                          className="flex items-center justify-between text-left p-3 bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-100/50 rounded-xl text-xs font-semibold text-emerald-900 transition-colors group"
                        >
                          <span>"{cmd.label}"</span>
                          <MdArrowForward className="h-4 w-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {status === 'listening' && (
                <div className="flex flex-col items-center space-y-4">
                  {/* Animated Waveform */}
                  <div className="relative">
                    <div className="w-24 h-24 bg-forest-green/10 rounded-full flex items-center justify-center animate-pulse">
                      <div className="w-16 h-16 bg-forest-green/20 rounded-full flex items-center justify-center">
                        <div className="w-10 h-10 bg-forest-green text-white rounded-full flex items-center justify-center">
                          <MdMic className="h-6 w-6" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 h-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                      <span 
                        key={i} 
                        className="w-1 bg-forest-green rounded-full animate-bounce"
                        style={{
                          height: `${Math.random() * 24 + 8}px`,
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: '0.6s'
                        }}
                      ></span>
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-forest-green animate-pulse">{t('listening')}</p>
                  {transcript && (
                    <p className="text-base font-bold italic text-gray-700">"{transcript}"</p>
                  )}
                  <button
                    onClick={handleReset}
                    className="text-xs text-gray-400 hover:text-red-500 underline font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {status === 'processing' && (
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-10 h-10 border-4 border-forest-green border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-500">{t('processing')}</p>
                  <p className="text-xs font-bold text-gray-700">"{transcript}"</p>
                </div>
              )}

              {status === 'speaking' && (
                <div className="text-center space-y-4 w-full">
                  <div className="w-16 h-16 bg-emerald-100 text-forest-green rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <MdVolumeUp className="w-8 h-8" />
                  </div>
                  {transcript && (
                    <p className="text-xs text-gray-400 font-semibold">You said: "{transcript}"</p>
                  )}
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                    <p className="text-base font-semibold text-emerald-950 leading-relaxed">
                      {response}
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-xs text-gray-500 hover:text-forest-green underline font-medium"
                  >
                    {language === 'te' ? 'మళ్లీ మాట్లాడండి' : 'Speak again'}
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceAssistantWidget;
