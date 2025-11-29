import { useLanguage } from "@/contexts/language-context";
import { getLanguagePrefix } from "@/lib/language-utils";

export function useLocalizedLink() {
  const { language } = useLanguage();

  return (path: string) => {
    // Remove existing language prefix if present
    const cleanPath = path.replace(/^\/[a-z]{2}(\/|$)/, "/");
    // Add language prefix
    return `${getLanguagePrefix(language)}${cleanPath === "/" ? "" : cleanPath}`;
  };
}
