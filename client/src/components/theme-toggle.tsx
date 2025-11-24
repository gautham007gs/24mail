import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useCallback, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleTheme = useCallback(() => {
    if (isAnimating) return; // Prevent double-clicks during animation
    
    setIsAnimating(true);
    
    // Determine next theme and apply it immediately
    const nextTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(nextTheme);
    
    // Reset animation state after animation completes
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [theme, setTheme, isAnimating]);

  const nextTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      disabled={isAnimating}
      data-testid="button-theme-toggle"
      className={`shrink-0 transition-all ${isAnimating ? "theme-toggle-animating opacity-70" : ""}`}
      title={`Switch to ${nextTheme} theme (current: ${theme})`}
      aria-label={`Switch to ${nextTheme} theme`}
    >
      {theme === "dark" ? (
        <Moon className="h-5 w-5 transition-all duration-300" data-testid="icon-moon" />
      ) : theme === "light" ? (
        <Sun className="h-5 w-5 transition-all duration-300" data-testid="icon-sun" />
      ) : (
        <Sun className="h-5 w-5 opacity-60 transition-all duration-300" data-testid="icon-sun-system" />
      )}
      <span className="sr-only">Current theme: {theme}</span>
    </Button>
  );
}
