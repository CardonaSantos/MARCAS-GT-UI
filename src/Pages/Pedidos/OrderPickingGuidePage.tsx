import { pdf, PDFViewer } from "@react-pdf/renderer";
import { Download, FileText, Printer, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { toast } from "sonner";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { formatDateTime, formatMoney } from "@/features/common/formatters/value.formatters";
import { useOrder } from "@/features/pedidos/api/order.queries";
import { ORDER_PAYMENT_CONDITION_LABELS, ORDER_STATE_LABELS } from "@/features/pedidos/common/order.constants";
import { OrderPickingPdfDocument, type PickingPaperFormat } from "@/features/pedidos/components/order-picking-pdf-document";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function OrderPickingGuidePage() {
  const params = useParams();
  const location = useLocation();
  const id = Number(params.id);
  const validId = Number.isSafeInteger(id) && id > 0;
  const backTo = getReturnRoute(location.state, "/marcas-gt/pedidos/" + id);
  const query = useOrder(id);
  const order = query.data;
  const [format, setFormat] = useState<PickingPaperFormat>("A4");
  const [includeAmounts, setIncludeAmounts] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const fileName = "Guia_pedido_" + String(order?.numero ?? id).replace(/[^A-Za-z0-9_-]/g, "_") +
    (format === "A4" ? "_A4.pdf" : "_Carta.pdf");

  const buildPdf = async () => {
    if (!order || order.detalles.length === 0) throw new Error("El pedido no tiene productos para imprimir.");
    return pdf(<OrderPickingPdfDocument order={order} format={format} includeAmounts={includeAmounts} />).toBlob();
  };

  const downloadBlob = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const onDownload = async () => {
    if (working) return;
    setWorking(true);
    try {
      downloadBlob(await buildPdf());
      toast.success("Guía descargada en PDF.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo descargar el PDF.");
    } finally {
      setWorking(false);
    }
  };

  const onPrint = async () => {
    if (working || !order || !order.detalles.length) return;
    // La pestaña se abre directamente con el clic para evitar bloqueos del navegador.
    const tab = window.open("", "_blank");
    if (!tab) {
      toast.error("El navegador bloqueó la ventana. Descarga el PDF para imprimir.");
      return;
    }
    tab.opener = null;
    tab.document.title = "Preparando guía";
    tab.document.body.textContent = "Preparando PDF…";
    setWorking(true);
    try {
      const url = URL.createObjectURL(await buildPdf());
      tab.location.href = url;
      tab.focus();
      toast.info("Utiliza la opción Imprimir del visor PDF.");
      window.setTimeout(() => URL.revokeObjectURL(url), 5 * 60_000);
    } catch (error) {
      tab.close();
      toast.error(error instanceof Error ? error.message : "No se pudo abrir el PDF.");
    } finally {
      setWorking(false);
    }
  };

  const onShare = async () => {
    if (working || !order) return;
    setWorking(true);
    try {
      const blob = await buildPdf();
      const file = new File([blob], fileName, { type: "application/pdf" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ title: "Guía de pedido " + order.numero, files: [file] });
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") return;
          downloadBlob(blob);
          toast.info("No se pudo compartir. Se descargó el PDF.");
        }
      } else {
        downloadBlob(blob);
        toast.info("Tu dispositivo no permite compartir archivos; se descargó el PDF.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo preparar el PDF.");
    } finally {
      setWorking(false);
    }
  };

  const blocked = order && ["BORRADOR", "PENDIENTE_VALIDACION", "CANCELADO"].includes(order.estado);
  const canExport = Boolean(order && order.detalles.length > 0 && !working);

  return <AppContainer size="full" paddingX="none">
    <AppStack gap="lg">
      <FeaturePageHeader
        title={order ? "Guía de preparación · " + order.numero : "Guía de preparación"}
        description="Revisa los productos y cantidades antes de su salida de bodega."
        backTo={backTo}
        backLabel="Volver al pedido"
      />
      <AppDataState
        isLoading={validId && query.isLoading}
        isFetching={query.isFetching}
        error={validId ? query.error : new Error("Número de pedido inválido.")}
        onRetry={() => void query.refetch()}
        isEmpty={validId && !query.isLoading && !order}
        emptyTitle="Pedido no encontrado"
      >
        {order ? <AppStack gap="md">
          <AppAlert tone={blocked ? "warning" : "info"}
            title={blocked ? "Pedido no autorizado para preparación" : "Guía interna de bodega"}
            description={blocked
              ? "El pedido está " + ORDER_STATE_LABELS[order.estado].toLowerCase() + ". El documento no autoriza retirar mercancía."
              : "Esta guía permite verificar productos y cantidades. La salida real se registra en Despachos."}
          />
          <AppCard title="Formato de impresión" size="sm">
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Formato del documento">
              <AppButton size="sm" variant={format === "A4" ? "primary" : "secondary"}
                aria-pressed={format === "A4"} onClick={() => setFormat("A4")}>
                <FileText className="h-4 w-4" /> A4
              </AppButton>
              <AppButton size="sm" variant={format === "LETTER" ? "primary" : "secondary"}
                aria-pressed={format === "LETTER"} onClick={() => setFormat("LETTER")}>
                <FileText className="h-4 w-4" /> Carta
              </AppButton>
              <label className="ml-2 inline-flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" checked={includeAmounts}
                  onChange={(event) => setIncludeAmounts(event.target.checked)}
                  className="h-4 w-4 accent-emerald-600" />
                Incluir precios e importes
              </label>
            </div>
            <p className="mt-3 text-xs text-[hsl(var(--app-muted-foreground))]">
              Los precios están ocultos inicialmente para facilitar la revisión en bodega.
            </p>
          </AppCard>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Acciones del documento">
            <AppButton variant="primary" disabled={!canExport} loading={working}
              leftIcon={<Printer />} onClick={() => void onPrint()}>Abrir para imprimir</AppButton>
            <AppButton variant="secondary" disabled={!canExport} leftIcon={<Download />}
              onClick={() => void onDownload()}>Descargar PDF</AppButton>
            <AppButton variant="secondary" disabled={!canExport} leftIcon={<Share2 />}
              onClick={() => void onShare()}>Compartir PDF</AppButton>
            <AppButton asChild variant="ghost">
              <Link to={"/marcas-gt/pedidos/" + id}>Ver pedido</Link>
            </AppButton>
          </div>
          <AppCard title="Vista previa del documento" size="sm">
            {desktop ? (
              <div className="overflow-hidden rounded-md border border-[hsl(var(--app-border))] bg-[hsl(var(--app-muted))] p-2">
                <PDFViewer width="100%" height={770} showToolbar={false}
                  key={order.id + "-" + format + "-" + String(includeAmounts)}>
                  <OrderPickingPdfDocument order={order} format={format} includeAmounts={includeAmounts} />
                </PDFViewer>
              </div>
            ) : (
              <div className="mx-auto max-w-xl rounded-md border border-slate-200 bg-white p-4 text-slate-900">
                <p className="text-xs font-bold tracking-wide text-emerald-800">MARCAS GT</p>
                <h2 className="mt-2 text-lg font-bold">Guía de preparación</h2>
                <p className="text-sm font-semibold">{order.numero} · {ORDER_STATE_LABELS[order.estado]}</p>
                {blocked ? <p className="mt-2 rounded bg-orange-100 p-2 text-xs font-bold text-orange-900">
                  No autorizado para preparar ni sacar mercancía.
                </p> : null}
                <div className="mt-4 space-y-1 text-xs">
                  <p><strong>Cliente:</strong> {order.cliente.nombreCompleto}</p>
                  <p><strong>Dirección:</strong> {order.cliente.direccion}</p>
                  <p><strong>Teléfono:</strong> {order.cliente.telefono}</p>
                  <p><strong>Vendedor:</strong> {order.vendedor.nombre}</p>
                  <p><strong>Fecha:</strong> {formatDateTime(order.creadoEn)}</p>
                  <p><strong>Pago:</strong> {ORDER_PAYMENT_CONDITION_LABELS[order.condicionPago]}</p>
                </div>
                <div className="mt-4 border-t border-slate-200">
                  {order.detalles.map((line) => <div key={line.id} className="border-b border-slate-200 py-3">
                    <div className="flex justify-between gap-3">
                      <div className="min-w-0">
                        <p className="break-all text-xs text-slate-600">{line.producto.codigo}</p>
                        <p className="text-sm font-semibold">{line.producto.nombre}</p>
                        {line.observaciones ? <p className="text-xs">Nota: {line.observaciones}</p> : null}
                        {includeAmounts ? <p className="text-xs">Subtotal: {formatMoney(line.subtotal)}</p> : null}
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xl font-bold">{line.cantidadSolicitada}</p>
                        <p className="text-xs">Pedidas</p>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-600">
                      Despachadas: {line.cantidadDespachada} · Pendientes: {line.cantidadPendienteDespacho}
                    </p>
                  </div>)}
                </div>
                <p className="mt-3 text-sm font-semibold">Unidades solicitadas: {order.progreso.unidadesSolicitadas}</p>
                {order.observaciones ? <p className="mt-3 text-xs">Observaciones: {order.observaciones}</p> : null}
                <p className="mt-3 text-xs text-slate-500">
                  El PDF incluye casillas de revisión y espacios para firmas.
                </p>
              </div>
            )}
          </AppCard>
          <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
            En Android, abre el PDF descargado para imprimirlo o compártelo desde el teléfono.
            En computadora puedes revisarlo arriba antes de imprimir.
          </p>
        </AppStack> : null}
      </AppDataState>
    </AppStack>
  </AppContainer>;
}
