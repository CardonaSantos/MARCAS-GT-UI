import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, Save } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { toast } from "sonner";

import { useStore } from "@/Context/ContextSucursal";
import { useCustomerSelectables } from "@/features/common/catalogs/catalog.queries";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { formatMoney } from "@/features/common/formatters/value.formatters";
import { createIdempotencyKey } from "@/features/common/utils/idempotency";
import { moneyCents } from "@/features/creditos/common/credit-advance.utils";
import { useOrders } from "@/features/pedidos/api/order.queries";
import { useRegisterPayment } from "@/features/pagos/api/payment.mutations";
import { usePaymentBanks } from "@/features/pagos/api/payment.queries";
import {
  BANK_REQUIRED_METHODS,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
} from "@/features/pagos/common/payment.constants";
import { toRegisterPaymentPayload } from "@/features/pagos/common/payment.mappers";
import {
  registerPaymentSchema,
  type RegisterPaymentFormValues,
} from "@/features/pagos/schemas/payment.schemas";
import {
  AppForm,
  AppFormInput,
  AppFormSingleSelect,
  AppFormSubmit,
  AppFormTextarea,
} from "@/ui/components/app/form";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function CreatePaymentPage() {
  const role = useStore((state) => state.userRol);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCustomerId = Number(searchParams.get("clienteId")) || 0;
  const preselectedOrderId = Number(searchParams.get("pedidoId")) || null;
  const requestedAmount = searchParams.get("monto") ?? "";
  const preselectedAmount = (moneyCents(requestedAmount) ?? 0) > 0 ? requestedAmount : "";
  const isAdvancePayment = searchParams.get("concepto") === "anticipo" && preselectedOrderId !== null;
  const backTo = getReturnRoute(location.state, "/marcas-gt/pagos");
  const customers = useCustomerSelectables();
  const banks = usePaymentBanks();
  const mutation = useRegisterPayment();
  const [pending, setPending] = useState<RegisterPaymentFormValues | null>(
    null,
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [key, setKey] = useState("");

  const form = useForm<RegisterPaymentFormValues>({
    resolver: zodResolver(registerPaymentSchema),
    defaultValues: {
      clienteId: preselectedCustomerId,
      pedidoId: preselectedOrderId,
      bancoId: null,
      metodo: "EFECTIVO",
      moneda: "GTQ",
      monto: preselectedAmount,
      referencia: "",
      fechaPago: "",
      observaciones: "",
    },
    mode: "onTouched",
  });

  const clienteId = useWatch({ control: form.control, name: "clienteId" });
  const metodo = useWatch({ control: form.control, name: "metodo" });
  const pedidoId = useWatch({ control: form.control, name: "pedidoId" });
  const bancoId = useWatch({ control: form.control, name: "bancoId" });

  const orders = useOrders({
    page: 1,
    limit: 100,
    clienteId: clienteId > 0 ? clienteId : undefined,
    sortBy: "creadoEn",
    sortDir: "desc",
  });

  const orderOptions = useMemo(
    () =>
      (orders.data?.data ?? [])
        .filter((order) => order.estado !== "CANCELADO")
        .map((order) => ({
          value: order.id,
          label:
            order.numero +
            " · " +
            order.condicionPago +
            " · " +
            formatMoney(order.total),
        })),
    [orders.data?.data],
  );

  const previousCustomerId = useRef(clienteId);
  useEffect(() => {
    if (
      previousCustomerId.current !== clienteId &&
      previousCustomerId.current > 0
    ) {
      form.setValue("pedidoId", null, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    previousCustomerId.current = clienteId;
  }, [clienteId, form]);

  useEffect(() => {
    if (!BANK_REQUIRED_METHODS.includes(metodo)) {
      form.setValue("bancoId", null, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [metodo, form]);

  const selectedCustomer = (customers.data ?? []).find(
    (customer) => customer.id === clienteId,
  );
  const selectedOrder = (orders.data?.data ?? []).find(
    (order) => order.id === pedidoId,
  );
  const selectedBank = (banks.data ?? []).find((bank) => bank.id === bancoId);
  const needsBank = BANK_REQUIRED_METHODS.includes(metodo);

  const requestConfirmation = (values: RegisterPaymentFormValues) => {
    if (role === "VENDEDOR" && !values.pedidoId) {
      toast.error("VENDEDOR debe registrar el pago sobre uno de sus pedidos.");
      return;
    }
    setPending(values);
    setKey(createIdempotencyKey("payment-register"));
    setConfirmOpen(true);
  };

  const confirm = async () => {
    if (!pending) return;
    const payment = await mutation.mutateAsync(
      toRegisterPaymentPayload(pending, key),
    );
    navigate("/marcas-gt/pagos/" + payment.id, {
      replace: true,
      state: { from: backTo },
    });
  };

  return (
    <AppContainer size="lg" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Registrar pago"
          description={isAdvancePayment
            ? "Registra el anticipo del pedido mixto. No se considerará cobrado hasta que ADMIN o CONTABILIDAD verifiquen el pago."
            : "Registra el dinero recibido. El pago quedará PENDIENTE hasta que ADMIN o CONTABILIDAD lo verifique."}
          backTo={backTo}
          backLabel="Volver a pagos"
        />

        <AppAlert
          tone="info"
          title={isAdvancePayment ? "Anticipo del pedido" : "Registro de pago"}
          description={isAdvancePayment
            ? "Confirma cliente, pedido e importe. La verificación aplicará el pago al anticipo; las cuotas financiadas se activan después de entregar el pedido."
            : "El registro de un pago no equivale a su verificación."}
        />

        <AppForm form={form} onSubmit={requestConfirmation}>
          <AppStack gap="md">
            <AppCard title="Origen del pago" size="sm">
              <div className="grid gap-3 md:grid-cols-2">
                <AppFormSingleSelect<RegisterPaymentFormValues, number>
                  name="clienteId"
                  label="Cliente"
                  options={(customers.data ?? []).map((customer) => ({
                    value: customer.id,
                    label: customer.nombreCompleto,
                  }))}
                  isLoading={customers.isLoading}
                  required
                />
                <AppFormSingleSelect<RegisterPaymentFormValues, number>
                  name="pedidoId"
                  label={role === "VENDEDOR" ? "Pedido *" : "Pedido"}
                  options={orderOptions}
                  isLoading={orders.isLoading}
                  isDisabled={!clienteId}
                  placeholder={
                    clienteId ? "Seleccionar pedido" : "Selecciona cliente"
                  }
                />
              </div>
            </AppCard>

            <AppCard title="Datos del pago" icon={<Banknote />} size="sm">
              <div className="grid gap-3 md:grid-cols-2">
                <AppFormSingleSelect<RegisterPaymentFormValues, string>
                  name="metodo"
                  label="Método"
                  options={PAYMENT_METHODS.map((value) => ({
                    value,
                    label: PAYMENT_METHOD_LABELS[value],
                  }))}
                  required
                />
                <AppFormInput<RegisterPaymentFormValues>
                  name="monto"
                  label="Monto"
                  type="number"
                  min={0.01}
                  step="0.01"
                  required
                />
                <AppFormInput<RegisterPaymentFormValues>
                  name="moneda"
                  label="Moneda"
                  maxLength={8}
                  required
                />
                <AppFormInput<RegisterPaymentFormValues>
                  name="fechaPago"
                  label="Fecha y hora del pago"
                  type="datetime-local"
                />

                {needsBank ? (
                  <>
                    <AppFormSingleSelect<RegisterPaymentFormValues, number>
                      name="bancoId"
                      label="Banco"
                      options={(banks.data ?? []).map((bank) => ({
                        value: bank.id,
                        label: bank.codigo
                          ? bank.nombre + " · " + bank.codigo
                          : bank.nombre,
                      }))}
                      isLoading={banks.isLoading}
                      required
                    />
                    <AppFormInput<RegisterPaymentFormValues>
                      name="referencia"
                      label="Referencia"
                      maxLength={200}
                      required
                    />
                  </>
                ) : (
                  <AppFormInput<RegisterPaymentFormValues>
                    name="referencia"
                    label="Referencia"
                    maxLength={200}
                  />
                )}
              </div>
            </AppCard>

            <AppCard title="Observaciones" size="sm">
              <AppFormTextarea<RegisterPaymentFormValues>
                name="observaciones"
                label="Observaciones"
                rows={4}
                maxLength={1000}
              />
            </AppCard>

            <div className="flex justify-end gap-2">
              <AppButton asChild variant="secondary">
                <Link to={backTo}>Cancelar</Link>
              </AppButton>
              <AppFormSubmit<RegisterPaymentFormValues>
                leftIcon={<Save />}
                loadingText="Revisando..."
                disableWhenInvalid
              >
                Revisar y registrar
              </AppFormSubmit>
            </div>
          </AppStack>
        </AppForm>

        <AppConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          preset="send"
          title="Confirmar registro del pago"
          description={isAdvancePayment
            ? "Se registrará el anticipo del pedido. Se mantendrá pendiente hasta que se verifique."
            : "Revisa los datos antes de crear el pago. Después quedará pendiente de verificación."}
          confirmText="Registrar pago"
          loadingText="Registrando..."
          onConfirm={confirm}
          isLoading={mutation.isPending}
          contentCard
        >
          {pending ? (
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <p>
                <strong>Cliente:</strong>{" "}
                {selectedCustomer?.nombreCompleto ?? "#" + pending.clienteId}
              </p>
              <p>
                <strong>Pedido:</strong> {selectedOrder?.numero ?? "Sin pedido"}
              </p>
              <p>
                <strong>Método:</strong> {PAYMENT_METHOD_LABELS[pending.metodo]}
              </p>
              <p>
                <strong>Monto:</strong> {formatMoney(pending.monto)}
              </p>
              <p>
                <strong>Banco:</strong> {selectedBank?.nombre ?? "No aplica"}
              </p>
              <p>
                <strong>Referencia:</strong> {pending.referencia || "—"}
              </p>
            </div>
          ) : null}
        </AppConfirmDialog>
      </AppStack>
    </AppContainer>
  );
}
