export type DashboardView = "resumen" | "alertas" | "agenda" | "graficos" | "actividad" | "live";
export type DashboardFilters = { desde?: string; hasta?: string; limit?: number };

export type DashboardSection<T> =
  | { status: "OK"; data: T }
  | { status: "UNAVAILABLE"; data: null };

export type DashboardList<T> = { total: number; items: T[] };

export type FinanceSummary = {
  cobrosVerificados: string;
  numeroCobros: number;
  pagosPorVerificar: number;
  pagosVerificadosSinAplicaciones: number;
  nota: string;
};
export type PortfolioSummary = {
  pendiente: string; cuentasAbiertas: number; vencido: string;
  cuentasVencidas: number; porVencer7Dias: string; vencimientos7Dias: number;
  planesSinActivar: number;
};
export type OrderSummary = {
  pedidosPeriodo: number; valorNetoPedidos: string;
  porValidar: number; pendientesDeSalida: number;
};
export type InventorySummary = {
  bodegasActivas: number; unidadesFisicas: number;
  unidadesReservadas: number; unidadesDisponibles: number; referenciasAgotadas: number;
};
export type LogisticsSummary = {
  despachosAbiertos: number; enviosEnRutaOIncidencia: number;
  entregasPeriodo: number; incidenciasAbiertas: number;
};
export type SupplySummary = { requisicionesPorAprobar: number; transferenciasEnTransito: number };
export type CustomerSummary = { clientesConPedidos: number; clientesConPedidosPeriodo: number; nota: string };
export type InvoiceSummary = { borradores: number; listasEmision: number; emitidasPeriodo: number; montoEmitido: string };

export type PaymentItem = {
  id: number; clienteId: number; pedidoId: number | null;
  monto: string; moneda: string; fechaPago: string; referencia: string | null;
};
export type CreditItem = {
  id: number; numero: string; clienteId: number; pedidoId: number;
  estado: string; montoSolicitado: string; solicitadaEn: string;
};
export type DueItem = {
  id: number; creditoId?: number | null; clienteId?: number;
  pedidoId?: number | null; numeroDocumento?: string | null;
  fechaVencimiento: string; saldoPendiente: string;
};
export type DispatchIssue = { id: number; ordenDespachoId: number; tipo: string; intentos: number; actualizadoEn: string };
export type TransportIssue = { id: number; envioId: number; tipo: string; severidad: string; estado: string; reportadaEn: string };
export type RequisitionItem = { id: number; bodegaDestinoId: number; solicitanteId: number; solicitadaEn: string };
export type PendingOrder = { id: number; numero: string; clienteId: number; estado: string; total: string; creadoEn: string };
export type ShipmentItem = {
  id: number; numero: string; estado: string; vehiculoId: number | null;
  conductorId: number | null; responsableId?: number | null;
  salidaProgramadaEn?: string | null; salidaEn?: string | null; actualizadoEn?: string;
};
export type TransferItem = { id: number; estado: string; bodegaOrigenId: number; bodegaDestinoId: number; enviadaEn: string | null };

export type DailyPoint = { dia: string; monto: string; cantidad: number };
export type AgingPoint = { rango: string; monto: string };
export type DispatchPoint = { estado: string; cantidad: number };
export type RecentOrder = { id: number; numero: string; estado: string; clienteId: number; total: string; actualizadoEn: string };
export type RecentPayment = { id: number; estado: string; pedidoId: number | null; clienteId: number; monto: string; fechaPago: string };
export type TrackingStaff = {
  id: number; usuarioId: number; nombre: string; rol: string;
  ultimoHeartbeatEn: string | null;
  posicion: { latitud: number; longitud: number; capturadoEn: string | null } | null;
};
export type TrackingSummary = { sesionesActivas: number; sinHeartbeat10Min: number; items: TrackingStaff[] };

export interface DashboardSections {
  finanzas: FinanceSummary; cartera: PortfolioSummary; pedidos: OrderSummary;
  inventario: InventorySummary; logistica: LogisticsSummary;
  abastecimiento: SupplySummary; clientes: CustomerSummary; facturacion: InvoiceSummary;
  pagosPorVerificar: DashboardList<PaymentItem>;
  creditosPorAprobar: DashboardList<CreditItem>;
  cuotasVencidas: DashboardList<DueItem> & { monto: string };
  despachosFallidos: DashboardList<DispatchIssue>;
  incidenciasTransporte: DashboardList<TransportIssue>;
  requisicionesPorAprobar: DashboardList<RequisitionItem>;
  proximosCobros: DashboardList<DueItem> & { monto: string };
  pedidosPendientes: DashboardList<PendingOrder>;
  salidasProgramadas: DashboardList<ShipmentItem>;
  transferenciasPorRecibir: DashboardList<TransferItem>;
  cobrosDiarios: DailyPoint[]; pedidosDiarios: DailyPoint[];
  carteraAntiguedad: AgingPoint[]; despachosPorEstado: DispatchPoint[];
  ultimosPedidos: RecentOrder[]; ultimosPagos: RecentPayment[]; ultimosEnvios: ShipmentItem[];
  enviosEnRuta: DashboardList<ShipmentItem>;
  personalEnCampo: TrackingSummary;
}
export type DashboardResponse = {
  view: DashboardView; empresaId: number; generatedAt: string;
  timezone: "America/Guatemala";
  period: { desde: string; hasta: string };
  partial: boolean;
  sections: { [K in keyof DashboardSections]?: DashboardSection<DashboardSections[K]> };
};
export type DashboardSectionKey = keyof DashboardSections;
