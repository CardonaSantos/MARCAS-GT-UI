import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { useProductSelectables } from "@/features/common/catalogs/catalog.queries";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useUpdateOrder } from "@/features/pedidos/api/order.mutations";
import { useOrder } from "@/features/pedidos/api/order.queries";
import {
  toOrderFormValues,
  toUpdateOrderPayload,
} from "@/features/pedidos/common/order.mappers";
import { validateOrderDraftDiscounts } from "@/features/pedidos/common/order-form.utils";
import { OrderFormFields } from "@/features/pedidos/components/order-form-fields";
import {
  orderFormSchema,
  type OrderFormValues,
} from "@/features/pedidos/schemas/order.schemas";
import { AppForm, AppFormSubmit } from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function EditOrderPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const detailUrl = "/marcas-gt/pedidos/" + id;
  const backTo = getReturnRoute(location.state, detailUrl);
  const listFrom = getListReturnRoute(location.state, "/marcas-gt/pedidos");

  const query = useOrder(id);
  const productsQuery = useProductSelectables();
  const mutation = useUpdateOrder();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      clienteId: null,
      vendedorId: null,
      visitaId: null,
      condicionPago: "PREPAGO",
      observaciones: "",
      detalles: [],
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (query.data) {
      form.reset(toOrderFormValues(query.data));
    }
  }, [form, query.data]);

  const onSubmit = async (values: OrderFormValues) => {
    if (!query.data?.acciones.puedeEditar) return;

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

    await mutation.mutateAsync({
      id,
      payload: toUpdateOrderPayload(values),
    });

    navigate(detailUrl, {
      replace: true,
      state: { from: listFrom },
    });
  };

  return (
    <AppContainer size="xl" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Editar pedido"
          description={query.data ? query.data.numero : undefined}
          backTo={backTo}
          backState={{ from: listFrom }}
          backLabel="Volver al detalle"
        />

        <AppDataState
          isLoading={query.isLoading}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !query.data}
          emptyTitle="Pedido no encontrado"
        >
          {query.data?.acciones.puedeEditar ? (
            <AppForm form={form} onSubmit={onSubmit}>
              <AppStack gap="md">
                <OrderFormFields />

                <div className="flex justify-end gap-2">
                  <AppButton asChild variant="secondary">
                    <Link to={backTo} state={{ from: listFrom }}>
                      Cancelar
                    </Link>
                  </AppButton>

                  <AppFormSubmit<OrderFormValues>
                    leftIcon={<Save />}
                    loadingText="Guardando..."
                    disableWhenInvalid
                    disabled={!form.formState.isDirty}
                  >
                    Guardar cambios
                  </AppFormSubmit>
                </div>
              </AppStack>
            </AppForm>
          ) : query.data ? (
            <AppCard
              title="El pedido ya no es editable"
              description="El backend sólo permite modificar pedidos en estado BORRADOR y sin actividad operativa."
              size="sm"
            />
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
