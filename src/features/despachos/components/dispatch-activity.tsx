import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { MessageSquarePlus, RotateCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

import {
  formatDateTime,
} from "@/features/common/formatters/value.formatters";
import {
  parseEnumParam,
  parsePositiveIntParam,
  setSearchParam,
} from "@/features/common/navigation/url-state.utils";
import { useAddDispatchObservation } from "@/features/despachos/api/dispatch.mutations";
import { useDispatchEvents } from "@/features/despachos/api/dispatch.queries";
import type {
  DispatchEvent,
  DispatchEventType,
} from "@/features/despachos/api/dispatch.types";
import {
  DISPATCH_EVENT_LABELS,
  DISPATCH_EVENT_TYPES,
} from "@/features/despachos/common/dispatch.constants";
import {
  dispatchObservationSchema,
  type DispatchObservationFormValues,
} from "@/features/despachos/schemas/dispatch.schemas";
import {
  AppForm,
  AppFormSubmit,
  AppFormTextarea,
} from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppDatePicker } from "@/ui/components/app/primitives/app-date-picker";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";

import { DispatchUserSelect } from "./dispatch-selects";

const eventOptions = DISPATCH_EVENT_TYPES.map((value) => ({
  value,
  label: DISPATCH_EVENT_LABELS[value],
}));

export function DispatchActivity({
  dispatchId,
  canAddObservation,
}: {
  dispatchId: number;
  canAddObservation: boolean;
}) {
  const [params, setParams] = useSearchParams();
  const page = parsePositiveIntParam(params.get("eventPage"), 1) ?? 1;
  const limit = parsePositiveIntParam(params.get("eventLimit"), 20) ?? 20;
  const tipo = parseEnumParam(
    params.get("eventType"),
    DISPATCH_EVENT_TYPES,
  );
  const usuarioId = parsePositiveIntParam(params.get("eventUser"));
  const fechaDesde = params.get("eventFrom") ?? "";
  const fechaHasta = params.get("eventTo") ?? "";

  const query = useDispatchEvents(dispatchId, {
    page,
    limit,
    tipo: tipo ?? undefined,
    usuarioId: usuarioId ?? undefined,
    fechaDesde: fechaDesde || undefined,
    fechaHasta: fechaHasta || undefined,
  });
  const observation = useAddDispatchObservation();

  const form = useForm<DispatchObservationFormValues>({
    resolver: zodResolver(dispatchObservationSchema),
    defaultValues: { detalle: "" },
    mode: "onTouched",
  });

  const update = (
    patch: Record<string, string | number | null | undefined>,
  ) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([key, value]) =>
      setSearchParam(next, key, value),
    );
    setParams(next, { replace: true });
  };

  const reset = () =>
    update({
      eventPage: null,
      eventType: null,
      eventUser: null,
      eventFrom: null,
      eventTo: null,
    });

  const columns: ColumnDef<DispatchEvent, unknown>[] = [
    {
      accessorKey: "creadoEn",
      header: "Fecha",
      size: 155,
      cell: ({ row }) => formatDateTime(row.original.creadoEn),
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      size: 175,
      cell: ({ row }) => DISPATCH_EVENT_LABELS[row.original.tipo],
    },
    {
      id: "actor",
      header: "Usuario",
      size: 155,
      cell: ({ row }) => row.original.actor?.nombre ?? "Sistema",
    },
    {
      accessorKey: "detalle",
      header: "Detalle",
      size: 310,
      meta: { grow: true },
      cell: ({ row }) => row.original.detalle ?? "—",
    },
    {
      id: "referencia",
      header: "Referencia",
      size: 180,
      cell: ({ row }) =>
        row.original.referencia
          ? row.original.referencia.tipo + " #" + row.original.referencia.id
          : "—",
    },
  ];

  return (
    <div className="space-y-4">
      {canAddObservation ? (
        <AppCard
          title="Agregar observación"
          description="Registra una nota operativa en la auditoría del despacho."
          size="sm"
        >
          <AppForm
            form={form}
            onSubmit={async (values) => {
              await observation.mutateAsync({
                id: dispatchId,
                payload: { detalle: values.detalle.trim() },
              });
              form.reset({ detalle: "" });
            }}
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
              <div className="min-w-0 flex-1">
                <AppFormTextarea<DispatchObservationFormValues>
                  name="detalle"
                  label="Observación"
                  rows={2}
                  maxLength={1000}
                  required
                />
              </div>
              <AppFormSubmit<DispatchObservationFormValues>
                leftIcon={<MessageSquarePlus />}
                loadingText="Guardando..."
                disableWhenInvalid
              >
                Registrar
              </AppFormSubmit>
            </div>
          </AppForm>
        </AppCard>
      ) : null}

      <AppDataTable
        data={query.data?.data ?? []}
        columns={columns}
        getRowId={(row) => String(row.id)}
        isLoading={query.isLoading}
        isFetching={query.isFetching}
        error={query.error}
        onRetry={() => void query.refetch()}
        toolbar={
          <div className="grid w-full gap-2 md:grid-cols-2 xl:grid-cols-5">
            <AppSingleSelect<DispatchEventType>
              value={tipo}
              options={eventOptions}
              onChange={(value) =>
                update({ eventType: value, eventPage: 1 })
              }
              placeholder="Tipo de evento"
            />
            <DispatchUserSelect
              value={usuarioId}
              onChange={(value) =>
                update({ eventUser: value, eventPage: 1 })
              }
              placeholder="Usuario"
            />
            <AppDatePicker
              value={fechaDesde}
              outputFormat="iso"
              boundary="startOfDay"
              aria-label="Evento desde"
              onChange={(value) =>
                update({ eventFrom: value ?? null, eventPage: 1 })
              }
            />
            <AppDatePicker
              value={fechaHasta}
              outputFormat="iso"
              boundary="endOfDay"
              aria-label="Evento hasta"
              onChange={(value) =>
                update({ eventTo: value ?? null, eventPage: 1 })
              }
            />
            <AppButton
              variant="secondary"
              size="sm"
              leftIcon={<RotateCcw />}
              onClick={reset}
            >
              Limpiar
            </AppButton>
          </div>
        }
        paginationMode="server"
        pagination={{
          pageIndex: page - 1,
          pageSize: limit,
          totalRows: query.data?.meta.total ?? 0,
          pageCount: Math.max(query.data?.meta.totalPages ?? 1, 1),
          onPaginationChange: (next) =>
            update({
              eventPage: next.pageIndex + 1,
              eventLimit: next.pageSize,
            }),
        }}
        density="xs"
        responsiveMode="scroll"
        emptyTitle="Sin actividad"
        emptyDescription="No hay eventos para los filtros seleccionados."
      />
    </div>
  );
}
