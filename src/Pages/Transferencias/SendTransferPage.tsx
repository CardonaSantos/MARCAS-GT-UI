import { Send } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { createIdempotencyKey } from "@/features/common/utils/idempotency";
import { useRegisterTransferOutbound } from "@/features/transferencias/api/transfer.mutations";
import { useTransfer } from "@/features/transferencias/api/transfer.queries";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppInput } from "@/ui/components/app/primitives/app-input";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppTextarea } from "@/ui/components/app/primitives/app-textarea";

export default function SendTransferPage() {
  const params = useParams();
  const id = Number(params.id);
  const location = useLocation();
  const navigate = useNavigate();
  const backTo = getReturnRoute(
    location.state,
    "/marcas-gt/transferencias/" + id,
  );

  const query = useTransfer(id);
  const mutation = useRegisterTransferOutbound();

  const [documentoReferencia, setDocumentoReferencia] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [ocurridaEn, setOcurridaEn] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [key, setKey] = useState("");

  const transfer = query.data;
  const canSend = transfer?.estado === "PREPARADA";

  const requestReview = () => {
    if (!canSend) return;
    setKey(createIdempotencyKey("transfer-outbound"));
    setReviewOpen(true);
  };

  const confirmSend = async () => {
    if (!canSend) return;

    await mutation.mutateAsync({
      id,
      payload: {
        claveIdempotencia: key,
        documentoReferencia: documentoReferencia.trim() || null,
        observaciones: observaciones.trim() || null,
        ...(ocurridaEn
          ? { ocurridaEn: new Date(ocurridaEn).toISOString() }
          : {}),
      },
    });

    navigate("/marcas-gt/transferencias/" + id + "?tab=operaciones", {
      replace: true,
      state: { from: backTo },
    });
  };

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title={"Registrar salida · Transferencia #" + id}
          description={
            transfer
              ? transfer.bodegaOrigen.nombre +
                " → " +
                transfer.bodegaDestino.nombre
              : undefined
          }
          backTo={backTo}
          backLabel="Volver al detalle"
          actions={
            <AppButton
              type="button"
              variant="primary"
              size="sm"
              leftIcon={<Send />}
              disabled={!canSend}
              onClick={requestReview}
            >
              Revisar salida
            </AppButton>
          }
        />

        <AppDataState
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !transfer}
          emptyTitle="Transferencia no encontrada"
        >
          {transfer ? (
            <div className="space-y-4">
              <AppAlert
                tone="warning"
                title=""
                description="Al confirmar, el inventario disminuirá en la bodega origen; bodega destino a la espera de recepción."
              />

              {!canSend ? (
                <AppAlert
                  tone="danger"
                  title="Salida no disponible"
                  description="La transferencia debe estar PREPARADA antes de registrar la salida física."
                />
              ) : null}

              <AppCard title="Mercadería que saldrá" size="sm">
                <div className="space-y-2">
                  {transfer.detalles.map((line) => (
                    <div
                      key={line.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[hsl(var(--app-border))] p-3"
                    >
                      <div>
                        <p className="font-medium">
                          {line.producto.codigo} · {line.producto.nombre}
                        </p>
                        {line.observaciones ? (
                          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
                            {line.observaciones}
                          </p>
                        ) : null}
                      </div>
                      <p className="font-semibold tabular-nums">
                        {line.cantidadSolicitada} unidades
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-right text-sm font-medium">
                  Total {transfer.progreso.unidadesSolicitadas} unidades
                </div>
              </AppCard>

              <AppCard title="Documento de salida" size="sm">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="transfer-out-document"
                      className="mb-1 block text-xs font-medium"
                    >
                      Documento de referencia
                    </label>
                    <AppInput
                      id="transfer-out-document"
                      value={documentoReferencia}
                      maxLength={160}
                      onChange={(event) =>
                        setDocumentoReferencia(event.target.value)
                      }
                      placeholder="TRAS-001, vale, guía..."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="transfer-out-date"
                      className="mb-1 block text-xs font-medium"
                    >
                      Fecha y hora de salida
                    </label>
                    <AppInput
                      id="transfer-out-date"
                      type="datetime-local"
                      value={ocurridaEn}
                      onChange={(event) => setOcurridaEn(event.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="transfer-out-observations"
                      className="mb-1 block text-xs font-medium"
                    >
                      Observaciones
                    </label>
                    <AppTextarea
                      id="transfer-out-observations"
                      rows={3}
                      maxLength={1000}
                      value={observaciones}
                      onChange={(event) => setObservaciones(event.target.value)}
                      placeholder="Condición de salida, vehículo interno, responsable..."
                    />
                  </div>
                </div>
              </AppCard>
            </div>
          ) : null}
        </AppDataState>

        <AppConfirmDialog
          open={reviewOpen}
          onOpenChange={setReviewOpen}
          preset="warning"
          title="Confirmar salida física"
          description="Esta operación disminuirá inmediatamente las existencias de la bodega origen. No incrementará el destino hasta registrar la recepción."
          confirmText="Registrar salida"
          loadingText="Aplicando salida..."
          isLoading={mutation.isPending}
          confirmDisabled={!canSend}
          onConfirm={confirmSend}
          contentCard
        >
          {transfer ? (
            <div className="space-y-2 text-sm">
              <p>
                <strong>Origen:</strong> {transfer.bodegaOrigen.nombre}
              </p>
              <p>
                <strong>Destino:</strong> {transfer.bodegaDestino.nombre}
              </p>
              <p>
                <strong>Productos:</strong> {transfer.detalles.length}
              </p>
              <p>
                <strong>Unidades:</strong>{" "}
                {transfer.progreso.unidadesSolicitadas}
              </p>
              <p>
                <strong>Documento:</strong> {documentoReferencia.trim() || "—"}
              </p>
            </div>
          ) : null}
        </AppConfirmDialog>
      </AppStack>
    </AppContainer>
  );
}
