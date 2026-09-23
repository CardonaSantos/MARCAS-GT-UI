"use client";
import { Check, Laptop, Moon, Sun } from "lucide-react";
import {
  AppDropdownMenu,
  AppDropdownMenuContent,
  AppDropdownMenuItem,
  AppDropdownMenuTrigger,
} from "../primitives/app-dropdown-menu";
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
  if (appearance === "dark") return <Moon size={15} />;
  if (appearance === "system") return <Laptop size={15} />;

  return <Sun size={15} />;
}

export function AppModeToggle() {
  const { appearance, setAppearance } = useAppTheme();

  return (
    <AppDropdownMenu>
      <AppDropdownMenuTrigger
        className={[
          "relative inline-flex h-8 w-8 items-center justify-center rounded-[var(--app-radius-md)]",
          "border border-[hsl(var(--app-border,var(--border)))]",
          "bg-[hsl(var(--app-background,var(--background)))]",
          "text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
          "transition-colors hover:bg-[hsl(var(--app-muted,var(--muted))/0.55)]",
          "hover:text-[hsl(var(--app-foreground,var(--foreground)))]",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-[hsl(var(--app-ring,var(--ring)))]",
        ].join(" ")}
        aria-label="Cambiar apariencia"
        title="Cambiar apariencia"
      >
        {getAppearanceIcon(appearance)}
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
