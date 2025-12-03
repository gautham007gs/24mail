
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "burneremail-theme",
}: ThemeProviderProps) {
  // Prevent SSR/root mismatch by waiting for mount
  const [mounted, setMounted] = useState(false);
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  useEffect(() => {
    setMounted(true);

    // Load stored theme AFTER mount
    try {
      const stored = localStorage.getItem(storageKey) as Theme | null;
      const finalTheme = stored || defaultTheme;
      setThemeState(finalTheme);

      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(finalTheme);
    } catch {}
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);

    try {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newTheme);
      localStorage.setItem(storageKey, newTheme);
    } catch {}
  };

  if (!mounted) return null; // Avoids build/runtime crash

  return (
    <ThemeProviderContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used inside ThemeProvider");

  return context;
};
