import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserRoundPlus } from "lucide-react";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { useProspectHistory } from "@/features/prospectos/api/prospect-history.queries";
import { useConvertProspectToCustomer } from "@/features/prospectos/api/prospect-history.mutations";
import { useProspectHistoryState } from "@/features/prospectos/common/use-prospect-history-state";
import { ProspectHistoryFilters } from "@/features/prospectos/components/prospect-history-filters";
import { ProspectHistoryTable } from "@/features/prospectos/components/prospect-history-table";
import { ProspectHistoryDetailDialog } from "@/features/prospectos/components/prospect-history-detail-dialog";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function ProspectoHistorial() {
  const state = useProspectHistoryState();
  const history = useProspectHistory(state.filters);
  const converter = useConvertProspectToCustomer();
  const [detailId, setDetailId] = useState<number | null>(null);
  const [convertingId, setConvertingId] = useState<number | null>(null);
  const meta = history.data?.meta;

  useEffect(() => {
    if (meta && meta.totalPages > 0 && state.filters.page > meta.totalPages) {
      state.setPagination({
        pageIndex: meta.totalPages - 1,
        pageSize: state.filters.limit,
      });
    }
  }, [meta?.totalPages, state.filters.page, state.filters.limit, state.setPagination]);

  const confirmConversion = async () => {
    if (convertingId === null) return;
    await converter.mutateAsync({ id: convertingId });
    setConvertingId(null);
    setDetailId(null);
  };

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Historial de prospectos"
          actions={
            <AppButton asChild size="sm" variant="primary">
              <Link to="/marcas-gt/prospecto">
                <UserRoundPlus className="h-4 w-4" />
                Nuevo prospecto
              </Link>
            </AppButton>
          }
        />
        <ProspectHistoryTable
          rows={history.data?.data ?? []}
          isLoading={history.isLoading}
          isFetching={history.isFetching}
          error={history.error}
          onRetry={() => void history.refetch()}
          onDetail={setDetailId}
          onConvert={setConvertingId}
          sorting={state.sorting}
          onSortingChange={state.setSorting}
          pagination={{
            pageIndex: state.pagination.pageIndex,
            pageSize: state.pagination.pageSize,
            totalRows: meta?.total ?? 0,
            pageCount: Math.max(meta?.totalPages ?? 1, 1),
            onPaginationChange: state.setPagination,
          }}
          toolbar={
            <ProspectHistoryFilters
              filters={state.filters}
              searchDraft={state.searchDraft}
              onSearchDraft={state.setSearchDraft}
              onSearch={state.setSearch}
              onFilter={state.setFilter}
              onClear={state.clear}
            />
          }
        />
        <ProspectHistoryDetailDialog
          id={detailId}
          onClose={() => setDetailId(null)}
          onConvert={setConvertingId}
        />
        <AppConfirmDialog
          open={convertingId !== null}
          onOpenChange={(open) => {
            if (!open && !converter.isPending) setConvertingId(null);
          }}
          preset="confirm"
          title="Convertir prospecto en cliente"
          description="Se generará un cliente con los datos guardados en el prospecto finalizado y se vincularán ambos registros. La operación es transaccional y no se puede repetir."
          confirmText="Generar cliente"
          loadingText="Generando cliente..."
          isLoading={converter.isPending}
          onConfirm={confirmConversion}
          onConfirmError={() => { /* El hook muestra el mensaje y permite reintentar. */ }}
        />
      </AppStack>
    </AppContainer>
  );
}
