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

import { useAddDeliveryObservation } from "../api/delivery.mutations";
import { useDeliveryEvents } from "../api/delivery.queries";
import type { DeliveryEvent } from "../api/delivery.types";
import {
  deliveryObservationSchema,
  type DeliveryObservationFormValues,
} from "../schemas/delivery.schemas";

export function DeliveryActivity({
  deliveryId,
  canAddObservation,
}: {
  deliveryId: number;
  canAddObservation: boolean;
}) {
  const query = useDeliveryEvents(deliveryId, { page: 1, limit: 50 });
  const mutation = useAddDeliveryObservation();

  const form = useForm<DeliveryObservationFormValues>({
    resolver: zodResolver(deliveryObservationSchema),
    defaultValues: { detalle: "" },
    mode: "onTouched",
  });

  const columns: ColumnDef<DeliveryEvent, unknown>[] = [
    {
      accessorKey: "tipo",
      header: "Evento",
      size: 180,
      cell: ({ row }) => String(row.original.tipo).replace(/_+/g, " "),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 135,
      cell: ({ row }) => row.original.estado.replace(/_+/g, " "),
    },
    {
      accessorKey: "detalle",
      header: "Detalle",
      size: 340,
      meta: { grow: true },
      cell: ({ row }) => row.original.detalle ?? "—",
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

  const onSubmit = async (values: DeliveryObservationFormValues) => {
    await mutation.mutateAsync({
      id: deliveryId,
      payload: {
        detalle: values.detalle.trim(),
        claveIdempotencia: createIdempotencyKey("delivery-observation"),
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
              <AppFormTextarea<DeliveryObservationFormValues>
                name="detalle"
                label="Detalle"
                rows={2}
                maxLength={1000}
              />
              <AppFormSubmit<DeliveryObservationFormValues>
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
