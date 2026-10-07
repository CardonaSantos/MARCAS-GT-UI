import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";

import type { BodegaSelectable } from "@/features/bodegas/api/bodega.types";
import type { ProductSelectable } from "@/features/common/catalogs/catalog.types";
import { useProductAvailability } from "@/features/inventario/api/inventory.queries";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppInput } from "@/ui/components/app/primitives/app-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";
import { AppTextarea } from "@/ui/components/app/primitives/app-textarea";

import type { TransferDraft, TransferDraftLine } from "../api/transfer.types";

function emptyLine(): TransferDraftLine {
  return {
    productoId: null,
    cantidadSolicitada: "1",
    observaciones: "",
  };
}

export type TransferAvailabilityStatus = { productoId: number; bodegaOrigenId: number; disponible: number | null };

function TransferLineAvailability({
  productoId,
  bodegaOrigenId,
  requested,
  onAvailabilityChange,
}: {
  productoId: number | null;
  bodegaOrigenId: number | null;
  requested: string;
  onAvailabilityChange?: (status: TransferAvailabilityStatus) => void;
}) {
  const query = useProductAvailability(
    productoId ?? 0,
    Boolean(productoId && bodegaOrigenId),
  );

  const warehouse = query.data?.bodegas.find((item) => item.bodegaId === bodegaOrigenId);
  const disponible = query.isSuccess ? (warehouse?.disponible ?? 0) : null;
  useEffect(() => {
    if (productoId && bodegaOrigenId) onAvailabilityChange?.({ productoId, bodegaOrigenId, disponible });
  }, [productoId, bodegaOrigenId, disponible, onAvailabilityChange]);

  if (!productoId || !bodegaOrigenId) {
    return (
      <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
        Selecciona producto y origen para consultar disponibilidad.
      </p>
    );
  }

  if (query.isLoading || query.isError) {
    return (
      <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
        {query.isError ? "No se pudo consultar disponibilidad." : "Consultando disponibilidad..."}
      </p>
    );
  }

  const available = disponible ?? 0;
  const quantity = Number(requested);
  const remaining =
    Number.isFinite(quantity) && quantity > 0 ? available - quantity : available;
  const enough = Number.isFinite(quantity) && quantity > 0
    ? available >= quantity
    : true;

  return (
    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs">
      <span className={enough ? "text-[hsl(var(--app-muted-foreground))]" : "font-medium text-red-500"}>
        Disponible en origen: {available}
      </span>
      {Number.isFinite(quantity) && quantity > 0 ? (
        <span className="text-[hsl(var(--app-muted-foreground))]">
          Después de salida: {remaining}
        </span>
      ) : null}
      {!enough ? (
        <span className="font-medium text-red-500">
          Cantidad mayor a la disponibilidad actual.
        </span>
      ) : null}
    </div>
  );
}

