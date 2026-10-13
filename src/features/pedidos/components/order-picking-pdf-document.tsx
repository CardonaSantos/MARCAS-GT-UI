import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { formatMoney } from "@/features/common/formatters/value.formatters";
import { ORDER_STATE_LABELS, ORDER_PAYMENT_CONDITION_LABELS, ORDER_PAYMENT_STATE_LABELS } from "@/features/pedidos/common/order.constants";
import type { OrderDetail } from "@/features/pedidos/api/order.types";

export type PickingPaperFormat = "A4" | "LETTER";
type Props = { order: OrderDetail; format: PickingPaperFormat; includeAmounts: boolean };

const s = StyleSheet.create({
  page: { fontFamily: "Helvetica", color: "#15242f", fontSize: 9, paddingTop: 36, paddingHorizontal: 36, paddingBottom: 55 },
  brand: { fontSize: 10, color: "#147d70", fontFamily: "Helvetica-Bold", letterSpacing: 1 },
  title: { fontSize: 19, fontFamily: "Helvetica-Bold", marginTop: 8, marginBottom: 3 },
  secondary: { color: "#566575", fontSize: 8 },
  status: { marginTop: 10, flexDirection: "row", justifyContent: "space-between" },
  notice: { marginTop: 11, backgroundColor: "#eff4f6", padding: 10, fontSize: 8, lineHeight: 1.4 },
  caution: { backgroundColor: "#fff0e4", color: "#922e1f" },
  section: { fontSize: 10, fontFamily: "Helvetica-Bold", marginTop: 16, marginBottom: 9 },
  info: { flexDirection: "row", flexWrap: "wrap" },
  infoField: { width: "50%", paddingRight: 10, paddingBottom: 9 },
  full: { width: "100%" },
  label: { color: "#607083", fontSize: 7.5, marginBottom: 3 },
  value: { fontSize: 9, lineHeight: 1.35 },
  header: { flexDirection: "row", paddingVertical: 8, paddingHorizontal: 5, backgroundColor: "#e9eff2", borderBottomWidth: 1, borderColor: "#c4d0d7" },
  th: { fontSize: 7.5, fontFamily: "Helvetica-Bold" },
  item: { flexDirection: "row", paddingHorizontal: 5, paddingVertical: 10, borderBottomWidth: 0.7, borderColor: "#d9e1e6" },
  code: { width: "18%", paddingRight: 5, fontSize: 8 },
  product: { width: "42%", paddingRight: 6 },
  productName: { fontFamily: "Helvetica-Bold", fontSize: 9, lineHeight: 1.35 },
  productNote: { fontSize: 7.5, color: "#566575", marginTop: 4, lineHeight: 1.35 },
  number: { width: "11%", textAlign: "center" },
  strongNumber: { fontFamily: "Helvetica-Bold", fontSize: 11 },
  mark: { width: "7%", alignItems: "center" },
  square: { width: 13, height: 13, borderWidth: 1, borderColor: "#667584" },
  totals: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#eff4f6", padding: 10, marginTop: 13 },
  totalCell: { width: "24%" },
  totalValue: { fontSize: 13, fontFamily: "Helvetica-Bold", marginTop: 4 },
  remarks: { borderWidth: 1, borderColor: "#d4dee4", padding: 10, fontSize: 9 },
  signRow: { flexDirection: "row", marginTop: 32, gap: 20 },
  sign: { flex: 1, borderTopWidth: 1, borderColor: "#536371", paddingTop: 6, fontSize: 8 },
  footer: { position: "absolute", bottom: 17, left: 36, right: 36, borderTopWidth: 1, borderColor: "#d4dee4", paddingTop: 7, flexDirection: "row", justifyContent: "space-between", fontSize: 7, color: "#586879" },
});

function when(value: string | null | undefined) {
  if (!value || Number.isNaN(new Date(value).getTime())) return "Sin registrar";
  return new Intl.DateTimeFormat("es-GT", {
    timeZone: "America/Guatemala", dateStyle: "medium", timeStyle: "short",
  }).format(new Date(value));
}
function Field({ label, value, full = false }: { label: string; value: string; full?: boolean }) {
  return <View style={[s.infoField, ...(full ? [s.full] : [])]}>
    <Text style={s.label}>{label}</Text><Text style={s.value}>{value || "—"}</Text>
  </View>;
}

