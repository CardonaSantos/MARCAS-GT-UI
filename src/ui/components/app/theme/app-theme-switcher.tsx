"use client";

import { Check, RotateCcw } from "lucide-react";

import { AppBadge } from "../primitives/app-badge";
import { AppButton } from "../primitives/app-button";
import { AppCard } from "../primitives/app-card";
import { AppInput } from "../primitives/app-input";
import { AppInline } from "../primitives/app-inline";
import { AppStack } from "../primitives/app-stack";
import { AppSwitch } from "../primitives/app-switch";
import { useAppTheme } from "./app-theme-provider";

const PRESET_COLORS = [
  { label: "Verde", value: "#1fc99a" },
  { label: "Azul", value: "#2563eb" },
  { label: "Morado", value: "#7c3aed" },
  { label: "Fucsia", value: "#e11d8f" },
];

export function AppThemeSwitcher() {
  const {
    accentColor,
    appearance,
    setAccentColor,
    setAppearance,
    resetAccentColor,
  } = useAppTheme();

  const isDark = appearance === "dark";

  return (
    <AppCard
      title="Apariencia"
      description="Personaliza el color principal y el modo visual del sistema."
      variant="outline"
      size="sm"
    >
      <AppStack gap="md">
        <AppStack gap="xs">
          <AppInline align="center" justify="between" gap="sm">
            <span className="text-xs font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
              Color principal
            </span>

            <AppBadge tone="neutral" appearance="outline" size="xs">
              {accentColor}
            </AppBadge>
          </AppInline>

          <AppInline gap="xs" wrap>
            {PRESET_COLORS.map((color) => {
              const isActive = accentColor.toLowerCase() === color.value;

              return (
                <AppButton
                  key={color.value}
                  type="button"
                  size="xs"
                  variant={isActive ? "primary" : "secondary"}
                  width="auto"
                  leftIcon={isActive ? <Check size={13} /> : undefined}
                  onClick={() => setAccentColor(color.value)}
                >
                  {color.label}
                </AppButton>
              );
            })}
          </AppInline>

          <AppInline gap="xs" align="center" wrap>
            <input
              type="color"
              value={accentColor}
              onChange={(event) => setAccentColor(event.target.value)}
              className="h-8 w-12 cursor-pointer rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-transparent p-1"
              aria-label="Color principal"
            />

            <AppInput
              size="xs"
              value={accentColor}
              onChange={(event) => setAccentColor(event.target.value)}
              className="max-w-32"
              fieldWidth="auto"
            />

            <AppButton
              type="button"
              size="xs"
              variant="secondary"
              width="auto"
              leftIcon={<RotateCcw size={13} />}
              onClick={resetAccentColor}
            >
              Reset
            </AppButton>
          </AppInline>
        </AppStack>

        <div className="rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted))/0.18)] px-3 py-2">
          <AppSwitch
            checked={isDark}
            onCheckedChange={(checked) => {
              setAppearance(checked ? "dark" : "light");
            }}
            label="Modo oscuro"
            description="Persiste entre recargas. Para modo automático usa el selector compacto."
          />
        </div>
      </AppStack>
    </AppCard>
  );
}
