import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { extractLanguageFromPath, isValidLanguage, type Language } from "@/lib/language-utils";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  
  // Track language in state and update when location changes
  const [language, setLanguageState] = useState<Language>(() => {
    return extractLanguageFromPath(location);
  });

  // Update language state whenever location changes
  useEffect(() => {
    const newLanguage = extractLanguageFromPath(location);
    setLanguageState(newLanguage);
  }, [location]);

  const setLanguage = (lang: Language) => {
    if (lang === language) return;
    
    // Remove existing language prefix and add new one
    const cleanPath = location.replace(/^\/[a-z]{2}(\/|$)/, "/");
    // Always ensure trailing slash for proper route matching
    const newPath = `/${lang}${cleanPath === "/" ? "/" : cleanPath}`;
    navigate(newPath);
    
    // Scroll to top smoothly when language changes
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      localStorage.setItem("burner-email-language", lang);
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
