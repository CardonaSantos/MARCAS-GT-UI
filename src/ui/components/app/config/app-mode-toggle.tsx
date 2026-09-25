"use client";

import { Check, Laptop, Moon, Sun } from "lucide-react";

import {
  AppDropdownMenu,
  AppDropdownMenuContent,
  AppDropdownMenuItem,
  AppDropdownMenuTrigger,
} from "../primitives/app-dropdown-menu";
import { AppButton } from "../primitives/app-button";
import { useAppTheme } from "./app-theme-provider";
import type { AppAppearance } from "./app-theme-runtime";

const APPEARANCE_OPTIONS: Array<{
  value: AppAppearance;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    value: "light",
    label: "Día",
    icon: <Sun size={13} />,
  },
  {
    value: "dark",
    label: "Noche",
    icon: <Moon size={13} />,
  },
  {
    value: "system",
    label: "Sistema",
    icon: <Laptop size={13} />,
  },
];

function getAppearanceIcon(appearance: AppAppearance) {
  if (appearance === "dark") return <Moon className="h-3.5 w-3.5" />;
  if (appearance === "system") return <Laptop className="h-3.5 w-3.5" />;

  return <Sun className="h-3.5 w-3.5" />;
}

export function AppModeToggle() {
  const { appearance, setAppearance } = useAppTheme();

  return (
    <AppDropdownMenu>
      <AppDropdownMenuTrigger asChild>
        <AppButton
          variant="outline"
          size="iconXs"
          radius="md"
          aria-label="Cambiar apariencia"
          title="Cambiar apariencia"
        >
          {getAppearanceIcon(appearance)}
        </AppButton>
      </AppDropdownMenuTrigger>

      <AppDropdownMenuContent
        align="end"
        width="sm"
        size="xs"
        className="w-36 p-1"
      >
        {APPEARANCE_OPTIONS.map((option) => {
          const isActive = option.value === appearance;

          return (
            <AppDropdownMenuItem
              key={option.value}
              className="h-7 px-2 text-[11px]"
              onSelect={() => setAppearance(option.value)}
            >
              <span className="flex w-full items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  {option.icon}
                  {option.label}
                </span>

                {isActive ? (
                  <Check size={12} className="text-[hsl(var(--app-primary))]" />
                ) : null}
              </span>
            </AppDropdownMenuItem>
          );
        })}
      </AppDropdownMenuContent>
    </AppDropdownMenu>
  );
}
