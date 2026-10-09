import {
  Document, Image, Page, StyleSheet, Text, View,
} from "@react-pdf/renderer";

import type {
  ReceiptFormat,
  ReceiptPreview,
} from "../api/receipt.types";
import {
  dateText, isDeliverySnapshot, isDispatchSnapshot, receiptTitle,
} from "../common/receipt.helpers";

interface Props {
  snapshot: ReceiptPreview["snapshot"];
  numero: string;
  format: ReceiptFormat;
  emitidoEn?: string | null;
}

const ink = "#1e293b";
const gray = "#64748b";
const line = "#cbd5e1";
const styles = StyleSheet.create({
  page: { padding: 31, fontFamily: "Helvetica", color: ink, fontSize: 9,
    backgroundColor: "#fff" },
  thermalPage: { paddingTop: 10, paddingBottom: 16, paddingHorizontal: 11,
    fontFamily: "Helvetica", color: "#000", fontSize: 8, backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start",
    borderBottomWidth: 1.5, borderBottomColor: ink, paddingBottom: 13, marginBottom: 15 },
  companyName: { fontFamily: "Helvetica-Bold", fontSize: 19, marginBottom: 5 },
  title: { fontFamily: "Helvetica-Bold", fontSize: 15, textAlign: "right" },
  meta: { fontSize: 8, color: gray, marginTop: 4 },
  section: { marginBottom: 14 },
  sectionTitle: { fontFamily: "Helvetica-Bold", fontSize: 9,
    borderBottomWidth: 1, borderBottomColor: line, paddingBottom: 5, marginBottom: 7 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12, marginBottom: 4 },
  col: { flex: 1 },
  label: { fontSize: 7, color: gray, marginBottom: 2 },
  value: { fontSize: 9, marginBottom: 4 },
  tableHead: { backgroundColor: "#f1f5f9", padding: 7, flexDirection: "row" },
  tableRow: { padding: 7, flexDirection: "row", borderBottomWidth: 0.5,
    borderBottomColor: "#e2e8f0" },
  product: { flex: 1 },
  qty: { width: 64, textAlign: "right" },
  foot: { marginTop: 12, borderTopWidth: 1, borderTopColor: line, paddingTop: 7 },
  strong: { fontFamily: "Helvetica-Bold" },
  warning: { marginTop: 10, fontSize: 8, color: "#475569", textAlign: "center" },
  signature: { borderBottomWidth: 1, borderColor: "#475569", width: 190, height: 40,
    justifyContent: "flex-end", marginTop: 12 },
  signatureImage: { maxWidth: 165, width: 145, height: 37, objectFit: "contain" },
  tCenter: { textAlign: "center" },
  tName: { fontSize: 13, fontFamily: "Helvetica-Bold", textAlign: "center", marginBottom: 5 },
  tTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", textAlign: "center", marginTop: 8 },
  tLine: { borderBottomWidth: 1, borderBottomColor: "#000", marginVertical: 8 },
  tText: { fontSize: 8, marginBottom: 4 },
  tStrong: { fontFamily: "Helvetica-Bold" },
  tQty: { fontFamily: "Helvetica-Bold", fontSize: 9 },
  tItem: { marginBottom: 7 },
});

