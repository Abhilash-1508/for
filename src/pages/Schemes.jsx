import React, { useState, useEffect } from 'react';
import { schemesAPI } from '../services/api';
import { SCHEMES } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { MdGavel, MdFilterList, MdInfo, MdOutlineArrowForward } from 'react-icons/md';

const Schemes = () => {
  const { t, language } = useLanguage();
  
  // Profile Search Filter States
  const [age, setAge] = useState('');
  const [occupation, setOccupation] = useState('all');
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
      if (result && result.success && Array.isArray(result.schemes) && result.schemes.length >= 5) {
        // Merge fallback criteria fields if API doesn't return eligibleOccupations
        const merged = result.schemes.map(s => {
          const fallback = SCHEMES.find(m => m.id === s.id || m.name === s.name);
          return {
            ...fallback,
            ...s
          };
        });
        setAllSchemes(merged);
        setFilteredSchemes(merged);
      } else {
        setAllSchemes(SCHEMES);
        setFilteredSchemes(SCHEMES);
      }
    } catch (err) {
      console.error("Failed to fetch schemes, using fallback SCHEMES:", err);
      setAllSchemes(SCHEMES);
      setFilteredSchemes(SCHEMES);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setHasSearched(true);
    
    const userAge = age ? parseInt(age, 10) : null;
    const userIncome = income ? parseFloat(income) : null;
    const occ = occupation; // 'all', 'gatherer', 'farmer', 'artisan', 'student'
    const selectedState = state ? state.trim().toLowerCase() : '';
    
    let matches = allSchemes.filter(scheme => {
      if (!scheme) return false;

      // 1. Occupation Filter
      if (occ !== 'all') {
        const schemeOccs = scheme.eligibleOccupations || [];
        const elgText = String(scheme.eligibility || '').toLowerCase();
        const catText = String(scheme.category || '').toLowerCase();

        let isOccMatch = false;

        if (schemeOccs.length > 0) {
          isOccMatch = schemeOccs.includes('all') || schemeOccs.includes(occ);
        }
        
        // Fallback text check
        if (!isOccMatch) {
          if (occ === 'gatherer' && (elgText.includes('gatherer') || elgText.includes('shg') || elgText.includes('collect') || catText.includes('livelihood') || catText.includes('financial'))) isOccMatch = true;
          if (occ === 'farmer' && (elgText.includes('farmer') || elgText.includes('agro') || catText.includes('livelihood') || catText.includes('financial'))) isOccMatch = true;
          if (occ === 'artisan' && (elgText.includes('artisan') || elgText.includes('craft') || catText.includes('livelihood') || catText.includes('financial'))) isOccMatch = true;
          if (occ === 'student' && (elgText.includes('student') || elgText.includes('school') || catText.includes('education'))) isOccMatch = true;
        }

        if (!isOccMatch) return false;
      }

      // 2. Income Filter (check user income <= scheme maxIncome if specified)
      if (userIncome !== null && !isNaN(userIncome) && userIncome > 0) {
        if (scheme.maxIncome && userIncome > scheme.maxIncome) {
          return false;
        }
      }

      // 3. Age Filter (check user age between minAge and maxAge)
      if (userAge !== null && !isNaN(userAge)) {
        if (scheme.minAge !== undefined && userAge < scheme.minAge) return false;
        if (scheme.maxAge !== undefined && userAge > scheme.maxAge) return false;
      }

      // 4. State Filter
      if (selectedState && selectedState !== 'all') {
        if (scheme.id === 's3') {
          const isTSorAP = selectedState.includes('telangana') || selectedState.includes('andhra') || selectedState.includes('ap') || selectedState.includes('tg');
          if (!isTSorAP && selectedState.length > 2 && !'all india national nationwide'.includes(selectedState)) {
            return false;
          }
        }
      }

      return true;
    });
    
    setFilteredSchemes(matches);
  };

  const handleReset = () => {
    setAge('');
    setOccupation('all');
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
            <h2 className="text-2xl font-extrabold text-stone-900 font-display">{t('schemesTitle')}</h2>
            <p className="text-xs text-stone-500 font-semibold mt-1">{t('schemesSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Filter Form Card (Left/Top) */}
            <form onSubmit={handleSearch} className="lg:col-span-4 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-5 self-start">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <MdFilterList className="h-5 w-5 text-forest-green" />
                <h3 className="font-bold text-sm text-stone-900 font-display">Eligibility Finder</h3>
              </div>

              {/* Age Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide">{t('inputAge')}</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-stone-900 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                  placeholder="e.g. 35"
                />
              </div>

              {/* Occupation Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide">Occupation Category</label>
                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-stone-900 rounded-xl px-4 py-2.5 text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                >
                  <option value="all">All Categories</option>
                  <option value="gatherer">Forest Gatherer / SHG Member</option>
                  <option value="farmer">Agro-Forestry / Bamboo Farmer</option>
                  <option value="artisan">Handicrafts Artisan</option>
                  <option value="student">Student / Education Scholar</option>
                </select>
              </div>

              {/* Income Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide">{t('inputIncome')}</label>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-stone-900 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                  placeholder="e.g. 60000"
                />
              </div>

              {/* State Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide">{t('inputState')}</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-stone-900 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest-green transition-all"
                />
              </div>

              {/* Action triggers */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  className="w-full bg-forest-green hover:bg-forest-dark text-white font-extrabold py-3 rounded-xl text-xs transition-all shadow-sm hover:shadow cursor-pointer"
                >
                  {t('findSchemesBtn')}
                </button>
                {hasSearched && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full border border-gray-200 text-stone-600 hover:bg-gray-50 font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
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
                  <p className="text-sm text-stone-500 font-semibold">Loading schemes...</p>
                </div>
              ) : filteredSchemes.length > 0 ? (
                filteredSchemes.map((scheme) => {
                  const catLabel = scheme.category || 'Livelihood';
                  const applyLink = scheme.url || scheme.applyUrl || scheme.officialUrl || 'https://tribal.nic.in';

                  return (
                    <div key={scheme.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow space-y-4">
                      
                      {/* Header info */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Category Badge */}
                            <span className={`font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider border ${
                              catLabel === 'Livelihood' ? 'bg-emerald-50 text-forest-green border-emerald-200' :
                              catLabel === 'Financial' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              catLabel === 'Education' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              'bg-purple-50 text-purple-700 border-purple-200'
                            }`}>
                              {catLabel}
                            </span>

                            {scheme.tag && (
                              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50/80 border border-emerald-200/60 px-2.5 py-0.5 rounded-md">
                                {scheme.tag}
                              </span>
                            )}
                          </div>

                          {/* Scheme Name - High Contrast Heading */}
                          <h3 className="text-xl font-bold text-stone-900 mt-2 mb-1 font-display leading-snug">
                            {scheme.name}
                          </h3>

                          {/* Local Language Subtitles */}
                          {language === 'hi' && scheme.nameHi && (
                            <h4 className="text-xs font-semibold text-emerald-800 mt-1">{scheme.nameHi}</h4>
                          )}
                          {language === 'te' && (scheme.nameTe || scheme.nameLocal || scheme.name_local) && (
                            <h4 className="text-xs font-semibold text-emerald-800 mt-1">{scheme.nameTe || scheme.nameLocal || scheme.name_local}</h4>
                          )}
                        </div>
                        
                        <div className="p-3 bg-emerald-50 text-forest-green rounded-2xl flex-shrink-0">
                          <MdGavel className="h-6 w-6" />
                        </div>
                      </div>

                      {/* Technical terms layout: Eligibility & Key Benefits */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1 bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
                          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wide">{t('schemeEligibility')}</p>
                          <p className="font-semibold text-stone-700 leading-relaxed">{scheme.eligibility}</p>
                        </div>
                        <div className="space-y-1 bg-emerald-50/40 p-3.5 rounded-2xl border border-emerald-100/40">
                          <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wide">{t('schemeBenefits')}</p>
                          <p className="font-semibold text-stone-700 leading-relaxed">{scheme.benefits}</p>
                        </div>
                      </div>

                      {/* How to Apply Procedure */}
                      <div className="bg-sage-accent/30 border border-emerald-100/50 rounded-2xl p-4 flex items-start gap-3 text-xs">
                        <MdInfo className="h-5 w-5 text-forest-green flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-emerald-950 uppercase tracking-wider text-[9px] mb-1">{t('applyNow')}</p>
                          <p className="font-semibold text-emerald-900 leading-relaxed">{scheme.apply_procedure || scheme.applyProcedure}</p>
                        </div>
                      </div>

                      {/* Official Scheme Portal Link */}
                      <div className="flex justify-end pt-1">
                        <a 
                          href={applyLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer"
                        >
                          <span>Apply / Know More →</span>
                        </a>
                      </div>

                    </div>
                  );
                })
              ) : (
                <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl space-y-4 p-6 shadow-sm">
                  <span className="text-4xl block">📋</span>
                  <h3 className="font-bold text-lg text-stone-800 font-display">No Matching Schemes Found</h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                    No schemes matched your exact criteria. Try adjusting your age, income, or occupation category to view available government programs.
                  </p>
                  <button
                    onClick={handleReset}
                    className="mt-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all border border-emerald-200/50 cursor-pointer"
                  >
                    Clear Results & View All Schemes
                  </button>
                </div>
              )}

            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default Schemes;
