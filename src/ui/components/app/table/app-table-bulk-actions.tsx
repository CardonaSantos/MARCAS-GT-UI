import type { AppTableBulkAction } from "./app-data-table.types";
import { AppButton } from "../primitives/app-button";
import { AppInline } from "../primitives/app-inline";
import { cn } from "@/lib/utils";
import { appTableBulkActionsVariants } from "../theme/app-data-table.variants";

export interface AppTableBulkActionsProps {
  selectedCount: number;
  actions: AppTableBulkAction[];
  label?: string;
  className?: string;
}

export function AppTableBulkActions({
  selectedCount,
  actions,
  label,
  className,
}: AppTableBulkActionsProps) {
  const visibleActions = actions.filter((action) => !action.hidden);

  if (selectedCount <= 0 || !visibleActions.length) {
    return null;
  }

  return (
    <div className={cn(appTableBulkActionsVariants(), className)}>
      <div className="min-w-0 font-medium">
        {label ??
          `${selectedCount} seleccionado${selectedCount === 1 ? "" : "s"}`}
      </div>

      <AppInline justify="end" gap="xs" wrap>
        {visibleActions.map((action, index) => (
          <AppButton
            key={index}
            type="button"
            size="xs"
            variant={action.tone === "danger" ? "danger" : "secondary"}
            disabled={action.disabled}
            leftIcon={action.icon}
            onClick={action.onClick}
          >
            {action.label}
          </AppButton>
        ))}
      </AppInline>
    </div>
  );
}
