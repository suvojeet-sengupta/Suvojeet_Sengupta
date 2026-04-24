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
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setThemeState(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeState('dark');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute(attribute, theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme, attribute, mounted]);

  const toggleTheme = () => {
    setThemeState(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <div className={mounted ? '' : 'is-hydrating'}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
