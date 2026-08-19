import React, { useState } from 'react';
import { ScreenId, TransitionType } from '../types';

const footerLogoUrl = new URL('../../assets/Nava-logo.png', import.meta.url).href;

interface FooterProps {
  onNavigate: (screen: ScreenId, transition: TransitionType) => void;
  currentScreen: ScreenId;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, currentScreen }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const handleLink = (target: ScreenId) => {
    if (target === currentScreen) return;
    const transition: TransitionType = target === 'home' ? 'push_back' : 'none';
    onNavigate(target, transition);
  };

  return (
    <footer className="bg-[#e0e3e5] border-t border-[#c6c6cd]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src={footerLogoUrl} alt="Navapack Solutions logo" className="h-10 object-contain" />
          </div>
          <p className="text-[#45464d] text-sm leading-relaxed">
            Integrated plastic recycling and packaging manufacturing. A division of Nova Recycling
            Industries Limited (NRIL), driving circular economy practices from Kampala, Uganda.
          </p>
          <div className="flex gap-3">
            {/* TODO: swap href="#" for real social profile URLs when confirmed */}
            <a
              href="#"
              aria-label="Navapack website"
              className="w-10 h-10 rounded-full bg-[#eceef0] flex items-center justify-center text-[#191c1e] hover:text-[#006c49] hover:bg-white transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">public</span>
            </a>
            <a
              href="#"
              aria-label="Email Navapack"
              className="w-10 h-10 rounded-full bg-[#eceef0] flex items-center justify-center text-[#191c1e] hover:text-[#006c49] hover:bg-white transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">alternate_email</span>
            </a>
            <a
              href="#"
              aria-label="Navapack on LinkedIn"
              className="w-10 h-10 rounded-full bg-[#eceef0] flex items-center justify-center text-[#191c1e] hover:text-[#006c49] hover:bg-white transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">hub</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-[#000000] uppercase tracking-wider">Quick Links</h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleLink('home')} className="text-[#45464d] hover:text-[#006c49] text-xs font-medium cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('products')} className="text-[#45464d] hover:text-[#006c49] text-xs font-medium cursor-pointer">
                  Products
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('sustainability')} className="text-[#45464d] hover:text-[#006c49] text-xs font-medium cursor-pointer">
                  Sustainability
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('about')} className="text-[#45464d] hover:text-[#006c49] text-xs font-medium cursor-pointer">
                  About Us
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-sm text-[#000000] uppercase tracking-wider">Headquarters</h5>
            {/* Only Kampala is confirmed in the company profile. Add address line once received. */}
            <p className="text-[#45464d] text-xs">Kampala, Uganda</p>
            <p className="text-[#45464d] text-xs italic">A division of Nova Recycling Industries Limited (NRIL)</p>
          </div>
        </div>

        <div className="space-y-4">
          <h5 className="font-bold text-sm text-[#000000] uppercase tracking-wider">Stay Informed</h5>
          <p className="text-[#45464d] text-sm">
            Get the latest industrial updates, supply chain trends, and circular economy insights.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="bg-white px-4 py-2.5 rounded-xl border border-[#c6c6cd] focus:ring-2 focus:ring-[#006c49] outline-none text-xs w-full"
              required
            />
            <button
              type="submit"
              className="bg-[#000000] text-white px-5 py-2.5 rounded-xl hover:bg-[#006c49] transition-colors text-xs font-semibold whitespace-nowrap cursor-pointer"
            >
              {subscribed ? 'Joined!' : 'Join'}
            </button>
          </form>
          {subscribed && (
            <p className="text-[#006c49] text-xs font-semibold">Thank you for subscribing to Navapack insights.</p>
          )}
        </div>
      </div>

            <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 border-t border-[#c6c6cd] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#45464d]">
        <p>
          © 2026 Navapack Solutions. All rights reserved.
          <span className="mx-2 hidden md:inline">|</span>
          <span className="block md:inline">Powered by Careergize LLP</span>
        </p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[#006c49]">Terms of Service</a>
          <a href="#" className="hover:text-[#006c49]">Privacy Policy</a>
          <a href="#" className="hover:text-[#006c49]">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};