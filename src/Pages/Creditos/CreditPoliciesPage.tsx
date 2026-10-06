import { Landmark, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { useCreditPolicies } from "@/features/creditos/api/credit.queries";
import { useCreditPolicyListState } from "@/features/creditos/common/use-credit-policy-list-state";
import { CreditPolicyFilters } from "@/features/creditos/components/credit-policy-filters";
import { CreditPolicyTable } from "@/features/creditos/components/credit-policy-table";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function CreditPoliciesPage() {
  const location = useLocation();
  const role = useStore((state) => state.userRol);
  const isAdmin = role === "ADMIN";
  const state = useCreditPolicyListState();
  const query = useCreditPolicies(state.queryFilters);
  const meta = query.data?.meta;
  const currentUrl = location.pathname + location.search;

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Políticas de crédito"
          description="Define límites y requisitos reutilizables para solicitudes CREDITO."
          actions={
            <>
              <AppButton asChild variant="secondary" size="sm">
                <Link to="/marcas-gt/creditos" state={{ from: currentUrl }}>
                  <Landmark className="h-4 w-4" />
                  Solicitudes
                </Link>
              </AppButton>

              {isAdmin ? (
                <AppButton asChild variant="primary" size="sm">
                  <Link
                    to="/marcas-gt/creditos/politicas/nueva"
                    state={{ from: currentUrl }}
                  >
                    <Plus className="h-4 w-4" />
                    Nueva política
                  </Link>
                </AppButton>
              ) : null}
            </>
          }
        />

        <CreditPolicyTable
          data={query.data?.data ?? []}
          isAdmin={isAdmin}
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          pagination={{
            pageIndex: state.table.pagination.pageIndex,
            pageSize: state.table.pagination.pageSize,
            totalRows: meta?.total ?? 0,
            pageCount: Math.max(meta?.totalPages ?? 1, 1),
            onPaginationChange: state.setPagination,
          }}
          toolbar={
            <CreditPolicyFilters
              search={state.table.search}
              activo={state.filters.activo}
              onSearchChange={state.setSearch}
              onSearchDebouncedChange={state.setServerSearch}
              onActivoChange={state.setActivo}
              onReset={state.resetFilters}
            />
          }
        />
      </AppStack>
    </AppContainer>
  );
}
