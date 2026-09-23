import * as React from "react";
import {
  APP_ACCENT_STORAGE_KEY,
  APP_APPEARANCE_STORAGE_KEY,
  applyAppAccentColor,
  applyAppAppearance,
  type AppAppearance,
} from "./app-theme-runtime";

type AppThemeContextValue = {
  accentColor: string;
  appearance: AppAppearance;
  setAccentColor: (hex: string) => void;
  setAppearance: (appearance: AppAppearance) => void;
  toggleAppearance: () => void;
  resetAccentColor: () => void;
};

const AppThemeContext = React.createContext<AppThemeContextValue | null>(null);

export interface AppThemeProviderProps {
  children: React.ReactNode;
  defaultAccentColor?: string;
  defaultAppearance?: AppAppearance;
}

export function AppThemeProvider({
  children,
  defaultAccentColor = "#1fc99a",
  defaultAppearance = "light",
}: AppThemeProviderProps) {
  const [accentColor, internalSetAccentColor] = React.useState(() => {
    return localStorage.getItem(APP_ACCENT_STORAGE_KEY) ?? defaultAccentColor;
  });

  const [appearance, internalSetAppearance] = React.useState<AppAppearance>(
    () => {
      return (
        (localStorage.getItem(
          APP_APPEARANCE_STORAGE_KEY,
        ) as AppAppearance | null) ?? defaultAppearance
      );
    },
  );

  const setAccentColor = React.useCallback((hex: string) => {
    internalSetAccentColor(hex);
    applyAppAccentColor(hex);
  }, []);

  const setAppearance = React.useCallback((nextAppearance: AppAppearance) => {
    internalSetAppearance(nextAppearance);
    applyAppAppearance(nextAppearance);
  }, []);

  const toggleAppearance = React.useCallback(() => {
    setAppearance(appearance === "dark" ? "light" : "dark");
  }, [appearance, setAppearance]);

  const resetAccentColor = React.useCallback(() => {
    internalSetAccentColor(defaultAccentColor);
    applyAppAccentColor(defaultAccentColor);
  }, [defaultAccentColor]);

  React.useEffect(() => {
    applyAppAppearance(appearance);
    applyAppAccentColor(accentColor);
  }, [accentColor, appearance]);

  const value = React.useMemo<AppThemeContextValue>(
    () => ({
      accentColor,
      appearance,
      setAccentColor,
      setAppearance,
      toggleAppearance,
      resetAccentColor,
    }),
    [
      accentColor,
      appearance,
      resetAccentColor,
      setAccentColor,
      setAppearance,
      toggleAppearance,
    ],
  );

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = React.useContext(AppThemeContext);

  if (!context) {
    throw new Error("useAppTheme debe usarse dentro de AppThemeProvider");
  }

  return context;
}
