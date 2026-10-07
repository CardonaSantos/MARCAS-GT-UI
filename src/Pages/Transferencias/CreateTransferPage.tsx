import { Save } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useBodegaSelectables } from "@/features/bodegas/api/bodega.queries";
import { useProductSelectables } from "@/features/common/catalogs/catalog.queries";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useCreateTransfer } from "@/features/transferencias/api/transfer.mutations";
import type { TransferDraft } from "@/features/transferencias/api/transfer.types";
import {
  toTransferPayload,
  validateTransferDraft,
} from "@/features/transferencias/common/transfer.mappers";
import {
  newTransferDraft,
  TransferForm,
} from "@/features/transferencias/components/transfer-form";
import type { TransferAvailabilityStatus } from "@/features/transferencias/components/transfer-form";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function CreateTransferPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const backTo = getReturnRoute(location.state, "/marcas-gt/transferencias");

  const [draft, setDraft] = useState<TransferDraft>(() => newTransferDraft());
  const [reviewOpen, setReviewOpen] = useState(false);
  const [availability, setAvailability] = useState<Record<string, number | null>>({});
  const onAvailabilityChange = useCallback((status: TransferAvailabilityStatus) => {
    const lookup = `${status.bodegaOrigenId}:${status.productoId}`;
    setAvailability((previous) =>
      Object.prototype.hasOwnProperty.call(previous, lookup) && previous[lookup] === status.disponible
        ? previous
        : { ...previous, [lookup]: status.disponible },
    );
  }, []);

  const bodegasQuery = useBodegaSelectables({ limit: 100 });
  const productsQuery = useProductSelectables();
  const mutation = useCreateTransfer();

  const errors = useMemo(() => validateTransferDraft(draft), [draft]);
  const availabilityError = draft.detalles.some((line) => {
    if (!draft.bodegaOrigenId || !line.productoId) return false;
    const available = availability[`${draft.bodegaOrigenId}:${line.productoId}`];
    return available == null || Number(line.cantidadSolicitada) > available;
  });
  const canReview = errors.length === 0 && !availabilityError;

  const origin = bodegasQuery.data?.find(
    (item) => item.id === draft.bodegaOrigenId,
  );
  const destination = bodegasQuery.data?.find(
    (item) => item.id === draft.bodegaDestinoId,
  );

  const confirmCreate = async () => {
    const created = await mutation.mutateAsync(toTransferPayload(draft));
    navigate("/marcas-gt/transferencias/" + created.id, {
      replace: true,
      state: { from: backTo },
    });
  };

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Nueva transferencia"
          description="Crea un borrador de traslado interno. Guardarlo todavía no reserva ni mueve inventario."
          backTo={backTo}
          backLabel="Volver a transferencias"
          actions={
            <AppButton
              type="button"
              variant="primary"
              size="sm"
              leftIcon={<Save />}
              disabled={!canReview}
              onClick={() => setReviewOpen(true)}
            >
              Revisar y guardar
            </AppButton>
          }
        />

        {errors.length > 0 ? (
          <AppAlert
            tone="warning"
            title="Completa los datos mínimos"
            description={errors[0]}
          />
        ) : null}

        <TransferForm
          value={draft}
          onAvailabilityChange={onAvailabilityChange}
          bodegas={bodegasQuery.data ?? []}
          productos={productsQuery.data ?? []}
          onChange={setDraft}
          disabled={mutation.isPending}
        />

        <AppConfirmDialog
          open={reviewOpen}
          onOpenChange={setReviewOpen}
          preset="send"
          title="Guardar transferencia en borrador"
          description="Revisa la ruta y las cantidades. Guardar el borrador todavía no modifica existencias."
          confirmText="Guardar borrador"
          loadingText="Guardando..."
          isLoading={mutation.isPending}
          confirmDisabled={!canReview}
          onConfirm={confirmCreate}
          contentCard
        >
          <div className="space-y-2 text-sm">
            <p>
              <strong>Origen:</strong> {origin?.nombre ?? "—"}
            </p>
            <p>
              <strong>Destino:</strong> {destination?.nombre ?? "—"}
            </p>
            <p>
              <strong>Productos:</strong> {draft.detalles.length}
            </p>
            <p>
              <strong>Unidades:</strong>{" "}
              {draft.detalles.reduce(
                (total, line) =>
                  total + (Number(line.cantidadSolicitada) || 0),
                0,
              )}
            </p>
          </div>
        </AppConfirmDialog>
      </AppStack>
    </AppContainer>
  );
}
