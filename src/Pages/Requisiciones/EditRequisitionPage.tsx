import { Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useBodegaSelectables } from "@/features/bodegas/api/bodega.queries";
import {
  useProductSelectables,
  useProviderSelectables,
} from "@/features/common/catalogs/catalog.queries";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useUpdateRequisition } from "@/features/requisiciones/api/requisition.mutations";
import { useRequisition } from "@/features/requisiciones/api/requisition.queries";
import type { RequisitionDraft } from "@/features/requisiciones/api/requisition.types";
import {
  requisitionDetailToDraft,
  toRequisitionPayload,
  validateRequisitionDraft,
} from "@/features/requisiciones/common/requisition.mappers";
import { RequisitionForm } from "@/features/requisiciones/components/requisition-form";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function EditRequisitionPage() {
  const params = useParams();
  const id = Number(params.id);
  const location = useLocation();
  const navigate = useNavigate();
  const backTo = getReturnRoute(
    location.state,
    "/marcas-gt/requisiciones/" + id,
  );

  const query = useRequisition(id);
  const bodegasQuery = useBodegaSelectables({ limit: 100 });
  const providersQuery = useProviderSelectables();
  const productsQuery = useProductSelectables();
  const mutation = useUpdateRequisition();

  const [draft, setDraft] = useState<RequisitionDraft | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  useEffect(() => {
    if (query.data && !draft) {
      setDraft(requisitionDetailToDraft(query.data));
    }
  }, [query.data, draft]);

  const errors = useMemo(
    () => (draft ? validateRequisitionDraft(draft) : ["Cargando..."]),
    [draft],
  );

  const confirmUpdate = async () => {
    if (!draft) return;
    await mutation.mutateAsync({
      id,
      payload: toRequisitionPayload(draft),
    });
    navigate("/marcas-gt/requisiciones/" + id, {
      replace: true,
      state: { from: backTo },
    });
  };

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title={"Editar requisición #" + id}
          description="Sólo los borradores pueden modificarse. Al solicitar aprobación las líneas quedan congeladas."
          backTo={backTo}
          backLabel="Volver al detalle"
          actions={
            <AppButton
              type="button"
              variant="primary"
              size="sm"
              leftIcon={<Save />}
              disabled={!draft || errors.length > 0 || query.data?.estado !== "BORRADOR"}
              onClick={() => setReviewOpen(true)}
            >
              Revisar cambios
            </AppButton>
          }
        />

        <AppDataState
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !query.data}
          emptyTitle="Requisición no encontrada"
        >
          {query.data && draft ? (
            <>
              {query.data.estado !== "BORRADOR" ? (
                <AppAlert
                  tone="warning"
                  title="Edición bloqueada"
                  description="Esta requisición ya salió de BORRADOR y el server no permite reemplazar sus líneas."
                />
              ) : null}

              <RequisitionForm
                value={draft}
                bodegas={bodegasQuery.data ?? []}
                proveedores={providersQuery.data ?? []}
                productos={productsQuery.data ?? []}
                onChange={setDraft}
                disabled={mutation.isPending || query.data.estado !== "BORRADOR"}
              />
            </>
          ) : null}
        </AppDataState>

        <AppConfirmDialog
          open={reviewOpen}
          onOpenChange={setReviewOpen}
          preset="warning"
          title="Confirmar cambios"
          description="La requisición seguirá en BORRADOR después de guardar. Verifica cantidades, bodega y proveedor."
          confirmText="Guardar cambios"
          loadingText="Guardando..."
          isLoading={mutation.isPending}
          confirmDisabled={!draft || errors.length > 0}
          onConfirm={confirmUpdate}
          contentCard
        >
          {draft ? (
            <div className="space-y-2 text-sm">
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
          ) : null}
        </AppConfirmDialog>
      </AppStack>
    </AppContainer>
  );
}
