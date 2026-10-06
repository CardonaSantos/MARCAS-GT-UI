import { PackageMinus, XCircle } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useInventoryReservation } from "@/features/inventario/api/inventory.queries";
import { InventoryReservationDetail } from "@/features/inventario/components/inventory-reservation-detail";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function InventoryReservationDetailPage() {
  const params = useParams();
  const location = useLocation();
  const id = Number(params.id);

  const backTo = getReturnRoute(
    location.state,
    "/marcas-gt/inventario/reservas",
  );
  const listFrom = getListReturnRoute(location.state, backTo);
  const query = useInventoryReservation(id);
  const reservation = query.data;
  const canMutate = Boolean(reservation && reservation.cantidadPendiente > 0);
  const currentUrl = location.pathname + location.search;
  const actionState = { from: currentUrl, listFrom };

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title={reservation ? "Reserva #" + reservation.id : "Reserva"}
          description={
            reservation
              ? reservation.producto.nombre + " · " + reservation.bodega.nombre
              : undefined
          }
          backTo={backTo}
          backState={backTo !== listFrom ? { from: listFrom } : undefined}
          backLabel="Volver a reservas"
          actions={
            canMutate ? (
              <>
                <AppButton asChild variant="secondary" size="sm">
                  <Link
                    to={"/marcas-gt/inventario/reservas/" + id + "/liberar"}
                    state={actionState}
                  >
                    <PackageMinus className="h-4 w-4" />
                    Liberar
                  </Link>
                </AppButton>

                <AppButton asChild variant="danger" size="sm">
                  <Link
                    to={"/marcas-gt/inventario/reservas/" + id + "/cancelar"}
                    state={actionState}
                  >
                    <XCircle className="h-4 w-4" />
                    Cancelar reserva
                  </Link>
                </AppButton>
              </>
            ) : undefined
          }
        />

        <AppDataState
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !reservation}
          emptyTitle="Reserva no encontrada"
          emptyDescription="El registro solicitado no existe."
        >
          {reservation ? (
            <InventoryReservationDetail reservation={reservation} />
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
