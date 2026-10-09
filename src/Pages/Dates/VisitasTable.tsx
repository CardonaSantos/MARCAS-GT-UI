import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CalendarPlus } from "lucide-react";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { useVisitHistory } from "@/features/visitas/api/visit-history.queries";
import { useVisitHistoryState } from "@/features/visitas/common/use-visit-history-state";
import { VisitHistoryFilters } from "@/features/visitas/components/visit-history-filters";
import { VisitHistoryTable } from "@/features/visitas/components/visit-history-table";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function VisitasTable() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = useVisitHistoryState();
  const query = useVisitHistory(state.filters);
  const meta = query.data?.meta;

  useEffect(() => {
    if (meta && meta.totalPages > 0 && state.filters.page > meta.totalPages) {
      state.setPagination({
        pageIndex: meta.totalPages - 1, pageSize: state.filters.limit,
      });
    }
  }, [meta?.totalPages, state.filters.page, state.filters.limit, state.setPagination]);

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Historial de visitas"
          actions={
            <AppButton asChild size="sm" variant="primary">
              <Link to="/marcas-gt/visita">
                <CalendarPlus className="h-4 w-4" /> Registrar visita
              </Link>
            </AppButton>
          }
        />
        <VisitHistoryTable
          rows={query.data?.data ?? []}
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          onDetail={(id) => navigate(`/marcas-gt/historial-visitas/${id}`, {
            state: { from: location.pathname + location.search },
          })}
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
            <VisitHistoryFilters
              filters={state.filters}
              searchDraft={state.searchDraft}
              onSearchDraft={state.setSearchDraft}
              onSearch={state.setSearch}
              onFilter={state.setFilter}
              onClear={state.clear}
            />
          }
        />
      </AppStack>
    </AppContainer>
  );
}
