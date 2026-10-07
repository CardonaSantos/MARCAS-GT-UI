import { PackageCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { formatMoney } from "@/features/common/formatters/value.formatters";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { createIdempotencyKey } from "@/features/common/utils/idempotency";
import { useRegisterRequisitionReceipt } from "@/features/requisiciones/api/requisition.mutations";
import { useRequisition } from "@/features/requisiciones/api/requisition.queries";
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
  requisicionDetalleId: number;
  cantidad: string;
  costoUnitario: string;
};

export default function ReceiveRequisitionPage() {
  const params = useParams();
  const id = Number(params.id);
  const location = useLocation();
  const navigate = useNavigate();
  const backTo = getReturnRoute(
    location.state,
    "/marcas-gt/requisiciones/" + id,
  );

  const query = useRequisition(id);
  const mutation = useRegisterRequisitionReceipt();

  const [documentoReferencia, setDocumentoReferencia] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [recibidoEn, setRecibidoEn] = useState("");
  const [lines, setLines] = useState<ReceiptDraftLine[]>([]);
  const [initializedFor, setInitializedFor] = useState<number | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [key, setKey] = useState("");

  const requisition = query.data;

  useEffect(() => {
    if (!requisition || initializedFor === requisition.id) return;

    setInitializedFor(requisition.id);
    setLines(
      requisition.detalles
        .filter((line) => line.cantidadPendiente > 0)
        .map((line) => ({
          requisicionDetalleId: line.id,
          cantidad: String(line.cantidadPendiente),
          costoUnitario: line.costoUnitarioEstimado ?? "",
        })),
    );
  }, [initializedFor, requisition]);

  const selectedLines = useMemo(
    () =>
      lines.filter((line) => {
        const quantity = Number(line.cantidad);
        return Number.isInteger(quantity) && quantity > 0;
      }),
    [lines],
  );

  const validationError = useMemo(() => {
    if (!requisition) return "Cargando requisición.";
    if (!["APROBADA", "PARCIAL"].includes(requisition.estado)) {
      return "La requisición no está habilitada para recibir mercadería.";
    }
    if (!requisition.proveedor) {
      return "La requisición necesita un proveedor activo antes de recibir.";
    }
    if (selectedLines.length === 0) {
      return "Indica al menos una cantidad mayor que cero.";
    }

    for (const line of selectedLines) {
      const source = requisition.detalles.find(
        (item) => item.id === line.requisicionDetalleId,
      );
      if (!source) return "Hay una línea que ya no pertenece a la requisición.";
      if (Number(line.cantidad) > source.cantidadPendiente) {
        return (
          "La cantidad de " +
          source.producto.nombre +
          " supera el pendiente de " +
          source.cantidadPendiente +
          "."
        );
      }
      if (
        !line.costoUnitario.trim() ||
        !Number.isFinite(Number(line.costoUnitario)) ||
        Number(line.costoUnitario) < 0
      ) {
        return "Indica un costo real válido para " + source.producto.nombre + ".";
      }
    }

    return null;
  }, [requisition, selectedLines]);

  const totalUnits = selectedLines.reduce(
    (total, line) => total + Number(line.cantidad),
    0,
  );
  const totalCost = selectedLines.reduce(
    (total, line) =>
      total + Number(line.cantidad) * Number(line.costoUnitario || 0),
    0,
  );

  const patchLine = (detailId: number, patch: Partial<ReceiptDraftLine>) => {
    setLines((current) =>
      current.map((line) =>
        line.requisicionDetalleId === detailId
          ? { ...line, ...patch }
          : line,
      ),
    );
  };

  const requestReview = () => {
    if (validationError) return;
    setKey(createIdempotencyKey("requisition-receipt"));
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
        ...(recibidoEn
          ? { recibidoEn: new Date(recibidoEn).toISOString() }
          : {}),
        detalles: selectedLines.map((line) => ({
          requisicionDetalleId: line.requisicionDetalleId,
          cantidad: Number(line.cantidad),
          costoUnitario: Number(line.costoUnitario).toFixed(4),
        })),
      },
    });

    navigate("/marcas-gt/requisiciones/" + id + "?tab=recepciones", {
      replace: true,
      state: { from: backTo },
    });
  };

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title={"Registrar recepción · Requisición #" + id}
          description={
            requisition
              ? requisition.proveedor?.nombre +
                " · destino " +
                requisition.bodega.nombre
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
          isEmpty={!query.isLoading && !requisition}
          emptyTitle="Requisición no encontrada"
        >
          {requisition ? (
            <div className="space-y-4">
              <AppAlert
                tone="warning"
                title="Esta operación modifica inventario"
                description="Sólo confirma cantidades que hayan llegado físicamente. Cada línea aplicada registrará una entrada real en la bodega destino."
              />

              {validationError ? (
                <AppAlert tone="danger" title="No se puede registrar todavía" description={validationError} />
              ) : null}

              <AppCard title="Documento y recepción" size="sm">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label htmlFor="receipt-document" className="mb-1 block text-xs font-medium">
                      Documento de referencia
                    </label>
                    <AppInput
                      id="receipt-document"
                      value={documentoReferencia}
                      maxLength={160}
                      onChange={(event) => setDocumentoReferencia(event.target.value)}
                      placeholder="Factura, nota de envío, boleta..."
                    />
                  </div>
                  <div>
                    <label htmlFor="receipt-date" className="mb-1 block text-xs font-medium">
                      Fecha y hora de recepción
                    </label>
                    <AppInput
                      id="receipt-date"
                      type="datetime-local"
                      value={recibidoEn}
                      onChange={(event) => setRecibidoEn(event.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="receipt-observations" className="mb-1 block text-xs font-medium">
                      Observaciones
                    </label>
                    <AppTextarea
                      id="receipt-observations"
                      rows={3}
                      maxLength={1000}
                      value={observaciones}
                      onChange={(event) => setObservaciones(event.target.value)}
                    />
                  </div>
                </div>
              </AppCard>

              <AppCard
                title="Mercadería recibida"
                description="El sistema propone recibir todo lo pendiente. Coloca 0 en una línea si hoy no llegó."
                size="sm"
              >
                <div className="space-y-2">
                  {requisition.detalles.map((source) => {
                    const line = lines.find(
                      (item) => item.requisicionDetalleId === source.id,
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
                            Completado · {source.cantidadRecibida} de {source.cantidadSolicitada}
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={source.id}
                        className="grid gap-3 rounded-md border border-[hsl(var(--app-border))] p-3 md:grid-cols-[minmax(220px,1fr)_110px_110px_140px_160px]"
                      >
                        <div>
                          <p className="font-medium">
                            {source.producto.codigo} · {source.producto.nombre}
                          </p>
                          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
                            Solicitado {source.cantidadSolicitada} · recibido {source.cantidadRecibida}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[hsl(var(--app-muted-foreground))]">Pendiente</p>
                          <p className="mt-1 font-semibold">{source.cantidadPendiente}</p>
                        </div>
                        <div>
                          <label htmlFor={"receipt-qty-" + source.id} className="mb-1 block text-xs font-medium">
                            Recibir
                          </label>
                          <AppInput
                            id={"receipt-qty-" + source.id}
                            type="number"
                            min={0}
                            max={source.cantidadPendiente}
                            step={1}
                            value={line.cantidad}
                            onChange={(event) =>
                              patchLine(source.id, { cantidad: event.target.value })
                            }
                          />
                        </div>
                        <div>
                          <p className="text-xs text-[hsl(var(--app-muted-foreground))]">Costo estimado</p>
                          <p className="mt-2 font-medium">
                            {source.costoUnitarioEstimado
                              ? formatMoney(source.costoUnitarioEstimado)
                              : "—"}
                          </p>
                        </div>
                        <div>
                          <label htmlFor={"receipt-cost-" + source.id} className="mb-1 block text-xs font-medium">
                            Costo real *
                          </label>
                          <AppInput
                            id={"receipt-cost-" + source.id}
                            type="number"
                            min={0}
                            step="0.0001"
                            value={line.costoUnitario}
                            onChange={(event) =>
                              patchLine(source.id, {
                                costoUnitario: event.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex justify-end text-right">
                  <div>
                    <p className="font-medium">{totalUnits} unidades</p>
                    <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                      Costo recibido {formatMoney(totalCost)}
                    </p>
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
          title="Confirmar recepción física"
          description="Esta acción incrementará el inventario de la bodega destino. Revisa documento, cantidades y costos reales."
          confirmText="Registrar recepción"
          loadingText="Aplicando inventario..."
          isLoading={mutation.isPending}
          confirmDisabled={Boolean(validationError)}
          onConfirm={confirmReceipt}
          contentCard
        >
          {requisition ? (
            <div className="space-y-2 text-sm">
              <p><strong>Requisición:</strong> #{requisition.id}</p>
              <p><strong>Bodega:</strong> {requisition.bodega.nombre}</p>
              <p><strong>Proveedor:</strong> {requisition.proveedor?.nombre ?? "—"}</p>
              <p><strong>Unidades:</strong> {totalUnits}</p>
              <p><strong>Costo real:</strong> {formatMoney(totalCost)}</p>
              <p><strong>Documento:</strong> {documentoReferencia.trim() || "—"}</p>
            </div>
          ) : null}
        </AppConfirmDialog>
      </AppStack>
    </AppContainer>
  );
}
