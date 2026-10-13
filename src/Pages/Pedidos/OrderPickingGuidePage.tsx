import { pdf, PDFViewer } from "@react-pdf/renderer";
import { Download, FileText, Printer, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { toast } from "sonner";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useOrder } from "@/features/pedidos/api/order.queries";
import {
  OrderPickingPdfDocument,
  type PickingPaperFormat,
} from "@/features/pedidos/components/order-picking-pdf-document";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

function formatGuatemalaDate(value: string | null | undefined) {
  if (!value) return "Fecha no disponible";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Fecha no disponible";
  return new Intl.DateTimeFormat("es-GT", {
    timeZone: "America/Guatemala",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}

export default function OrderPickingGuidePage() {
  const params = useParams();
  const location = useLocation();
  const id = Number(params.id);
  const validId = Number.isSafeInteger(id) && id > 0;
  const backTo = getReturnRoute(location.state, "/marcas-gt/pedidos/" + id);
  const query = useOrder(id);
  const order = query.data;
  const [format, setFormat] = useState<PickingPaperFormat>("A4");
  const [desktop, setDesktop] = useState(false);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const fileName = "Guia_pedido_" +
    String(order?.numero ?? id).replace(/[^A-Za-z0-9_-]/g, "_") +
    (format === "A4" ? "_A4.pdf" : "_Carta.pdf");

  const buildPdf = async () => {
    if (!order || order.detalles.length === 0) {
      throw new Error("El pedido no tiene productos para imprimir.");
    }
    return pdf(
      <OrderPickingPdfDocument order={order} format={format} />,
    ).toBlob();
  };

  const downloadBlob = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
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

  const blocked = order?.estado === "BORRADOR" ||
    order?.estado === "PENDIENTE_VALIDACION" ||
    order?.estado === "CANCELADO";
  const completed = Boolean(
    order && !blocked && order.progreso.unidadesPendientesDespacho === 0,
  );
  const canExport = Boolean(order && order.detalles.length > 0 && !working);

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Guía de preparación - Marcas"
          description="Lista compacta para revisar e imprimir los productos del pedido."
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
          {order ? (
            <AppStack gap="md">
              <AppCard title="Opciones del documento" size="sm">
                <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Formato del documento">
                  <AppButton size="sm" variant={format === "A4" ? "primary" : "secondary"}
                    aria-pressed={format === "A4"} onClick={() => setFormat("A4")}>
                    <FileText className="h-4 w-4" /> A4
                  </AppButton>
                  <AppButton size="sm" variant={format === "LETTER" ? "primary" : "secondary"}
                    aria-pressed={format === "LETTER"} onClick={() => setFormat("LETTER")}>
                    <FileText className="h-4 w-4" /> Carta
                  </AppButton>
                </div>
              </AppCard>

              <div className="flex flex-wrap gap-2" role="group" aria-label="Acciones del documento">
                <AppButton variant="primary" disabled={!canExport} loading={working}
                  leftIcon={<Printer />} onClick={() => void onPrint()}>
                  Abrir para imprimir
                </AppButton>
                <AppButton variant="secondary" disabled={!canExport}
                  leftIcon={<Download />} onClick={() => void onDownload()}>
                  Descargar PDF
                </AppButton>
                <AppButton variant="secondary" disabled={!canExport}
                  leftIcon={<Share2 />} onClick={() => void onShare()}>
                  Compartir PDF
                </AppButton>
                <AppButton asChild variant="ghost">
                  <Link to={"/marcas-gt/pedidos/" + id}>Ver pedido</Link>
                </AppButton>
              </div>

              <AppCard title="Vista previa" size="sm">
                {desktop ? (
                  <div className="overflow-hidden rounded-md border border-[hsl(var(--app-border))] p-2">
                    <PDFViewer width="100%" height={760} showToolbar={false}
                      key={order.id + "-" + format}>
                      <OrderPickingPdfDocument order={order} format={format} />
                    </PDFViewer>
                  </div>
                ) : (
                  <div className="mx-auto max-w-xl border border-slate-200 bg-white px-3 py-3 text-black">
                    <p className="text-sm font-bold">Guía de preparación - Marcas</p>
                    <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs">
                      <span>Pedido: {order.numero}</span>
                      <span>Fecha: {formatGuatemalaDate(order.creadoEn)}</span>
                    </div>
                    {blocked ? (
                      <p className="mt-2 text-xs font-bold">
                        {order.estado === "CANCELADO"
                          ? "PEDIDO CANCELADO - No preparar mercancía."
                          : "PEDIDO SIN CONFIRMAR - No preparar mercancía."}
                      </p>
                    ) : completed ? (
                      <p className="mt-2 text-xs font-bold">PEDIDO DESPACHADO - Sin unidades pendientes.</p>
                    ) : null}
                    <div className="mt-3 border-t border-black">
                      <div className="grid grid-cols-[1fr_3fr_45px_45px] gap-2 border-b border-black py-2 text-[10px] font-bold">
                        <span>CÓDIGO</span>
                        <span>PRODUCTO</span>
                        <span className="text-center">PED.</span>
                        <span className="text-center">PEND.</span>
                      </div>
                      {order.detalles.map((line) => (
                        <div key={line.id}
                          className="grid grid-cols-[1fr_3fr_45px_45px] gap-2 border-b border-slate-300 py-2 text-xs">
                          <span className="min-w-0 break-all">{line.producto.codigo || "—"}</span>
                          <div className="min-w-0">
                            <p className="font-semibold">{line.producto.nombre}</p>
                            {line.observaciones ? <p className="mt-1 text-[11px]">Nota: {line.observaciones}</p> : null}
                          </div>
                          <span className="text-center">{line.cantidadSolicitada}</span>
                          <span className="text-center font-bold">{line.cantidadPendienteDespacho}</span>
                        </div>
                      ))}
                    </div>
                    {order.observaciones ? (
                      <p className="mt-3 text-xs"><strong>Observaciones:</strong> {order.observaciones}</p>
                    ) : null}
                    <p className="mt-3 text-[11px] text-slate-600">
                      El PDF incluye una casilla para marcar cada producto revisado.
                    </p>
                  </div>
                )}
              </AppCard>
              <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                En Android puedes descargar, abrir o compartir el PDF para imprimirlo.
                La guía no registra salidas de bodega.
              </p>
            </AppStack>
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