function Value({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <View style={styles.col}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value === null || value === undefined || value === "" ? "—" : String(value)}</Text>
    </View>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>;
}
function ProductTable({ snapshot }: { snapshot: ReceiptPreview["snapshot"] }) {
  if (isDispatchSnapshot(snapshot)) return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Detalle de salida física</Text>
      <View style={styles.tableHead}>
        <Text style={styles.product}>Código / producto</Text>
        <Text style={styles.qty}>Salida</Text>
      </View>
      {snapshot.lineas.map((l) => (
        <View key={l.operacionDetalleId} style={styles.tableRow} wrap={false}>
          <Text style={styles.product}>{l.producto.codigo}  ·  {l.producto.nombre}</Text>
          <Text style={styles.qty}>{l.cantidad}</Text>
        </View>
      ))}
      <View style={styles.foot}>
        <Text style={styles.strong}>Productos: {snapshot.resumen.productos}  ·  Unidades retiradas: {snapshot.resumen.unidadesSalidas}</Text>
      </View>
    </View>
  );
  if (!isDeliverySnapshot(snapshot)) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Detalle del resultado de entrega</Text>
      <View style={styles.tableHead}>
        <Text style={styles.product}>Código / producto</Text>
        <Text style={styles.qty}>Cargado</Text>
        <Text style={styles.qty}>Recibido</Text>
        <Text style={styles.qty}>Rechazado</Text>
      </View>
      {snapshot.lineas.map((l) => (
        <View key={l.entregaDetalleId} wrap={false}>
          <View style={styles.tableRow}>
            <Text style={styles.product}>{l.producto.codigo}  ·  {l.producto.nombre}</Text>
            <Text style={styles.qty}>{l.cargadoIntento ?? "—"}</Text>
            <Text style={styles.qty}>{l.cantidadAceptada}</Text>
            <Text style={styles.qty}>{l.cantidadRechazada}</Text>
          </View>
          {l.motivoRechazo ? <Text style={styles.meta}>Motivo de rechazo: {l.motivoRechazo}</Text> : null}
        </View>
      ))}
      <View style={styles.foot}>
        <Text style={styles.strong}>
          Cargado: {snapshot.resumen.unidadesCargadas ?? "—"}  ·  Aceptado: {snapshot.resumen.unidadesAceptadas}  ·  Rechazado: {snapshot.resumen.unidadesRechazadas}
        </Text>
      </View>
    </View>
  );
}