export function TransferForm({
  value,
  bodegas,
  productos,
  onChange,
  disabled = false,
  onAvailabilityChange,
}: {
  value: TransferDraft;
  bodegas: BodegaSelectable[];
  productos: ProductSelectable[];
  onChange: (next: TransferDraft) => void;
  disabled?: boolean;
  onAvailabilityChange?: (status: TransferAvailabilityStatus) => void;
}) {
  const selectedIds = new Set(
    value.detalles
      .map((line) => line.productoId)
      .filter((id): id is number => id != null),
  );

  const origin = bodegas.find((item) => item.id === value.bodegaOrigenId);
  const destination = bodegas.find(
    (item) => item.id === value.bodegaDestinoId,
  );
  const totalUnits = value.detalles.reduce((total, line) => {
    const quantity = Number(line.cantidadSolicitada);
    return total + (Number.isFinite(quantity) ? quantity : 0);
  }, 0);

  const patchLine = (index: number, patch: Partial<TransferDraftLine>) => {
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
        title="Ruta del traslado"
        description="Define de dónde sale físicamente la mercadería y en qué bodega será recibida."
        size="sm"
      >
        <div className="grid items-end gap-3 md:grid-cols-[1fr_auto_1fr]">
          <div>
            <label htmlFor="transfer-origin" className="mb-1 block text-xs font-medium">
              Bodega origen *
            </label>
            <AppSingleSelect<number>
              inputId="transfer-origin"
              value={value.bodegaOrigenId}
              options={bodegas
                .filter((item) => item.id !== value.bodegaDestinoId)
                .map((item) => ({
                  value: item.id,
                  label:
                    item.codigo +
                    " · " +
                    item.nombre +
                    (item.esPrincipal ? " · Principal" : ""),
                }))}
              onChange={(next) =>
                onChange({ ...value, bodegaOrigenId: next })
              }
              placeholder="Seleccionar origen"
              isDisabled={disabled}
            />
          </div>

          <div className="hidden pb-2 md:block" aria-hidden="true">
            <ArrowRight className="h-5 w-5 text-[hsl(var(--app-muted-foreground))]" />
          </div>

          <div>
            <label htmlFor="transfer-destination" className="mb-1 block text-xs font-medium">
              Bodega destino *
            </label>
            <AppSingleSelect<number>
              inputId="transfer-destination"
              value={value.bodegaDestinoId}
              options={bodegas
                .filter((item) => item.id !== value.bodegaOrigenId)
                .map((item) => ({
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
              placeholder="Seleccionar destino"
              isDisabled={disabled}
            />
          </div>
        </div>

        {origin && destination ? (
          <div className="mt-3 rounded-md border border-[hsl(var(--app-border))] p-3 text-sm">
            <span className="font-medium">{origin.nombre}</span>
            <span className="mx-2 text-[hsl(var(--app-muted-foreground))]">→</span>
            <span className="font-medium">{destination.nombre}</span>
          </div>
        ) : null}
      </AppCard>

      <AppCard
        title="Productos a trasladar"
        description="La UI consulta la disponibilidad actual del origen. El server volverá a validarla al preparar la transferencia."
        size="sm"
      >
        <div className="space-y-2">
          {value.detalles.length === 0 ? (
            <AppAlert
              tone="warning"
              title="Sin productos"
              description="Puedes guardar el borrador, pero necesitarás al menos un producto antes de preparar la transferencia."
            />
          ) : null}

          {value.detalles.map((line, index) => {
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
                className="grid gap-3 rounded-md border border-[hsl(var(--app-border))] p-3 xl:grid-cols-[minmax(260px,1fr)_150px_minmax(220px,1fr)_auto]"
              >
                <div>
                  <label
                    htmlFor={"transfer-product-" + index}
                    className="mb-1 block text-xs font-medium"
                  >
                    Producto *
                  </label>
                  <AppSingleSelect<number>
                    inputId={"transfer-product-" + index}
                    value={line.productoId}
                    options={options}
                    onChange={(next) => patchLine(index, { productoId: next })}
                    placeholder="Seleccionar producto"
                    isDisabled={disabled}
                  />
                  <TransferLineAvailability
                    productoId={line.productoId}
                    bodegaOrigenId={value.bodegaOrigenId}
                    requested={line.cantidadSolicitada}
                    onAvailabilityChange={onAvailabilityChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor={"transfer-quantity-" + index}
                    className="mb-1 block text-xs font-medium"
                  >
                    Cantidad *
                  </label>
                  <AppInput
                    id={"transfer-quantity-" + index}
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
                    htmlFor={"transfer-line-observation-" + index}
                    className="mb-1 block text-xs font-medium"
                  >
                    Observación de línea
                  </label>
                  <AppInput
                    id={"transfer-line-observation-" + index}
                    value={line.observaciones}
                    maxLength={500}
                    disabled={disabled}
                    onChange={(event) =>
                      patchLine(index, { observaciones: event.target.value })
                    }
                    placeholder="Caja cerrada, lote, condición..."
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

          <p className="text-sm font-medium tabular-nums">
            {value.detalles.length} productos · {totalUnits} unidades
          </p>
        </div>
      </AppCard>

      <AppCard title="Observaciones generales" size="sm">
        <label htmlFor="transfer-observations" className="sr-only">
          Observaciones generales
        </label>
        <AppTextarea
          id="transfer-observations"
          rows={4}
          maxLength={1000}
          value={value.observaciones}
          disabled={disabled}
          onChange={(event) =>
            onChange({ ...value, observaciones: event.target.value })
          }
          placeholder="Motivo del traslado, prioridad u otra información útil."
        />
      </AppCard>
    </div>
  );
}

export function newTransferDraft(): TransferDraft {
  return {
    bodegaOrigenId: null,
    bodegaDestinoId: null,
    observaciones: "",
    detalles: [emptyLine()],
  };
}
