import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ClipboardList, Flag, History, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { useStore } from "@/Context/ContextSucursal";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { ProspectCommercialFields } from "@/features/prospectos/components/prospect-commercial-fields";
import { ProspectIdentityFields } from "@/features/prospectos/components/prospect-identity-fields";
import { ProspectLocationFields } from "@/features/prospectos/components/prospect-location-fields";
import { useOpenProspect } from "@/features/prospectos/api/prospect.queries";
import {
  useCancelProspect, useFinishProspect, useStartProspect,
} from "@/features/prospectos/api/prospect.mutations";
import {
  toFinishPayload, toProspectForm, toStartPayload,
} from "@/features/prospectos/common/prospect.mappers";
import {
  emptyProspect, prospectFinishSchema, prospectStartSchema,
  type ProspectFormValues,
} from "@/features/prospectos/schemas/prospect.schemas";
import { AppForm, AppFormSubmit } from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppInput } from "@/ui/components/app/primitives/app-input";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

const progressFields: Array<keyof ProspectFormValues> = [
  "nombreCompleto", "apellido", "empresaTienda", "telefono", "correo", "direccion",
  "tipoCliente", "categoriasInteres", "volumenCompra", "presupuestoMensual",
  "preferenciaContacto", "comentarios",
];

type PendingAction = "start" | "finish" | "cancel" | null;

