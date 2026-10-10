import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FolderPlus, PackagePlus, Warehouse } from "lucide-react";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { useProductCatalog } from "@/features/productos/api/catalog.queries";
import { useProductCatalogState } from "@/features/productos/common/use-product-catalog-state";
import { ProductCatalogFilters } from "@/features/productos/components/product-catalog-filters";
import { ProductCatalogTable } from "@/features/productos/components/product-catalog-table";
import { ProductCatalogDetailDialog } from "@/features/productos/components/product-catalog-detail-dialog";
import { ProductCatalogEditDialog } from "@/features/productos/components/product-catalog-edit-dialog";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

/**
 * Catálogo comercial. Las cantidades vienen exclusivamente de StockBodega.
 * La ruta histórica se conserva para no romper sidebar ni enlaces previos.
 */
export default function ViewProducts() {
  const location = useLocation();
  const returnTo = location.pathname + location.search;
  const state = useProductCatalogState();
  const query = useProductCatalog(state.filters);
  const meta = query.data?.meta;

  const [detailId, setDetailId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  // Si un filtro deja a la página fuera del rango, regresar a la última válida.
  useEffect(() => {
    if (meta && meta.totalPages > 0 && state.filters.page > meta.totalPages) {
      state.setPagination({
        pageIndex: meta.totalPages - 1,
        pageSize: state.filters.limit,
      });
    }
  }, [meta?.totalPages, meta?.total, state.filters.page, state.filters.limit, state.setPagination]);

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Catálogo de productos"
          actions={
            <>
              <AppButton asChild size="sm" variant="secondary">
                <Link to="/marcas-gt/crear-categoria" state={{ from: returnTo }}>
                  <FolderPlus className="h-4 w-4" />
                  Categorías
                </Link>
              </AppButton>
              <AppButton asChild size="sm" variant="secondary">
                <Link to="/marcas-gt/inventario" state={{ from: returnTo }}>
                  <Warehouse className="h-4 w-4" />
                  Existencias
                </Link>
              </AppButton>
              <AppButton asChild size="sm" variant="primary">
                <Link to="/marcas-gt/crear-productos" state={{ from: returnTo }}>
                  <PackagePlus className="h-4 w-4" />
                  Nuevo producto
                </Link>
              </AppButton>
            </>
          }
        />

        <ProductCatalogTable
          data={query.data?.data ?? []}
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          onDetail={setDetailId}
          onEdit={setEditId}
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
            <ProductCatalogFilters
              filters={state.filters}
              searchDraft={state.draftSearch}
              onSearchDraftChange={state.setDraftSearch}
              onSearch={state.setSearch}
              onFilter={state.setFilter}
              onPrice={state.setPriceRange}
              onReset={state.reset}
            />
          }
        />

        <ProductCatalogDetailDialog
          id={detailId}
          onClose={() => setDetailId(null)}
          onEdit={setEditId}
        />
        <ProductCatalogEditDialog id={editId} onClose={() => setEditId(null)} />
      </AppStack>
    </AppContainer>
  );
}
