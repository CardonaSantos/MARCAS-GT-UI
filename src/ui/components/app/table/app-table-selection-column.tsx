import type { ColumnDef } from "@tanstack/react-table";

import { AppCheckbox } from "../primitives/app-checkbox";

export function createAppSelectionColumn<TData>(): ColumnDef<TData, unknown> {
  return {
    id: "__select",
    size: 44,
    minSize: 44,
    maxSize: 44,
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
    meta: {
      align: "center",
      truncate: false,
    },
    header: ({ table }) => {
      const checked = table.getIsAllPageRowsSelected()
        ? true
        : table.getIsSomePageRowsSelected()
          ? "indeterminate"
          : false;

      return (
        <AppCheckbox
          checked={checked}
          aria-label="Seleccionar todas las filas visibles"
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(value === true);
          }}
        />
      );
    },
    cell: ({ row }) => {
      const checked = row.getIsSelected()
        ? true
        : row.getIsSomeSelected()
          ? "indeterminate"
          : false;

      return (
        <AppCheckbox
          checked={checked}
          aria-label="Seleccionar fila"
          disabled={!row.getCanSelect()}
          onCheckedChange={(value) => {
            row.toggleSelected(value === true);
          }}
        />
      );
    },
  };
}