export default function ProspectoFormulario() {
  const userRole = useStore((state) => state.userRol);
  const open = useOpenProspect();
  const active = open.data ?? null;
  const start = useStartProspect();
  const finish = useFinishProspect();
  const cancel = useCancelProspect();

  const form = useForm<ProspectFormValues>({
    resolver: zodResolver(prospectStartSchema),
    defaultValues: emptyProspect,
    mode: "onTouched",
  });
  const { control, reset, setError, clearErrors } = form;
  const formValues = useWatch({ control });
  const hydratedId = useRef<number | null | undefined>(undefined);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    if (!open.isSuccess) return;
    const currentId = active?.id ?? null;
    if (hydratedId.current !== currentId) {
      reset(active ? toProspectForm(active) : emptyProspect);
      hydratedId.current = currentId;
    }
  }, [open.isSuccess, active?.id, reset]);

  const busy = start.isPending || finish.isPending || cancel.isPending;
  const filledCount = progressFields.filter((name) => {
    const value = formValues[name];
    return Array.isArray(value) ? value.length > 0 : Boolean(String(value ?? "").trim());
  }).length;
  const progress = Math.round((filledCount / progressFields.length) * 100);

  const onSubmit = (values: ProspectFormValues) => {
    if (!active) {
      setPendingAction("start");
      return;
    }
    clearErrors();
    const result = prospectFinishSchema.safeParse(values);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const name = issue.path[0] as keyof ProspectFormValues | undefined;
        if (name) setError(name, { type: "manual", message: issue.message });
      }
      toast.warning("Corrige los campos indicados antes de finalizar.");
      return;
    }
    setPendingAction("finish");
  };

  const submitConfirmed = async () => {
    const values = form.getValues();
    if (pendingAction === "start") {
      const result = prospectStartSchema.safeParse(values);
      if (!result.success) throw new Error("Formulario de inicio inválido.");
      await start.mutateAsync(toStartPayload(result.data));
      setPendingAction(null);
    } else if (pendingAction === "finish" && active) {
      const result = prospectFinishSchema.safeParse(values);
      if (!result.success) throw new Error("Formulario de finalización inválido.");
      await finish.mutateAsync({ id: active.id, payload: toFinishPayload(result.data) });
      setPendingAction(null);
    } else if (pendingAction === "cancel" && active) {
      if (!cancelReason.trim()) throw new Error("Debes indicar el motivo de cancelación.");
      await cancel.mutateAsync({ id: active.id, payload: { motivo: cancelReason.trim() } });
      setCancelReason("");
      setPendingAction(null);
    }
  };

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title={active ? "Prospecto en curso" : "Nuevo prospecto"}
          actions={userRole === "ADMIN" ? (
            <AppButton asChild size="sm" variant="secondary">
              <Link to="/marcas-gt/historial-prospectos">
                <History className="h-4 w-4" /> Historial
              </Link>
            </AppButton>
          ) : undefined}
        />
        {open.isLoading ? <p role="status" className="text-sm">Consultando prospecto abierto...</p> : null}
        {open.isError ? (
          <div role="alert" className="flex flex-wrap items-center gap-3 rounded-md border border-red-500/30 p-3 text-sm">
            No se pudo consultar el estado actual del prospecto. No se iniciará otro hasta verificarlo.
            <AppButton size="sm" variant="secondary" onClick={() => void open.refetch()}>Reintentar</AppButton>
          </div>
        ) : null}
        {open.isSuccess ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[hsl(var(--app-border))] bg-[hsl(var(--app-card))] p-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                {active ? <Flag className="h-4 w-4" /> : <ClipboardList className="h-4 w-4" />}
                {active ? `Registro #${active.id} · iniciado el ${new Date(active.inicio).toLocaleString("es-GT")}`
                  : "Registra un contacto para iniciar su seguimiento."}
              </div>
              {active ? <span className="text-xs text-[hsl(var(--app-primary))]">En prospecto</span> : null}
            </div>

            <AppForm form={form} onSubmit={onSubmit} id="prospect-workflow-form">
              <AppStack gap="md">
                {active ? (
                  <div className="space-y-2" aria-label="Progreso de la ficha comercial">
                    <div className="flex justify-between text-xs text-[hsl(var(--app-muted-foreground))]">
                      <span>Información completada</span>
                      <span className="tabular-nums">{progress}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[hsl(var(--app-muted))]"
                      role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}
                      aria-label="Progreso de información comercial">
                      <div className="h-full rounded-full bg-[hsl(var(--app-primary))]"
                        style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                ) : null}

                <div className="grid min-w-0 items-start gap-4 xl:grid-cols-2">
                  <AppStack gap="md">
                    <ProspectIdentityFields />
                    <ProspectLocationFields showGps={Boolean(active)} />
                  </AppStack>
                  {active ? <ProspectCommercialFields /> : (
                    <div className="rounded-lg border border-[hsl(var(--app-border))] p-4 text-sm text-[hsl(var(--app-muted-foreground))]">
                      Después de iniciar el prospecto podrás completar su perfil comercial,
                      registrar intereses y añadir la ubicación GPS de manera opcional.
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap justify-end gap-2">
                  {active ? (
                    <AppButton type="button" variant="danger" size="sm"
                      leftIcon={<XCircle />} disabled={busy} onClick={() => setPendingAction("cancel")}>
                      Cancelar prospecto
                    </AppButton>
                  ) : null}
                  <AppFormSubmit<ProspectFormValues> size="sm"
                    leftIcon={active ? <CheckCircle2 /> : <Flag />}
                    disabled={busy} loadingText="Procesando...">
                    {active ? "Finalizar prospecto" : "Iniciar prospecto"}
                  </AppFormSubmit>
                </div>
              </AppStack>
            </AppForm>
          </>
        ) : null}
        <AppConfirmDialog
          open={pendingAction !== null}
          onOpenChange={(value) => { if (!value && !busy) setPendingAction(null); }}
          preset={pendingAction === "cancel" ? "warning" : "confirm"}
          title={pendingAction === "start" ? "Iniciar prospecto" :
            pendingAction === "finish" ? "Finalizar prospecto" : "Cancelar prospecto"}
          description={pendingAction === "start"
            ? "Se iniciará el seguimiento y quedará registrado a tu nombre."
            : pendingAction === "finish"
              ? "Se guardarán los datos comerciales y se cerrará el registro. Esta acción no se puede deshacer."
              : "El prospecto quedará cerrado como cancelado. Indica el motivo para conservarlo en el historial."}
          confirmText={pendingAction === "start" ? "Iniciar" :
            pendingAction === "finish" ? "Finalizar" : "Confirmar cancelación"}
          isLoading={busy}
          loadingText="Procesando..."
          confirmDisabled={pendingAction === "cancel" && !cancelReason.trim()}
          onConfirm={submitConfirmed}
          onConfirmError={() => { /* Los hooks muestran el error; el diálogo permanece abierto. */ }}
        >
          {pendingAction === "cancel" ? (
            <div className="mt-3 space-y-1">
              <label htmlFor="prospect-cancel-reason" className="block text-sm font-medium">
                Motivo de cancelación
              </label>
              <AppInput id="prospect-cancel-reason" value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Describe brevemente el motivo" maxLength={2000}
                autoComplete="off" />
            </div>
          ) : null}
        </AppConfirmDialog>
      </AppStack>
    </AppContainer>
  );
}