function A4Receipt({ snapshot, numero, emitidoEn }: Omit<Props, "format">) {
  const despacho = isDispatchSnapshot(snapshot) ? snapshot : null;
  const entrega = isDeliverySnapshot(snapshot) ? snapshot : null;
  const referencia = despacho?.documento.numeroPedido ?? entrega?.documento.numeroPedido ?? "—";
  const fechaOperacion = despacho?.fechas.salidaConfirmadaEn ?? entrega?.fechas.finalizadaEn ?? null;
  const signature = entrega?.evidencias.find((e) => e.tipo === "FIRMA" &&
    /^https:\/\/res\.cloudinary\.com\//i.test(e.url)) ?? null;
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header} wrap={false}>
        <View style={{ width: "48%" }}>
          <Text style={styles.companyName}>{snapshot.empresa.nombre}</Text>
          <Text>{snapshot.empresa.direccion}</Text>
          <Text>Tel. {snapshot.empresa.telefono}</Text>
          {snapshot.empresa.email ? <Text style={styles.meta}>{snapshot.empresa.email}</Text> : null}
        </View>
        <View style={{ width: "48%" }}>
          <Text style={styles.title}>{receiptTitle(despacho ? "SALIDA_DESPACHO" : "ENTREGA", snapshot)}</Text>
          <Text style={{ ...styles.meta, textAlign: "right" }}>N.º {numero}</Text>
          <Text style={{ ...styles.meta, textAlign: "right" }}>Pedido: {referencia}</Text>
          <Text style={{ ...styles.meta, textAlign: "right" }}>Operación: {dateText(fechaOperacion)}</Text>
          <Text style={{ ...styles.meta, textAlign: "right" }}>
            {emitidoEn ? "Emitido: " + dateText(emitidoEn) : "Vista previa · sin emitir"}
          </Text>
        </View>
      </View>

      <Section title="Cliente y destino">
        <View style={styles.row}>
          <Value label="Cliente" value={snapshot.cliente.nombreCompleto} />
          <Value label="Teléfono" value={snapshot.cliente.telefono} />
        </View>
        <View style={styles.row}>
          <Value label="Dirección" value={entrega?.destino?.direccion ?? snapshot.cliente.direccion} />
          <Value label="Bodega origen" value={despacho?.bodega.nombre ?? entrega?.bodegaOrigen.nombre} />
        </View>
        <View style={styles.row}>
          <Value label="Despacho" value={despacho?.documento.numeroDespacho ?? entrega?.documento.numeroDespacho} />
          <Value label="Estado" value={despacho?.documento.estadoOperacion ?? entrega?.documento.estado} />
        </View>
      </Section>

      <Section title="Personal y logística">
        <View style={styles.row}>
          <Value label={despacho ? "Salida registrada por" : "Responsable de entrega"}
            value={despacho?.operadores.registradoPor.nombre ?? entrega?.operadores.responsableEntrega?.nombre} />
          <Value label={despacho ? "Preparado por" : "Finalizada por"}
            value={despacho?.operadores.preparadoPor?.nombre ?? entrega?.operadores.finalizadoPor?.nombre} />
          <Value label="Vendedor" value={despacho?.operadores.vendedor.nombre ?? entrega?.operadores.vendedor?.nombre} />
        </View>
        {entrega?.transporte ? (
          <View style={styles.row}>
            <Value label="Envío" value={entrega.transporte.numero} />
            <Value label="Conductor" value={entrega.transporte.conductor} />
            <Value label="Placa" value={entrega.transporte.vehiculo?.placa} />
          </View>
        ) : null}
        {despacho && despacho.transporte.length > 0 ? (
          <Text style={styles.meta}>
            Envíos relacionados: {despacho.transporte.map((t) => t.envio.numero).join(", ")}
          </Text>
        ) : null}
      </Section>

      <ProductTable snapshot={snapshot} />
      {entrega ? (
        <Section title="Recepción y evidencia">
          <View style={styles.row}>
            <Value label="Receptor" value={entrega.receptor.nombre} />
            <Value label="Documento" value={entrega.receptor.documento} />
            <Value label="Evidencias" value={entrega.evidencias.length} />
          </View>
          {entrega.motivoNoEntrega ? (
            <Text>Motivo de no entrega: {entrega.motivoNoEntrega} · {entrega.detalleNoEntrega ?? ""}</Text>
          ) : null}
          {signature ? <View style={{ marginTop: 7 }}>
            <Text style={styles.label}>Firma registrada</Text>
            <Image src={signature.url} style={styles.signatureImage} />
          </View> : (
            <View style={styles.signature}><Text style={styles.label}>
              {entrega.evidencias.some((x) => x.tipo === "FIRMA")
                ? "Firma disponible en evidencia digital adjunta"
                : "Sin firma digital adjunta"}
            </Text></View>
          )}
        </Section>
      ) : null}
      {(snapshot.observaciones || entrega?.detalleNoEntrega) ? (
        <Section title="Observaciones">
          <Text>{snapshot.observaciones ?? entrega?.detalleNoEntrega}</Text>
        </Section>
      ) : null}
      <Text style={styles.warning}>{snapshot.advertencia}</Text>
    </Page>
  );
}

