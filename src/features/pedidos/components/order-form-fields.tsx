import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import { useStore } from "@/Context/ContextSucursal";
import { useVisitSelectables } from "@/features/common/catalogs/catalog.queries";
import {
  formatMoney,
  formatInteger,
} from "@/features/common/formatters/value.formatters";
import {
  AppFormInput,
  AppFormSingleSelect,
  AppFormTextarea,
} from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

import {
  ORDER_PAYMENT_CONDITION_LABELS,
  ORDER_PAYMENT_CONDITIONS,
} from "../common/order.constants";
import {
  orderDraftLineAmounts,
  orderDraftTotals,
} from "../common/order-form.utils";
import type { OrderFormValues } from "../schemas/order.schemas";
import {
  OrderCustomerFormSelect,
  useOrderProductOptions,
  OrderSellerFormSelect,
  OrderVisitFormSelect,
} from "./order-selects";

const paymentOptions = ORDER_PAYMENT_CONDITIONS.map((value) => ({
  value,
  label: ORDER_PAYMENT_CONDITION_LABELS[value],
}));

export function OrderFormFields() {
  const role = useStore((state) => state.userRol);
  const userId = useStore((state) => state.userId);

  const form = useFormContext<OrderFormValues>();
  const { control, setValue } = form;

  const clienteId = useWatch({ control, name: "clienteId" });
  const vendedorId = useWatch({ control, name: "vendedorId" });
  const visitaId = useWatch({ control, name: "visitaId" });
  const detalles = useWatch({ control, name: "detalles" }) ?? [];

  const { fields, append, remove } = useFieldArray({
    control,
    name: "detalles",
  });

  const productsQuery = useOrderProductOptions();
  const visitQuery = useVisitSelectables(
    { clienteId, vendedorId },
    Boolean(clienteId && vendedorId),
  );
  const products = productsQuery.data ?? [];
  const totals = orderDraftTotals(detalles, products);

  useEffect(() => {
    if (role === "VENDEDOR" && userId && vendedorId !== userId) {
      setValue("vendedorId", userId, {
        shouldValidate: true,
      });
    }
  }, [role, setValue, userId, vendedorId]);

  useEffect(() => {
    if (!visitaId) return;

    if (!clienteId || !vendedorId) {
      setValue("visitaId", null);
      return;
    }

    if (
      !visitQuery.isLoading &&
      visitQuery.data &&
      !visitQuery.data.some((visit) => visit.id === visitaId)
    ) {
      setValue("visitaId", null, { shouldValidate: true });
    }
  }, [
    clienteId,
    setValue,
    vendedorId,
    visitaId,
    visitQuery.data,
    visitQuery.isLoading,
  ]);

  return (
    <AppStack gap="md">
      <AppCard title="Datos comerciales" description="" size="sm">
        <AppGrid cols={{ base: 1, md: 2 }} gap="md">
          <OrderCustomerFormSelect<OrderFormValues>
            name="clienteId"
            label="Cliente"
            placeholder="Seleccionar cliente"
            required
          />

          <OrderSellerFormSelect<OrderFormValues>
            name="vendedorId"
            label="Vendedor"
            placeholder="Seleccionar vendedor"
            isDisabled={role === "VENDEDOR"}
            required
          />

          <OrderVisitFormSelect<OrderFormValues>
            name="visitaId"
            label="Visita"
            description="Opcional. Sólo se muestran visitas compatibles con cliente y vendedor."
            clienteId={clienteId}
            vendedorId={vendedorId}
            placeholder={
              clienteId && vendedorId
                ? "Seleccionar visita"
                : "Selecciona cliente y vendedor"
            }
            isDisabled={!clienteId || !vendedorId}
            isClearable
          />

          <AppFormSingleSelect<
            OrderFormValues,
            OrderFormValues["condicionPago"]
          >
            name="condicionPago"
            label="Condición de pago"
            options={paymentOptions}
            isClearable={false}
            required
          />
        </AppGrid>

        <div className="mt-4">
          <AppFormTextarea<OrderFormValues>
            name="observaciones"
            label="Observaciones"
            maxLength={1000}
            rows={3}
            placeholder="Indicaciones comerciales o información adicional del pedido."
          />
        </div>
      </AppCard>

      <AppCard
        title="Productos"
        description="El precio mostrado es informativo. El backend toma el precio vigente al guardar el pedido."
        size="sm"
        action={
          <AppButton
            type="button"
            variant="secondary"
            size="sm"
            leftIcon={<Plus />}
            disabled={fields.length >= 200}
            onClick={() =>
              append({
                productoId: null,
                cantidadSolicitada: "1",
                descuento: "",
                observaciones: "",
              })
            }
          >
            Agregar producto
          </AppButton>
        }
      >
        <AppStack gap="sm">
          {fields.length === 0 ? (
            <div className="rounded-md border border-dashed border-[hsl(var(--app-border))] p-6 text-center text-sm text-[hsl(var(--app-muted-foreground))]">
              El borrador puede guardarse sin productos. Agrega al menos uno
              antes de solicitar validación.
            </div>
          ) : null}

          {fields.map((field, index) => {
            const line = detalles[index] ?? {
              productoId: null,
              cantidadSolicitada: "",
              descuento: "",
              observaciones: "",
            };
            const amounts = orderDraftLineAmounts(line, products);

            return (
              <div
                key={field.id}
                className="rounded-md border border-[hsl(var(--app-border))] p-3"
              >
                <div className="grid gap-3 xl:grid-cols-[minmax(260px,2fr)_120px_130px_120px_130px_auto] xl:items-start">
                  <AppFormSingleSelect<OrderFormValues, number>
                    name={`detalles.${index}.productoId`}
                    label="Producto"
                    options={productsQuery.options}
                    isLoading={productsQuery.isLoading}
                    placeholder="Seleccionar producto"
                    required
                  />

                  <AppFormInput<OrderFormValues>
                    name={`detalles.${index}.cantidadSolicitada`}
                    label="Cantidad"
                    type="number"
                    min={1}
                    inputMode="numeric"
                    required
                  />

                  <AppFormInput<OrderFormValues>
                    name={`detalles.${index}.descuento`}
                    label="Descuento"
                    inputMode="decimal"
                    placeholder="0.00"
                  />

                  <div className="pt-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
                      Precio
                    </p>
                    <p className="mt-2 text-sm tabular-nums">
                      {formatMoney(amounts.unit)}
                    </p>
                  </div>

                  <div className="pt-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
                      Neto estimado
                    </p>
                    <p className="mt-2 text-sm font-medium tabular-nums">
                      {formatMoney(amounts.net)}
                    </p>
                  </div>

                  <div className="flex justify-end pt-6">
                    <AppButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label="Eliminar producto"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </AppButton>
                  </div>
                </div>

                <div className="mt-3">
                  <AppFormInput<OrderFormValues>
                    name={`detalles.${index}.observaciones`}
                    label="Observación de línea"
                    maxLength={500}
                    placeholder="Opcional"
                  />
                </div>
              </div>
            );
          })}

          <div className="grid gap-3 border-t border-[hsl(var(--app-border))] pt-4 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                Unidades
              </p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {formatInteger(totals.units)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                Subtotal estimado
              </p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {formatMoney(totals.subtotal)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                Descuento
              </p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {formatMoney(totals.discount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                Total estimado
              </p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {formatMoney(totals.total)}
              </p>
            </div>
          </div>
        </AppStack>
      </AppCard>
    </AppStack>
  );
}
