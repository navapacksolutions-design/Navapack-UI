import React, { useEffect, useState } from 'react';
import { ScreenId, TransitionType } from '../types';

const navLogoUrl = new URL('../../assets/Nava-logo.png', import.meta.url).href;

interface NavbarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId, transition: TransitionType) => void;
  onRequestQuote: () => void;
  onLogin: () => void;
}

const NAV_ITEMS: { id: ScreenId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'products', label: 'Products' },
  { id: 'sustainability', label: 'Sustainability' },
  { id: 'about', label: 'About Us' },
  { id: 'contact', label: 'Contact Us' },
];

// Only Home has a dark video hero under the nav — every other screen opens
// on a white/light section, so the transparent+white-text treatment would
// disappear there. Switch styling based on which screen is active.
export const Navbar: React.FC<NavbarProps> = ({ currentScreen, onNavigate, onRequestQuote, onLogin }) => {
  const isDarkHero = currentScreen === 'home';

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Reset nav visibility whenever screen changes (fresh page = fresh top)
  useEffect(() => {
    setMobileMenuOpen(false);
    setScrolled(window.scrollY > 20);
  }, [currentScreen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, target: ScreenId) => {
    e.preventDefault();
    if (target === currentScreen) {
      setMobileMenuOpen(false);
      return;
    }

    let transition: TransitionType = 'none';

    if (currentScreen === 'home') {
      transition = 'push';
    } else if (target === 'home') {
      transition = 'push_back';
    } else {
      transition = 'none';
    }

    onNavigate(target, transition);
    setMobileMenuOpen(false);
  };

  const showSolid = scrolled || !isDarkHero;

  const BAR = showSolid
    ? 'bg-white border-b border-[#e5e7ea] shadow-[0_1px_0_rgba(0,0,0,0.04)]'
    : 'bg-gradient-to-b from-black/60 via-black/40 to-transparent border-b border-white/10';

  const useLightText = isDarkHero && !showSolid;

  const linkColorActive = useLightText ? 'text-white' : 'text-[#1a1a1a]';
  const linkColorInactive = useLightText
    ? 'text-white/75 hover:text-white'
    : 'text-[#5a5c63] hover:text-[#1a1a1a]';

  const strokeColor = useLightText ? 'white' : '#1a1a1a';

  const PILL_BTN = useLightText
    ? 'font-brand-body flex items-center gap-2 px-4 py-2 rounded-full border border-white/25 text-white text-sm font-semibold tracking-[0.01em] hover:bg-white/10 transition-all duration-200'
    : 'font-brand-body flex items-center gap-2 px-4 py-2 rounded-full border border-[#d5d7db] text-[#1a1a1a] text-sm font-semibold tracking-[0.01em] hover:bg-black/5 transition-all duration-200';

  const ICON_BTN = 'w-9 h-9 flex items-center justify-center hover:opacity-70 transition-opacity duration-200';

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${BAR}`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center h-20 px-6 md:px-8">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            if (currentScreen !== 'home') onNavigate('home', 'push_back');
          }}
          aria-label="Go to homepage"
          className="flex items-center gap-3 cursor-pointer shrink-0"
        >
          <img
            src={navLogoUrl}
            alt="Navapack"
            className="h-8 object-contain"
          />
        </button>

        {/* Central Nav Links */}
        <div className="hidden md:flex items-center gap-9">
          {NAV_ITEMS.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`font-brand-body text-[15px] font-medium tracking-[0.01em] transition-colors duration-200 ${
                  isActive ? linkColorActive : linkColorInactive
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        {/* Search + Quote */}
        <div className="flex items-center gap-4">
          <button type="button" onClick={onLogin} aria-label="Admin sign in" className={`${ICON_BTN} hidden md:flex`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" /></svg>
          </button>
          <button type="button" aria-label="Search" className={`${ICON_BTN} hidden md:flex`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Request quote"
            onClick={onRequestQuote}
            className={`${PILL_BTN} hidden md:flex`}
          >
            Get Quote
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen(true)}
            className={`${ICON_BTN} md:hidden`}
          >
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`fixed inset-0 top-0 z-60 bg-black/45 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />
      <aside
        id="mobile-navigation"
        aria-label="Mobile navigation"
        className={`fixed right-0 top-0 z-70 flex h-dvh w-[min(86vw,360px)] flex-col bg-white shadow-[-12px_0_36px_rgba(0,0,0,0.16)] transition-transform duration-300 ease-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-[#e5e7ea] px-6">
          <img src={navLogoUrl} alt="Navapack" className="h-8 object-contain" />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#1a1a1a] transition-colors hover:bg-black/5"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 flex-col px-6 py-7">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = currentScreen === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`font-brand-body flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-semibold transition-colors ${
                    isActive ? 'bg-[#eef9f3] text-[#006b46]' : 'text-[#34363b] hover:bg-[#f4f5f6] hover:text-[#111]'
                  }`}
                >
                  {item.label}
                  <span aria-hidden="true">{isActive ? '•' : '›'}</span>
                </a>
              );
            })}
          </div>

          <div className="mt-auto space-y-3 border-t border-[#e5e7ea] pt-6">
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onRequestQuote(); }}
              className="font-brand-body flex w-full items-center justify-center gap-2 rounded-full bg-[#006b46] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#00583a]"
            >
              Get Quote <span aria-hidden="true">→</span>
            </button>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onLogin(); }}
              className="font-brand-body w-full rounded-full border border-[#d5d7db] px-5 py-3 text-sm font-semibold text-[#1a1a1a] transition-colors hover:bg-black/5"
            >
              Admin sign in
            </button>
          </div>
        </div>
      </aside>
    </nav>
  );
};
