import { useState } from "react";
import { ClipboardCheck, Percent } from "lucide-react";
import { toast } from "sonner";
import { API } from "@/API/api";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { marcasQueryKeys } from "@/API/queryKeys";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { DashboardBlock, mutedText } from "./dashboard-widgets";

type DiscountRequest = {
  id: number; porcentaje: number; justificacion: string | null;
  vendedor: { id: number; nombre: string };
  cliente: { id: number; nombre: string };
};
type Decision = { action: "aprobar" | "rechazar"; request: DiscountRequest };

export function DashboardDiscountApprovals() {
  const [decision, setDecision] = useState<Decision | null>(null);
  const key = marcasQueryKeys.dashboard.custom("legacy-discounts");
  const query = API.useQuery<DiscountRequest[]>({
    queryKey: key,
    endpoint: marcasEndpoints.dashboard.legacyDiscounts.list,
    options: { refetchInterval: 60_000, retry: 1, refetchOnWindowFocus: false },
  });
  const approve = API.useMutation<unknown, { porcentaje: number; clienteId: number; vendedorId: number; requestId: number }>({
    method: "POST",
    endpoint: marcasEndpoints.dashboard.legacyDiscounts.approve,
    body: params => params,
    invalidateKeys: [key],
    options: { onSuccess: () => { toast.success("Solicitud aprobada."); } },
  });
  const reject = API.useMutation<unknown, { vendedorId: number; requestId: number }>({
    method: "POST",
    endpoint: marcasEndpoints.dashboard.legacyDiscounts.reject,
    body: params => params,
    invalidateKeys: [key],
    options: { onSuccess: () => { toast.success("Solicitud rechazada."); } },
  });
  const saving = approve.isPending || reject.isPending;
  const confirm = async () => {
    if (!decision) return;
    const r = decision.request;
    if (decision.action === "aprobar") {
      await approve.mutateAsync({
        porcentaje: r.porcentaje, clienteId: r.cliente.id,
        vendedorId: r.vendedor.id, requestId: r.id,
      });
    } else {
      await reject.mutateAsync({ vendedorId: r.vendedor.id, requestId: r.id });
    }
    setDecision(null);
  };
  return <section aria-label="Solicitudes de descuento heredadas">
    <DashboardBlock title="Solicitudes de descuento" icon={Percent}
      description="Autorizaciones comerciales pendientes del flujo anterior"
      section={query.data ? { status: "OK", data: query.data } : undefined}
      loading={query.isLoading} error={query.isError}
      retry={() => { void query.refetch(); }} isEmpty={items => items.length === 0}>
      {items => <div className="space-y-2">
        {items.slice(0, 8).map(request => <div key={request.id}
          className="flex min-w-0 flex-col gap-3 rounded-lg border border-[hsl(var(--app-border))] p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {request.cliente?.nombre ?? "Cliente #" + request.id}
              <span className="ml-2 inline-flex rounded-md bg-[hsl(var(--app-muted-bg))] px-2 py-0.5 text-xs font-medium">
                {request.porcentaje}%
              </span>
            </p>
            <p className={"mt-1 text-xs " + mutedText}>Vendedor: {request.vendedor?.nombre ?? "No asignado"}</p>
            <p className={"mt-1 line-clamp-2 text-xs " + mutedText}>{request.justificacion || "Sin justificación"}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <AppButton size="xs" variant="outline" onClick={() => setDecision({ action: "rechazar", request })}>
              Rechazar
            </AppButton>
            <AppButton size="xs" onClick={() => setDecision({ action: "aprobar", request })}
              leftIcon={<ClipboardCheck className="h-3.5 w-3.5" />}>Aprobar</AppButton>
          </div>
        </div>)}
        {items.length > 8 && <p className={"text-xs " + mutedText}>Se muestran 8 de {items.length} solicitudes; se actualizará la lista después de cada decisión.</p>}
      </div>}
    </DashboardBlock>
    <AppConfirmDialog
      open={!!decision}
      onOpenChange={open => { if (!open && !saving) setDecision(null); }}
      preset={decision?.action === "rechazar" ? "warning" : "confirm"}
      title={decision?.action === "rechazar" ? "Rechazar descuento" : "Aprobar descuento"}
      description={decision
        ? "Solicitud #" + decision.request.id + " · " + decision.request.porcentaje +
          "% para " + decision.request.cliente?.nombre + ". ¿Confirmas esta decisión?"
        : "Confirma la decisión."}
      confirmText={decision?.action === "rechazar" ? "Rechazar" : "Aprobar"}
      confirmButtonVariant={decision?.action === "rechazar" ? "danger" : "primary"}
      isLoading={saving}
      onConfirm={confirm}
      onConfirmError={() => toast.error("No se pudo procesar la solicitud. Inténtalo nuevamente.")}
    />
  </section>;
}
