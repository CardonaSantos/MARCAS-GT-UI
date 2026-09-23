export const APP_ACCENT_STORAGE_KEY = "app-accent-color";
export const APP_APPEARANCE_STORAGE_KEY = "app-appearance";

export type AppAppearance = "light" | "dark";

export function hexToHslTriplet(hex: string) {
  const sanitized = hex.replace("#", "");

  const r = parseInt(sanitized.slice(0, 2), 16) / 255;
  const g = parseInt(sanitized.slice(2, 4), 16) / 255;
  const b = parseInt(sanitized.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const delta = max - min;

    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    if (max === r) {
      h = (g - b) / delta + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// function toHslCss(value: { h: number; s: number; l: number }) {
//   return `${value.h} ${value.s}% ${value.l}%`;
// }

function clampLightness(value: number) {
  return Math.max(8, Math.min(96, value));
}

export function applyAppAccentColor(hex: string) {
  const { h, s, l } = hexToHslTriplet(hex);

  const root = document.documentElement;

  const primary = `${h} ${s}% ${l}%`;
  const primaryHover = `${h} ${s}% ${clampLightness(l - 7)}%`;

  const primarySoft = `${h} ${Math.max(s - 12, 20)}% 94%`;
  //   const primarySoftDark = `${h} ${Math.max(s - 12, 20)}% 18%`;
  const primaryForeground = `${h} ${s}% 26%`;
  const primaryBorder = `${h} ${s}% 84%`;

  /**
   * Tokens globales
   */
  root.style.setProperty("--app-primary", primary);
  root.style.setProperty("--app-primary-hover", primaryHover);
  root.style.setProperty("--app-ring", primary);

  /**
   * Button
   */
  root.style.setProperty("--app-button-primary-bg", primary);
  root.style.setProperty("--app-button-primary-bg-hover", primaryHover);
  root.style.setProperty("--app-button-primary-border", primary);

  /**
   * Switch
   */
  root.style.setProperty("--app-switch-bg-checked", primary);
  root.style.setProperty("--app-switch-bg-checked-hover", primaryHover);

  /**
   * Checkbox
   */
  root.style.setProperty("--app-checkbox-bg-checked", primary);
  root.style.setProperty("--app-checkbox-border-checked", primary);

  /**
   * Select/Input focus
   */
  root.style.setProperty("--app-select-ring", primary);
  root.style.setProperty("--app-input-ring", primary);
  root.style.setProperty("--app-textarea-ring", primary);

  /**
   * Badge primary
   */
  root.style.setProperty("--app-badge-primary-bg", primarySoft);
  root.style.setProperty("--app-badge-primary-foreground", primaryForeground);
  root.style.setProperty("--app-badge-primary-border", primaryBorder);

  /**
   * Table selected/bulk state
   */
  root.style.setProperty("--app-table-row-selected-bg", primarySoft);
  root.style.setProperty("--app-table-bulk-bg", primarySoft);
  root.style.setProperty("--app-table-bulk-foreground", primaryForeground);
  root.style.setProperty("--app-table-bulk-border", primaryBorder);

  /**
   * Guardado
   */
  localStorage.setItem(APP_ACCENT_STORAGE_KEY, hex);
}

export function applyAppAppearance(appearance: AppAppearance) {
  const root = document.documentElement;

  root.classList.toggle("dark", appearance === "dark");
  root.dataset.appAppearance = appearance;

  localStorage.setItem(APP_APPEARANCE_STORAGE_KEY, appearance);
}

export function loadPersistedAppTheme() {
  const accent = localStorage.getItem(APP_ACCENT_STORAGE_KEY);
  const appearance = localStorage.getItem(
    APP_APPEARANCE_STORAGE_KEY,
  ) as AppAppearance | null;

  if (appearance) {
    applyAppAppearance(appearance);
  }

  if (accent) {
    applyAppAccentColor(accent);
  }
}
