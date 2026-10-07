import { Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useBodegaSelectables } from "@/features/bodegas/api/bodega.queries";
import { useProductSelectables } from "@/features/common/catalogs/catalog.queries";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useUpdateTransfer } from "@/features/transferencias/api/transfer.mutations";
import { useTransfer } from "@/features/transferencias/api/transfer.queries";
import type { TransferDraft } from "@/features/transferencias/api/transfer.types";
import {
  toTransferPayload,
  transferDetailToDraft,
  validateTransferDraft,
} from "@/features/transferencias/common/transfer.mappers";
import { TransferForm } from "@/features/transferencias/components/transfer-form";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function EditTransferPage() {
  const params = useParams();
  const id = Number(params.id);
  const location = useLocation();
  const navigate = useNavigate();
  const backTo = getReturnRoute(
    location.state,
    "/marcas-gt/transferencias/" + id,
  );

  const query = useTransfer(id);
  const bodegasQuery = useBodegaSelectables({ limit: 100 });
  const productsQuery = useProductSelectables();
  const mutation = useUpdateTransfer();

  const [draft, setDraft] = useState<TransferDraft | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  useEffect(() => {
    if (query.data && !draft) {
      setDraft(transferDetailToDraft(query.data));
    }
  }, [query.data, draft]);

  const errors = useMemo(
    () => (draft ? validateTransferDraft(draft) : ["Cargando..."]),
    [draft],
  );

  const confirmUpdate = async () => {
    if (!draft) return;

    await mutation.mutateAsync({
      id,
      payload: toTransferPayload(draft),
    });

    navigate("/marcas-gt/transferencias/" + id, {
      replace: true,
      state: { from: backTo },
    });
  };

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title={"Editar transferencia #" + id}
          description="Sólo los borradores pueden modificar ruta, productos y cantidades."
          backTo={backTo}
          backLabel="Volver al detalle"
          actions={
            <AppButton
              type="button"
              variant="primary"
              size="sm"
              leftIcon={<Save />}
              disabled={
                !draft ||
                errors.length > 0 ||
                query.data?.estado !== "BORRADOR"
              }
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
          emptyTitle="Transferencia no encontrada"
        >
          {query.data && draft ? (
            <>
              {query.data.estado !== "BORRADOR" ? (
                <AppAlert
                  tone="warning"
                  title="Edición bloqueada"
                  description="La transferencia ya salió de BORRADOR. El server conserva las líneas para proteger la historia física."
                />
              ) : null}

              <TransferForm
                value={draft}
                bodegas={bodegasQuery.data ?? []}
                productos={productsQuery.data ?? []}
                onChange={setDraft}
                disabled={
                  mutation.isPending || query.data.estado !== "BORRADOR"
                }
              />
            </>
          ) : null}
        </AppDataState>

        <AppConfirmDialog
          open={reviewOpen}
          onOpenChange={setReviewOpen}
          preset="warning"
          title="Confirmar cambios"
          description="La transferencia seguirá en BORRADOR. Revisa la ruta y cantidades antes de guardar."
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
                  (total, line) =>
                    total + (Number(line.cantidadSolicitada) || 0),
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
