import { useState } from "react";

import { useBodegaEvents } from "../api/bodega.queries";
import { BodegaEventList } from "./bodega-event-list";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";

export function BodegaActivity({ bodegaId }: { bodegaId: number }) {
  const [page, setPage] = useState(1);
  const query = useBodegaEvents(bodegaId, { page, limit: 20 });
  const meta = query.data?.meta;

  return (
    <AppDataState
      isLoading={query.isLoading}
      isFetching={query.isFetching}
      error={query.error}
      onRetry={() => void query.refetch()}
      isEmpty={(query.data?.data.length ?? 0) === 0}
      emptyTitle="Sin actividad"
      emptyDescription="Todavía no hay eventos registrados para esta bodega."
    >
      <BodegaEventList events={query.data?.data ?? []} />

      {(meta?.totalPages ?? 0) > 1 ? (
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
            Página {meta?.page ?? page} de {meta?.totalPages ?? 1}
          </p>

          <div className="flex gap-2">
            <AppButton
              variant="secondary"
              size="xs"
              disabled={page <= 1 || query.isFetching}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Anterior
            </AppButton>
            <AppButton
              variant="secondary"
              size="xs"
              disabled={
                page >= (meta?.totalPages ?? 1) || query.isFetching
              }
              onClick={() => setPage((current) => current + 1)}
            >
              Siguiente
            </AppButton>
          </div>
        </div>
      ) : null}
    </AppDataState>
  );
}
