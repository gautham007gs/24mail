import { useLanguage } from "@/contexts/language-context";
import { getLanguagePrefix } from "@/lib/language-utils";

export function useLocalizedLink() {
  const { language } = useLanguage();

  return (path: string) => {
    // Remove existing language prefix if present
    const cleanPath = path.replace(/^\/[a-z]{2}(\/|$)/, "/");
    // Add language prefix with trailing slash for consistency
    const finalPath = cleanPath === "/" ? "" : (cleanPath.endsWith("/") ? cleanPath : `${cleanPath}/`);
    return `${getLanguagePrefix(language)}${finalPath}`;
  };
}
