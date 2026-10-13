import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import type { OrderDetail } from "@/features/pedidos/api/order.types";

export type PickingPaperFormat = "A4" | "LETTER";

type Props = {
  order: OrderDetail;
  format: PickingPaperFormat;
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111111",
    backgroundColor: "#ffffff",
    paddingTop: 24,
    paddingHorizontal: 26,
    paddingBottom: 32,
  },
  heading: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 7,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 10,
    marginBottom: 8,
  },
  warning: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: "row",
    borderTopWidth: 0.8,
    borderBottomWidth: 0.8,
    borderColor: "#222222",
    paddingVertical: 5,
    paddingHorizontal: 3,
    alignItems: "center",
  },
  headerText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 0.4,
    borderColor: "#aaaaaa",
    paddingVertical: 6,
    paddingHorizontal: 3,
    alignItems: "center",
    minHeight: 29,
  },
  code: {
    width: "21%",
    paddingRight: 5,
    fontSize: 10,
  },
  product: {
    width: "46%",
    paddingRight: 7,
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
    lineHeight: 1.18,
  },
  productNote: {
    fontSize: 9,
    marginTop: 2,
  },
  requested: {
    width: "13%",
    textAlign: "center",
    fontSize: 10,
  },
  pending: {
    width: "13%",
    textAlign: "center",
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
  },
  check: {
    width: "7%",
    alignItems: "center",
  },
  checkbox: {
    width: 11,
    height: 11,
    borderWidth: 0.8,
    borderColor: "#222222",
  },
  observationsHeading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    marginTop: 10,
    marginBottom: 2,
  },
  observations: {
    fontSize: 9.5,
    lineHeight: 1.25,
  },
  footer: {
    position: "absolute",
    bottom: 12,
    left: 26,
    right: 26,
    textAlign: "right",
    fontSize: 8,
  },
});

function dateInGuatemala(value: string | null | undefined) {
  if (!value) return "Fecha no disponible";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha no disponible";
  return new Intl.DateTimeFormat("es-GT", {
    timeZone: "America/Guatemala",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function OrderPickingPdfDocument({ order, format }: Props) {
  const blocked = order.estado === "BORRADOR" || order.estado === "PENDIENTE_VALIDACION";
  const cancelled = order.estado === "CANCELADO";
  const completed = !blocked && !cancelled && order.progreso.unidadesPendientesDespacho === 0;

  return (
    <Document
      title={"Guía de preparación - " + order.numero}
      author="Marcas"
      subject="Lista de productos del pedido para bodega"
    >
      <Page size={format} style={styles.page} wrap>
        <Text style={styles.heading}>Guía de preparación - Marcas</Text>

        <View style={styles.meta} wrap={false}>
          <Text>Pedido: {order.numero}</Text>
          <Text>Fecha: {dateInGuatemala(order.creadoEn)}</Text>
        </View>

        {cancelled ? (
          <Text style={styles.warning}>PEDIDO CANCELADO - No preparar mercancía.</Text>
        ) : blocked ? (
          <Text style={styles.warning}>PEDIDO SIN CONFIRMAR - No preparar mercancía.</Text>
        ) : completed ? (
          <Text style={styles.warning}>PEDIDO DESPACHADO - Sin unidades pendientes.</Text>
        ) : null}

        <View style={styles.tableHeader} wrap={false}>
          <Text style={[styles.headerText, styles.code]}>CÓDIGO</Text>
          <Text style={[styles.headerText, styles.product]}>PRODUCTO</Text>
          <Text style={[styles.headerText, styles.requested]}>PEDIDA</Text>
          <Text style={[styles.headerText, styles.pending]}>PEND.</Text>
          <Text style={[styles.headerText, styles.check]}>REV.</Text>
        </View>

        {order.detalles.map((line) => (
          <View key={line.id} style={styles.row} wrap={false}>
            <Text style={styles.code}>{line.producto.codigo || "—"}</Text>
            <View style={styles.product}>
              <Text style={styles.name}>{line.producto.nombre}</Text>
              {line.observaciones ? (
                <Text style={styles.productNote}>Nota: {line.observaciones}</Text>
              ) : null}
            </View>
            <Text style={styles.requested}>{line.cantidadSolicitada}</Text>
            <Text style={styles.pending}>{line.cantidadPendienteDespacho}</Text>
            <View style={styles.check}><View style={styles.checkbox} /></View>
          </View>
        ))}

        {order.observaciones ? (
          <View>
            <Text style={styles.observationsHeading}>Observaciones</Text>
            <Text style={styles.observations}>{order.observaciones}</Text>
          </View>
        ) : null}

        <Text
          style={styles.footer}
          fixed
          render={({ pageNumber, totalPages }) =>
            totalPages > 1 ? "Página " + pageNumber + " de " + totalPages : ""
          }
        />
      </Page>
    </Document>
  );
}
