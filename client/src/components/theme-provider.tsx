import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Helper function to apply theme to DOM with smooth transition
const applyTheme = (theme: Theme, smooth = false) => {
  const root = window.document.documentElement;
  
  // Add transition class for smooth color animation
  if (smooth) {
    root.classList.add("theme-transitioning");
  }
  
  root.classList.remove("light", "dark");

  if (theme === "system") {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const systemTheme = mediaQuery.matches ? "dark" : "light";
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
  
  // Remove transition class after animation completes
  if (smooth) {
    setTimeout(() => {
      root.classList.remove("theme-transitioning");
    }, 300);
  }
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "burneremail-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeValue] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
  });

  // Apply theme immediately on initial load
  useEffect(() => {
    if (typeof window === "undefined") return;
    applyTheme(theme);
  }, [theme]);

  // Listen for system theme changes only when in system mode
  useEffect(() => {
    if (typeof window === "undefined" || theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      applyTheme("system");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      // Apply theme with smooth transition animation
      applyTheme(newTheme, true);
      // Update state
      setThemeValue(newTheme);
      // Save to localStorage
      localStorage.setItem(storageKey, newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
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
