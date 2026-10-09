import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { UserRoundPlus, UsersRound } from "lucide-react";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { useProspectHistoryDetail } from "@/features/prospectos/api/prospect-history.queries";
import { useConvertProspectToCustomer } from "@/features/prospectos/api/prospect-history.mutations";
import { ProspectHistoryDetailContent } from "@/features/prospectos/components/prospect-history-detail-content";
import { prospectDisplayName } from "@/features/prospectos/common/prospect-history.formatters";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

type RouteState = { from?: string } | null;
const DEFAULT_HISTORY = "/marcas-gt/historial-prospectos";

export default function ProspectoHistorialDetalle() {
  const { id: rawId } = useParams<{ id: string }>();
  const id = rawId && /^[1-9]\d*$/.test(rawId) && Number.isSafeInteger(Number(rawId))
    ? Number(rawId) : null;
  const location = useLocation();
  const from = (location.state as RouteState)?.from;
  const backTo = from && /^\/marcas-gt\/historial-prospectos(?:\?|$)/.test(from)
    ? from : DEFAULT_HISTORY;

  const detail = useProspectHistoryDetail(id);
  const converter = useConvertProspectToCustomer();
  const [confirmConversion, setConfirmConversion] = useState(false);
  const prospect = detail.data;
  const canConvert = Boolean(
    prospect?.estado === "FINALIZADO" && prospect.clienteId === null &&
    (prospect.nombreCompleto?.trim() || prospect.empresaTienda?.trim()) &&
    prospect.telefono?.trim(),
  );
  const needsData = prospect?.estado === "FINALIZADO" &&
    !prospect.clienteId && !canConvert;

  const convert = async () => {
    if (!id || !canConvert) return;
    await converter.mutateAsync({ id });
    setConfirmConversion(false);
    await detail.refetch();
  };

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title={prospect ? prospectDisplayName(prospect) : "Ficha del prospecto"}
          description={prospect ? `Prospecto #${prospect.id} · Detalle de contacto y seguimiento`
            : "Consulta individual del prospecto"}
          backTo={backTo}
          backLabel="Volver al historial"
          actions={prospect ? (
            <>
              {prospect.clienteId ? (
                <AppButton asChild variant="secondary" size="sm">
                  <Link to="/marcas-gt/clientes">
                    <UsersRound className="h-4 w-4" /> Ver clientes
                  </Link>
                </AppButton>
              ) : null}
              {canConvert ? (
                <AppButton
                  size="sm" variant="primary" disabled={converter.isPending}
                  leftIcon={<UserRoundPlus />} onClick={() => setConfirmConversion(true)}
                >
                  Generar cliente
                </AppButton>
              ) : null}
            </>
          ) : null}
        />
        {id === null ? (
          <p className="rounded-lg border border-[hsl(var(--app-border))] p-4 text-sm" role="alert">
            El identificador del prospecto no es válido.
          </p>
        ) : detail.isLoading ? (
          <p className="rounded-lg border border-[hsl(var(--app-border))] p-4 text-sm" role="status">
            Cargando ficha del prospecto...
          </p>
        ) : detail.isError ? (
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[hsl(var(--app-border))] p-4" role="alert">
            <p className="text-sm">No se pudo cargar esta ficha. Puede que el prospecto no exista o no tengas acceso.</p>
            <AppButton type="button" size="sm" variant="secondary" onClick={() => void detail.refetch()}>
              Reintentar
            </AppButton>
          </div>
        ) : prospect ? (
          <>
            <ProspectHistoryDetailContent prospect={prospect} />
            {needsData ? (
              <p className="rounded-md border border-[hsl(var(--app-border))] p-3 text-sm">
                Para convertir este prospecto en cliente debe tener un nombre o empresa y teléfono registrados.
              </p>
            ) : null}
          </>
        ) : (
          <p role="status" className="text-sm">No hay información disponible para este prospecto.</p>
        )}
        <AppConfirmDialog
          open={confirmConversion}
          onOpenChange={(open) => {
            if (!open && !converter.isPending) setConfirmConversion(false);
          }}
          preset="confirm"
          title="Generar cliente desde el prospecto"
          description="Se creará un cliente con los datos del prospecto finalizado y ambos registros quedarán vinculados. Esta operación no se puede repetir."
          confirmText="Generar cliente"
          loadingText="Generando cliente..."
          isLoading={converter.isPending}
          confirmDisabled={!canConvert}
          onConfirm={convert}
          onConfirmError={() => { /* El hook muestra el error; se puede volver a intentar. */ }}
        />
      </AppStack>
    </AppContainer>
  );
}
