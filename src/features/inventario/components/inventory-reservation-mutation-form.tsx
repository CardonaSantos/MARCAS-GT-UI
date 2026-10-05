import { zodResolver } from "@hookform/resolvers/zod";
import { PackageCheck, PackageMinus } from "lucide-react";
import { useForm } from "react-hook-form";

import { useIdempotencyKey } from "@/features/common/utils/idempotency";
import {
  AppForm,
  AppFormInput,
  AppFormSubmit,
  AppFormTextarea,
} from "@/ui/components/app/form";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

import type {
  InventoryReservation,
  ReservationMutationPayload,
} from "../api/inventory.types";
import { toReservationMutationPayload } from "../common/inventory.mappers";
import {
  reservationMutationSchema,
  type ReservationMutationFormValues,
} from "../schemas/inventory.schemas";
import { InventoryReferenceFields } from "./inventory-reference-fields";

interface InventoryReservationMutationFormProps {
  reservation: InventoryReservation;
  mode: "apply" | "release";
  onSubmit: (payload: ReservationMutationPayload) => Promise<void>;
}

export function InventoryReservationMutationForm({
  reservation,
  mode,
  onSubmit,
}: InventoryReservationMutationFormProps) {
  const key = useIdempotencyKey(
    `inventory-reservation-${mode}-${reservation.id}`,
  );

  const form = useForm<ReservationMutationFormValues>({
    resolver: zodResolver(reservationMutationSchema),
    defaultValues: {
      cantidad: String(reservation.cantidadPendiente),
      observaciones: "",
      referenciaTipo: "",
      referenciaId: "",
    },
    mode: "onTouched",
  });

  const submit = async (values: ReservationMutationFormValues) => {
    const cantidad = Number(values.cantidad);

    if (cantidad > reservation.cantidadPendiente) {
      form.setError("cantidad", {
        type: "validate",
        message:
          "No puedes superar la cantidad pendiente de la reserva (" +
          reservation.cantidadPendiente +
          ").",
      });
      return;
    }

    await onSubmit(toReservationMutationPayload(values, key));
  };

  const isApply = mode === "apply";

  return (
    <AppForm form={form} onSubmit={submit}>
      <AppStack gap="md">
        <AppCard
          title={isApply ? "Aplicar reserva" : "Liberar reserva"}
          description={
            isApply
              ? "La cantidad aplicada saldrá del inventario reservado."
              : "La cantidad liberada volverá a estar disponible."
          }
          icon={isApply ? <PackageCheck /> : <PackageMinus />}
          size="sm"
        >
          <AppStack gap="md">
            <AppFormInput<ReservationMutationFormValues>
              name="cantidad"
              label="Cantidad"
              description={
                "Pendiente actual: " + reservation.cantidadPendiente
              }
              type="number"
              min={1}
              max={reservation.cantidadPendiente}
              inputMode="numeric"
              required
            />

            <AppFormTextarea<ReservationMutationFormValues>
              name="observaciones"
              label="Observaciones"
              placeholder="Información adicional de la operación."
              maxLength={500}
              rows={4}
            />
          </AppStack>
        </AppCard>

        <AppCard
          title="Referencia"
          description="Opcional. Si no se indica, el backend utilizará el detalle de pedido de la reserva."
          size="sm"
        >
          <InventoryReferenceFields<ReservationMutationFormValues> />
        </AppCard>

        <div className="flex justify-end">
          <AppFormSubmit<ReservationMutationFormValues>
            variant={isApply ? "primary" : "secondary"}
            leftIcon={isApply ? <PackageCheck /> : <PackageMinus />}
            loadingText="Procesando..."
            disableWhenInvalid
          >
            {isApply ? "Aplicar reserva" : "Liberar reserva"}
          </AppFormSubmit>
        </div>
      </AppStack>
    </AppForm>
  );
}
