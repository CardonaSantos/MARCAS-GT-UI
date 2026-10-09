import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { History, MapPinned } from "lucide-react";
import { toast } from "sonner";

import { useStore } from "@/Context/ContextSucursal";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { useOpenVisit } from "@/features/visitas/api/visit-workflow.queries";
import {
  useStartVisit, useFinishVisit, useCancelVisit,
} from "@/features/visitas/api/visit-workflow.mutations";
import { VisitStartForm } from "@/features/visitas/components/visit-start-form";
import { VisitActiveCard } from "@/features/visitas/components/visit-active-card";
import {
  startVisitSchema, finishVisitSchema, cancelVisitSchema,
  type StartVisitValues,
} from "@/features/visitas/schemas/visit-workflow.schemas";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppInput } from "@/ui/components/app/primitives/app-input";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

type ClosingAction = "finish" | "cancel" | null;

export default function RegistroVisita() {
  const role = useStore((state) => state.userRol);
  const activeQuery = useOpenVisit();
  const active = activeQuery.data ?? null;
  const start = useStartVisit();
  const finish = useFinishVisit();
  const cancel = useCancelVisit();

  const [pendingStart, setPendingStart] = useState<StartVisitValues | null>(null);
  const [closingAction, setClosingAction] = useState<ClosingAction>(null);
  const [notes, setNotes] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const hydratedVisit = useRef<number | null | undefined>(undefined);

  useEffect(() => {
    if (!activeQuery.isSuccess) return;
    const id = active?.id ?? null;
    if (hydratedVisit.current !== id) {
      setNotes(active?.observaciones ?? "");
      hydratedVisit.current = id;
    }
  }, [activeQuery.isSuccess, active?.id]);

  const busy = start.isPending || finish.isPending || cancel.isPending;
  const confirmationOpen = pendingStart !== null || closingAction !== null;

  const onConfirm = async () => {
    if (pendingStart) {
      const valid = startVisitSchema.safeParse(pendingStart);
      if (!valid.success) throw new Error("Datos de visita inválidos.");
      await start.mutateAsync(valid.data);
      setPendingStart(null);
    } else if (closingAction === "finish" && active) {
      const valid = finishVisitSchema.safeParse({ observaciones: notes });
      if (!valid.success) {
        toast.warning("Las observaciones no pueden superar los 3000 caracteres.");
        return;
      }
      await finish.mutateAsync({ id: active.id, payload: valid.data });
      setClosingAction(null);
    } else if (closingAction === "cancel" && active) {
      const valid = cancelVisitSchema.safeParse({ motivoCancelacion: cancelReason });
      if (!valid.success) {
        toast.warning(valid.error.issues[0]?.message ?? "Indica el motivo de cancelación.");
        return;
      }
      await cancel.mutateAsync({ id: active.id, payload: valid.data });
      setClosingAction(null);
      setCancelReason("");
    }
    await activeQuery.refetch();
  };

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title={active ? "Visita en curso" : "Registrar visita"}
          actions={role === "ADMIN" ? (
            <AppButton asChild variant="secondary" size="sm">
              <Link to="/marcas-gt/historial-visitas">
                <History className="h-4 w-4" /> Historial de visitas
              </Link>
            </AppButton>
          ) : undefined}
        />
        {activeQuery.isLoading ? (
          <p role="status" className="rounded-md border border-[hsl(var(--app-border))] p-4 text-sm">
            Consultando la visita abierta...
          </p>
        ) : null}
        {activeQuery.isError ? (
          <div role="alert" className="flex flex-wrap items-center gap-3 rounded-md border border-red-500/30 p-4 text-sm">
            No se pudo consultar tu visita actual. No se iniciará otra hasta confirmar su estado.
            <AppButton size="sm" variant="secondary" onClick={() => void activeQuery.refetch()}>
              Reintentar
            </AppButton>
          </div>
        ) : null}
        {activeQuery.isSuccess ? (
          active ? (
            <VisitActiveCard
              visit={active}
              notes={notes}
              onNotesChange={setNotes}
              busy={busy}
              onFinish={() => setClosingAction("finish")}
              onCancel={() => setClosingAction("cancel")}
            />
          ) : (
            <>
              <div className="flex items-center gap-2 rounded-md border border-[hsl(var(--app-border))] p-3 text-sm">
                <MapPinned className="h-4 w-4 shrink-0" />
                Selecciona un cliente y registra el motivo y tipo de visita.
              </div>
              <VisitStartForm busy={busy} onReady={setPendingStart} />
            </>
          )
        ) : null}
        <AppConfirmDialog
          open={confirmationOpen}
          onOpenChange={(value) => {
            if (!value && !busy) {
              setPendingStart(null);
              setClosingAction(null);
            }
          }}
          preset={closingAction === "cancel" ? "warning" : "confirm"}
          title={pendingStart ? "Iniciar visita" : closingAction === "finish"
            ? "Finalizar visita" : "Cancelar visita"}
          description={pendingStart
            ? "Se registrará el inicio de la visita a tu nombre. Solo puedes tener una visita activa."
            : closingAction === "finish"
              ? "Se guardarán las observaciones y la fecha de finalización. No podrás modificar esta visita después de cerrarla."
              : "La visita quedará cancelada y conservará el motivo para auditoría."}
          confirmText={pendingStart ? "Iniciar visita" :
            closingAction === "finish" ? "Finalizar visita" : "Confirmar cancelación"}
          loadingText="Procesando..."
          isLoading={busy}
          confirmDisabled={closingAction === "cancel" && !cancelReason.trim()}
          onConfirm={onConfirm}
          onConfirmError={() => { /* Los hooks presentan los errores y conservan la información. */ }}
        >
          {closingAction === "cancel" ? (
            <div className="mt-3 space-y-2">
              <label htmlFor="visit-cancel-reason" className="text-sm font-medium">
                Motivo de cancelación
              </label>
              <AppInput
                id="visit-cancel-reason" value={cancelReason} maxLength={2000}
                onChange={(event) => setCancelReason(event.target.value)}
                placeholder="Por qué se cancela la visita"
                autoComplete="off"
              />
            </div>
          ) : null}
        </AppConfirmDialog>
      </AppStack>
    </AppContainer>
  );
}
