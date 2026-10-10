import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { MessageSquarePlus } from "lucide-react";
import { useForm } from "react-hook-form";

import { createIdempotencyKey } from "@/features/common/utils/idempotency";
import { formatDateTime } from "@/features/common/formatters/value.formatters";
import {
  AppForm,
  AppFormSubmit,
  AppFormTextarea,
} from "@/ui/components/app/form";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";

import { useAddShipmentObservation } from "../api/transport.mutations";
import { useShipmentEvents } from "../api/transport.queries";
import type { ShipmentEvent } from "../api/transport.types";
import {
  shipmentObservationSchema,
  type ShipmentObservationFormValues,
} from "../schemas/transport.schemas";

export function ShipmentActivity({
  shipmentId,
  canAddObservation,
}: {
  shipmentId: number;
  canAddObservation: boolean;
}) {
  const query = useShipmentEvents(shipmentId, { page: 1, limit: 50 });
  const mutation = useAddShipmentObservation();

  const form = useForm<ShipmentObservationFormValues>({
    resolver: zodResolver(shipmentObservationSchema),
    defaultValues: { detalle: "" },
    mode: "onTouched",
  });

  const columns: ColumnDef<ShipmentEvent, unknown>[] = [
    {
      accessorKey: "tipo",
      header: "Evento",
      size: 170,
      cell: ({ row }) => row.original.tipo.replace("_", " "),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 135,
      cell: ({ row }) => row.original.estado.replace("_", " "),
    },
    {
      accessorKey: "descripcion",
      header: "Detalle",
      size: 320,
      meta: { grow: true },
      cell: ({ row }) => row.original.descripcion ?? "—",
    },
    {
      id: "usuario",
      header: "Usuario",
      size: 150,
      cell: ({ row }) => row.original.usuario?.nombre ?? "Sistema",
    },
    {
      accessorKey: "creadoEn",
      header: "Fecha",
      size: 160,
      cell: ({ row }) => formatDateTime(row.original.creadoEn),
    },
  ];

  const onSubmit = async (values: ShipmentObservationFormValues) => {
    await mutation.mutateAsync({
      id: shipmentId,
      payload: {
        detalle: values.detalle.trim(),
        claveIdempotencia: createIdempotencyKey("transport-observation"),
      },
    });
    form.reset({ detalle: "" });
  };

  return (
    <div className="space-y-4">
      {canAddObservation ? (
        <AppCard title="Agregar observación" size="sm">
          <AppForm form={form} onSubmit={onSubmit}>
            <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
              <AppFormTextarea<ShipmentObservationFormValues>
                name="detalle"
                label="Detalle"
                rows={2}
                maxLength={1000}
              />
              <AppFormSubmit<ShipmentObservationFormValues>
                leftIcon={<MessageSquarePlus />}
                loadingText="Guardando..."
                disableWhenInvalid
              >
                Agregar
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
        paginationMode="none"
        density="xs"
        responsiveMode="scroll"
        emptyTitle="Sin actividad"
      />
    </div>
  );
}
