import React, { createContext, useContext, useEffect, useState } from "react";
import { extractLanguageFromPath, isValidLanguage, type Language } from "@/lib/language-utils";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Initialize language from localStorage or path
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("burner-email-language");
      if (stored && isValidLanguage(stored)) {
        return stored as Language;
      }
      const pathLang = window.location.pathname.match(/^\/([a-z]{2})/)?.[1];
      if (pathLang && isValidLanguage(pathLang)) {
        return pathLang as Language;
      }
    }
    return "en";
  });

  // Monitor URL changes using popstate event
  useEffect(() => {
    const handlePopState = () => {
      const pathLang = window.location.pathname.match(/^\/([a-z]{2})/)?.[1];
      if (pathLang && isValidLanguage(pathLang)) {
        setLanguageState(pathLang as Language);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const setLanguage = (lang: Language) => {
    if (lang === language) return;

    setLanguageState(lang);

    // Update URL and localStorage
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const cleanPath = currentPath.replace(/^\/[a-z]{2}(\/|$)/, "/");
      const newPath = `/${lang}${cleanPath === "/" ? "/" : cleanPath}`;
      
      window.history.pushState(null, "", newPath);
      localStorage.setItem("burner-email-language", lang);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    return {
      language: "en" as Language,
      setLanguage: () => {}
    };
  }
  return context;
}

export type { Language };
