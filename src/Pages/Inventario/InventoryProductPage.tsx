import { useLocation, useParams } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { formatInteger } from "@/features/common/formatters/value.formatters";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useUrlTabState } from "@/features/common/navigation/use-url-tab-state";
import { useProductAvailability } from "@/features/inventario/api/inventory.queries";
import {
  INVENTORY_PRODUCT_TABS,
  type InventoryProductTab,
} from "@/features/inventario/common/inventory.constants";
import { ProductAvailabilityTable } from "@/features/inventario/components/product-availability-table";
import { ProductKardexPanel } from "@/features/inventario/components/product-kardex-panel";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppTabs } from "@/ui/components/app/primitives/app-tabs";

export default function InventoryProductPage() {
  const params = useParams();
  const location = useLocation();
  const productoId = Number(params.productoId);
  const role = useStore((state) => state.userRol);
  const canViewKardex =
    role === "ADMIN" || role === "BODEGA" || role === "CONTABILIDAD";

  const backTo = getReturnRoute(location.state, "/marcas-gt/inventario");
  const listFrom = getListReturnRoute(location.state, backTo);
  const query = useProductAvailability(productoId);

  const allowedTabs: InventoryProductTab[] = canViewKardex
    ? [...INVENTORY_PRODUCT_TABS]
    : ["disponibilidad"];

  const tabState = useUrlTabState<InventoryProductTab>({
    defaultValue: "disponibilidad",
    allowedValues: allowedTabs,
  });

  const availability = query.data;

  const tabs = availability
    ? [
        {
          value: "disponibilidad" as const,
          label: "Disponibilidad",
          content: (
            <AppStack gap="md">
              <AppGrid cols={{ base: 1, md: 3 }} gap="sm">
                <AppCard title="Stock real" size="sm">
                  <p className="text-2xl font-semibold tabular-nums">
                    {formatInteger(availability.totales.real)}
                  </p>
                </AppCard>
                <AppCard title="Reservado" size="sm">
                  <p className="text-2xl font-semibold tabular-nums">
                    {formatInteger(availability.totales.reservado)}
                  </p>
                </AppCard>
                <AppCard title="Disponible" size="sm">
                  <p className="text-2xl font-semibold tabular-nums">
                    {formatInteger(availability.totales.disponible)}
                  </p>
                </AppCard>
              </AppGrid>

              <ProductAvailabilityTable
                data={availability.bodegas}
                canViewStockDetail={canViewKardex}
              />
            </AppStack>
          ),
        },
        ...(canViewKardex
          ? [
              {
                value: "kardex" as const,
                label: "Kardex",
                content: <ProductKardexPanel productoId={productoId} />,
              },
            ]
          : []),
      ]
    : [];

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title={availability?.producto.nombre ?? "Inventario del producto"}
          description={
            availability
              ? "Código " + availability.producto.codigo
              : undefined
          }
          backTo={backTo}
          backState={backTo !== listFrom ? { from: listFrom } : undefined}
          backLabel="Volver"
        />

        <AppDataState
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !availability}
          emptyTitle="Producto no encontrado"
          emptyDescription="No fue posible obtener la disponibilidad del producto."
        >
          {availability ? (
            <AppTabs
              tabs={tabs}
              value={tabState.value}
              onValueChange={tabState.setValue}
              variant="minimal"
              size="sm"
            />
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
