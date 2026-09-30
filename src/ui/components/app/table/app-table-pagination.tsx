import { AppButton } from "../primitives/app-button";
import { AppInline } from "../primitives/app-inline";
import { AppSingleSelect } from "../primitives/app-single-select";
import { cn } from "@/lib/utils";

export interface AppTablePaginationProps {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  totalRows?: number;
  pageSizeOptions?: number[];
  disabled?: boolean;
  onPageIndexChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  className?: string;
}

export function AppTablePagination({
  pageIndex,
  pageSize,
  pageCount,
  totalRows,
  pageSizeOptions = [10, 20, 30, 50, 100],
  disabled = false,
  onPageIndexChange,
  onPageSizeChange,
  className,
}: AppTablePaginationProps) {
  const currentPage = pageIndex + 1;
  const safePageCount = Math.max(pageCount, 1);

  const from = totalRows && totalRows > 0 ? pageIndex * pageSize + 1 : 0;
  const to =
    totalRows && totalRows > 0
      ? Math.min((pageIndex + 1) * pageSize, totalRows)
      : 0;

  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col gap-2 text-xs text-[hsl(var(--app-muted-foreground))] sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 truncate">
        {totalRows !== undefined ? (
          <span>
            Mostrando {from}-{to} de {totalRows}
          </span>
        ) : (
          <span>
            Página {currentPage} de {safePageCount}
          </span>
        )}
      </div>

      <AppInline gap="xs" justify="end" wrap>
        <AppSingleSelect<number>
          value={pageSize}
          options={pageSizeOptions.map((option) => ({
            value: option,
            label: `${option} filas`,
          }))}
          onChange={(value) => {
            if (value) {
              onPageSizeChange(value);
            }
          }}
          size="xs"
          fieldWidth="auto"
          isDisabled={disabled}
          aria-label="Filas por página"
        />

        <AppButton
          type="button"
          size="xs"
          variant="secondary"
          disabled={disabled || pageIndex <= 0}
          onClick={() => onPageIndexChange(0)}
        >
          «
        </AppButton>

        <AppButton
          type="button"
          size="xs"
          variant="secondary"
          disabled={disabled || pageIndex <= 0}
          onClick={() => onPageIndexChange(pageIndex - 1)}
        >
          ‹
        </AppButton>

        <span className="min-w-16 text-center">
          {currentPage}/{safePageCount}
        </span>

        <AppButton
          type="button"
          size="xs"
          variant="secondary"
          disabled={disabled || currentPage >= safePageCount}
          onClick={() => onPageIndexChange(pageIndex + 1)}
        >
          ›
        </AppButton>

        <AppButton
          type="button"
          size="xs"
          variant="secondary"
          disabled={disabled || currentPage >= safePageCount}
          onClick={() => onPageIndexChange(safePageCount - 1)}
        >
          »
        </AppButton>
      </AppInline>
    </div>
  );
}
