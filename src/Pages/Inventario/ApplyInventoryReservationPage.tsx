import { useLocation, useNavigate, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useApplyInventoryReservation } from "@/features/inventario/api/inventory.mutations";
import { useInventoryReservation } from "@/features/inventario/api/inventory.queries";
import { InventoryReservationMutationForm } from "@/features/inventario/components/inventory-reservation-mutation-form";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function ApplyInventoryReservationPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const detailUrl = "/marcas-gt/inventario/reservas/" + id;
  const backTo = getReturnRoute(location.state, detailUrl);
  const listFrom = getListReturnRoute(
    location.state,
    "/marcas-gt/inventario/reservas",
  );

  const query = useInventoryReservation(id);
  const mutation = useApplyInventoryReservation();
  const reservation = query.data;

  return (
    <AppContainer size="lg" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Aplicar reserva"
          description="Convierte unidades reservadas en una salida real de inventario."
          backTo={backTo}
          backState={{ from: listFrom }}
          backLabel="Volver a la reserva"
        />

        <AppDataState
          isLoading={query.isLoading}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !reservation}
          emptyTitle="Reserva no encontrada"
        >
          {reservation ? (
            <InventoryReservationMutationForm
              reservation={reservation}
              mode="apply"
              onSubmit={async (payload) => {
                await mutation.mutateAsync({ id, payload });
                navigate(detailUrl, {
                  replace: true,
                  state: { from: listFrom },
                });
              }}
            />
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
