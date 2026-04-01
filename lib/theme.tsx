import React, { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

type Theme = {
  isDark: boolean;
  colors: {
    bg: string;
    card: string;
    text: string;
    sub: string;
    border: string;
    primary: string;
    scoreHigh: string;
    scoreMid: string;
    scoreLow: string;
  };
  toggle: () => void;
  preference: "light" | "dark" | "system";
  setPreference: (p: "light" | "dark" | "system") => void;
};

export const DESIGN = {
  radiusCard: 20,
  radiusBtn: 8,
  fontHeading: "800" as const,
  fontBody: "400" as const,
};

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [preference, setPreference] = useState<"light" | "dark" | "system">("system");
  const isDark = preference === "system" ? system === "dark" : preference === "dark";

  const colors = useMemo(
    () =>
      isDark
        ? {
            bg: "#121212",
            card: "#1E1E1E",
            text: "#FFFFFF",
            sub: "#A0A0A0",
            border: "#2D2D2D",
            primary: "#3B82F6",
            scoreHigh: "#4ade80",
            scoreMid: "#3B82F6",
            scoreLow: "#f87171",
          }
        : {
            bg: "#F3F4F6",
            card: "#FFFFFF",
            text: "#111827",
            sub: "#6B7280",
            border: "#E5E7EB",
            primary: "#3B82F6",
            scoreHigh: "#16a34a",
            scoreMid: "#3B82F6",
            scoreLow: "#dc2626",
          },
    [isDark]
  );

  const value: Theme = {
    isDark,
    colors,
    toggle: () => setPreference((p) => (p === "dark" ? "light" : "dark")),
    preference,
    setPreference,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const t = useContext(ThemeContext);
  if (!t) throw new Error("useTheme outside ThemeProvider");
  return t;
}
