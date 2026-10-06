import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useIdempotencyKey } from "@/features/common/utils/idempotency";
import { useReserveInventory } from "@/features/inventario/api/inventory.mutations";
import {
  useInventoryOrderDetail,
  useInventoryOrderOptions,
} from "@/features/inventario/api/inventory.queries";
import { toReserveInventoryPayload } from "@/features/inventario/common/inventory.mappers";
import { InventoryBodegaFormSelect } from "@/features/inventario/components/inventory-selects";
import {
  reserveInventorySchema,
  type ReserveInventoryFormValues,
} from "@/features/inventario/schemas/inventory.schemas";
import {
  AppForm,
  AppFormInput,
  AppFormSingleSelect,
  AppFormSubmit,
} from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function CreateInventoryReservationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const backTo = getReturnRoute(
    location.state,
    "/marcas-gt/inventario/reservas",
  );
  const listFrom = getListReturnRoute(location.state, backTo);
  const key = useIdempotencyKey("inventory-reservation");

  const initialOrderId = Number(searchParams.get("pedidoId"));
  const [orderSearchInput, setOrderSearchInput] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(
    Number.isInteger(initialOrderId) && initialOrderId > 0
      ? initialOrderId
      : null,
  );

  const ordersQuery = useInventoryOrderOptions(orderSearch);
  const orderQuery = useInventoryOrderDetail(selectedOrderId);
  const mutation = useReserveInventory();

  const form = useForm<ReserveInventoryFormValues>({
    resolver: zodResolver(reserveInventorySchema),
    defaultValues: {
      pedidoDetalleId: null,
      bodegaId: null,
      cantidad: "",
    },
    mode: "onTouched",
  });

  const selectedDetailId = useWatch({
    control: form.control,
    name: "pedidoDetalleId",
  });

  useEffect(() => {
    form.setValue("pedidoDetalleId", null);
    form.setValue("cantidad", "");
  }, [form, selectedOrderId]);

  const orderRows = [...(ordersQuery.data?.data ?? [])];

  if (
    orderQuery.data &&
    !orderRows.some((order) => order.id === orderQuery.data?.id)
  ) {
    orderRows.unshift(orderQuery.data);
  }

  const orderOptions = orderRows.map((order) => ({
    value: order.id,
    label: `${order.numero} · ${order.cliente.nombreCompleto}`,
  }));

  const detailOptions = (orderQuery.data?.detalles ?? [])
    .filter((detail) => detail.cantidadPendienteReserva > 0)
    .map((detail) => ({
      value: detail.id,
      label:
        detail.producto.codigo +
        " · " +
        detail.producto.nombre +
        " · Pendiente " +
        detail.cantidadPendienteReserva,
    }));

  const selectedDetail = orderQuery.data?.detalles.find(
    (detail) => detail.id === selectedDetailId,
  );

  const onSubmit = async (values: ReserveInventoryFormValues) => {
    const cantidad = Number(values.cantidad);

    if (
      selectedDetail &&
      cantidad > selectedDetail.cantidadPendienteReserva
    ) {
      form.setError("cantidad", {
        type: "validate",
        message:
          "La cantidad supera lo pendiente por reservar (" +
          selectedDetail.cantidadPendienteReserva +
          ").",
      });
      return;
    }

    const result = await mutation.mutateAsync(
      toReserveInventoryPayload(values, key),
    );

    if (result.reservaId) {
      navigate("/marcas-gt/inventario/reservas/" + result.reservaId, {
        replace: true,
        state: { from: backTo, listFrom },
      });
      return;
    }

    navigate("/marcas-gt/inventario/stocks/" + result.stockId, {
      replace: true,
      state: { from: backTo, listFrom },
    });
  };

  return (
    <AppContainer size="xl" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Nueva reserva"
          description="Reserva existencias para una línea de pedido confirmada con unidades pendientes."
          backTo={backTo}
          backLabel="Volver a reservas"
        />

        <AppCard
          title="Pedido"
          description="Se muestran pedidos confirmados o en operación que todavía tienen unidades pendientes de reserva."
          size="sm"
        >
          <AppStack gap="md">
            <AppSearchInput
              value={orderSearchInput}
              onValueChange={setOrderSearchInput}
              onDebouncedChange={setOrderSearch}
              placeholder="Buscar pedido o cliente..."
            />

            <AppSingleSelect<number>
              value={selectedOrderId}
              options={orderOptions}
              isLoading={ordersQuery.isLoading}
              placeholder="Seleccionar pedido"
              onChange={setSelectedOrderId}
              noOptionsText="No hay pedidos elegibles para reserva"
            />
          </AppStack>
        </AppCard>

        <AppForm form={form} onSubmit={onSubmit}>
          <AppStack gap="md">
            <AppCard
              title="Reserva"
              description={
                selectedOrderId
                  ? "Selecciona un detalle del pedido, la bodega y la cantidad."
                  : "Primero selecciona un pedido."
              }
              size="sm"
            >
              <AppStack gap="md">
                <AppFormSingleSelect<ReserveInventoryFormValues, number>
                  name="pedidoDetalleId"
                  label="Detalle de pedido"
                  options={detailOptions}
                  isLoading={orderQuery.isLoading}
                  isDisabled={!selectedOrderId}
                  placeholder="Seleccionar producto del pedido"
                  required
                />

                <InventoryBodegaFormSelect<ReserveInventoryFormValues>
                  name="bodegaId"
                  label="Bodega"
                  placeholder="Seleccionar bodega"
                  required
                />

                <AppFormInput<ReserveInventoryFormValues>
                  name="cantidad"
                  label="Cantidad"
                  description={
                    selectedDetail
                      ? "Pendiente por reservar: " +
                        selectedDetail.cantidadPendienteReserva
                      : undefined
                  }
                  type="number"
                  min={1}
                  max={selectedDetail?.cantidadPendienteReserva}
                  inputMode="numeric"
                  required
                />
              </AppStack>
            </AppCard>

            <div className="flex justify-end gap-2">
              <AppButton asChild variant="secondary">
                <Link to={backTo}>Cancelar</Link>
              </AppButton>

              <AppFormSubmit<ReserveInventoryFormValues>
                leftIcon={<Plus />}
                loadingText="Reservando..."
                disableWhenInvalid
              >
                Crear reserva
              </AppFormSubmit>
            </div>
          </AppStack>
        </AppForm>
      </AppStack>
    </AppContainer>
  );
}
