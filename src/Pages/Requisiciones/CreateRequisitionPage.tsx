import { Save } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useBodegaSelectables } from "@/features/bodegas/api/bodega.queries";
import {
  useProductSelectables,
  useProviderSelectables,
} from "@/features/common/catalogs/catalog.queries";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useCreateRequisition } from "@/features/requisiciones/api/requisition.mutations";
import type { RequisitionDraft } from "@/features/requisiciones/api/requisition.types";
import {
  toRequisitionPayload,
  validateRequisitionDraft,
} from "@/features/requisiciones/common/requisition.mappers";
import {
  newRequisitionDraft,
  RequisitionForm,
} from "@/features/requisiciones/components/requisition-form";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function CreateRequisitionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const backTo = getReturnRoute(location.state, "/marcas-gt/requisiciones");

  const [draft, setDraft] = useState<RequisitionDraft>(() =>
    newRequisitionDraft(),
  );
  const [reviewOpen, setReviewOpen] = useState(false);

  const bodegasQuery = useBodegaSelectables({ limit: 100 });
  const providersQuery = useProviderSelectables();
  const productsQuery = useProductSelectables();
  const mutation = useCreateRequisition();

  const errors = useMemo(() => validateRequisitionDraft(draft), [draft]);
  const canReview = errors.length === 0;

  const confirmCreate = async () => {
    const created = await mutation.mutateAsync(toRequisitionPayload(draft));
    navigate("/marcas-gt/requisiciones/" + created.id, {
      replace: true,
      state: { from: backTo },
    });
  };

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Nueva requisición"
          description="Crea un borrador de abastecimiento. Guardarlo todavía no aprueba compras ni modifica inventario."
          backTo={backTo}
          backLabel="Volver a requisiciones"
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

        <RequisitionForm
          value={draft}
          bodegas={bodegasQuery.data ?? []}
          proveedores={providersQuery.data ?? []}
          productos={productsQuery.data ?? []}
          onChange={setDraft}
          disabled={mutation.isPending}
        />

        <AppConfirmDialog
          open={reviewOpen}
          onOpenChange={setReviewOpen}
          preset="send"
          title="Guardar requisición en borrador"
          description="Revisa los datos antes de crearla. Podrás editarla mientras permanezca en BORRADOR."
          confirmText="Guardar borrador"
          loadingText="Guardando..."
          isLoading={mutation.isPending}
          confirmDisabled={!canReview}
          onConfirm={confirmCreate}
          contentCard
        >
          <div className="space-y-2 text-sm">
            <p>
              <strong>Bodega:</strong>{" "}
              {bodegasQuery.data?.find(
                (item) => item.id === draft.bodegaDestinoId,
              )?.nombre ?? "—"}
            </p>
            <p>
              <strong>Proveedor:</strong>{" "}
              {providersQuery.data?.find(
                (item) => item.id === draft.proveedorId,
              )?.nombre ?? "Pendiente"}
            </p>
            <p>
              <strong>Productos:</strong> {draft.detalles.length}
            </p>
            <p>
              <strong>Unidades:</strong>{" "}
              {draft.detalles.reduce(
                (total, line) => total + (Number(line.cantidadSolicitada) || 0),
                0,
              )}
            </p>
          </div>
        </AppConfirmDialog>
      </AppStack>
    </AppContainer>
  );
}
