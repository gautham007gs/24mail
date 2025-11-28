import { useLanguage } from "@/contexts/language-context";
import { translations, type Language } from "@/lib/translations";

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: string): string => {
    // Direct lookup for flat key structure
    const translation = (translations[language] as any)?.[key];
    if (translation) {
      return translation;
    }
    
    // Fallback to English
    const enTranslation = (translations.en as any)?.[key];
    if (enTranslation) {
      return enTranslation;
    }
    
    // Return key if not found (fallback)
    return key;
  };

  return { t, language };
}
