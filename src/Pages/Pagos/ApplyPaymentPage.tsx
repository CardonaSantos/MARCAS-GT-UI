import { zodResolver } from "@hookform/resolvers/zod";
import { Landmark } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { formatDateTime, formatMoney } from "@/features/common/formatters/value.formatters";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { createIdempotencyKey } from "@/features/common/utils/idempotency";
import { useApplyPayment } from "@/features/pagos/api/payment.mutations";
import {
  usePayment,
  usePaymentReceivableCandidates,
} from "@/features/pagos/api/payment.queries";
import type { ReceivableCandidate } from "@/features/pagos/api/payment.types";
import { toApplyPaymentPayload } from "@/features/pagos/common/payment.mappers";
import {
  applyPaymentSchema,
  type ApplyPaymentFormValues,
} from "@/features/pagos/schemas/payment.schemas";
import {
  AppForm,
  AppFormInput,
  AppFormSubmit,
} from "@/ui/components/app/form";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function ApplyPaymentPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const detailUrl = "/marcas-gt/pagos/" + id;
  const backTo = getReturnRoute(location.state, detailUrl);
  const listFrom = getListReturnRoute(location.state, "/marcas-gt/pagos");
  const paymentQuery = usePayment(id);
  const candidatesQuery = usePaymentReceivableCandidates(id);
  const mutation = useApplyPayment();

  const [selected, setSelected] = useState<ReceivableCandidate | null>(null);
  const [pending, setPending] = useState<ApplyPaymentFormValues | null>(null);
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState("");

  const form = useForm<ApplyPaymentFormValues>({
    resolver: zodResolver(applyPaymentSchema),
    defaultValues: {
      cuentaPorCobrarId: 0,
      monto: "",
    },
    mode: "onTouched",
  });

  const choose = (candidate: ReceivableCandidate) => {
    setSelected(candidate);
    form.setValue("cuentaPorCobrarId", candidate.id, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue("monto", candidate.montoMaximoAplicable, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const requestConfirmation = (values: ApplyPaymentFormValues) => {
    if (!selected) {
      toast.error("Selecciona una Cuenta por Cobrar.");
      return;
    }
    if (Number(values.monto) > Number(selected.montoMaximoAplicable)) {
      toast.error(
        "El monto supera el máximo aplicable de " +
          formatMoney(selected.montoMaximoAplicable) +
          ".",
      );
      return;
    }

    setPending(values);
    setKey(createIdempotencyKey("payment-apply"));
    setOpen(true);
  };

  const confirm = async () => {
    if (!pending) return;
    await mutation.mutateAsync({
      id,
      payload: toApplyPaymentPayload(pending, key),
    });
    navigate(detailUrl, {
      replace: true,
      state: { from: listFrom },
    });
  };

  const payment = paymentQuery.data;
  const candidates = candidatesQuery.data?.data ?? [];

  return (
    <AppContainer size="xl" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Aplicar pago"
          description={
            payment
              ? "Pago #" +
                payment.id +
                " · Disponible " +
                formatMoney(payment.montoDisponible)
              : undefined
          }
          backTo={backTo}
          backLabel="Volver al pago"
        />

        <AppAlert
          tone="warning"
          title="La aplicación modifica cartera"
          description="Al confirmar se reducirá el saldo de la Cuenta por Cobrar. El servidor también recalculará estadoPago del pedido y ACTIVO/CERRADO del crédito asociado."
        />

        <AppDataState
          isLoading={paymentQuery.isLoading || candidatesQuery.isLoading}
          isFetching={paymentQuery.isFetching || candidatesQuery.isFetching}
          error={paymentQuery.error ?? candidatesQuery.error}
          onRetry={() => {
            void paymentQuery.refetch();
            void candidatesQuery.refetch();
          }}
          isEmpty={
            !paymentQuery.isLoading &&
            !candidatesQuery.isLoading &&
            (!payment || candidates.length === 0)
          }
          emptyTitle="Sin cuentas candidatas"
          emptyDescription="No hay CxC compatibles o el pago ya no tiene saldo disponible."
        >
          {payment ? (
            <AppForm form={form} onSubmit={requestConfirmation}>
              <AppStack gap="md">
                <div className="grid gap-3 lg:grid-cols-2">
                  {candidates.map((candidate) => {
                    const active = selected?.id === candidate.id;
                    return (
                      <AppCard
                        key={candidate.id}
                        title={
                          candidate.numeroDocumento ??
                          "Cuenta #" + candidate.id
                        }
                        description={
                          candidate.pedido
                            ? candidate.pedido.numero
                            : "Sin pedido"
                        }
                        size="sm"
                        className={
                          active
                            ? "ring-2 ring-[hsl(var(--app-primary))]"
                            : undefined
                        }
                      >
                        <div className="space-y-3 text-sm">
                          <div className="flex flex-wrap gap-2">
                            {candidate.factura ? (
                              <AppBadge tone="neutral" size="xs">
                                Factura #{candidate.factura.id}
                              </AppBadge>
                            ) : null}
                            {candidate.credito ? (
                              <AppBadge tone="primary" size="xs">
                                {candidate.credito.numero} · {candidate.credito.estado}
                              </AppBadge>
                            ) : null}
                          </div>
                          <div className="grid gap-2 sm:grid-cols-2">
                            <p>
                              <strong>Saldo:</strong>{" "}
                              {formatMoney(candidate.saldoPendiente)}
                            </p>
                            <p>
                              <strong>Máximo aplicable:</strong>{" "}
                              {formatMoney(candidate.montoMaximoAplicable)}
                            </p>
                            <p>
                              <strong>Vencimiento:</strong>{" "}
                              {formatDateTime(candidate.fechaVencimiento)}
                            </p>
                            <p>
                              <strong>Estado:</strong> {candidate.estado}
                            </p>
                          </div>
                          <AppButton
                            type="button"
                            variant={active ? "primary" : "secondary"}
                            size="sm"
                            onClick={() => choose(candidate)}
                          >
                            {active ? "Seleccionada" : "Seleccionar CxC"}
                          </AppButton>
                        </div>
                      </AppCard>
                    );
                  })}
                </div>

                {selected ? (
                  <AppCard title="Monto a aplicar" size="sm">
                    <AppFormInput<ApplyPaymentFormValues>
                      name="monto"
                      label="Monto"
                      type="number"
                      min={0.01}
                      max={Number(selected.montoMaximoAplicable)}
                      step="0.01"
                      required
                    />
                  </AppCard>
                ) : null}

                <div className="flex justify-end gap-2">
                  <AppButton asChild variant="secondary">
                    <Link to={backTo}>Cancelar</Link>
                  </AppButton>
                  <AppFormSubmit<ApplyPaymentFormValues>
                    leftIcon={<Landmark />}
                    loadingText="Revisando..."
                    disableWhenInvalid
                    disabled={!selected || !payment.acciones.puedeAplicar}
                  >
                    Revisar aplicación
                  </AppFormSubmit>
                </div>
              </AppStack>
            </AppForm>
          ) : null}
        </AppDataState>

        <AppConfirmDialog
          open={open}
          onOpenChange={setOpen}
          preset="warning"
          title="Confirmar aplicación del pago"
          description="Revisa la Cuenta por Cobrar y el monto. Esta operación cambia saldos financieros y puede cerrar un crédito."
          confirmText="Aplicar pago"
          loadingText="Aplicando..."
          onConfirm={confirm}
          isLoading={mutation.isPending}
          contentCard
        >
          {pending && selected ? (
            <div className="space-y-2 text-sm">
              <p>
                <strong>Pago:</strong> #{id}
              </p>
              <p>
                <strong>CxC:</strong>{" "}
                {selected.numeroDocumento ?? "#" + selected.id}
              </p>
              <p>
                <strong>Monto:</strong> {formatMoney(pending.monto)}
              </p>
              <p>
                <strong>Saldo antes:</strong>{" "}
                {formatMoney(selected.saldoPendiente)}
              </p>
              <p>
                <strong>Crédito:</strong>{" "}
                {selected.credito?.numero ?? "Sin crédito"}
              </p>
            </div>
          ) : null}
        </AppConfirmDialog>
      </AppStack>
    </AppContainer>
  );
}
