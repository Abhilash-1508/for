import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MdLanguage } from 'react-icons/md';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' }
];

const LanguageSelector = ({ variant = 'default' }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selector Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-forest-green px-3 py-1.5 rounded-full border border-gray-200 hover:border-emerald-200 transition-all text-xs font-bold cursor-pointer shadow-2xs"
        title="Switch Language / भाषा बदलें / భాష మార్చండి"
      >
        <span className="text-sm">🌐</span>
        <span className="hidden sm:inline font-display">{currentLangObj.native}</span>
        <span className="text-[10px] text-gray-400">▼</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl border border-gray-100 shadow-xl z-[999] overflow-hidden py-1.5 animate-fade-in">
          <div className="px-3 py-1.5 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider border-b border-gray-50 flex items-center gap-1">
            <MdLanguage className="h-3.5 w-3.5 text-forest-green" />
            <span>Select Language</span>
          </div>

          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                language === lang.code
                  ? 'bg-emerald-50 text-forest-green'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-forest-green'
              }`}
            >
              <span>{lang.native}</span>
              <span className="text-[10px] font-normal text-gray-400">({lang.label})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
