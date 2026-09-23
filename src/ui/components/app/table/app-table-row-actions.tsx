import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";

import { cn } from "@/lib/utils";
import { AppButton } from "../primitives/app-button";
import {
  appTableMenuContentVariants,
  appTableMenuItemVariants,
} from "../theme/app-data-table.variants";
import type { AppTableRowAction } from "./app-data-table.types";

export interface AppTableRowActionsProps<TData> {
  row: Row<TData>;
  actions: AppTableRowAction<TData>[];
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

function runAfterDropdownClose(callback: () => void) {
  window.requestAnimationFrame(() => {
    window.setTimeout(callback, 0);
  });
}

export function AppTableRowActions<TData>({
  row,
  actions,
  align = "end",
  side = "bottom",
  className,
}: AppTableRowActionsProps<TData>) {
  const visibleActions = actions.filter((action) => !action.hidden);

  if (!visibleActions.length) {
    return null;
  }

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <AppButton
          type="button"
          size="xs"
          variant="ghost"
          aria-label="Abrir acciones"
          className={className}
        >
          <MoreVertical className="h-4 w-4" />
        </AppButton>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side={side}
          align={align}
          sideOffset={6}
          collisionPadding={8}
          className={appTableMenuContentVariants()}
        >
          {visibleActions.map((action, index) => (
            <React.Fragment key={`${action.label}-${index}`}>
              {action.separatorBefore ? (
                <DropdownMenu.Separator className="my-1 h-px bg-[hsl(var(--app-table-border))]" />
              ) : null}

              <DropdownMenu.Item
                disabled={action.disabled}
                className={cn(
                  appTableMenuItemVariants({
                    tone: action.tone ?? "default",
                  }),
                )}
                onSelect={() => {
                  runAfterDropdownClose(() => {
                    action.onClick(row);
                  });
                }}
              >
                {action.icon ? (
                  <span className="[&_svg]:h-3.5 [&_svg]:w-3.5">
                    {action.icon}
                  </span>
                ) : null}

                <span className="min-w-0 truncate">{action.label}</span>
              </DropdownMenu.Item>
            </React.Fragment>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function createAppRowActionsColumn<TData>({
  actions,
  header = "Acciones",
  size = 72,
  align = "end",
  side = "bottom",
}: {
  actions: (row: Row<TData>) => AppTableRowAction<TData>[];
  header?: string;
  size?: number;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
}): ColumnDef<TData, unknown> {
  return {
    id: "__actions",
    header,
    size,
    minSize: size,
    maxSize: size,
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
    meta: {
      align: "center",
      truncate: false,
    },
    cell: ({ row }) => (
      <AppTableRowActions
        row={row}
        actions={actions(row)}
        align={align}
        side={side}
      />
    ),
  };
}
