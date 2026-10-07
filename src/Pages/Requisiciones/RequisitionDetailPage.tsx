import {
  CheckCircle2,
  PackageCheck,
  Pencil,
  Send,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useUrlTabState } from "@/features/common/navigation/use-url-tab-state";
import {
  useApproveRequisition,
  useCancelRequisition,
  useRejectRequisition,
  useRequestRequisition,
} from "@/features/requisiciones/api/requisition.mutations";
import {
  useRequisition,
  useRequisitionEvents,
  useRequisitionReceipts,
} from "@/features/requisiciones/api/requisition.queries";
import {
  REQUISITION_DETAIL_TABS,
  REQUISITION_STATE_LABELS,
  type RequisitionDetailTab,
  requisitionStateTone,
} from "@/features/requisiciones/common/requisition.constants";
import {
  RequisitionActivity,
  RequisitionOverview,
  RequisitionProducts,
  RequisitionReceiptsTable,
} from "@/features/requisiciones/components/requisition-detail-panels";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppTabs } from "@/ui/components/app/primitives/app-tabs";
import { AppTextarea } from "@/ui/components/app/primitives/app-textarea";

type ReasonAction = "reject" | "cancel" | null;

export default function RequisitionDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const location = useLocation();
  const role = useStore((state) => state.userRol);
  const backTo = getReturnRoute(location.state, "/marcas-gt/requisiciones");
  const currentUrl = location.pathname + location.search;

  const query = useRequisition(id);
  const receiptsQuery = useRequisitionReceipts(id, { page: 1, limit: 100 });
  const eventsQuery = useRequisitionEvents(id, { page: 1, limit: 100 });

  const requestMutation = useRequestRequisition();
  const approveMutation = useApproveRequisition();
  const rejectMutation = useRejectRequisition();
  const cancelMutation = useCancelRequisition();

  const [requestOpen, setRequestOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [reasonAction, setReasonAction] = useState<ReasonAction>(null);
  const [reason, setReason] = useState("");

  const tabState = useUrlTabState<RequisitionDetailTab>({
    defaultValue: "resumen",
    allowedValues: REQUISITION_DETAIL_TABS,
  });

  const requisition = query.data;
  const canOperate = role === "ADMIN" || role === "BODEGA";
  const isAdmin = role === "ADMIN";

  const confirmReason = async () => {
    if (reason.trim().length < 3 || !reasonAction) return;

    if (reasonAction === "reject") {
      await rejectMutation.mutateAsync({
        id,
        payload: { motivo: reason.trim() },
      });
    } else {
      await cancelMutation.mutateAsync({
        id,
        payload: { motivo: reason.trim() },
      });
    }

    setReason("");
    setReasonAction(null);
  };

  const tabs = requisition
    ? [
        {
          value: "resumen" as const,
          label: "Resumen",
          content: <RequisitionOverview requisition={requisition} />,
        },
        {
          value: "productos" as const,
          label: "Productos",
          badge: (
            <AppBadge tone="neutral" size="xs">
              {requisition.detalles.length}
            </AppBadge>
          ),
          content: <RequisitionProducts requisition={requisition} />,
        },
        {
          value: "recepciones" as const,
          label: "Recepciones",
          badge:
            (receiptsQuery.data?.meta.total ?? 0) > 0 ? (
              <AppBadge tone="neutral" size="xs">
                {receiptsQuery.data?.meta.total ?? 0}
              </AppBadge>
            ) : undefined,
          content: (
            <RequisitionReceiptsTable
              receipts={receiptsQuery.data?.data ?? []}
              isLoading={receiptsQuery.isLoading}
              isFetching={receiptsQuery.isFetching}
              error={receiptsQuery.error}
              onRetry={() => void receiptsQuery.refetch()}
            />
          ),
        },
        {
          value: "actividad" as const,
          label: "Actividad",
          content: (
            <RequisitionActivity
              events={eventsQuery.data?.data ?? []}
              isLoading={eventsQuery.isLoading}
              isFetching={eventsQuery.isFetching}
              error={eventsQuery.error}
              onRetry={() => void eventsQuery.refetch()}
            />
          ),
        },
      ]
    : [];

  const actionBusy =
    requestMutation.isPending ||
    approveMutation.isPending ||
    rejectMutation.isPending ||
    cancelMutation.isPending;

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title={
            requisition ? (
              <span className="inline-flex flex-wrap items-center gap-2">
                {"Requisición #" + requisition.id}
                <AppBadge
                  tone={requisitionStateTone(requisition.estado)}
                  size="xs"
                >
                  {REQUISITION_STATE_LABELS[requisition.estado]}
                </AppBadge>
              </span>
            ) : (
              "Detalle de requisición"
            )
          }
          description={
            requisition
              ? requisition.bodega.nombre +
                " · " +
                (requisition.proveedor?.nombre ?? "Proveedor pendiente")
              : undefined
          }
          backTo={backTo}
          backLabel="Volver a requisiciones"
          actions={
            requisition ? (
              <div className="flex flex-wrap gap-2">
                {canOperate && requisition.acciones.puedeEditar ? (
                  <AppButton asChild variant="secondary" size="sm">
                    <Link
                      to={"/marcas-gt/requisiciones/" + id + "/editar"}
                      state={{ from: currentUrl }}
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Link>
                  </AppButton>
                ) : null}

                {canOperate && requisition.acciones.puedeSolicitar ? (
                  <AppButton
                    variant="primary"
                    size="sm"
                    leftIcon={<Send />}
                    onClick={() => setRequestOpen(true)}
                  >
                    Solicitar aprobación
                  </AppButton>
                ) : null}

                {isAdmin && requisition.acciones.puedeAprobar ? (
                  <AppButton
                    variant="primary"
                    size="sm"
                    leftIcon={<CheckCircle2 />}
                    onClick={() => setApproveOpen(true)}
                  >
                    Aprobar
                  </AppButton>
                ) : null}

                {isAdmin && requisition.acciones.puedeRechazar ? (
                  <AppButton
                    variant="danger"
                    size="sm"
                    leftIcon={<XCircle />}
                    onClick={() => {
                      setReason("");
                      setReasonAction("reject");
                    }}
                  >
                    Rechazar
                  </AppButton>
                ) : null}

                {canOperate && requisition.acciones.puedeRecibir ? (
                  <AppButton asChild variant="primary" size="sm">
                    <Link
                      to={"/marcas-gt/requisiciones/" + id + "/recibir"}
                      state={{ from: currentUrl }}
                    >
                      <PackageCheck className="h-4 w-4" />
                      Registrar recepción
                    </Link>
                  </AppButton>
                ) : null}

                {isAdmin && requisition.acciones.puedeCancelar ? (
                  <AppButton
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setReason("");
                      setReasonAction("cancel");
                    }}
                  >
                    Cancelar requisición
                  </AppButton>
                ) : null}
              </div>
            ) : undefined
          }
        />

        <AppDataState
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !requisition}
          emptyTitle="Requisición no encontrada"
          emptyDescription="La requisición no existe o no está disponible."
        >
          {requisition ? (
            <AppTabs
              tabs={tabs}
              value={tabState.value}
              onValueChange={tabState.setValue}
              variant="minimal"
              size="sm"
            />
          ) : null}
        </AppDataState>

        <AppConfirmDialog
          open={requestOpen}
          onOpenChange={setRequestOpen}
          preset="send"
          title="Solicitar aprobación"
          description="Después de enviar la requisición ya no podrás editar sus productos como borrador."
          confirmText="Solicitar aprobación"
          loadingText="Solicitando..."
          isLoading={requestMutation.isPending}
          confirmDisabled={!requisition || requisition.detalles.length === 0}
          onConfirm={async () => {
            await requestMutation.mutateAsync({ id });
          }}
          contentCard
        >
          {requisition ? (
            <div className="space-y-2 text-sm">
              <p><strong>Bodega:</strong> {requisition.bodega.nombre}</p>
              <p><strong>Proveedor:</strong> {requisition.proveedor?.nombre ?? "Pendiente"}</p>
              <p><strong>Productos:</strong> {requisition.detalles.length}</p>
              <p><strong>Unidades:</strong> {requisition.progreso.unidadesSolicitadas}</p>
            </div>
          ) : null}
        </AppConfirmDialog>

        <AppConfirmDialog
          open={approveOpen}
          onOpenChange={setApproveOpen}
          preset="warning"
          title="Aprobar requisición"
          description="Aprobar autoriza el abastecimiento, pero NO aumenta inventario. El stock cambiará únicamente al registrar recepción física."
          confirmText="Aprobar requisición"
          loadingText="Aprobando..."
          isLoading={approveMutation.isPending}
          confirmDisabled={!requisition?.proveedor}
          onConfirm={async () => {
            await approveMutation.mutateAsync({ id });
          }}
          contentCard
        >
          {requisition ? (
            <div className="space-y-2 text-sm">
              <p><strong>Proveedor:</strong> {requisition.proveedor?.nombre ?? "Sin proveedor"}</p>
              <p><strong>Bodega:</strong> {requisition.bodega.nombre}</p>
              <p><strong>Unidades:</strong> {requisition.progreso.unidadesSolicitadas}</p>
              <p><strong>Costo estimado:</strong> Q {requisition.progreso.costoEstimado}</p>
            </div>
          ) : null}
        </AppConfirmDialog>

        <AppConfirmDialog
          open={reasonAction !== null}
          onOpenChange={(open) => {
            if (!open && !actionBusy) {
              setReasonAction(null);
              setReason("");
            }
          }}
          preset={reasonAction === "reject" ? "delete" : "warning"}
          title={
            reasonAction === "reject"
              ? "Rechazar requisición"
              : "Cancelar requisición"
          }
          description="Esta decisión quedará registrada en la auditoría. Escribe un motivo claro antes de continuar."
          confirmText={reasonAction === "reject" ? "Rechazar" : "Cancelar requisición"}
          loadingText="Procesando..."
          isLoading={rejectMutation.isPending || cancelMutation.isPending}
          confirmDisabled={reason.trim().length < 3}
          onConfirm={confirmReason}
          contentCard
        >
          <div>
            <label htmlFor="requisition-reason" className="mb-1 block text-xs font-medium">
              Motivo *
            </label>
            <AppTextarea
              id="requisition-reason"
              rows={4}
              maxLength={500}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Describe el motivo..."
            />
          </div>
        </AppConfirmDialog>
      </AppStack>
    </AppContainer>
  );
}
