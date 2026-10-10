import { useCallback } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import type { PaginationState } from "@tanstack/react-table";
import { Warehouse } from "lucide-react";

import {
  parsePositiveIntParam,
  setSearchParam,
} from "@/features/common/navigation/url-state.utils";
import { AppCard } from "@/ui/components/app/primitives/app-card";

import { useInventoryKardex } from "../api/inventory.queries";
import { InventoryBodegaSelect } from "./inventory-selects";
import { InventoryMovementTable } from "./inventory-movement-table";

export function ProductKardexPanel({
  productoId,
}: {
  productoId: number;
}) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const bodegaId = parsePositiveIntParam(searchParams.get("bodegaId"));
  const page = parsePositiveIntParam(searchParams.get("page"), 1) ?? 1;
  const limit = parsePositiveIntParam(searchParams.get("limit"), 20) ?? 20;

  const updateUrl = useCallback(
    (patch: Record<string, string | number | null>) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(patch).forEach(([key, value]) =>
        setSearchParam(next, key, value),
      );
      setSearchParams(next, {
        replace: true,
        state: location.state,
      });
    },
    [location.state, searchParams, setSearchParams],
  );

  const query = useInventoryKardex(
    productoId,
    {
      page,
      limit,
      bodegaId: bodegaId ?? undefined,
    },
    Boolean(bodegaId),
  );

  const setPagination = (next: PaginationState) => {
    updateUrl({
      page: next.pageIndex + 1,
      limit: next.pageSize,
    });
  };

  if (!bodegaId) {
    return (
      <AppCard
        title="Selecciona una bodega"
        description="El movimiento retornado por el backend no incluye la bodega en cada fila. Selecciona una bodega para mantener el kardex inequívoco."
        icon={<Warehouse />}
        size="sm"
      >
        <div className="max-w-md">
          <InventoryBodegaSelect
            value={null}
            onChange={(value) =>
              updateUrl({ bodegaId: value, page: 1 })
            }
            placeholder="Seleccionar bodega"
          />
        </div>
      </AppCard>
    );
  }

  const meta = query.data?.meta;

  return (
    <InventoryMovementTable
      data={query.data?.data ?? []}
      isLoading={query.isLoading}
      isFetching={query.isFetching}
      error={query.error}
      onRetry={() => void query.refetch()}
      toolbar={
        <div className="max-w-md">
          <InventoryBodegaSelect
            value={bodegaId}
            onChange={(value) =>
              updateUrl({ bodegaId: value, page: 1 })
            }
            placeholder="Bodega"
          />
        </div>
      }
      pagination={{
        pageIndex: page - 1,
        pageSize: limit,
        totalRows: meta?.total ?? 0,
        pageCount: Math.max(meta?.totalPages ?? 1, 1),
        onPaginationChange: setPagination,
      }}
    />
  );
}
