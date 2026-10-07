import {
  CheckCircle2,
  Landmark,
  ShieldX,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { formatMoney } from "@/features/common/formatters/value.formatters";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useUrlTabState } from "@/features/common/navigation/use-url-tab-state";
import { createIdempotencyKey } from "@/features/common/utils/idempotency";
import {
  useRejectPayment,
  useVerifyPayment,
  useVoidPayment,
} from "@/features/pagos/api/payment.mutations";
import { usePayment } from "@/features/pagos/api/payment.queries";
import {
  PAYMENT_DETAIL_TABS,
  PAYMENT_STATE_LABELS,
  PAYMENT_STATE_TONES,
  type PaymentDetailTab,
} from "@/features/pagos/common/payment.constants";
import { PaymentActivity } from "@/features/pagos/components/payment-activity";
import { PaymentApplications } from "@/features/pagos/components/payment-applications";
import { PaymentDetailSummary } from "@/features/pagos/components/payment-detail-summary";
import { PaymentProofs } from "@/features/pagos/components/payment-proofs";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppTabs } from "@/ui/components/app/primitives/app-tabs";
import { AppTextarea } from "@/ui/components/app/primitives/app-textarea";

type ReasonAction = "reject" | "void" | null;

export default function PaymentDetailPage() {
  const params = useParams();
  const location = useLocation();
  const id = Number(params.id);
  const query = usePayment(id);
  const payment = query.data;
  const backTo = getReturnRoute(location.state, "/marcas-gt/pagos");
  const currentUrl = location.pathname + location.search;

  const verifyMutation = useVerifyPayment();
  const rejectMutation = useRejectPayment();
  const voidMutation = useVoidPayment();

  const [verifyOpen, setVerifyOpen] = useState(false);
  const [verifyKey, setVerifyKey] = useState("");
  const [reasonAction, setReasonAction] = useState<ReasonAction>(null);
  const [reason, setReason] = useState("");
  const [reasonKey, setReasonKey] = useState("");

  const tabState = useUrlTabState<PaymentDetailTab>({
    defaultValue: "resumen",
    allowedValues: PAYMENT_DETAIL_TABS,
  });

  const openVerify = () => {
    setVerifyKey(createIdempotencyKey("payment-verify"));
    setVerifyOpen(true);
  };

  const openReasonAction = (action: Exclude<ReasonAction, null>) => {
    setReasonAction(action);
    setReason("");
    setReasonKey(
      createIdempotencyKey(
        action === "reject" ? "payment-reject" : "payment-void",
      ),
    );
  };

  const confirmVerify = async () => {
    await verifyMutation.mutateAsync({
      id,
      payload: { claveIdempotencia: verifyKey },
    });
  };

  const confirmReasonAction = async () => {
    if (!reasonAction || reason.trim().length < 3) return;

    if (reasonAction === "reject") {
      await rejectMutation.mutateAsync({
        id,
        payload: {
          motivo: reason.trim(),
          claveIdempotencia: reasonKey,
        },
      });
    } else {
      await voidMutation.mutateAsync({
        id,
        payload: {
          motivo: reason.trim(),
          claveIdempotencia: reasonKey,
        },
      });
    }

    setReasonAction(null);
    setReason("");
  };

  const tabs = payment
    ? [
        {
          value: "resumen" as const,
          label: "Resumen",
          content: <PaymentDetailSummary payment={payment} />,
        },
        {
          value: "comprobantes" as const,
          label: "Comprobantes",
          badge:
            payment.comprobantes.length > 0 ? (
              <AppBadge tone="neutral" size="xs">
                {payment.comprobantes.length}
              </AppBadge>
            ) : undefined,
          content: <PaymentProofs payment={payment} />,
        },
        {
          value: "aplicaciones" as const,
          label: "Aplicaciones",
          badge:
            payment.aplicaciones.length > 0 ? (
              <AppBadge tone="neutral" size="xs">
                {payment.aplicaciones.length}
              </AppBadge>
            ) : undefined,
          content: <PaymentApplications paymentId={id} />,
        },
        {
          value: "actividad" as const,
          label: "Actividad",
          content: <PaymentActivity paymentId={id} />,
        },
      ]
    : [];

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title={
            payment ? (
              <span className="inline-flex flex-wrap items-center gap-2">
                Pago #{payment.id}
                <AppBadge tone={PAYMENT_STATE_TONES[payment.estado]} size="xs">
                  {PAYMENT_STATE_LABELS[payment.estado]}
                </AppBadge>
              </span>
            ) : (
              "Detalle de pago"
            )
          }
          description={
            payment
              ? [payment.cliente.nombre, payment.cliente.apellido]
                  .filter(Boolean)
                  .join(" ") +
                " · " +
                formatMoney(payment.monto)
              : undefined
          }
          backTo={backTo}
          backLabel="Volver a pagos"
          actions={
            payment ? (
              <>
                {payment.acciones.puedeVerificar ? (
                  <AppButton
                    type="button"
                    variant="primary"
                    size="sm"
                    leftIcon={<CheckCircle2 />}
                    onClick={openVerify}
                  >
                    Verificar
                  </AppButton>
                ) : null}
                {payment.acciones.puedeRechazar ? (
                  <AppButton
                    type="button"
                    variant="danger"
                    size="sm"
                    leftIcon={<ShieldX />}
                    onClick={() => openReasonAction("reject")}
                  >
                    Rechazar
                  </AppButton>
                ) : null}
                {payment.acciones.puedeAplicar ? (
                  <AppButton asChild variant="secondary" size="sm">
                    <Link
                      to={"/marcas-gt/pagos/" + id + "/aplicar"}
                      state={{ from: currentUrl, listFrom: backTo }}
                    >
                      <Landmark className="h-4 w-4" />
                      Aplicar a CxC
                    </Link>
                  </AppButton>
                ) : null}
                {payment.acciones.puedeAnular ? (
                  <AppButton
                    type="button"
                    variant="danger"
                    size="sm"
                    leftIcon={<XCircle />}
                    onClick={() => openReasonAction("void")}
                  >
                    Anular
                  </AppButton>
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
          isEmpty={!query.isLoading && !payment}
          emptyTitle="Pago no encontrado"
          emptyDescription="El pago no existe o no está disponible para tu usuario."
        >
          {payment ? (
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
          open={verifyOpen}
          onOpenChange={setVerifyOpen}
          preset="success"
          title="Verificar pago"
          description="Confirma que el dinero realmente fue recibido. Después de verificar, el pago podrá aplicarse a cuentas por cobrar."
          confirmText="Verificar pago"
          loadingText="Verificando..."
          onConfirm={confirmVerify}
          isLoading={verifyMutation.isPending}
          contentCard
        >
          {payment ? (
            <div className="space-y-2 text-sm">
              <p>
                <strong>Monto:</strong> {formatMoney(payment.monto)}
              </p>
              <p>
                <strong>Referencia:</strong> {payment.referencia ?? "—"}
              </p>
              <p>
                <strong>Comprobantes:</strong> {payment.comprobantes.length}
              </p>
            </div>
          ) : null}
        </AppConfirmDialog>

        <AppConfirmDialog
          open={reasonAction !== null}
          onOpenChange={(next) => {
            if (!next && !rejectMutation.isPending && !voidMutation.isPending) {
              setReasonAction(null);
              setReason("");
            }
          }}
          preset="warning"
          tone="danger"
          title={
            reasonAction === "reject" ? "Rechazar pago" : "Anular pago"
          }
          description={
            reasonAction === "reject"
              ? "El pago quedará RECHAZADO y ya no podrá verificarse."
              : "Se revertirán las aplicaciones activas y se recalcularán saldos, pedido y crédito. Revisa cuidadosamente antes de continuar."
          }
          confirmText={
            reasonAction === "reject" ? "Rechazar pago" : "Anular pago"
          }
          loadingText={
            reasonAction === "reject" ? "Rechazando..." : "Anulando..."
          }
          onConfirm={confirmReasonAction}
          isLoading={rejectMutation.isPending || voidMutation.isPending}
          confirmDisabled={reason.trim().length < 3}
          contentCard
        >
          <div className="space-y-2">
            <label className="block text-xs font-medium">Motivo *</label>
            <AppTextarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Describe el motivo..."
            />
          </div>
        </AppConfirmDialog>
      </AppStack>
    </AppContainer>
  );
}
