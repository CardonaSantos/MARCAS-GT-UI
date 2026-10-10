import { Link, useLocation, useParams } from "react-router-dom";
import { CalendarPlus, UsersRound } from "lucide-react";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { useVisitHistoryDetail } from "@/features/visitas/api/visit-history.queries";
import { VisitHistoryDetailContent } from "@/features/visitas/components/visit-history-detail-content";
import { customerName } from "@/features/visitas/common/visit-history.formatters";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

const HISTORY = "/marcas-gt/historial-visitas";
type NavigationState = { from?: string } | null;

export default function VisitaHistorialDetalle() {
  const { id: rawId } = useParams<{ id: string }>();
  const id = rawId && /^[1-9]\d*$/.test(rawId) && Number.isSafeInteger(Number(rawId))
    ? Number(rawId) : null;
  const location = useLocation();
  const from = (location.state as NavigationState)?.from;
  const backTo = from && /^\/marcas-gt\/historial-visitas(?:\?|$)/.test(from)
    ? from : HISTORY;
  const detail = useVisitHistoryDetail(id);
  const visit = detail.data;

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title={visit ? `Visita #${visit.id} · ${customerName(visit.cliente)}` : "Ficha de visita"}
          description="Registro comercial, duración, cliente, vendedor, ventas y pedidos relacionados."
          backTo={backTo} backLabel="Volver al historial"
          actions={visit ? (
            <>
              <AppButton asChild variant="secondary" size="sm">
                <Link to="/marcas-gt/clientes">
                  <UsersRound className="h-4 w-4" /> Directorio de clientes
                </Link>
              </AppButton>
              <AppButton asChild variant="secondary" size="sm">
                <Link to="/marcas-gt/visita">
                  <CalendarPlus className="h-4 w-4" /> Registro de visita
                </Link>
              </AppButton>
            </>
          ) : undefined}
        />
        {id === null ? (
          <p role="alert" className="rounded-md border border-red-500/30 p-4 text-sm">
            El identificador de la visita no es válido.
          </p>
        ) : detail.isLoading ? (
          <p role="status" className="rounded-md border border-[hsl(var(--app-border))] p-4 text-sm">
            Consultando visita...
          </p>
        ) : detail.isError ? (
          <div role="alert" className="flex flex-wrap items-center gap-3 rounded-md border border-red-500/30 p-4">
            <p className="text-sm">No se pudo cargar la visita. Puede que no exista o no tengas acceso.</p>
            <AppButton size="sm" variant="secondary" onClick={() => void detail.refetch()}>
              Reintentar
            </AppButton>
          </div>
        ) : visit ? (
          <VisitHistoryDetailContent visit={visit} />
        ) : (
          <p role="status" className="text-sm">No hay información disponible.</p>
        )}
      </AppStack>
    </AppContainer>
  );
}
