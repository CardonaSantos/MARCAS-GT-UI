import { PackageCheck } from "lucide-react";
import { useMemo } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useIdempotencyKey } from "@/features/common/utils/idempotency";
import { useCreateDelivery } from "@/features/entregas/api/delivery.mutations";
import { useDeliveryCandidates } from "@/features/entregas/api/delivery.queries";
import type { DeliveryCandidate } from "@/features/entregas/api/delivery.types";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

function candidateName(candidate: DeliveryCandidate) {
  return [candidate.cliente.nombre, candidate.cliente.apellido]
    .filter(Boolean)
    .join(" ");
}

export default function CreateDeliveryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const preferredStopId = Number(params.get("envioDespachoId")) || null;
  const backTo = getReturnRoute(location.state, "/marcas-gt/entregas");
  const key = useIdempotencyKey("delivery-create");
  const query = useDeliveryCandidates({ page: 1, limit: 100 });
  const mutation = useCreateDelivery();

  const candidates = useMemo(() => {
    const data = query.data?.data ?? [];
    if (!preferredStopId) return data;
    return [...data].sort((a, b) =>
      a.envioDespachoId === preferredStopId
        ? -1
        : b.envioDespachoId === preferredStopId
          ? 1
          : 0,
    );
  }, [preferredStopId, query.data?.data]);

  const create = async (candidate: DeliveryCandidate) => {
    if (candidate.entregaActual) {
      navigate("/marcas-gt/entregas/" + candidate.entregaActual.id, {
        state: { from: backTo },
      });
      return;
    }

    const delivery = await mutation.mutateAsync({
      envioDespachoId: candidate.envioDespachoId,
      claveIdempotencia: key,
    });
    navigate("/marcas-gt/entregas/" + delivery.id, {
      replace: true,
      state: { from: backTo },
    });
  };

  return (
    <AppContainer size="xl" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Nueva entrega"
          description="Selecciona una parada EN_RUTA con mercancía cargada para iniciar su atención."
          backTo={backTo}
          backLabel="Volver a entregas"
        />

        <AppAlert
          tone="info"
          title="Origen de la entrega"
          description="Una entrega siempre nace de una parada de Transporte. El servidor restringe al repartidor a las paradas donde es responsable."
        />

        <AppDataState
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && candidates.length === 0}
          emptyTitle="Sin paradas candidatas"
          emptyDescription="No hay paradas EN_RUTA disponibles para crear o continuar una entrega."
        >
          <AppStack gap="sm">
            {candidates.map((candidate) => (
              <AppCard
                key={candidate.envioDespachoId}
                title={
                  candidate.envio.numero +
                  " · Parada " +
                  candidate.secuencia +
                  " · " +
                  candidate.despacho.numero
                }
                description={candidateName(candidate)}
                size="sm"
              >
                <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-center">
                  <div>
                    <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                      Destino
                    </p>
                    <p className="text-sm font-medium">
                      {candidate.destino.direccion}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                      Carga
                    </p>
                    <p className="text-sm font-medium">
                      {candidate.unidadesCargadas} unidades ·{" "}
                      {candidate.carga.length} líneas
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    {candidate.entregaActual ? (
                      <AppBadge tone="primary" size="xs">
                        {candidate.entregaActual.estado.replace(/_+/g, " ")}
                      </AppBadge>
                    ) : null}
                    <AppButton
                      type="button"
                      variant={candidate.entregaActual ? "secondary" : "primary"}
                      size="sm"
                      leftIcon={<PackageCheck />}
                      onClick={() => void create(candidate)}
                    >
                      {candidate.entregaActual ? "Ver entrega" : "Crear entrega"}
                    </AppButton>
                  </div>
                </div>
              </AppCard>
            ))}
          </AppStack>
        </AppDataState>

        <div className="flex justify-end">
          <AppButton asChild variant="secondary">
            <Link to={backTo}>Volver</Link>
          </AppButton>
        </div>
      </AppStack>
    </AppContainer>
  );
}
