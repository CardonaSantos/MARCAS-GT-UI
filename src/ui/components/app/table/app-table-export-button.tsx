import { Download } from "lucide-react";

import { AppButton } from "../primitives/app-button";
import type { AppTableExportColumn } from "./app-data-table.types";
import { downloadCsv, stringifyCsvValue } from "./app-table-utils";

export interface AppTableExportButtonProps<TData> {
  rows: TData[];
  columns: AppTableExportColumn<TData>[];
  filename: string;
  disabled?: boolean;
}

export function AppTableExportButton<TData>({
  rows,
  columns,
  filename,
  disabled = false,
}: AppTableExportButtonProps<TData>) {
  const handleExport = () => {
    const header = columns.map((column) => stringifyCsvValue(column.label));
    const body = rows.map((row) =>
      columns.map((column) => stringifyCsvValue(column.getValue(row))),
    );

    const csv = [header, ...body].map((line) => line.join(",")).join("\n");

    downloadCsv(filename, csv);
  };

  return (
    <AppButton
      type="button"
      size="xs"
      variant="secondary"
      disabled={disabled || rows.length === 0}
      leftIcon={<Download className="h-3.5 w-3.5" />}
      onClick={handleExport}
    >
      Exportar
    </AppButton>
  );
}
