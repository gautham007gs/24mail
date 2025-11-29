import { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "pt" | "es" | "fr" | "de" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      // First check localStorage (user preference)
      const stored = localStorage.getItem("burner-email-language");
      if (stored) {
        return (stored as Language);
      }

      // Auto-detect from browser language on first visit
      const browserLang = navigator.language.toLowerCase();
      const supportedLanguages: Record<string, Language> = {
        es: "es",
        "es-es": "es",
        "es-mx": "es",
        pt: "pt",
        "pt-br": "pt",
        "pt-pt": "pt",
        fr: "fr",
        "fr-fr": "fr",
        de: "de",
        "de-de": "de",
        hi: "hi",
        "hi-in": "hi",
      };

      // Check for exact match or prefix match
      const detectedLang = supportedLanguages[browserLang] || supportedLanguages[browserLang.split("-")[0]];
      return detectedLang || "en";
    }
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
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
  // Return default values if context is not available (for components rendered outside provider)
  if (context === undefined) {
    return {
      language: "en" as Language,
      setLanguage: () => {}
    };
  }
  return context;
}
