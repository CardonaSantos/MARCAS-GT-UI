import { AppButton } from "../primitives/app-button";
import { AppInline } from "../primitives/app-inline";
import type { AppDataTableDensity } from "./app-data-table.types";

export interface AppTableDensityToggleProps {
  value: AppDataTableDensity;
  onChange: (value: AppDataTableDensity) => void;
  disabled?: boolean;
}

const OPTIONS: Array<{
  value: AppDataTableDensity;
  label: string;
}> = [
  { value: "xs", label: "XS" },
  { value: "sm", label: "SM" },
  { value: "md", label: "MD" },
];

export function AppTableDensityToggle({
  value,
  onChange,
  disabled = false,
}: AppTableDensityToggleProps) {
  return (
    <AppInline gap="xs" wrap={false}>
      {OPTIONS.map((option) => (
        <AppButton
          key={option.value}
          type="button"
          size="xs"
          variant={value === option.value ? "primary" : "secondary"}
          disabled={disabled}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </AppButton>
      ))}
    </AppInline>
  );
}
