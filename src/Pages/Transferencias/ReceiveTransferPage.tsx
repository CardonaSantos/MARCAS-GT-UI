import { PackageCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { createIdempotencyKey } from "@/features/common/utils/idempotency";
import { useRegisterTransferReceipt } from "@/features/transferencias/api/transfer.mutations";
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

type ReceiptDraftLine = {
  transferenciaDetalleId: number;
  cantidad: string;
};

export default function ReceiveTransferPage() {
  const params = useParams();
  const id = Number(params.id);
  const location = useLocation();
  const navigate = useNavigate();
  const backTo = getReturnRoute(
    location.state,
    "/marcas-gt/transferencias/" + id,
  );

  const query = useTransfer(id);
  const mutation = useRegisterTransferReceipt();

  const [documentoReferencia, setDocumentoReferencia] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [ocurridaEn, setOcurridaEn] = useState("");
  const [lines, setLines] = useState<ReceiptDraftLine[]>([]);
  const [initializedFor, setInitializedFor] = useState<number | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [key, setKey] = useState("");

  const transfer = query.data;

  useEffect(() => {
    if (!transfer || initializedFor === transfer.id) return;

    setInitializedFor(transfer.id);
    setLines(
      transfer.detalles
        .filter((line) => line.cantidadEnTransito > 0)
        .map((line) => ({
          transferenciaDetalleId: line.id,
          cantidad: String(line.cantidadEnTransito),
        })),
    );
  }, [initializedFor, transfer]);

  const selectedLines = useMemo(
    () =>
      lines.filter((line) => {
        const quantity = Number(line.cantidad);
        return Number.isInteger(quantity) && quantity > 0;
      }),
    [lines],
  );

  const validationError = useMemo(() => {
    if (!transfer) return "Cargando transferencia.";

    if (!["EN_TRANSITO", "RECIBIDA_PARCIAL"].includes(transfer.estado)) {
      return "La transferencia no está habilitada para recepción.";
    }

    if (selectedLines.length === 0) {
      return "Indica al menos una cantidad mayor que cero.";
    }

    for (const line of selectedLines) {
      const source = transfer.detalles.find(
        (item) => item.id === line.transferenciaDetalleId,
      );

      if (!source) {
        return "Hay una línea que ya no pertenece a la transferencia.";
      }

      if (Number(line.cantidad) > source.cantidadEnTransito) {
        return (
          "La cantidad de " +
          source.producto.nombre +
          " supera las " +
          source.cantidadEnTransito +
          " unidades actualmente en tránsito."
        );
      }
    }

    return null;
  }, [selectedLines, transfer]);

  const totalUnits = selectedLines.reduce(
    (total, line) => total + Number(line.cantidad),
    0,
  );

  const patchLine = (detailId: number, quantity: string) => {
    setLines((current) =>
      current.map((line) =>
        line.transferenciaDetalleId === detailId
          ? { ...line, cantidad: quantity }
          : line,
      ),
    );
  };

  const requestReview = () => {
    if (validationError) return;
    setKey(createIdempotencyKey("transfer-receipt"));
    setReviewOpen(true);
  };

  const confirmReceipt = async () => {
    if (validationError) return;

    await mutation.mutateAsync({
      id,
      payload: {
        claveIdempotencia: key,
        documentoReferencia: documentoReferencia.trim() || null,
        observaciones: observaciones.trim() || null,
        ...(ocurridaEn
          ? { ocurridaEn: new Date(ocurridaEn).toISOString() }
          : {}),
        detalles: selectedLines.map((line) => ({
          transferenciaDetalleId: line.transferenciaDetalleId,
          cantidad: Number(line.cantidad),
        })),
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
          title={"Recibir transferencia #" + id}
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
              leftIcon={<PackageCheck />}
              disabled={Boolean(validationError)}
              onClick={requestReview}
            >
              Revisar recepción
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
                title="Esta operación modifica el inventario destino"
                description="Confirma únicamente lo recibido físicamente. El costo no se captura aquí: el server reutiliza el costo histórico exacto registrado en la salida."
              />

              {validationError ? (
                <AppAlert
                  tone="danger"
                  title="No se puede registrar todavía"
                  description={validationError}
                />
              ) : null}

              <AppCard title="Documento de recepción" size="sm">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="transfer-receipt-document"
                      className="mb-1 block text-xs font-medium"
                    >
                      Documento de referencia
                    </label>
                    <AppInput
                      id="transfer-receipt-document"
                      value={documentoReferencia}
                      maxLength={160}
                      onChange={(event) =>
                        setDocumentoReferencia(event.target.value)
                      }
                      placeholder="REC-001, vale, guía..."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="transfer-receipt-date"
                      className="mb-1 block text-xs font-medium"
                    >
                      Fecha y hora de recepción
                    </label>
                    <AppInput
                      id="transfer-receipt-date"
                      type="datetime-local"
                      value={ocurridaEn}
                      onChange={(event) => setOcurridaEn(event.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="transfer-receipt-observations"
                      className="mb-1 block text-xs font-medium"
                    >
                      Observaciones
                    </label>
                    <AppTextarea
                      id="transfer-receipt-observations"
                      rows={3}
                      maxLength={1000}
                      value={observaciones}
                      onChange={(event) =>
                        setObservaciones(event.target.value)
                      }
                      placeholder="Condición de recepción, faltantes visibles, responsable..."
                    />
                  </div>
                </div>
              </AppCard>

              <AppCard
                title="Mercadería recibida"
                description="El sistema propone todo lo que sigue en tránsito. Coloca 0 en una línea si hoy no llegó."
                size="sm"
              >
                <div className="space-y-2">
                  {transfer.detalles.map((source) => {
                    const line = lines.find(
                      (item) =>
                        item.transferenciaDetalleId === source.id,
                    );

                    if (!line) {
                      return (
                        <div
                          key={source.id}
                          className="rounded-md border border-[hsl(var(--app-border))] p-3"
                        >
                          <p className="font-medium">
                            {source.producto.codigo} · {source.producto.nombre}
                          </p>
                          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
                            Completado · {source.cantidadRecibida} de{" "}
                            {source.cantidadEnviada} recibidas
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={source.id}
                        className="grid gap-3 rounded-md border border-[hsl(var(--app-border))] p-3 md:grid-cols-[minmax(240px,1fr)_110px_110px_130px]"
                      >
                        <div>
                          <p className="font-medium">
                            {source.producto.codigo} · {source.producto.nombre}
                          </p>
                          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
                            Enviado {source.cantidadEnviada} · recibido{" "}
                            {source.cantidadRecibida}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                            En tránsito
                          </p>
                          <p className="mt-1 font-semibold">
                            {source.cantidadEnTransito}
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor={"transfer-receipt-qty-" + source.id}
                            className="mb-1 block text-xs font-medium"
                          >
                            Recibir
                          </label>
                          <AppInput
                            id={"transfer-receipt-qty-" + source.id}
                            type="number"
                            min={0}
                            max={source.cantidadEnTransito}
                            step={1}
                            value={line.cantidad}
                            onChange={(event) =>
                              patchLine(source.id, event.target.value)
                            }
                          />
                        </div>

                        <div>
                          <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                            Quedaría en tránsito
                          </p>
                          <p className="mt-1 font-semibold">
                            {Math.max(
                              source.cantidadEnTransito -
                                (Number(line.cantidad) || 0),
                              0,
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 text-right">
                  <p className="font-medium tabular-nums">
                    {totalUnits} unidades a recibir
                  </p>
                </div>
              </AppCard>
            </div>
          ) : null}
        </AppDataState>

        <AppConfirmDialog
          open={reviewOpen}
          onOpenChange={setReviewOpen}
          preset="warning"
          title="Confirmar recepción física"
          description="Las cantidades confirmadas incrementarán el inventario de la bodega destino usando el costo histórico de salida."
          confirmText="Registrar recepción"
          loadingText="Aplicando recepción..."
          isLoading={mutation.isPending}
          confirmDisabled={Boolean(validationError)}
          onConfirm={confirmReceipt}
          contentCard
        >
          {transfer ? (
            <div className="space-y-2 text-sm">
              <p>
                <strong>Destino:</strong> {transfer.bodegaDestino.nombre}
              </p>
              <p>
                <strong>Origen:</strong> {transfer.bodegaOrigen.nombre}
              </p>
              <p>
                <strong>Unidades:</strong> {totalUnits}
              </p>
              <p>
                <strong>Documento:</strong>{" "}
                {documentoReferencia.trim() || "—"}
              </p>
            </div>
          ) : null}
        </AppConfirmDialog>
      </AppStack>
    </AppContainer>
  );
}
