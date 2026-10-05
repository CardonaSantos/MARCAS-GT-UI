import {
  ArrowDownToLine,
  PackageSearch,
  PencilLine,
  RotateCcw,
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useUrlTabState } from "@/features/common/navigation/use-url-tab-state";
import { useInventoryStock } from "@/features/inventario/api/inventory.queries";
import {
  INVENTORY_STOCK_DETAIL_TABS,
  type InventoryStockDetailTab,
} from "@/features/inventario/common/inventory.constants";
import { InventoryMovementTable } from "@/features/inventario/components/inventory-movement-table";
import { InventoryReservationTable } from "@/features/inventario/components/inventory-reservation-table";
import { InventoryStockOverview } from "@/features/inventario/components/inventory-stock-overview";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppTabs } from "@/ui/components/app/primitives/app-tabs";

export default function InventoryStockDetailPage() {
  const params = useParams();
  const location = useLocation();
  const id = Number(params.id);
  const role = useStore((state) => state.userRol);
  const canManage = role === "ADMIN" || role === "BODEGA";

  const backTo = getReturnRoute(location.state, "/marcas-gt/inventario");
  const listFrom = getListReturnRoute(location.state, backTo);
  const query = useInventoryStock(id);

  const tabState = useUrlTabState<InventoryStockDetailTab>({
    defaultValue: "resumen",
    allowedValues: INVENTORY_STOCK_DETAIL_TABS,
  });

  const stock = query.data;
  const currentUrl = location.pathname + location.search;

  const tabs = stock
    ? [
        {
          value: "resumen" as const,
          label: "Resumen",
          content: <InventoryStockOverview stock={stock} />,
        },
        {
          value: "reservas" as const,
          label: "Reservas",
          content: (
            <InventoryReservationTable
              data={stock.reservasActivas}
              canManage={canManage}
            />
          ),
        },
        {
          value: "movimientos" as const,
          label: "Movimientos",
          content: (
            <InventoryMovementTable data={stock.ultimosMovimientos} />
          ),
        },
      ]
    : [];

  const operationState = {
    from: currentUrl,
    listFrom,
  };

  const baseQuery = stock
    ? "?bodegaId=" +
      stock.bodega.id +
      "&productoId=" +
      stock.producto.id
    : "";

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title={stock?.producto.nombre ?? "Detalle de stock"}
          description={
            stock
              ? `${stock.producto.codigo} · ${stock.bodega.nombre}`
              : undefined
          }
          backTo={backTo}
          backState={backTo !== listFrom ? { from: listFrom } : undefined}
          backLabel="Volver a inventario"
          actions={
            stock ? (
              <>
                <AppButton asChild variant="secondary" size="sm">
                  <Link
                    to={"/marcas-gt/inventario/productos/" + stock.producto.id}
                    state={{ from: currentUrl, listFrom }}
                  >
                    <PackageSearch className="h-4 w-4" />
                    Disponibilidad
                  </Link>
                </AppButton>

                {canManage ? (
                  <>
                    <AppButton asChild variant="secondary" size="sm">
                      <Link
                        to={
                          "/marcas-gt/inventario/ajustes/nuevo" + baseQuery
                        }
                        state={operationState}
                      >
                        <PencilLine className="h-4 w-4" />
                        Ajuste
                      </Link>
                    </AppButton>

                    <AppButton asChild variant="secondary" size="sm">
                      <Link
                        to={
                          "/marcas-gt/inventario/devoluciones/nueva" +
                          baseQuery
                        }
                        state={operationState}
                      >
                        <RotateCcw className="h-4 w-4" />
                        Devolución
                      </Link>
                    </AppButton>

                    <AppButton asChild variant="primary" size="sm">
                      <Link
                        to={
                          "/marcas-gt/inventario/entradas/nueva" + baseQuery
                        }
                        state={operationState}
                      >
                        <ArrowDownToLine className="h-4 w-4" />
                        Entrada
                      </Link>
                    </AppButton>
                  </>
                ) : null}
              </>
            ) : undefined
          }
        />

        <AppDataState
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !stock}
          emptyTitle="Stock no encontrado"
          emptyDescription="El registro solicitado no existe."
        >
          {stock ? (
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
