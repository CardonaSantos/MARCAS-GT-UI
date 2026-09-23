"use client";

import * as React from "react";
import { CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { AppButton } from "./app-button";
import { AppGrid } from "./app-grid";
import { AppInline } from "./app-inline";
import { AppStack } from "./app-stack";

type AppMonthPickerSize = "xs" | "sm" | "md" | "lg";

interface MonthOption {
  value: number;
  label: string;
  shortLabel: string;
}

const MONTH_OPTIONS: MonthOption[] = [
  { value: 1, label: "Enero", shortLabel: "Ene" },
  { value: 2, label: "Febrero", shortLabel: "Feb" },
  { value: 3, label: "Marzo", shortLabel: "Mar" },
  { value: 4, label: "Abril", shortLabel: "Abr" },
  { value: 5, label: "Mayo", shortLabel: "May" },
  { value: 6, label: "Junio", shortLabel: "Jun" },
  { value: 7, label: "Julio", shortLabel: "Jul" },
  { value: 8, label: "Agosto", shortLabel: "Ago" },
  { value: 9, label: "Septiembre", shortLabel: "Sep" },
  { value: 10, label: "Octubre", shortLabel: "Oct" },
  { value: 11, label: "Noviembre", shortLabel: "Nov" },
  { value: 12, label: "Diciembre", shortLabel: "Dic" },
];

export interface AppMonthPickerProps {
  id?: string;
  value?: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  size?: AppMonthPickerSize;
  minYear?: number;
  maxYear?: number;
  placeholder?: string;
  className?: string;
  ariaDescribedBy?: string;
}

function parseMonthValue(value?: string | null) {
  if (!value) return null;

  const [yearText, monthText] = value.split("-");
  const year = Number(yearText);
  const month = Number(monthText);

  if (!Number.isInteger(year) || !Number.isInteger(month)) return null;
  if (month < 1 || month > 12) return null;

  return { year, month };
}

function formatMonthValue(year: number, month: number) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

function getMonthLabel(value?: string | null) {
  const parsed = parseMonthValue(value);

  if (!parsed) return null;

  const month = MONTH_OPTIONS.find((item) => item.value === parsed.month);

  if (!month) return null;

  return `${month.label} ${parsed.year}`;
}

function getTriggerSizeClass(size: AppMonthPickerSize) {
  switch (size) {
    case "xs":
      return "h-8 text-xs";
    case "sm":
      return "h-9 text-sm";
    case "lg":
      return "h-11 text-base";
    case "md":
    default:
      return "h-10 text-sm";
  }
}

export function AppMonthPicker({
  id,
  value,
  onChange,
  disabled,
  invalid,
  size = "sm",
  minYear = 2000,
  maxYear = new Date().getFullYear() + 5,
  placeholder = "Seleccione mes y año",
  className,
  ariaDescribedBy,
}: AppMonthPickerProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const currentYear = React.useMemo(() => new Date().getFullYear(), []);
  const parsedValue = React.useMemo(() => parseMonthValue(value), [value]);

  const [open, setOpen] = React.useState(false);
  const [viewYear, setViewYear] = React.useState(
    parsedValue?.year ?? currentYear,
  );

  React.useEffect(() => {
    if (parsedValue?.year) {
      setViewYear(parsedValue.year);
    }
  }, [parsedValue?.year]);

  React.useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;

      if (!target) return;

      if (!rootRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const selectedLabel = getMonthLabel(value);
  const selectedMonth = parsedValue?.month ?? null;
  const selectedYear = parsedValue?.year ?? null;

  const canPrevYear = viewYear > minYear;
  const canNextYear = viewYear < maxYear;

  const handleSelectMonth = React.useCallback(
    (month: number) => {
      onChange(formatMonthValue(viewYear, month));
      setOpen(false);
    },
    [onChange, viewYear],
  );

  const handleClear = React.useCallback(() => {
    onChange("");
    setOpen(false);
  }, [onChange]);

  return (
    <div ref={rootRef} className={cn("w-full", className)}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-invalid={invalid}
        aria-describedby={ariaDescribedBy}
        onClick={() => {
          if (!disabled) {
            setOpen((prev) => !prev);
          }
        }}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-[var(--app-radius-md)]",
          "border bg-[hsl(var(--app-background,var(--background)))] px-3",
          "text-left transition-colors",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-[hsl(var(--app-ring,var(--ring)))]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          getTriggerSizeClass(size),
          invalid
            ? "border-[hsl(var(--app-danger))]"
            : "border-[hsl(var(--app-border,var(--border)))]",
        )}
      >
        <span className="inline-flex min-w-0 items-center gap-2">
          <CalendarIcon
            size={14}
            className="shrink-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
          />

          <span
            className={cn(
              "truncate",
              selectedLabel
                ? "text-[hsl(var(--app-foreground,var(--foreground)))]"
                : "text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
            )}
          >
            {selectedLabel ?? placeholder}
          </span>
        </span>

        {value ? (
          <span
            role="button"
            tabIndex={-1}
            className="rounded-[var(--app-radius-sm)] p-0.5 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))] hover:text-[hsl(var(--app-foreground,var(--foreground)))]"
            onClick={(event) => {
              event.stopPropagation();
              handleClear();
            }}
          >
            <X size={13} />
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          className={cn(
            "mt-2 rounded-[var(--app-radius-md)]",
            "border border-[hsl(var(--app-border,var(--border)))]",
            "bg-[hsl(var(--app-popover,var(--background)))]",
            "p-3 shadow-lg",
          )}
        >
          <AppStack gap="sm">
            <AppInline justify="between" align="center" gap="sm">
              <AppButton
                type="button"
                variant="ghost"
                size="xs"
                width="auto"
                disabled={!canPrevYear}
                onClick={() =>
                  setViewYear((prev) => Math.max(prev - 1, minYear))
                }
                aria-label="Año anterior"
              >
                <ChevronLeft size={14} />
              </AppButton>

              <span className="text-sm font-semibold tabular-nums">
                {viewYear}
              </span>

              <AppButton
                type="button"
                variant="ghost"
                size="xs"
                width="auto"
                disabled={!canNextYear}
                onClick={() =>
                  setViewYear((prev) => Math.min(prev + 1, maxYear))
                }
                aria-label="Año siguiente"
              >
                <ChevronRight size={14} />
              </AppButton>
            </AppInline>

            <AppGrid cols={{ base: 3 }} gap="xs">
              {MONTH_OPTIONS.map((month) => {
                const isSelected =
                  selectedYear === viewYear && selectedMonth === month.value;

                return (
                  <AppButton
                    key={month.value}
                    type="button"
                    variant={isSelected ? "primary" : "ghost"}
                    size="xs"
                    width="full"
                    className="justify-center"
                    onClick={() => handleSelectMonth(month.value)}
                  >
                    {month.shortLabel}
                  </AppButton>
                );
              })}
            </AppGrid>

            <AppInline justify="between" align="center" gap="xs">
              <span className="text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                Seleccione mes y año. No se usa día.
              </span>

              {value ? (
                <AppButton
                  type="button"
                  variant="ghost"
                  size="xs"
                  width="auto"
                  onClick={handleClear}
                >
                  Limpiar
                </AppButton>
              ) : null}
            </AppInline>
          </AppStack>
        </div>
      ) : null}
    </div>
  );
}
