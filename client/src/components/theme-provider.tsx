import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Helper function to apply theme to DOM
const applyTheme = (theme: Theme) => {
  if (typeof window === "undefined") return;
  
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "burneremail-theme",
}: ThemeProviderProps) {
  const [theme, setThemeValue] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    try {
      const stored = localStorage.getItem(storageKey);
      return (stored as Theme) || defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  // Apply theme immediately on mount
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    if (typeof window === "undefined") return;
    
    try {
      applyTheme(newTheme);
      setThemeValue(newTheme);
      localStorage.setItem(storageKey, newTheme);
    } catch {
      setThemeValue(newTheme);
    }
  };

  const value: ThemeProviderState = {
    theme,
    setTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
