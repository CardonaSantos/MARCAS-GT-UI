import { pdf, PDFViewer } from "@react-pdf/renderer";
import { Download, FileCheck2, FileText, Printer, Receipt, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { toast } from "sonner";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { marcasApi } from "@/API/api";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { createIdempotencyKey } from "@/features/common/utils/idempotency";
import { useIssueReceipt, useRecordReceiptAction } from "@/features/comprobantes/api/receipt.mutations";
import { useReceiptPreview } from "@/features/comprobantes/api/receipt.queries";
import type { ReceiptFormat, ReceiptKind } from "@/features/comprobantes/api/receipt.types";
import { cleanFilePart, isDeliverySnapshot, receiptTitle } from "@/features/comprobantes/common/receipt.helpers";
import { ReceiptDataSummary } from "@/features/comprobantes/components/receipt-data-summary";
import { ReceiptPdfDocument } from "@/features/comprobantes/components/receipt-pdf-document";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

interface Props { kind: ReceiptKind }

export default function OperationalReceiptPage({ kind }: Props) {
  const params = useParams();
  const location = useLocation();
  const id = Number(params.id);
  const operationId = Number(params.operacionId);
  const [format, setFormat] = useState<ReceiptFormat>("A4");
  const [isDesktop, setIsDesktop] = useState(false);
  const [working, setWorking] = useState(false);
  const [issuedOverride, setIssuedOverride] = useState<ReturnType<typeof useIssueReceipt>["data"]>(undefined);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const preview = useReceiptPreview(kind, id, operationId);
  const issue = useIssueReceipt();
  const action = useRecordReceiptAction();
  const fallback = kind === "SALIDA_DESPACHO"
    ? "/marcas-gt/despachos/" + id : "/marcas-gt/entregas/" + id;
  const backTo = getReturnRoute(location.state, fallback);
  const current = issuedOverride ?? preview.data?.comprobante ?? null;
  const snapshot = current?.snapshot ?? preview.data?.snapshot;
  const number = current?.numero ?? preview.data?.numeroPrevisto ?? "Sin número";
  // El snapshot del comprobante no se modifica: la firma se lee únicamente
  // para la representación PDF, mediante un endpoint autenticado de Entregas.
  const signature = kind === "ENTREGA" && snapshot && isDeliverySnapshot(snapshot)
    ? snapshot.evidencias.find((e) => e.tipo === "FIRMA" &&
      e.url.startsWith("spaces://") && Boolean(e.key))
    : null;
  const loadSignature = async (): Promise<string | null> => {
    if (!signature) return null;
    const result = await marcasApi.get<{ dataUrl: string }>(
      marcasEndpoints.entregas.evidenceImage(id, signature.id),
    );
    return /^data:image\/(?:png|jpeg);base64,/.test(result.dataUrl)
      ? result.dataUrl : null;
  };
  const issued = Boolean(current);
  const isValid = Number.isSafeInteger(id) && id > 0 && (kind === "ENTREGA" ||
    (Number.isSafeInteger(operationId) && operationId > 0));

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  // Cuando cambie el registro en la misma instancia React, descartar respuesta anterior.
  useEffect(() => {
    setIssuedOverride(undefined);
  }, [kind, id, operationId]);

  useEffect(() => {
    let active = true;
    setSignatureImage(null);
    if (signature) {
      void loadSignature()
        .then((dataUrl) => { if (active) setSignatureImage(dataUrl); })
        .catch(() => { /* El PDF aún mostrará el vínculo digital de la firma. */ });
    }
    return () => { active = false; };
  }, [id, signature?.id, signature?.url]);

  const renderBlob = async () => {
    if (!current || !snapshot) throw new Error("Emite primero el comprobante para poder utilizarlo.");
    let embeddedSignature = signatureImage;
    if (!embeddedSignature && signature) {
      embeddedSignature = await loadSignature().catch(() => null);
    }
    return pdf(<ReceiptPdfDocument snapshot={snapshot} numero={number} format={format}
      emitidoEn={current.emitidoEn} signatureImage={embeddedSignature} />).toBlob();
  };

  const logAction = async (
    accion: "IMPRESION_SOLICITADA" | "DESCARGA_SOLICITADA" | "COMPARTICION_PREPARADA",
    canal: string,
  ) => {
    if (!current) return;
    try {
      await action.mutateAsync({
        id: current.id, accion, canal,
        claveIdempotencia: createIdempotencyKey("receipt-" + accion),
      });
    } catch {
      // La auditoria debe ser recuperable: no bloquear el archivo ya generado.
      toast.warning("El archivo está disponible, pero no pudo registrarse la auditoría de la acción.");
    }
  };

  const fileName = () => cleanFilePart(
    (kind === "SALIDA_DESPACHO" ? "Salida_" : "Entrega_") + number +
    (format === "A4" ? "_A4.pdf" : "_80mm.pdf"),
  );

  const downloadBlob = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName();
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    // El navegador puede tardar en empezar la descarga tras el click.
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const onIssue = async () => {
    if (!isValid || issued || issue.isPending) return;
    try {
      const result = await issue.mutateAsync({ kind, id, operationId });
      setIssuedOverride(result);
      toast.success("Comprobante emitido. Puedes imprimirlo, descargarlo o compartirlo.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo emitir el comprobante.");
    }
  };

  const onDownload = async () => {
    if (working) return;
    setWorking(true);
    try {
      const blob = await renderBlob();
      downloadBlob(blob);
      await logAction("DESCARGA_SOLICITADA", format);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo descargar el documento.");
    } finally {
      setWorking(false);
    }
  };

  const onPrint = async () => {
    if (working || !current) return;
    // Abrir la ventana en el gesto del usuario para evitar bloqueo de popups.
    const tab = window.open("", "_blank");
    if (!tab) {
      toast.error("El navegador bloqueó la ventana. Descarga el PDF para imprimirlo.");
      return;
    }
    tab.opener = null;
    tab.document.title = "Preparando comprobante";
    tab.document.body.textContent = "Preparando PDF para impresión…";
    setWorking(true);
    try {
      const blob = await renderBlob();
      const url = URL.createObjectURL(blob);
      tab.location.href = url;
      tab.focus();
      toast.info("Se abrió el comprobante. Utiliza la opción Imprimir del visor PDF.");
      await logAction("IMPRESION_SOLICITADA", format);
      // La pestaña mantiene la URL hasta que termine la impresión.
      window.setTimeout(() => URL.revokeObjectURL(url), 5 * 60_000);
    } catch (error) {
      tab.close();
      toast.error(error instanceof Error ? error.message : "No se pudo preparar la impresión.");
    } finally {
      setWorking(false);
    }
  };

  const onShare = async () => {
    if (working || !current) return;
    setWorking(true);
    try {
      const blob = await renderBlob();
      const file = new File([blob], fileName(), { type: "application/pdf" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: receiptTitle(kind, snapshot!), text: "Comprobante operativo " + number,
          files: [file],
        });
        await logAction("COMPARTICION_PREPARADA", "SHARE_FILE");
      } else {
        downloadBlob(blob);
        toast.info("Tu navegador no permite compartir archivos. Se descargó el PDF para enviarlo.");
        await logAction("DESCARGA_SOLICITADA", format);
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        toast.error(error instanceof Error ? error.message : "No se pudo compartir el comprobante.");
      }
    } finally {
      setWorking(false);
    }
  };

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title={snapshot ? receiptTitle(kind, snapshot) : "Comprobante operativo"}
          description={kind === "SALIDA_DESPACHO"
            ? "Salida individual de bodega · despacho #" + id + " · operación #" + operationId
            : "Resultado registrado de la entrega #" + id}
          backTo={backTo}
          backLabel={kind === "SALIDA_DESPACHO" ? "Volver al despacho" : "Volver a la entrega"}
          actions={current
            ? <AppBadge tone="success">Emitido · {number}</AppBadge>
            : <AppBadge tone="neutral">Vista previa</AppBadge>}
        />
        <AppDataState
          isLoading={preview.isLoading && isValid}
          error={isValid ? preview.error : new Error("La ruta del comprobante no es válida.")}
          onRetry={() => void preview.refetch()}
          isEmpty={!preview.isLoading && !snapshot}
          emptyTitle="Comprobante no disponible"
          emptyDescription="Verifica que la salida esté aplicada o la entrega finalizada."
        >
          {snapshot ? (
            <AppStack gap="md">
              <AppAlert tone={issued ? "success" : "info"}
                title={issued ? "Comprobante operativo emitido" : "Documento listo para emisión"}
                description={issued
                  ? "El documento conserva el contenido emitido y su número original. Las siguientes impresiones son copias."
                  : "Revisa los datos antes de emitir. La primera emisión conserva un snapshot histórico que no se modifica después."}
              />

              <ReceiptDataSummary snapshot={snapshot} />

              <AppCard title="Formato de impresión" size="sm">
                <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Seleccionar formato de comprobante">
                  <AppButton size="sm" variant={format === "A4" ? "primary" : "secondary"}
                    aria-pressed={format === "A4"} onClick={() => setFormat("A4")}>
                    <FileText className="h-4 w-4" /> A4 completo
                  </AppButton>
                  <AppButton size="sm" variant={format === "THERMAL_80MM" ? "primary" : "secondary"}
                    aria-pressed={format === "THERMAL_80MM"} onClick={() => setFormat("THERMAL_80MM")}>
                    <Receipt className="h-4 w-4" /> Térmico 80 mm
                  </AppButton>
                </div>
                <p className="mt-3 text-xs text-[hsl(var(--app-muted-foreground))]">
                  Documento operativo; no sustituye una factura FEL. El formato térmico resume el contenido
                  para impresoras de rollo de 80 mm.
                </p>
              </AppCard>

              <div className="flex flex-wrap items-center gap-2" aria-live="polite">
                {!issued ? (
                  <AppButton variant="primary" leftIcon={<FileCheck2 />}
                    disabled={issue.isPending || working}
                    loading={issue.isPending} loadingText="Emitiendo comprobante…"
                    onClick={() => void onIssue()}>Emitir comprobante</AppButton>
                ) : null}
                <AppButton variant="secondary" disabled={!issued || working}
                  leftIcon={<Printer />} onClick={() => void onPrint()}>
                  Abrir para imprimir
                </AppButton>
                <AppButton variant="secondary" disabled={!issued || working}
                  leftIcon={<Download />} onClick={() => void onDownload()}>
                  Descargar PDF
                </AppButton>
                <AppButton variant="secondary" disabled={!issued || working}
                  leftIcon={<Share2 />} onClick={() => void onShare()}>
                  Compartir
                </AppButton>
                <AppButton asChild variant="ghost">
                  <Link to={fallback}>Ver registro original</Link>
                </AppButton>
              </div>

              <AppCard title="Vista previa del documento" size="sm">
                {isDesktop ? (
                  <div className="overflow-hidden rounded-md border border-[hsl(var(--app-border))] bg-[hsl(var(--app-muted))] p-2">
                    <div className="mx-auto" style={{ maxWidth: format === "A4" ? 950 : 315 }}>
                      <PDFViewer width="100%" height={format === "A4" ? 750 : 620}
                        showToolbar={false} key={format + number + String(issued)}>
                        <ReceiptPdfDocument snapshot={snapshot} numero={number} format={format}
                          emitidoEn={current?.emitidoEn} signatureImage={signatureImage} />
                      </PDFViewer>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-md border border-[hsl(var(--app-border))] p-5 text-center text-sm">
                    <p className="font-medium">Vista previa simplificada para móvil</p>
                    <p className="mt-2 text-[hsl(var(--app-muted-foreground))]">
                      Se muestra el resumen del documento arriba. Emite y utiliza Descargar o Compartir
                      para abrir el PDF completo en tu dispositivo.
                    </p>
                  </div>
                )}
              </AppCard>
              {issued ? (
                <p className="break-all text-xs text-[hsl(var(--app-muted-foreground))]">
                  N.º {number} · Emisión conservada · Huella SHA-256: {current?.huellaSha256}
                </p>
              ) : null}
            </AppStack>
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
