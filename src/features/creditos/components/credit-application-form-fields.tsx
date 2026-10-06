import { useEffect, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { formatMoney } from "@/features/common/formatters/value.formatters";
import { useOrder } from "@/features/pedidos/api/order.queries";
import {
  AppFormInput,
  AppFormSingleSelect,
  AppFormTextarea,
} from "@/ui/components/app/form";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

import {
  useCreditOrderOptions,
  useCreditPolicy,
} from "../api/credit.queries";
import type { CreditApplicationFormValues } from "../schemas/credit.schemas";
import { CreditPolicyFormSelect } from "./credit-selects";

export function CreditApplicationFormFields({
  lockOrder = false,
}: {
  lockOrder?: boolean;
}) {
  const form = useFormContext<CreditApplicationFormValues>();
  const pedidoId = useWatch({ control: form.control, name: "pedidoId" });
  const politicaId = useWatch({ control: form.control, name: "politicaId" });

  const [searchInput, setSearchInput] = useState("");
  const [serverSearch, setServerSearch] = useState("");

  const ordersQuery = useCreditOrderOptions(serverSearch);
  const orderQuery = useOrder(pedidoId ?? 0);
  const policyQuery = useCreditPolicy(politicaId ?? 0);

  const orderOptions = useMemo(() => {
    const rows = [...(ordersQuery.data?.data ?? [])];

    if (
      orderQuery.data &&
      orderQuery.data.condicionPago === "CREDITO" &&
      !rows.some((order) => order.id === orderQuery.data?.id)
    ) {
      rows.unshift(orderQuery.data);
    }

    return rows.map((order) => ({
      value: order.id,
      label:
        order.numero +
        " · " +
        order.cliente.nombreCompleto +
        " · " +
        formatMoney(order.total),
    }));
  }, [orderQuery.data, ordersQuery.data]);

  useEffect(() => {
    const order = orderQuery.data;
    if (!order || order.condicionPago !== "CREDITO") return;

    const amount = Number(order.total).toFixed(2);

    if (form.getValues("montoSolicitado") !== amount) {
      form.setValue("montoSolicitado", amount, {
        shouldValidate: true,
      });
    }
  }, [form, orderQuery.data]);

  const invalidOrder =
    orderQuery.data &&
    (orderQuery.data.condicionPago !== "CREDITO" ||
      orderQuery.data.estado !== "PENDIENTE_VALIDACION");

  return (
    <AppStack gap="md">
      <AppCard
        title="Pedido a crédito"
        description="La solicitud se vincula a un pedido CREDITO pendiente de validación."
        size="sm"
      >
        <AppStack gap="md">
          {!lockOrder ? (
            <AppSearchInput
              value={searchInput}
              onValueChange={setSearchInput}
              onDebouncedChange={setServerSearch}
              placeholder="Buscar pedido o cliente..."
            />
          ) : null}

          <AppFormSingleSelect<CreditApplicationFormValues, number>
            name="pedidoId"
            label="Pedido"
            options={orderOptions}
            isLoading={ordersQuery.isLoading || orderQuery.isLoading}
            isDisabled={lockOrder}
            placeholder="Seleccionar pedido a crédito"
            noOptionsText="No hay pedidos CREDITO pendientes de validación"
            required
          />

          {orderQuery.data ? (
            <AppGrid cols={{ base: 1, md: 2, xl: 4 }} gap="sm">
              <div>
                <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                  Cliente
                </p>
                <p className="mt-1 text-sm font-medium">
                  {orderQuery.data.cliente.nombreCompleto}
                </p>
              </div>
              <div>
                <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                  Vendedor
                </p>
                <p className="mt-1 text-sm font-medium">
                  {orderQuery.data.vendedor.nombre}
                </p>
              </div>
              <div>
                <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                  Estado
                </p>
                <p className="mt-1 text-sm font-medium">
                  {orderQuery.data.estado}
                </p>
              </div>
              <div>
                <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                  Total vigente
                </p>
                <p className="mt-1 text-sm font-semibold tabular-nums">
                  {formatMoney(orderQuery.data.total)}
                </p>
              </div>
            </AppGrid>
          ) : null}

          {invalidOrder ? (
            <AppAlert
              tone="danger"
              title="Pedido no elegible"
              description="Esta interfaz sólo tramita pedidos CREDITO en estado PENDIENTE_VALIDACION."
            />
          ) : null}
        </AppStack>
      </AppCard>

      <AppCard
        title="Condiciones solicitadas"
        description="El monto debe coincidir con el total vigente del pedido. El anticipo no aplica en crédito puro."
        size="sm"
      >
        <AppGrid cols={{ base: 1, md: 2 }} gap="md">
          <AppFormInput<CreditApplicationFormValues>
            name="montoSolicitado"
            label="Monto solicitado"
            inputMode="decimal"
            readOnly
            required
          />

          <AppFormInput<CreditApplicationFormValues>
            name="plazoDias"
            label="Plazo solicitado (días)"
            type="number"
            min={1}
            max={3650}
            inputMode="numeric"
            required
          />

          <CreditPolicyFormSelect<CreditApplicationFormValues>
            name="politicaId"
            label="Política de crédito"
            activeOnly
            placeholder="Sin política específica"
            isClearable
          />
        </AppGrid>

        {policyQuery.data ? (
          <div className="mt-4 rounded-md border border-[hsl(var(--app-border))] p-3">
            <p className="text-sm font-medium">{policyQuery.data.nombre}</p>
            <div className="mt-2 grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <span className="text-[hsl(var(--app-muted-foreground))]">
                  Monto máximo
                </span>
                <p>{formatMoney(policyQuery.data.montoMaximo)}</p>
              </div>
              <div>
                <span className="text-[hsl(var(--app-muted-foreground))]">
                  Plazo máximo
                </span>
                <p>
                  {policyQuery.data.plazoMaximoDias == null
                    ? "Sin límite"
                    : policyQuery.data.plazoMaximoDias + " días"}
                </p>
              </div>
              <div>
                <span className="text-[hsl(var(--app-muted-foreground))]">
                  Requisitos activos
                </span>
                <p>
                  {
                    policyQuery.data.requisitos.filter(
                      (requirement) => requirement.activo,
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-4">
          <AppFormTextarea<CreditApplicationFormValues>
            name="motivo"
            label="Motivo / observaciones de solicitud"
            maxLength={1000}
            rows={4}
            placeholder="Contexto adicional de la solicitud."
          />
        </div>

        <div className="mt-4">
          <AppAlert
            tone="info"
            title="Crédito puro"
            description="No se solicita anticipo en este flujo. El backend registra el anticipo propuesto en Q0.00."
          />
        </div>
      </AppCard>
    </AppStack>
  );
}
