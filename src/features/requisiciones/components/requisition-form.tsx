import { Plus, Trash2 } from "lucide-react";

import type { BodegaSelectable } from "@/features/bodegas/api/bodega.types";
import type {
  ProductSelectable,
  ProviderSelectable,
} from "@/features/common/catalogs/catalog.types";
import { formatMoney } from "@/features/common/formatters/value.formatters";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppInput } from "@/ui/components/app/primitives/app-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";
import { AppTextarea } from "@/ui/components/app/primitives/app-textarea";

import type {
  RequisitionDraft,
  RequisitionDraftLine,
} from "../api/requisition.types";

function emptyLine(): RequisitionDraftLine {
  return {
    productoId: null,
    cantidadSolicitada: "1",
    costoUnitarioEstimado: "",
  };
}

export function RequisitionForm({
  value,
  bodegas,
  proveedores,
  productos,
  onChange,
  disabled = false,
}: {
  value: RequisitionDraft;
  bodegas: BodegaSelectable[];
  proveedores: ProviderSelectable[];
  productos: ProductSelectable[];
  onChange: (next: RequisitionDraft) => void;
  disabled?: boolean;
}) {
  const selectedIds = new Set(
    value.detalles
      .map((line) => line.productoId)
      .filter((id): id is number => id != null),
  );

  const estimatedTotal = value.detalles.reduce((total, line) => {
    const quantity = Number(line.cantidadSolicitada);
    const cost = Number(line.costoUnitarioEstimado);
    if (!Number.isFinite(quantity) || !Number.isFinite(cost)) return total;
    return total + quantity * cost;
  }, 0);

  const totalUnits = value.detalles.reduce((total, line) => {
    const quantity = Number(line.cantidadSolicitada);
    return total + (Number.isFinite(quantity) ? quantity : 0);
  }, 0);

  const patchLine = (index: number, patch: Partial<RequisitionDraftLine>) => {
    onChange({
      ...value,
      detalles: value.detalles.map((line, itemIndex) =>
        itemIndex === index ? { ...line, ...patch } : line,
      ),
    });
  };

  const removeLine = (index: number) => {
    onChange({
      ...value,
      detalles: value.detalles.filter((_, itemIndex) => itemIndex !== index),
    });
  };

  return (
    <div className="space-y-4">
      <AppCard
        title="Destino y proveedor"
        description="El proveedor puede quedar pendiente mientras la requisición siga en borrador, pero será obligatorio antes de aprobar."
        size="sm"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium" htmlFor="req-bodega">
              Bodega destino *
            </label>
            <AppSingleSelect<number>
              inputId="req-bodega"
              value={value.bodegaDestinoId}
              options={bodegas.map((item) => ({
                value: item.id,
                label:
                  item.codigo +
                  " · " +
                  item.nombre +
                  (item.esPrincipal ? " · Principal" : ""),
              }))}
              onChange={(next) =>
                onChange({ ...value, bodegaDestinoId: next })
              }
              placeholder="Seleccionar bodega"
              isDisabled={disabled}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium" htmlFor="req-proveedor">
              Proveedor
            </label>
            <AppSingleSelect<number>
              inputId="req-proveedor"
              value={value.proveedorId}
              options={proveedores.map((item) => ({
                value: item.id,
                label: item.nombre,
              }))}
              onChange={(next) => onChange({ ...value, proveedorId: next })}
              placeholder="Seleccionar proveedor"
              isDisabled={disabled}
            />
          </div>
        </div>
      </AppCard>

      <AppCard
        title="Productos solicitados"
        description="Cada producto puede aparecer una sola vez. La cantidad debe ser mayor que cero."
        size="sm"
      >
        <div className="space-y-2">
          {value.detalles.length === 0 ? (
            <AppAlert
              tone="warning"
              title="Sin productos"
              description="Puedes guardar un borrador vacío, pero necesitarás al menos un producto antes de solicitar aprobación."
            />
          ) : null}

          {value.detalles.map((line, index) => {
            const product = productos.find((item) => item.id === line.productoId);
            const options = productos
              .filter(
                (item) =>
                  item.id === line.productoId || !selectedIds.has(item.id),
              )
              .map((item) => ({
                value: item.id,
                label: item.codigo + " · " + item.nombre,
              }));

            return (
              <div
                key={index}
                className="grid gap-2 rounded-md border border-[hsl(var(--app-border))] p-3 md:grid-cols-[minmax(220px,1fr)_140px_160px_auto]"
              >
                <div>
                  <label
                    className="mb-1 block text-xs font-medium"
                    htmlFor={"req-product-" + index}
                  >
                    Producto *
                  </label>
                  <AppSingleSelect<number>
                    inputId={"req-product-" + index}
                    value={line.productoId}
                    options={options}
                    onChange={(next) => patchLine(index, { productoId: next })}
                    placeholder="Seleccionar producto"
                    isDisabled={disabled}
                  />
                </div>

                <div>
                  <label
                    className="mb-1 block text-xs font-medium"
                    htmlFor={"req-qty-" + index}
                  >
                    Cantidad *
                  </label>
                  <AppInput
                    id={"req-qty-" + index}
                    type="number"
                    min={1}
                    step={1}
                    value={line.cantidadSolicitada}
                    disabled={disabled}
                    onChange={(event) =>
                      patchLine(index, {
                        cantidadSolicitada: event.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label
                    className="mb-1 block text-xs font-medium"
                    htmlFor={"req-cost-" + index}
                  >
                    Costo estimado
                  </label>
                  <AppInput
                    id={"req-cost-" + index}
                    type="number"
                    min={0}
                    step="0.0001"
                    value={line.costoUnitarioEstimado}
                    disabled={disabled}
                    placeholder={product ? "Precio/costo estimado" : "0.0000"}
                    onChange={(event) =>
                      patchLine(index, {
                        costoUnitarioEstimado: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex items-end">
                  <AppButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={disabled}
                    onClick={() => removeLine(index)}
                    aria-label={"Eliminar producto " + (index + 1)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Quitar
                  </AppButton>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <AppButton
            type="button"
            variant="secondary"
            size="sm"
            leftIcon={<Plus />}
            disabled={disabled || value.detalles.length >= 200}
            onClick={() =>
              onChange({
                ...value,
                detalles: [...value.detalles, emptyLine()],
              })
            }
          >
            Agregar producto
          </AppButton>

          <div className="text-right text-sm">
            <p className="font-medium">{totalUnits} unidades</p>
            <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
              Estimado {formatMoney(estimatedTotal)}
            </p>
          </div>
        </div>
      </AppCard>

      <AppCard title="Observaciones" size="sm">
        <label className="sr-only" htmlFor="req-observaciones">
          Observaciones
        </label>
        <AppTextarea
          id="req-observaciones"
          rows={4}
          maxLength={1000}
          value={value.observaciones}
          disabled={disabled}
          onChange={(event) =>
            onChange({ ...value, observaciones: event.target.value })
          }
          placeholder="Contexto de la reposición, temporada, urgencia u otra información útil."
        />
      </AppCard>
    </div>
  );
}

export function newRequisitionDraft(): RequisitionDraft {
  return {
    bodegaDestinoId: null,
    proveedorId: null,
    observaciones: "",
    detalles: [emptyLine()],
  };
}
