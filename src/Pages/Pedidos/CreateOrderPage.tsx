import { zodResolver } from "@hookform/resolvers/zod";
import { Save, ShieldCheck } from "lucide-react";
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
import { validateOrderDraftDiscounts } from "@/features/pedidos/common/order-form.utils";
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

    if (values.condicionPago === "CREDITO" && !validTerm) {
      toast.error("Indica un plazo válido entre 1 y 3650 días.");
      return;
    }
    const created = await mutation.mutateAsync(toCreateOrderPayload(values));
    if (values.condicionPago === "CREDITO") {
      try {
        await creditRequest.mutateAsync({
          pedidoId: created.id,
          payload: { plazoDias: termNumber, politicaId: policyId },
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

            {condition === "CREDITO" ? (
              <AppCard
                title="Solicitud de crédito"
                description="Al guardar el pedido se enviará su solicitud directamente al administrador."
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
                <div className="mt-4">
                  <AppAlert
                    tone="info"
                    title="La aprobación es exclusiva de ADMIN"
                    description="El bodeguero registra el pedido y solicita el crédito en una sola acción. No se autoriza ni se genera deuda hasta aprobar y entregar."
                  />
                </div>
              </AppCard>
            ) : null}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <AppButton asChild variant="secondary">
                <Link to={backTo}>Cancelar</Link>
              </AppButton>

              <AppFormSubmit<OrderFormValues>
                leftIcon={condition === "CREDITO" ? <ShieldCheck /> : <Save />}
                loadingText={condition === "CREDITO" ? "Creando y solicitando..." : "Creando..."}
                disableWhenInvalid
                disabled={mutation.isPending || creditRequest.isPending || (condition === "CREDITO" && !validTerm)}
                className="w-full sm:w-auto"
              >
                {condition === "CREDITO" ? "Crear y solicitar crédito" : "Crear pedido"}
              </AppFormSubmit>
            </div>
          </AppStack>
        </AppForm>
      </AppStack>
    </AppContainer>
  );
}
