/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ScreenId, TransitionType } from './types';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { QuoteModal } from './components/QuoteModal';
import { HomePage } from './components/HomePage';
import { ProductPortfolioScreen } from './components/ProductPortfolioScreen';
import { SustainabilityScreen } from './components/SustainabilityScreen';
import { AboutUsScreen } from './components/AboutUsScreen';
import { ContactScreen } from './components/Contact';
import { LoginScreen } from './components/LoginScreen';
import { SignupScreen } from './components/SignupScreen';
// import { AdminProductsScreen } from './components/AdminProductsScreen';
import { Dashboard } from './components/Dashboard';

export default function App() {
  // Get current screen from URL
  const getScreenFromPath = (): ScreenId => {
    const path = window.location.pathname.replace('/', '') as ScreenId;

    const validScreens: ScreenId[] = [
      'home',
      'products',
      'sustainability',
      'about',
      'contact',
      'login',
      'signup',
      'admin-products',
      'dashboard',
    ];

    return validScreens.includes(path)
      ? path
      : 'home';
  };

  const [currentScreen, setCurrentScreen] =
    useState<ScreenId>(getScreenFromPath);

  const [transition, setTransition] =
    useState<TransitionType>('push');

  const [isQuoteOpen, setIsQuoteOpen] =
    useState<boolean>(false);

  const [quoteProduct, setQuoteProduct] =
    useState<string>('');

  // Handle browser back / forward
  useEffect(() => {
    const handlePopState = () => {
      setCurrentScreen(getScreenFromPath());
    };

    window.addEventListener(
      'popstate',
      handlePopState
    );

    return () => {
      window.removeEventListener(
        'popstate',
        handlePopState
      );
    };
  }, []);

  // Scroll to top whenever screen changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant',
    });
  }, [currentScreen]);

  // Navigation
  const handleNavigate = (
    target: ScreenId,
    transType: TransitionType = 'push'
  ) => {
    setTransition(transType);
    setCurrentScreen(target);

    const newPath =
      target === 'home'
        ? '/'
        : `/${target}`;

    window.history.pushState(
      {},
      '',
      newPath
    );
  };

  // Open quote modal
  const handleOpenQuote = (
    productName?: string
  ) => {
    setQuoteProduct(
      productName || ''
    );

    setIsQuoteOpen(true);
  };

  // Page animation
  const getVariants = () => {
    if (transition === 'push') {
      return {
        initial: {
          x: '100%',
          opacity: 0,
        },
        animate: {
          x: 0,
          opacity: 1,
        },
        exit: {
          x: '-20%',
          opacity: 0,
        },
      };
    }

    if (transition === 'push_back') {
      return {
        initial: {
          x: '-100%',
          opacity: 0,
        },
        animate: {
          x: 0,
          opacity: 1,
        },
        exit: {
          x: '20%',
          opacity: 0,
        },
      };
    }

    return {
      initial: {
        opacity: 0,
      },
      animate: {
        opacity: 1,
      },
      exit: {
        opacity: 0,
      },
    };
  };

  const variants = getVariants();

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] flex flex-col font-sans overflow-x-hidden selection:bg-[#6cf8bb] selection:text-[#002113]">

      {/* =========================
          NAVBAR
      ========================== */}

      {currentScreen !== 'dashboard' && (
        <Navbar
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          onRequestQuote={() =>
            handleOpenQuote()
          }

          // IMPORTANT:
          // Go to Login page first.
          // Do NOT directly open dashboard.
          onLogin={() =>
            handleNavigate(
              'login',
              'none'
            )
          }
        />
      )}

      {/* =========================
          MAIN CONTENT
      ========================== */}

      <main className="flex-1 relative w-full overflow-x-hidden">

        <AnimatePresence mode="wait">

          <motion.div
            key={currentScreen}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{
              duration:
                transition === 'none'
                  ? 0.15
                  : 0.35,
              ease: [
                0.25,
                1,
                0.5,
                1,
              ],
            }}
            className="w-full"
          >

            {/* =========================
                HOME
            ========================== */}

            {currentScreen === 'home' && (
              <HomePage
                onNavigate={handleNavigate}
                onRequestQuote={
                  handleOpenQuote
                }
              />
            )}

            {/* =========================
                PRODUCTS
            ========================== */}

            {currentScreen === 'products' && (
              <ProductPortfolioScreen
                onNavigate={handleNavigate}
                onRequestQuote={
                  handleOpenQuote
                }
              />
            )}

            {/* =========================
                SUSTAINABILITY
            ========================== */}

            {currentScreen ===
              'sustainability' && (
              <SustainabilityScreen
                onNavigate={
                  handleNavigate
                }
                onRequestQuote={() =>
                  handleOpenQuote()
                }
              />
            )}

            {/* =========================
                ABOUT
            ========================== */}

            {currentScreen === 'about' && (
              <AboutUsScreen
                onNavigate={
                  handleNavigate
                }
                onRequestQuote={() =>
                  handleOpenQuote()
                }
              />
            )}

            {/* =========================
                CONTACT
            ========================== */}

            {currentScreen === 'contact' && (
              <ContactScreen
                onNavigate={
                  handleNavigate
                }
                onRequestQuote={() =>
                  handleOpenQuote()
                }
              />
            )}

            {/* =========================
                LOGIN
            ========================== */}

            {currentScreen === 'login' && (
              <LoginScreen
                onLogin={() =>
                  handleNavigate(
                    'dashboard',
                    'none'
                  )
                }
                onNavigateToSignup={() =>
                  handleNavigate(
                    'signup',
                    'push'
                  )
                }
              />
            )}

            {/* =========================
                SIGNUP
            ========================== */}

            {currentScreen === 'signup' && (
              <SignupScreen
                onSignupSuccess={() =>
                  handleNavigate(
                    'dashboard',
                    'none'
                  )
                }
                onNavigateToLogin={() =>
                  handleNavigate(
                    'login',
                    'push_back'
                  )
                }
              />
            )}

            {/* =========================
                ADMIN PRODUCTS
            ========================== */}

            {/* {currentScreen ===
              'admin-products' && (
              <AdminProductsScreen
                onLogout={() =>
                  handleNavigate(
                    'home',
                    'push_back'
                  )
                }
              />
            )} */}

            {/* =========================
                DASHBOARD
            ========================== */}

            {currentScreen ===
              'dashboard' && (
              <Dashboard />
            )}

          </motion.div>

        </AnimatePresence>

      </main>

      {/* =========================
          FOOTER
      ========================== */}

      <Footer
        onNavigate={handleNavigate}
        currentScreen={currentScreen}
      />

      {/* =========================
          QUOTE MODAL
      ========================== */}

      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() =>
          setIsQuoteOpen(false)
        }
        initialProduct={
          quoteProduct
        }
      />

    </div>
  );
}
