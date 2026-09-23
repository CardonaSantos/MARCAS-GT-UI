export const APP_ACCENT_STORAGE_KEY = "nova:app-accent-color";
export const APP_APPEARANCE_STORAGE_KEY = "nova:app-appearance";

export type AppAppearance = "light" | "dark" | "system";

type HslColor = {
  h: number;
  s: number;
  l: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function normalizeHexColor(hex: string) {
  const value = hex.trim();

  if (/^#[0-9a-fA-F]{6}$/.test(value)) {
    return value.toLowerCase();
  }

  if (/^#[0-9a-fA-F]{3}$/.test(value)) {
    const r = value[1];
    const g = value[2];
    const b = value[3];

    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }

  return null;
}

function hexToHsl(hex: string): HslColor | null {
  const normalized = normalizeHexColor(hex);

  if (!normalized) return null;

  const r = parseInt(normalized.slice(1, 3), 16) / 255;
  const g = parseInt(normalized.slice(3, 5), 16) / 255;
  const b = parseInt(normalized.slice(5, 7), 16) / 255;

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

function hslValue(h: number, s: number, l: number) {
  return `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`;
}

function hslAlphaValue(h: number, s: number, l: number, alpha: number) {
  return `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}% / ${alpha}`;
}

function getSystemAppearance(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getCurrentEffectiveAppearance(): "light" | "dark" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function applyAppAppearance(appearance: AppAppearance) {
  localStorage.setItem(APP_APPEARANCE_STORAGE_KEY, appearance);

  const effectiveAppearance =
    appearance === "system" ? getSystemAppearance() : appearance;

  document.documentElement.classList.toggle(
    "dark",
    effectiveAppearance === "dark",
  );
}

export function applyAppAccentColor(hex: string) {
  const normalized = normalizeHexColor(hex);
  if (!normalized) return;

  const hsl = hexToHsl(normalized);
  if (!hsl) return;

  localStorage.setItem(APP_ACCENT_STORAGE_KEY, normalized);

  const root = document.documentElement;
  const isDark = getCurrentEffectiveAppearance() === "dark";

  const h = hsl.h;
  const s = clamp(hsl.s, 45, 82);
  const l = clamp(hsl.l, 36, 62);

  const primary = hslValue(h, s, l);
  const hover = hslValue(h, s, clamp(l - 7, 24, 58));
  const active = hslValue(h, s, clamp(l - 12, 18, 52));

  root.style.setProperty("--app-brand-teal", primary);
  root.style.setProperty("--app-brand-teal-hover", hover);
  root.style.setProperty("--app-brand-teal-active", active);

  root.style.setProperty("--app-primary", primary);
  root.style.setProperty("--app-primary-hover", hover);
  root.style.setProperty("--app-primary-active", active);
  root.style.setProperty(
    "--app-primary-foreground",
    isDark ? "195 18% 7%" : "0 0% 100%",
  );

  root.style.setProperty("--primary", "var(--app-primary)");
  root.style.setProperty("--ring", "var(--app-ring)");
  root.style.setProperty("--accent", "var(--app-brand-mint)");

  root.style.setProperty("--app-ring", primary);
  root.style.setProperty("--app-ring-soft", hslAlphaValue(h, s, l, 0.22));

  root.style.setProperty("--app-button-primary-bg", primary);
  root.style.setProperty("--app-button-primary-bg-hover", hover);
  root.style.setProperty("--app-button-primary-bg-active", active);
  root.style.setProperty("--app-button-primary-border", primary);
  root.style.setProperty(
    "--app-button-primary-foreground",
    isDark ? "195 18% 7%" : "0 0% 100%",
  );

  root.style.setProperty("--app-switch-bg-checked", primary);
  root.style.setProperty("--app-switch-bg-checked-hover", hover);

  root.style.setProperty("--app-checkbox-checked-bg", primary);
  root.style.setProperty("--app-checkbox-checked-bg-hover", hover);
  root.style.setProperty("--app-checkbox-indeterminate-bg", primary);

  root.style.setProperty("--app-loader-primary", primary);
  root.style.setProperty("--app-status-dot-primary", primary);
  root.style.setProperty("--app-status-dot-primary-ring", primary);

  root.style.setProperty("--app-card-selected-ring", primary);
  root.style.setProperty("--app-table-ring", primary);

  root.style.setProperty("--app-select-option-bg-selected", primary);
  root.style.setProperty("--app-select-option-bg-selected-hover", hover);

  if (isDark) {
    root.style.setProperty("--app-brand-mint", hslValue(h, 55, 14));
    root.style.setProperty("--app-brand-mint-strong", hslValue(h, 44, 24));

    root.style.setProperty("--accent-foreground", hslValue(h, 70, 78));

    root.style.setProperty("--app-badge-primary-soft-bg", hslValue(h, 55, 14));
    root.style.setProperty(
      "--app-badge-primary-soft-foreground",
      hslValue(h, 70, 78),
    );

    root.style.setProperty(
      "--app-select-option-bg-focused",
      hslValue(h, 20, 17),
    );

    root.style.setProperty("--app-select-multi-value-bg", hslValue(h, 55, 14));
    root.style.setProperty(
      "--app-select-multi-value-foreground",
      hslValue(h, 70, 78),
    );
    root.style.setProperty(
      "--app-select-multi-value-border",
      hslValue(h, 44, 24),
    );

    root.style.setProperty("--app-table-row-selected-bg", hslValue(h, 34, 20));
    root.style.setProperty(
      "--app-table-row-selected-foreground",
      "170 18% 96%",
    );
    root.style.setProperty("--app-table-row-selected-muted", "170 14% 84%");
    root.style.setProperty(
      "--app-table-row-selected-link",
      hslValue(h, 76, 82),
    );
    root.style.setProperty(
      "--app-table-row-selected-border",
      hslValue(h, 36, 30),
    );

    root.style.setProperty("--app-table-bulk-bg", hslValue(h, 55, 14));
    root.style.setProperty("--app-table-bulk-foreground", hslValue(h, 70, 78));
    root.style.setProperty("--app-table-bulk-border", hslValue(h, 44, 24));
  } else {
    root.style.setProperty("--app-brand-mint", hslValue(h, 62, 92));
    root.style.setProperty("--app-brand-mint-strong", hslValue(h, 50, 84));

    root.style.setProperty("--accent-foreground", hslValue(h, 72, 25));

    root.style.setProperty("--app-badge-primary-soft-bg", hslValue(h, 62, 92));
    root.style.setProperty(
      "--app-badge-primary-soft-foreground",
      hslValue(h, 72, 25),
    );

    root.style.setProperty(
      "--app-select-option-bg-focused",
      hslValue(h, 45, 94),
    );

    root.style.setProperty("--app-select-multi-value-bg", hslValue(h, 45, 94));
    root.style.setProperty(
      "--app-select-multi-value-foreground",
      hslValue(h, 72, 25),
    );
    root.style.setProperty(
      "--app-select-multi-value-border",
      hslValue(h, 40, 82),
    );

    root.style.setProperty("--app-table-row-selected-bg", hslValue(h, 52, 88));
    root.style.setProperty(
      "--app-table-row-selected-foreground",
      "190 18% 13%",
    );
    root.style.setProperty("--app-table-row-selected-muted", "190 10% 24%");
    root.style.setProperty(
      "--app-table-row-selected-link",
      hslValue(h, 72, 18),
    );
    root.style.setProperty(
      "--app-table-row-selected-border",
      hslValue(h, 42, 72),
    );

    root.style.setProperty("--app-table-bulk-bg", hslValue(h, 62, 93));
    root.style.setProperty("--app-table-bulk-foreground", hslValue(h, 72, 25));
    root.style.setProperty("--app-table-bulk-border", hslValue(h, 45, 82));
  }
}
