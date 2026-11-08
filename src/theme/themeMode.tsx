"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type ThemeMode = {
  isDark: boolean;
  toggle: () => void;
};

const ThemeModeContext = createContext<ThemeMode | null>(null);

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(window.localStorage.getItem("isDarkMode") === "true");
  }, []);

  const toggle = () => {
    setIsDark(previous => {
      const next = !previous;
      window.localStorage.setItem("isDarkMode", String(next));
      document.documentElement.style.backgroundColor = next ? "#232a3b" : "";
      return next;
    });
  };

  return (
    <ThemeModeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within ThemeModeProvider");
  }
  return context;
}
