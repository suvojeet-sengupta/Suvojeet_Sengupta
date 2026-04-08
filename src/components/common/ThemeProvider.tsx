"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return a dummy context during SSR to prevent crashes, 
    // but ideally we should be inside a provider.
    // In Next.js App Router, the provider in layout.tsx should be found.
    return {
        theme: 'light' as Theme,
        toggleTheme: () => {},
        setTheme: () => {},
    };
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: Theme;
  enableSystem?: boolean;
}

export const ThemeProvider = ({ 
  children, 
  attribute = 'data-theme',
  defaultTheme = 'light'
}: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.setAttribute(attribute, savedTheme);
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = systemPrefersDark ? 'dark' : 'light';
      setThemeState(initialTheme);
      document.documentElement.setAttribute(attribute, initialTheme);
    }
  }, [attribute]);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute(attribute, theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme, mounted, attribute]);

  const toggleTheme = () => {
    setThemeState(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {/* We wrap children in a div that is hidden until mounted to prevent FOUC, 
          but we ALWAYS render the Provider so useTheme() doesn't fail during SSR */}
      <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
