import * as React from "react";
import { Check, Moon, Monitor, RotateCcw, Sun } from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { useAppTheme } from "./app-theme-provider";
import { normalizeHexColor, type AppAppearance } from "./app-theme-runtime";

const ACCENT_PRESETS = [
  { label: "NOVA", value: "#1fc99a" },
  { label: "Azul", value: "#2563eb" },
  { label: "Morado", value: "#7c3aed" },
  { label: "Fucsia", value: "#e11d8f" },
  { label: "Rojo", value: "#ef4444" },
  { label: "Ámbar", value: "#f59e0b" },
];

const appearanceOptions: Array<{
  value: AppAppearance;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    value: "light",
    label: "Claro",
    icon: <Sun className="h-3 w-3" />,
  },
  {
    value: "dark",
    label: "Oscuro",
    icon: <Moon className="h-3 w-3" />,
  },
  {
    value: "system",
    label: "Sistema",
    icon: <Monitor className="h-3 w-3" />,
  },
];

export function AppThemeColorPicker() {
  const {
    accentColor,
    appearance,
    setAccentColor,
    setAppearance,
    resetAccentColor,
  } = useAppTheme();

  const [draftColor, setDraftColor] = React.useState(accentColor);

  React.useEffect(() => {
    setDraftColor(accentColor);
  }, [accentColor]);

  const commitColor = React.useCallback(
    (value: string) => {
      const normalized = normalizeHexColor(value);

      if (!normalized) {
        setDraftColor(accentColor);
        return;
      }

      setDraftColor(normalized);
      setAccentColor(normalized);
    },
    [accentColor, setAccentColor],
  );

  return (
    <AppStack gap="xs" className="min-w-0 p-2">
      <AppInline gap="xs" align="center" justify="between" className="min-w-0">
        <span className="text-[10px] font-semibold uppercase leading-none tracking-wide text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          Apariencia
        </span>

        <AppButton
          type="button"
          variant="ghost"
          size="xs"
          width="auto"
          leftIcon={<RotateCcw className="h-3 w-3" />}
          onClick={resetAccentColor}
        >
          Reset
        </AppButton>
      </AppInline>

      <AppInline gap="xs" align="center" wrap>
        {appearanceOptions.map((option) => (
          <AppButton
            key={option.value}
            type="button"
            variant={appearance === option.value ? "primary" : "secondary"}
            size="xs"
            width="auto"
            leftIcon={option.icon}
            onClick={() => setAppearance(option.value)}
          >
            {option.label}
          </AppButton>
        ))}
      </AppInline>

      <div className="grid grid-cols-[2rem_1fr] gap-1">
        <input
          type="color"
          value={draftColor}
          onChange={(event) => commitColor(event.target.value)}
          className={[
            "h-8 w-8 cursor-pointer rounded-[var(--app-radius-sm)] border",
            "border-[hsl(var(--app-border,var(--border)))]",
            "bg-transparent p-0.5",
          ].join(" ")}
          aria-label="Seleccionar color principal"
        />

        <input
          value={draftColor}
          onChange={(event) => setDraftColor(event.target.value)}
          onBlur={(event) => commitColor(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              commitColor(event.currentTarget.value);
              event.currentTarget.blur();
            }
          }}
          placeholder="#1fc99a"
          className={[
            "h-8 min-w-0 rounded-[var(--app-radius-sm)] border",
            "border-[hsl(var(--app-input-border,var(--border)))]",
            "bg-[hsl(var(--app-input-bg,var(--background)))]",
            "px-2 text-xs",
            "text-[hsl(var(--app-input-foreground,var(--foreground)))]",
            "outline-none",
            "focus:border-[hsl(var(--app-input-border-focus,var(--ring)))]",
            "focus:ring-2 focus:ring-[hsl(var(--app-ring-soft))]",
          ].join(" ")}
        />
      </div>

      <AppInline gap="xs" align="center" wrap>
        {ACCENT_PRESETS.map((preset) => {
          const isActive =
            preset.value.toLowerCase() === accentColor.toLowerCase();

          return (
            <button
              key={preset.value}
              type="button"
              onClick={() => commitColor(preset.value)}
              className={[
                "group flex h-6 items-center gap-1 rounded-[var(--app-radius-full)] border px-1.5",
                "border-[hsl(var(--app-border,var(--border)))]",
                "text-[9px] font-medium",
                "text-[hsl(var(--app-foreground,var(--foreground)))]",
                "hover:bg-[hsl(var(--app-muted,var(--muted))/0.55)]",
              ].join(" ")}
              title={preset.label}
            >
              <span
                className="h-3 w-3 rounded-full border border-black/10"
                style={{ backgroundColor: preset.value }}
              />

              <span>{preset.label}</span>

              {isActive ? <Check className="h-3 w-3" /> : null}
            </button>
          );
        })}
      </AppInline>
    </AppStack>
  );
}
