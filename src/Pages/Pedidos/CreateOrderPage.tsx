import { zodResolver } from "@hookform/resolvers/zod";
import { Save, ShieldCheck } from "lucide-react";
import { formatMoney } from "@/features/common/formatters/value.formatters";
import { financedCreditAmount, normalizeCreditAdvance, validCreditAdvance } from "@/features/creditos/common/credit-advance.utils";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { useProductSelectables } from "@/features/common/catalogs/catalog.queries";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useCreateOrder } from "@/features/pedidos/api/order.mutations";
import { useRequestCreditFromOrder } from "@/features/creditos/api/credit.mutations";
import { CreditPolicySelect } from "@/features/creditos/components/credit-selects";
import { toCreateOrderPayload } from "@/features/pedidos/common/order.mappers";
import { orderDraftTotals, validateOrderDraftDiscounts } from "@/features/pedidos/common/order-form.utils";
import { OrderFormFields } from "@/features/pedidos/components/order-form-fields";
import {
  orderFormSchema,
  type OrderFormValues,
} from "@/features/pedidos/schemas/order.schemas";
import { AppForm, AppFormSubmit } from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";
import { AppInput } from "@/ui/components/app/primitives/app-input";

export default function CreateOrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = useStore((state) => state.userId);
  const backTo = getReturnRoute(location.state, "/marcas-gt/pedidos");

  const productsQuery = useProductSelectables();
  const mutation = useCreateOrder();
  const creditRequest = useRequestCreditFromOrder();
  const [term, setTerm] = useState("30");
  const [advance, setAdvance] = useState("");
  const [policyId, setPolicyId] = useState<number | null>(null);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      clienteId: null,
      vendedorId: userId,
      visitaId: null,
      condicionPago: "PREPAGO",
      observaciones: "",
      detalles: [
        {
          productoId: null,
          cantidadSolicitada: "1",
          descuento: "",
          observaciones: "",
        },
      ],
    },
    mode: "onTouched",
  });

  const condition = form.watch("condicionPago");
  const details = form.watch("detalles");
  const isCredit = condition === "CREDITO" || condition === "MIXTO";
  const estimatedTotal = orderDraftTotals(details, productsQuery.data ?? []).total;
  const validAdvance = condition !== "MIXTO" || validCreditAdvance("MIXTO", advance, estimatedTotal.toFixed(2));
  const estimatedFinanced = financedCreditAmount(estimatedTotal.toFixed(2), advance);
  const termNumber = Number(term);
  const validTerm = Number.isInteger(termNumber) && termNumber >= 1 && termNumber <= 3650;

  const onSubmit = async (values: OrderFormValues) => {
    const discountErrors = validateOrderDraftDiscounts(
      values.detalles,
      productsQuery.data ?? [],
    );

    if (discountErrors.length) {
      discountErrors.forEach((error) => {
        form.setError(`detalles.${error.index}.descuento`, {
          type: "validate",
          message: error.message,
        });
      });
      return;
    }

    if (isCredit && !validTerm) {
      toast.error("Indica un plazo válido entre 1 y 3650 días.");
      return;
    }
    if (values.condicionPago === "MIXTO" && !validAdvance) {
      toast.error("El anticipo debe ser mayor que Q0.00 y menor que el total estimado del pedido.");
      return;
    }
    const created = await mutation.mutateAsync(toCreateOrderPayload(values));
    if (isCredit) {
      try {
        await creditRequest.mutateAsync({
          pedidoId: created.id,
          payload: { plazoDias: termNumber, politicaId: policyId,
            anticipoPropuesto: values.condicionPago === "MIXTO"
              ? normalizeCreditAdvance(advance) : "0.00", },
        });
      } catch {
        // El pedido ya existe. En su detalle puede recuperarse la solicitud
        // sin recrear el pedido ni duplicar líneas de inventario.
        toast.warning("Pedido guardado. Revisa y completa la solicitud de crédito desde su detalle.");
      }
    }
    navigate("/marcas-gt/pedidos/" + created.id, {
      replace: true,
      state: { from: backTo },
    });
  };

  return (
    <AppContainer size="xl" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Nuevo pedido"
          description=""
          backTo={backTo}
          backLabel="Volver a pedidos"
        />

        <AppForm form={form} onSubmit={onSubmit}>
          <AppStack gap="md">
            <OrderFormFields />

            {isCredit ? (
              <AppCard
                title={condition === "MIXTO" ? "Crédito con anticipo" : "Solicitud de crédito"}
                description="Al guardar el pedido se enviará la solicitud al administrador para su evaluación."
                size="sm"
              >
                <AppGrid cols={{ base: 1, md: 2 }} gap="md">
                  <div className="min-w-0">
                    <label htmlFor="credit-term" className="mb-2 block text-xs font-medium">
                      Plazo solicitado (días) *
                    </label>
                    <AppInput
                      id="credit-term"
                      type="number"
                      min={1}
                      max={3650}
                      inputMode="numeric"
                      value={term}
                      onChange={(event) => setTerm(event.target.value)}
                      aria-invalid={!validTerm}
                    />
                  </div>
                  {condition === "MIXTO" ? (
                    <div className="min-w-0">
                      <label htmlFor="order-credit-advance" className="mb-2 block text-xs font-medium">Anticipo propuesto (Q) *</label>
                      <AppInput id="order-credit-advance" type="number" min={0.01} step="0.01" inputMode="decimal"
                        value={advance} onChange={(event) => setAdvance(event.target.value)}
                        aria-invalid={!validAdvance} aria-describedby="order-credit-advance-help" required />
                      <p id="order-credit-advance-help" className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">Mayor que Q0.00 y menor que el total del pedido.</p>
                    </div>
                  ) : null}
                  <div className="min-w-0">
                    <label className="mb-2 block text-xs font-medium">Política de crédito (opcional)</label>
                    <CreditPolicySelect
                      activeOnly
                      value={policyId}
                      onChange={setPolicyId}
                      placeholder="Sin política específica"
                      isClearable
                    />
                  </div>
                </AppGrid>
                {condition === "MIXTO" ? (
                  <div className="mt-4 grid gap-3 rounded-lg border border-[hsl(var(--app-border))] p-3 sm:grid-cols-3" role="status" aria-live="polite">
                    <div><p className="text-xs text-[hsl(var(--app-muted-foreground))]">Total estimado</p><p className="font-semibold tabular-nums">{formatMoney(estimatedTotal)}</p></div>
                    <div><p className="text-xs text-[hsl(var(--app-muted-foreground))]">Anticipo</p><p className="font-semibold tabular-nums">{advance && Number.isFinite(Number(advance)) ? formatMoney(advance) : "—"}</p></div>
                    <div><p className="text-xs text-[hsl(var(--app-muted-foreground))]">Por financiar</p><p className="font-semibold tabular-nums">{validAdvance && estimatedFinanced ? formatMoney(estimatedFinanced) : "—"}</p></div>
                  </div>
                ) : null}
                <div className="mt-4">
                  <AppAlert
                    tone="info"
                    title="La aprobación es exclusiva de ADMIN"
                    description={condition === "MIXTO"
                      ? "El anticipo se registra y verifica en Pagos. Una vez aplicado, ADMIN o CONTABILIDAD podrá activar las cuotas financiadas sin esperar la entrega."
                      : "El pedido se solicita sin autorizar crédito ni generar cuotas. El ADMIN revisará las condiciones."}
                  />
                </div>
              </AppCard>
            ) : null}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <AppButton asChild variant="secondary">
                <Link to={backTo}>Cancelar</Link>
              </AppButton>

              <AppFormSubmit<OrderFormValues>
                leftIcon={isCredit ? <ShieldCheck /> : <Save />}
                loadingText={isCredit ? "Creando y solicitando..." : "Creando..."}
                disableWhenInvalid
                disabled={mutation.isPending || creditRequest.isPending || (isCredit && (!validTerm || !validAdvance))}
                className="w-full sm:w-auto"
              >
                {isCredit ? "Crear y solicitar crédito" : "Crear pedido"}
              </AppFormSubmit>
            </div>
          </AppStack>
        </AppForm>
      </AppStack>
    </AppContainer>
  );
}
