import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { useProductSelectables } from "@/features/common/catalogs/catalog.queries";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useCreateOrder } from "@/features/pedidos/api/order.mutations";
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

export default function CreateOrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = useStore((state) => state.userId);
  const backTo = getReturnRoute(location.state, "/marcas-gt/pedidos");

  const productsQuery = useProductSelectables();
  const mutation = useCreateOrder();

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

    const created = await mutation.mutateAsync(toCreateOrderPayload(values));

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

            <div className="flex justify-end gap-2">
              <AppButton asChild variant="secondary">
                <Link to={backTo}>Cancelar</Link>
              </AppButton>

              <AppFormSubmit<OrderFormValues>
                leftIcon={<Save />}
                loadingText="Creando..."
                disableWhenInvalid
              >
                Crear pedido
              </AppFormSubmit>
            </div>
          </AppStack>
        </AppForm>
      </AppStack>
    </AppContainer>
  );
}
