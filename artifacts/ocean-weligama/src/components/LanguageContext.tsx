import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = {
  name: string;
  code: string;
  flag: string;
  currency: string;
  symbol: string;
  rate: number; // Rate relative to USD
};

const languages: Language[] = [
  { name: "English", code: "en", flag: "🇺🇸", currency: "EUR", symbol: "€", rate: 1 },
  { name: "Deutsch", code: "de", flag: "🇩🇪", currency: "EUR", symbol: "€", rate: 1 },
  { name: "Français", code: "fr", flag: "🇫🇷", currency: "EUR", symbol: "€", rate: 1 },
  { name: "Русский", code: "ru", flag: "🇷🇺", currency: "RUB", symbol: "₽", rate: 100 },
  { name: "中文", code: "zh-CN", flag: "🇨🇳", currency: "CNY", symbol: "¥", rate: 7.87 },
  { name: "العربية", code: "ar", flag: "🇦🇪", currency: "AED", symbol: "د.إ", rate: 4.0 },
  { name: "हिन्दी", code: "hi", flag: "🇮🇳", currency: "INR", symbol: "₹", rate: 90.7 },
  { name: "日本語", code: "ja", flag: "🇯🇵", currency: "JPY", symbol: "¥", rate: 165 },
  { name: "Italiano", code: "it", flag: "🇮🇹", currency: "EUR", symbol: "€", rate: 1 },
  { name: "Español", code: "es", flag: "🇪🇸", currency: "EUR", symbol: "€", rate: 1 },
];

import { motion, AnimatePresence } from "framer-motion";

type LanguageContextType = {
  currentLanguage: Language;
  setLanguage: (code: string) => void;
  languages: Language[];
  formatPrice: (usdAmount: number | string) => string;
  isTranslating: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("preferred-language");
    if (saved) {
      const found = languages.find((l) => l.code === saved);
      if (found) setCurrentLanguage(found);
    }
  }, []);

  const setLanguage = (code: string) => {
    const found = languages.find((l) => l.code === code);
    if (found) {
      setIsTranslating(true);
      setCurrentLanguage(found);
      localStorage.setItem("preferred-language", code);
      
      const setTranslationCookie = (langCode: string) => {
        const cookieValue = `/en/${langCode}`;
        // Set cookie for current domain and root domain for maximum compatibility
        document.cookie = `googtrans=${cookieValue}; path=/;`;
        document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname};`;
        
        const domainParts = window.location.hostname.split('.');
        if (domainParts.length >= 2) {
          const rootDomain = domainParts.slice(-2).join('.');
          document.cookie = `googtrans=${cookieValue}; path=/; domain=.${rootDomain};`;
        }
      };
      setTranslationCookie(found.code);

      // Recursive check for the select box (more robust than one-off query)
      let attempts = 0;
      const triggerSelect = () => {
        const select = document.querySelector("select.goog-te-combo") as HTMLSelectElement;
        if (select) {
          select.value = found.code;
          select.dispatchEvent(new Event("change"));
          setTimeout(() => setIsTranslating(false), 1500);
        } else if (attempts < 10) {
          attempts++;
          setTimeout(triggerSelect, 300);
        } else {
          // Absolute fallback if widget is stuck
          location.reload();
        }
      };
      triggerSelect();
    }
  };

  const formatPrice = (usdAmount: number | string) => {
    const amount = typeof usdAmount === "string" ? parseFloat(usdAmount) : usdAmount;
    if (isNaN(amount)) return "$0";
    const converted = amount * currentLanguage.rate;
    return new Intl.NumberFormat(currentLanguage.code === "en" ? "en-US" : currentLanguage.code, {
      style: "currency",
      currency: currentLanguage.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(converted);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, languages, formatPrice, isTranslating }}>
      {children}
      <AnimatePresence>
        {isTranslating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-white/40 backdrop-blur-md flex items-center justify-center pointer-events-none"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <span className="text-sm font-serif italic text-primary tracking-widest animate-pulse">Refining your experience...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}
