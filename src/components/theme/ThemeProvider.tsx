import { createContext, useContext, useEffect, useState } from "react";
import { generateColorVariables, generateTypographyVariables } from "@/lib/colors";

type Theme = "light" | "dark" | "system";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove("light", "dark");

    // Apply theme based on selection or system preference
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      
      root.classList.add(systemTheme);
      
      // Apply color variables
      const styleElement = document.getElementById("theme-colors");
      if (styleElement) {
        styleElement.innerHTML = generateColorVariables(systemTheme === "dark") + generateTypographyVariables();
      } else {
        const style = document.createElement("style");
        style.id = "theme-colors";
        style.innerHTML = generateColorVariables(systemTheme === "dark") + generateTypographyVariables();
        document.head.appendChild(style);
      }
    } else {
      root.classList.add(theme);
      
      // Apply color variables
      const styleElement = document.getElementById("theme-colors");
      if (styleElement) {
        styleElement.innerHTML = generateColorVariables(theme === "dark") + generateTypographyVariables();
      } else {
        const style = document.createElement("style");
        style.id = "theme-colors";
        style.innerHTML = generateColorVariables(theme === "dark") + generateTypographyVariables();
        document.head.appendChild(style);
      }
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      
      const handleChange = () => {
        const root = window.document.documentElement;
        const systemTheme = mediaQuery.matches ? "dark" : "light";
        
        root.classList.remove("light", "dark");
        root.classList.add(systemTheme);
        
        // Update color variables
        const styleElement = document.getElementById("theme-colors");
        if (styleElement) {
          styleElement.innerHTML = generateColorVariables(systemTheme === "dark") + generateTypographyVariables();
        }
      };
      
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
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