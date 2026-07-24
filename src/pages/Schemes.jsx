import React, { useState, useEffect } from 'react';
import { schemesAPI } from '../services/api';
import { SCHEMES } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import VoiceAssistantWidget from '../components/VoiceAssistantWidget';
import { MdGavel, MdFilterList, MdInfo, MdOutlineArrowForward } from 'react-icons/md';

const Schemes = () => {
  const { t, language } = useLanguage();
  
  // Profile Search Filter States
  const [age, setAge] = useState('');
  const [occupation, setOccupation] = useState('gatherer');
  const [income, setIncome] = useState('');
  const [state, setState] = useState('Telangana');
  const [allSchemes, setAllSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const result = await schemesAPI.getAll();
      if (result.success && result.schemes && result.schemes.length > 0) {
        setAllSchemes(result.schemes);
        setFilteredSchemes(result.schemes);
      } else {
        setAllSchemes(SCHEMES);
        setFilteredSchemes(SCHEMES);
      }
    } catch (err) {
      console.error("Failed to fetch schemes, using mock data:", err);
      setAllSchemes(SCHEMES);
      setFilteredSchemes(SCHEMES);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);
    
    const occ = occupation.trim().toLowerCase();
    const st = state.trim().toLowerCase();
    
    let matches = allSchemes.filter(scheme => {
      if (!scheme) return false;
      const elg = String(scheme.eligibility).toLowerCase();
      
      // 1. Occupation Match
      let matchesOcc = false;
      if (occ === 'gatherer') {
        matchesOcc = ['livelihood', 'economic', 'welfare'].includes(scheme.category);
      } else if (occ === 'farmer') {
        matchesOcc = ['agriculture', 'economic'].includes(scheme.category);
      } else if (occ === 'artisan') {
        matchesOcc = ['livelihood', 'agriculture'].includes(scheme.category);
      } else {
        matchesOcc = true;
      }
      
      // 2. State Match
      let matchesState = true;
      if (st && st !== 'all') {
        if (st.includes('telangana')) {
          matchesState = elg.includes('telangana') || elg.includes('tribal') || elg.includes('gatherer') || elg.includes('all') || elg.includes('traditional');
        }
      }
      
      return matchesOcc && matchesState;
    });
    
    setFilteredSchemes(matches);
  };

  const handleReset = () => {
    setAge('');
    setOccupation('gatherer');
    setIncome('');
    setState('Telangana');
    setFilteredSchemes(allSchemes);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-forest">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Schemes Portal Contents */}
        <main className="flex-1 space-y-6 animate-fade-in">
          
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 font-display">{t('schemesTitle')}</h2>
            <p className="text-xs text-gray-500 font-semibold mt-1">{t('schemesSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Filter Form Card (Left/Top) */}
            <form onSubmit={handleSearch} className="lg:col-span-4 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-5 self-start">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <MdFilterList className="h-5 w-5 text-forest-green" />
                <h3 className="font-bold text-sm text-gray-800 font-display">Eligibility Finder</h3>
              </div>

              {/* Age Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">{t('inputAge')}</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                  placeholder="e.g. 35"
                />
              </div>

              {/* Occupation Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">Occupation</label>
                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                >
                  <option value="gatherer">Forest Gatherer (సేకరణదారుడు)</option>
                  <option value="farmer">Bamboo/Amla Farmer (రైతు)</option>
                  <option value="artisan">Handicrafts Artisan (కళాకారుడు)</option>
                </select>
              </div>

              {/* Income Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">{t('inputIncome')}</label>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                  placeholder="e.g. 60000"
                />
              </div>

              {/* State Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">{t('inputState')}</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                />
              </div>

              {/* Action triggers */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  className="w-full bg-forest-green hover:bg-forest-dark text-white font-extrabold py-3 rounded-xl text-xs transition-all shadow-sm hover:shadow"
                >
                  {t('findSchemesBtn')}
                </button>
                {hasSearched && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold py-2.5 rounded-xl text-xs transition-all"
                  >
                    Clear Results
                  </button>
                )}
              </div>

            </form>

            {/* Scheme Cards Results List (Right/Bottom) */}
            <div className="lg:col-span-8 space-y-6">
              
              {loading ? (
                <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 border-4 border-forest-green border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-500 font-semibold">Loading schemes...</p>
                </div>
              ) : filteredSchemes.length > 0 ? (
                filteredSchemes.map((scheme) => (
                  <div key={scheme.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow space-y-4">
                    
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <span className="bg-emerald-50 text-forest-green font-extrabold text-[9px] px-2.5 py-1 rounded-full border border-emerald-100/30 uppercase tracking-wider">
                          {scheme.tag}
                        </span>
                        <h3 className="font-bold text-base text-gray-800 font-display">
                          {scheme.name}
                        </h3>
                        {language === 'te' && (
                          <h4 className="text-xs font-bold text-forest-green">{scheme.name_local || scheme.nameLocal}</h4>
                        )}
                      </div>
                      
                      <div className="p-3 bg-emerald-50 text-forest-green rounded-2xl">
                        <MdGavel className="h-6 w-6" />
                      </div>
                    </div>

                    {/* Technical terms layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">{t('schemeEligibility')}</p>
                        <p className="font-semibold text-gray-700 leading-relaxed">{scheme.eligibility}</p>
                      </div>
                      <div className="space-y-1 sm:border-l sm:border-gray-100 sm:pl-4">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">{t('schemeBenefits')}</p>
                        <p className="font-semibold text-gray-700 leading-relaxed">{scheme.benefits}</p>
                      </div>
                    </div>

                    {/* How to Apply collapse section */}
                    <div className="bg-emerald-50/40 border border-emerald-100/35 rounded-2xl p-4 flex items-start gap-3 text-xs">
                      <MdInfo className="h-5 w-5 text-forest-green flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-emerald-950 uppercase tracking-wider text-[9px] mb-1">{t('applyNow')}</p>
                        <p className="font-semibold text-emerald-900 leading-relaxed">{scheme.apply_procedure || scheme.applyProcedure}</p>
                      </div>
                    </div>

                    {/* Apply simulation button */}
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => alert(`Redirecting to regional government registration portal for: ${scheme.name}`)}
                        className="flex items-center gap-1 bg-emerald-50 hover:bg-forest-green text-forest-green hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all border border-emerald-100/50"
                      >
                        <span>Apply Online</span>
                        <MdOutlineArrowForward />
                      </button>
                    </div>

                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl space-y-4">
                  <span className="text-4xl block">📋</span>
                  <h3 className="font-bold text-lg text-gray-700 font-display">No Eligible Schemes Found</h3>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                    Try adjusting your eligibility inputs (like occupation category or state) to check other government schemes.
                  </p>
                  <button
                    onClick={handleReset}
                    className="mt-2 bg-emerald-50 text-forest-green hover:bg-forest-green hover:text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all border border-emerald-100/50"
                  >
                    Reset Form
                  </button>
                </div>
              )}

            </div>

          </div>

        </main>
      </div>

      <VoiceAssistantWidget />
    </div>
  );
};

export default Schemes;
