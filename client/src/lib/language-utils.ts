export type Language = "en" | "pt" | "es" | "fr" | "de" | "hi";

export const SUPPORTED_LANGUAGES: Record<Language, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
  fr: "Français",
  de: "Deutsch",
  hi: "हिन्दी",
};

export const LANGUAGE_FLAGS: Record<Language, string> = {
  en: "🇺🇸",
  es: "🇪🇸",
  pt: "🇵🇹",
  fr: "🇫🇷",
  de: "🇩🇪",
  hi: "🇮🇳",
};

export function isValidLanguage(lang: string | undefined): lang is Language {
  return Object.keys(SUPPORTED_LANGUAGES).includes(lang as string);
}

export function extractLanguageFromPath(pathname: string): Language {
  const match = pathname.match(/^\/([a-z]{2})\//);
  const langFromPath = match?.[1];
  return isValidLanguage(langFromPath) ? langFromPath : "en";
}

export function getLanguagePrefix(lang: Language): string {
  return `/${lang}`;
}

export function createLocalizedPath(pathname: string, lang: Language): string {
  // Remove existing language prefix if present
  const cleanPath = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
  // Add new language prefix
  return `/${lang}${cleanPath === "/" ? "" : cleanPath}`;
}