export function OrderPickingPdfDocument({ order, format, includeAmounts }: Props) {
  const blocked = ["BORRADOR", "PENDIENTE_VALIDACION", "CANCELADO"].includes(order.estado);
  const warehouses = [...new Set(order.despachos.map((d) => d.bodega.nombre))];
  const notice = order.estado === "CANCELADO"
    ? "PEDIDO CANCELADO. No preparar ni entregar mercancía."
    : blocked
      ? "PEDIDO SIN CONFIRMAR. Esta guía no autoriza la preparación ni la salida de mercancía."
      : "Guía interna para revisión física. La salida se registra exclusivamente en Despachos.";
  return <Document title={"Guía de pedido " + order.numero} author="MARCAS GT"
    subject="Guía interna de preparación de mercancía">
    <Page size={format} style={s.page} wrap>
      <Text style={s.brand}>MARCAS GT</Text>
      <Text style={s.title}>GUÍA DE PREPARACIÓN</Text>
      <Text style={s.secondary}>Pedido {order.numero} · Copia de trabajo para bodega</Text>
      <View style={s.status}>
        <Text>Estado: {ORDER_STATE_LABELS[order.estado]}</Text>
        <Text>Fecha: {when(order.creadoEn)}</Text>
      </View>
      <View style={[s.notice, ...(blocked ? [s.caution] : [])]}>
        <Text>{notice}</Text>
      </View>

      <Text style={s.section}>INFORMACIÓN DEL PEDIDO</Text>
      <View style={s.info}>
        <Field label="Cliente" value={order.cliente.nombreCompleto} />
        <Field label="Vendedor" value={order.vendedor.nombre} />
        <Field label="Teléfono" value={order.cliente.telefono} />
        <Field label="Bodega" value={warehouses.join(", ") || "Sin despacho asignado"} />
        <Field label="Confirmación" value={when(order.confirmadoEn)} />
        <Field label="Forma de pago" value={ORDER_PAYMENT_CONDITION_LABELS[order.condicionPago]} />
        <Field label="Estado del pago" value={ORDER_PAYMENT_STATE_LABELS[order.estadoPago]} />
        <Field label="Productos distintos" value={String(order.detalles.length)} />
        <Field label="Dirección de entrega" value={order.cliente.direccion} full />
      </View>

      <Text style={s.section}>LISTA DE PRODUCTOS</Text>
      <View style={s.header} wrap={false}>
        <Text style={[s.th, s.code]}>CÓDIGO</Text>
        <Text style={[s.th, s.product]}>NOMBRE DEL PRODUCTO</Text>
        <Text style={[s.th, s.number]}>PEDIDA</Text>
        <Text style={[s.th, s.number]}>DESP.</Text>
        <Text style={[s.th, s.number]}>PEND.</Text>
        <Text style={[s.th, s.mark]}>REV.</Text>
      </View>
      {order.detalles.map((line) => (
        <View key={line.id} style={s.item} wrap={false}>
          <Text style={s.code}>{line.producto.codigo || "Sin código"}</Text>
          <View style={s.product}>
            <Text style={s.productName}>{line.producto.nombre}</Text>
            {line.observaciones ? <Text style={s.productNote}>Nota: {line.observaciones}</Text> : null}
            {includeAmounts ? <Text style={s.productNote}>
              Precio: {formatMoney(line.precioUnitario)} · Descuento: {formatMoney(line.descuento)} · Subtotal: {formatMoney(line.subtotal)}
            </Text> : null}
          </View>
          <Text style={[s.number, s.strongNumber]}>{line.cantidadSolicitada}</Text>
          <Text style={s.number}>{line.cantidadDespachada}</Text>
          <Text style={s.number}>{line.cantidadPendienteDespacho}</Text>
          <View style={s.mark}><View style={s.square} /></View>
        </View>
      ))}
      <Text style={[s.secondary, { marginTop: 8 }]}>
        PEDIDA = solicitada · DESP. = ya despachada · PEND. = pendiente · REV. = verificación física.
      </Text>
      <View style={s.totals} wrap={false}>
        {[
          ["Solicitadas", order.progreso.unidadesSolicitadas],
          ["Reservadas", order.progreso.unidadesReservadas],
          ["Despachadas", order.progreso.unidadesDespachadas],
          ["Pendientes", order.progreso.unidadesPendientesDespacho],
        ].map(([label, value]) => (
          <View key={label} style={s.totalCell}>
            <Text style={s.label}>{label}</Text><Text style={s.totalValue}>{value}</Text>
          </View>
        ))}
      </View>
      {includeAmounts ? <Text style={{ marginTop: 11 }}>
        Subtotal: {formatMoney(order.subtotal)} · Descuentos: {formatMoney(order.descuentoTotal)} · Total: {formatMoney(order.total)}
      </Text> : null}
      {order.observaciones ? <View wrap={false}>
        <Text style={s.section}>OBSERVACIONES</Text>
        <Text style={s.remarks}>{order.observaciones}</Text>
      </View> : null}
      <View style={s.signRow} wrap={false}>
        <Text style={s.sign}>Preparado por / Fecha</Text>
        <Text style={s.sign}>Revisado por / Fecha</Text>
      </View>
      <View style={s.footer} fixed>
        <Text>Guía interna · No sustituye el comprobante de salida</Text>
        <Text render={({ pageNumber, totalPages }) =>
          order.numero + " · Página " + pageNumber + " de " + totalPages
        } />
      </View>
    </Page>
  </Document>;
}
