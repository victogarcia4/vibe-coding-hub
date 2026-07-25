import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, TranslationSchema } from "./types";
import { es } from "./locales/es";
import { en } from "./locales/en";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationSchema;
}

const dictionaries: Record<Language, TranslationSchema> = {
  es,
  en,
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // 1. Check URL query parameter ?lang=en or ?lang=es
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const langParam = urlParams.get("lang");
      if (langParam === "en" || langParam === "es") {
        return langParam;
      }
      // 2. Check localStorage
      const savedLang = localStorage.getItem("vibe-hub-lang");
      if (savedLang === "en" || savedLang === "es") {
        return savedLang;
      }
    }
    // Default language is Spanish ("es")
    return "es";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("vibe-hub-lang", lang);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value: I18nContextType = {
    language,
    setLanguage,
    t: dictionaries[language],
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
