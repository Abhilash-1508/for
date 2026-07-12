import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { GiOakLeaf } from 'react-icons/gi';
import { FaFacebook, FaTwitter, FaYoutube, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-emerald-950 text-emerald-100 border-t border-emerald-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Description */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-900 rounded-xl text-emerald-400">
                <GiOakLeaf className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display font-bold">
                Forest<span className="text-emerald-400">Connect</span> AI
              </span>
            </div>
            <p className="text-sm text-emerald-300 max-w-sm leading-relaxed">
              {t('aboutText1')}
            </p>
          </div>

          {/* Quick Contacts */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 font-display">
              {t('contactTitle')}
            </h3>
            <ul className="space-y-3 text-sm text-emerald-300">
              <li className="flex items-center gap-2">
                <FaPhoneAlt className="text-emerald-400" />
                <span>1800-425-5000 (Toll Free)</span>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-emerald-400" />
                <span>support@forestconnect.gov.in</span>
              </li>
              <li className="text-xs text-emerald-400 mt-2">
                * Available 24/7 in English & Telugu
              </li>
            </ul>
          </div>

          {/* Socials & Welfare Links */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 font-display">
              Tribal Welfare
            </h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="p-2 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-300 hover:text-white rounded-lg transition-colors" aria-label="Facebook">
                <FaFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-300 hover:text-white rounded-lg transition-colors" aria-label="Twitter">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-300 hover:text-white rounded-lg transition-colors" aria-label="YouTube">
                <FaYoutube className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-emerald-400">
              Supported by Ministry of Tribal Affairs & GCC Division.
            </p>
          </div>

        </div>

        <div className="mt-8 border-t border-emerald-900 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-emerald-400">
          <p>© {new Date().getFullYear()} ForestConnect AI. All Rights Reserved.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">GCC Scheme Guidelines</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
