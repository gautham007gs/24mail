import { useLanguage } from "@/contexts/language-context";
import { translations } from "@/lib/translations";

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: string): string => {
    const keys = key.split(".");
    let current: any = translations[language];
    
    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        // Fallback to English if key not found
        current = translations.en;
        for (const fallbackKey of keys) {
          current = current?.[fallbackKey];
        }
        return typeof current === "string" ? current : key;
      }
    }
    
    return typeof current === "string" ? current : key;
  };

  return { t, language };
}