function ThermalReceipt({ snapshot, numero, emitidoEn }: Omit<Props, "format">) {
  const despacho = isDispatchSnapshot(snapshot) ? snapshot : null;
  const entrega = isDeliverySnapshot(snapshot) ? snapshot : null;
  const rows = despacho?.lineas.length ?? entrega?.lineas.length ?? 0;
  // Altura larga, compatible con recibos de muchos productos, sin recorte por conteo de lineas.
  const height = Math.min(12000, Math.max(490, 335 + rows * 64 +
    (entrega?.evidencias.length ? 42 : 0) + (snapshot.observaciones ? 55 : 0)));
  return (
    <Page size={[226.77, height]} style={styles.thermalPage}>
      <Text style={styles.tName}>{snapshot.empresa.nombre}</Text>
      <Text style={styles.tCenter}>{snapshot.empresa.direccion}</Text>
      <Text style={styles.tCenter}>Tel. {snapshot.empresa.telefono}</Text>
      <Text style={styles.tTitle}>{receiptTitle(despacho ? "SALIDA_DESPACHO" : "ENTREGA", snapshot)}</Text>
      <Text style={styles.tCenter}>{numero}</Text>
      <Text style={styles.tText}>{emitidoEn ? "Emitido: " + dateText(emitidoEn) : "VISTA PREVIA · SIN EMITIR"}</Text>
      <View style={styles.tLine} />
      <Text style={styles.tText}>Pedido: {despacho?.documento.numeroPedido ?? entrega?.documento.numeroPedido ?? "—"}</Text>
      <Text style={styles.tText}>Despacho: {despacho?.documento.numeroDespacho ?? entrega?.documento.numeroDespacho ?? "—"}</Text>
      <Text style={styles.tText}>Cliente: {snapshot.cliente.nombreCompleto}</Text>
      <Text style={styles.tText}>Bodega: {despacho?.bodega.nombre ?? entrega?.bodegaOrigen.nombre}</Text>
      <Text style={styles.tText}>Fecha: {dateText(despacho?.fechas.salidaConfirmadaEn ?? entrega?.fechas.finalizadaEn)}</Text>
      <Text style={styles.tText}>Responsable: {despacho?.operadores.registradoPor.nombre ??
        entrega?.operadores.responsableEntrega?.nombre ?? "—"}</Text>
      <View style={styles.tLine} />
      {despacho ? despacho.lineas.map((l) => (
        <View key={l.operacionDetalleId} style={styles.tItem} wrap={false}>
          <Text style={styles.tStrong}>{l.producto.codigo}</Text>
          <Text style={styles.tText}>{l.producto.nombre}</Text>
          <Text style={styles.tQty}>Salida: {l.cantidad}</Text>
        </View>
      )) : null}
      {entrega ? entrega.lineas.map((l) => (
        <View key={l.entregaDetalleId} style={styles.tItem} wrap={false}>
          <Text style={styles.tStrong}>{l.producto.codigo}</Text>
          <Text style={styles.tText}>{l.producto.nombre}</Text>
          <Text>Cargado: {l.cargadoIntento ?? "—"}  ·  Recibido: {l.cantidadAceptada}  ·  Rechazado: {l.cantidadRechazada}</Text>
          {l.motivoRechazo ? <Text>Motivo: {l.motivoRechazo}</Text> : null}
        </View>
      )) : null}
      <View style={styles.tLine} />
      <Text style={styles.tStrong}>
        {despacho ? "Total salido: " + despacho.resumen.unidadesSalidas :
          "Recibidas: " + (entrega?.resumen.unidadesAceptadas ?? 0) +
          " · Rechazadas: " + (entrega?.resumen.unidadesRechazadas ?? 0)}
      </Text>
      {entrega ? <>
        <Text style={styles.tText}>Receptor: {entrega.receptor.nombre ?? "No registrado"}</Text>
        <Text style={styles.tText}>Evidencias: {entrega.evidencias.length}</Text>
        {entrega.motivoNoEntrega ? <Text style={styles.tText}>Motivo: {entrega.motivoNoEntrega}</Text> : null}
      </> : null}
      {snapshot.observaciones ? <Text style={styles.tText}>Obs.: {snapshot.observaciones}</Text> : null}
      <View style={styles.tLine} />
      <Text style={styles.tCenter}>{snapshot.advertencia}</Text>
    </Page>
  );
}

export function ReceiptPdfDocument({ snapshot, numero, format, emitidoEn }: Props) {
  return (
    <Document
      title={receiptTitle(isDispatchSnapshot(snapshot) ? "SALIDA_DESPACHO" : "ENTREGA", snapshot) + " " + numero}
      author={snapshot.empresa.nombre}
      subject="Comprobante operativo no fiscal"
    >
      {format === "A4"
        ? <A4Receipt snapshot={snapshot} numero={numero} emitidoEn={emitidoEn} />
        : <ThermalReceipt snapshot={snapshot} numero={numero} emitidoEn={emitidoEn} />}
    </Document>
  );
}
