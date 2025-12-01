import { SUPPORTED_LANGUAGES, type Language } from "./language-utils";

/**
 * Generate hreflang links for international SEO
 * Returns array of hreflang link objects for all language versions of a URL
 */
export function generateHreflangs(baseUrl: string, currentLanguage: Language) {
  const hreflangs = Object.keys(SUPPORTED_LANGUAGES).map((lang) => ({
    rel: "alternate",
    hrefLang: lang,
    href: baseUrl.replace(/\/(en|es|pt|fr|de|hi)(\/|$)/, `/${lang}/`),
  }));

  // Add x-default for English
  hreflangs.push({
    rel: "alternate",
    hrefLang: "x-default",
    href: baseUrl.replace(/\/(en|es|pt|fr|de|hi)(\/|$)/, `/en/`),
  });

  return hreflangs;
}

/**
 * Generate language-specific canonical URL
 */
export function generateCanonicalUrl(path: string, language: Language): string {
  const cleanPath = path.replace(/\/(en|es|pt|fr|de|hi)(\/|$)/, "/");
  return `https://burneremail.email/${language}${cleanPath === "/" ? "/" : cleanPath}`;
}

/**
 * Get all language versions of a URL
 */
export function getAllLanguageVersions(basePath: string): Record<Language, string> {
  const cleanPath = basePath.replace(/\/(en|es|pt|fr|de|hi)(\/|$)/, "/");
  const versions: Record<Language, string> = {} as Record<Language, string>;

  (Object.keys(SUPPORTED_LANGUAGES) as Language[]).forEach((lang) => {
    versions[lang] = `/${lang}${cleanPath === "/" ? "/" : cleanPath}`;
  });

  return versions;
}
