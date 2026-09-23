import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { Table } from "@tanstack/react-table";
import { Columns3, RotateCcw } from "lucide-react";

import { AppButton } from "../primitives/app-button";
import { AppCheckbox } from "../primitives/app-checkbox";
import { AppInput } from "../primitives/app-input";
import {
  appTableMenuContentVariants,
  appTableMenuItemVariants,
} from "../theme/app-data-table.variants";

export interface AppTableColumnVisibilityProps<TData> {
  table: Table<TData>;
  title?: string;
}

export function AppTableColumnVisibility<TData>({
  table,
  title = "Columnas visibles",
}: AppTableColumnVisibilityProps<TData>) {
  const [query, setQuery] = React.useState("");

  const columns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide());

  const filteredColumns = columns.filter((column) => {
    const label =
      typeof column.columnDef.header === "string"
        ? column.columnDef.header
        : column.id;

    return label.toLowerCase().includes(query.toLowerCase());
  });

  if (!columns.length) {
    return null;
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <AppButton
          type="button"
          size="xs"
          variant="secondary"
          leftIcon={<Columns3 className="h-3.5 w-3.5" />}
        >
          Columnas
        </AppButton>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className={appTableMenuContentVariants({
            className: "w-64",
          })}
        >
          <div className="px-2 py-1.5 text-xs font-semibold">{title}</div>

          <div className="p-1">
            <AppInput
              size="xs"
              value={query}
              placeholder="Buscar columna..."
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div className="max-h-72 overflow-auto p-1">
            {filteredColumns.map((column) => {
              const label =
                typeof column.columnDef.header === "string"
                  ? column.columnDef.header
                  : column.id;

              return (
                <label key={column.id} className={appTableMenuItemVariants()}>
                  <AppCheckbox
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => {
                      column.toggleVisibility(value === true);
                    }}
                  />
                  <span className="min-w-0 truncate">{label}</span>
                </label>
              );
            })}
          </div>

          <DropdownMenu.Separator className="my-1 h-px bg-[hsl(var(--app-table-border))]" />

          <DropdownMenu.Item
            className={appTableMenuItemVariants()}
            onSelect={(event) => {
              event.preventDefault();
              table.resetColumnVisibility();
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restaurar columnas
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
