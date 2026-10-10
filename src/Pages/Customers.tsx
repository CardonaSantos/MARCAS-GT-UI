import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserPlus } from "lucide-react";

import { useStore } from "@/Context/ContextSucursal";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { useCustomerDirectory } from "@/features/clientes/api/customer-directory.queries";
import { useDeleteCustomer } from "@/features/clientes/api/customer-directory.mutations";
import type { CustomerDirectoryItem } from "@/features/clientes/api/customer-directory.types";
import { useCustomerDirectoryState } from "@/features/clientes/common/use-customer-directory-state";
import { CustomerDirectoryFilters } from "@/features/clientes/components/customer-directory-filters";
import { CustomerDirectoryTable } from "@/features/clientes/components/customer-directory-table";
import { CustomerDirectoryDetailDialog } from "@/features/clientes/components/customer-directory-detail-dialog";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function ClientesList() {
  const location = useLocation();
  const state = useCustomerDirectoryState();
  const query = useCustomerDirectory(state.filters);
  const deleteCustomer = useDeleteCustomer();
  const canManage = useStore((store) => store.userRol === "ADMIN");
  const [detailId, setDetailId] = useState<number | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<CustomerDirectoryItem | null>(null);
  const meta = query.data?.meta;
  const activityTotal = deletingCustomer ? Object.values(deletingCustomer.actividad)
    .reduce((sum, value) => sum + value, 0) : 0;
  const returnTo = location.pathname + location.search;

  useEffect(() => {
    if (meta && meta.totalPages > 0 && state.filters.page > meta.totalPages) {
      state.setPagination({
        pageIndex: meta.totalPages - 1,
        pageSize: state.filters.limit,
      });
    }
  }, [meta?.totalPages, state.filters.page, state.filters.limit, state.setPagination]);

  const confirmDelete = async () => {
    if (!canManage || !deletingCustomer || activityTotal > 0) return;
    try {
      await deleteCustomer.mutateAsync({ id: deletingCustomer.id });
      setDeletingCustomer(null);
    } catch {
      // Conservar diálogo y contexto: el hook notifica los errores del servidor.
    }
  };

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Directorio de clientes"
          actions={
            <AppButton asChild size="sm" variant="primary">
              <Link to="/marcas-gt/crear-cliente" state={{ from: returnTo }}>
                <UserPlus className="h-4 w-4" />
                Nuevo cliente
              </Link>
            </AppButton>
          }
        />

        <CustomerDirectoryTable
          customers={query.data?.data ?? []}
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          onDetail={setDetailId}
          onDelete={setDeletingCustomer}
          canManage={canManage}
          sorting={state.sorting}
          onSorting={state.setSorting}
          pagination={{
            pageIndex: state.pagination.pageIndex,
            pageSize: state.pagination.pageSize,
            totalRows: meta?.total ?? 0,
            pageCount: Math.max(meta?.totalPages ?? 1, 1),
            onPaginationChange: state.setPagination,
          }}
          toolbar={
            <CustomerDirectoryFilters
              filters={state.filters}
              searchDraft={state.draftSearch}
              setSearchDraft={state.setDraftSearch}
              onSearch={state.setSearch}
              onFilter={state.setFilter}
              onClear={state.clear}
            />
          }
        />

        <CustomerDirectoryDetailDialog
          id={detailId}
          onClose={() => setDetailId(null)}
          canManage={canManage}
        />

        <AppConfirmDialog
          open={deletingCustomer !== null}
          onOpenChange={(open) => {
            if (!open && !deleteCustomer.isPending) setDeletingCustomer(null);
          }}
          preset={activityTotal > 0 ? "warning" : "delete"}
          title={activityTotal > 0 ? "Cliente con operaciones asociadas" : "Eliminar cliente"}
          description={deletingCustomer
            ? activityTotal > 0
              ? "Este cliente tiene ventas, pedidos, visitas u otras operaciones. Para preservar la trazabilidad histórica, no se puede eliminar desde el directorio."
              : `¿Eliminar a «${[deletingCustomer.nombre, deletingCustomer.apellido].filter(Boolean).join(" ")}»? Esta acción no se puede deshacer.`
            : undefined}
          confirmText="Eliminar cliente"
          confirmDisabled={activityTotal > 0 || !canManage}
          loadingText="Eliminando..."
          isLoading={deleteCustomer.isPending}
          onConfirm={confirmDelete}
          onConfirmError={() => { /* Los errores se presentan en el hook. */ }}
        />
      </AppStack>
    </AppContainer>
  );
}
