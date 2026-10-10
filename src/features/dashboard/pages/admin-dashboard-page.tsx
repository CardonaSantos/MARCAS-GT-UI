import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Activity, ArrowRight, ArrowUpRight, Boxes, Building2, CalendarDays,
  ClipboardCheck, CreditCard, FileText, Landmark, PackageCheck,
  RefreshCw, ShieldAlert, TrendingUp, Truck, Users, Wallet,
} from "lucide-react";
import { useAdminDashboard } from "../api/dashboard.queries";
import { countGt, dashboardDates, dateGt, moneyGt } from "../common/dashboard.utils";
import { DashboardBlock, DashboardInfoLine, DashboardMetric, mutedText } from "../components/dashboard-widgets";
import { AgingChart, CashChart, DispatchChart, OrdersChart } from "../components/dashboard-charts";
import { DashboardActivity, DashboardAgenda, DashboardAttention, DashboardLive } from "../components/dashboard-operations";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";

const shortcuts = [
  { label: "Nuevo pedido", href: "/marcas-gt/pedidos/nuevo", icon: ClipboardCheck },
  { label: "Créditos", href: "/marcas-gt/creditos", icon: CreditCard },
  { label: "Pagos", href: "/marcas-gt/pagos", icon: Wallet },
  { label: "Despachos", href: "/marcas-gt/despachos", icon: PackageCheck },
  { label: "Envíos", href: "/marcas-gt/transporte/envios", icon: Truck },
  { label: "Tracking", href: "/marcas-gt/tracking", icon: Activity },
];

function isDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const time = Date.parse(value + "T00:00:00Z");
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value;
}

export default function AdminDashboardPage() {
  const [params, setParams] = useSearchParams();
  const range = params.get("periodo") ?? "30";
  const activeRange = (["7", "30", "90", "personalizado"] as const).includes(range as "7") ? range : "30";
  const defaults = useMemo(() => dashboardDates(30), []);
  const [fromInput, setFromInput] = useState(params.get("desde") ?? defaults.desde);
  const [toInput, setToInput] = useState(params.get("hasta") ?? defaults.hasta);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const span = activeRange === "personalizado"
    ? { desde: params.get("desde") ?? defaults.desde, hasta: params.get("hasta") ?? defaults.hasta }
    : dashboardDates(Number(activeRange));
  const filters = useMemo(() => ({ ...span, limit: 8 }), [span.desde, span.hasta]);
  const summary = useAdminDashboard("resumen", filters);
  const alerts = useAdminDashboard("alertas", filters);
  const agenda = useAdminDashboard("agenda", filters);
  const graphs = useAdminDashboard("graficos", filters);
  const activity = useAdminDashboard("actividad", filters);
  const live = useAdminDashboard("live", filters);
  const queries = [summary, alerts, agenda, graphs, activity, live];
  const anyFetching = queries.some(q => q.isFetching);
  const anyUnavailable = queries.some(q => q.isError || q.data?.partial);
  const latest = queries.map(q => q.data?.generatedAt).filter((x): x is string => !!x).sort().at(-1);
  const retryAll = () => { queries.forEach(q => { void q.refetch(); }); };
  const choosePeriod = (period: string) => {
    setValidationMessage(null);
    setParams(period === "personalizado"
      ? { periodo: period, desde: fromInput, hasta: toInput }
      : { periodo: period });
  };
  const applyCustom = () => {
    const start = Date.parse(fromInput + "T00:00:00Z");
    const end = Date.parse(toInput + "T00:00:00Z");
    if (!isDate(fromInput) || !isDate(toInput) || start > end || (end - start) > 365 * 86400000) {
      setValidationMessage("Selecciona fechas válidas, en orden, dentro de un máximo de 365 días.");
      return;
    }
    setValidationMessage(null);
    setParams({ periodo: "personalizado", desde: fromInput, hasta: toInput });
  };
  const overview = { loading: summary.isLoading, error: summary.isError, retry: () => { void summary.refetch(); } };
  const chartState = { loading: graphs.isLoading, error: graphs.isError, retry: () => { void graphs.refetch(); } };
  const source = (query: typeof summary) => ({
    data: query.data, isLoading: query.isLoading, isError: query.isError, retry: () => { void query.refetch(); },
  });
  return <main className="mx-auto w-full min-w-0 max-w-[1600px] space-y-6 px-3 py-5 sm:px-5 lg:space-y-8 lg:px-7 lg:py-7 2xl:px-10">
    <header className="relative overflow-hidden rounded-2xl border border-[hsl(var(--app-border))] bg-[hsl(var(--app-card-bg))] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-28 h-64 w-64 rounded-full bg-[hsl(var(--chart-1))] opacity-[.065] blur-3xl" />
      <div className="relative flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.17em] text-[hsl(var(--app-muted-foreground))]">
            <span className="inline-block h-2 w-2 rounded-full bg-[hsl(var(--chart-2))]" aria-hidden />
            MARCAS GT · Gestión administrativa
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Centro de control</h1>
          <p className={"mt-2 max-w-2xl text-sm leading-relaxed " + mutedText}>
            Finanzas, cartera, pedidos y logística en una sola vista. Prioriza pendientes y accede a cada operación.
          </p>
          <div className={"mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs " + mutedText}>
            <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> {span.desde} al {span.hasta} · Guatemala</span>
            <span className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5" /> {latest ? "Actualizado: " + dateGt(latest) : "Esperando datos..."}</span>
            {anyUnavailable && <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400"><ShieldAlert className="h-3.5 w-3.5" /> Algunas secciones no están disponibles</span>}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <AppButton size="sm" variant="outline" onClick={retryAll} disabled={anyFetching}
            leftIcon={<RefreshCw className={"h-4 w-4 " + (anyFetching ? "animate-spin" : "")} />}>Actualizar</AppButton>
          <AppButton size="sm" asChild><Link to="/marcas-gt/reportes" className="inline-flex items-center gap-1">
            Reportes <ArrowUpRight className="h-4 w-4" /></Link></AppButton>
        </div>
      </div>
    </header>

    <section aria-label="Rango de consulta" className="flex min-w-0 flex-col gap-3 rounded-xl border border-[hsl(var(--app-border))] bg-[hsl(var(--app-card-bg))] px-3 py-3 sm:px-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold">Período de análisis</p>
        <div className="flex flex-wrap gap-1.5">
          {[["7", "7 días"], ["30", "30 días"], ["90", "90 días"], ["personalizado", "Personalizado"]].map(([key, label]) =>
            <button key={key} type="button" onClick={() => choosePeriod(key)} aria-pressed={activeRange === key}
              className={"rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors " +
                (activeRange === key ? "border-[hsl(var(--app-primary))] bg-[hsl(var(--app-muted-bg))]" :
                  "border-[hsl(var(--app-border))] hover:bg-[hsl(var(--app-muted-bg))]")}>{label}</button>)}
        </div>
      </div>
      {activeRange === "personalizado" && <div className="flex flex-wrap items-end gap-2 border-t border-[hsl(var(--app-border))] pt-3">
        <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs sm:flex-initial">Desde
          <input type="date" value={fromInput} onChange={e => setFromInput(e.target.value)}
            className="min-h-9 w-full rounded-lg border border-[hsl(var(--app-border))] bg-transparent px-2 text-sm sm:w-44" /></label>
        <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs sm:flex-initial">Hasta
          <input type="date" value={toInput} onChange={e => setToInput(e.target.value)}
            className="min-h-9 w-full rounded-lg border border-[hsl(var(--app-border))] bg-transparent px-2 text-sm sm:w-44" /></label>
        <AppButton size="sm" onClick={applyCustom}>Aplicar fechas</AppButton>
        {validationMessage && <p role="alert" className="w-full text-xs text-red-600 dark:text-red-400">{validationMessage}</p>}
      </div>}
    </section>

    <section aria-label="Indicadores principales" className="grid min-w-0 grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
      <DashboardMetric label="Cobros verificados" icon={Wallet} section={summary.data?.sections.finanzas}
        value={r => moneyGt(r.cobrosVerificados)} description="Dinero recibido en el período"
        href="/marcas-gt/pagos" {...overview} emphasized/>
      <DashboardMetric label="Saldo por cobrar" icon={Landmark} section={summary.data?.sections.cartera}
        value={r => moneyGt(r.pendiente)} description="CxC con saldo abierto"
        href="/marcas-gt/facturacion/cuentas-por-cobrar" {...overview}/>
      <DashboardMetric label="Cartera vencida" icon={ShieldAlert} section={summary.data?.sections.cartera}
        value={r => moneyGt(r.vencido)} description="Deuda con vencimiento pasado"
        href="/marcas-gt/creditos/cartera" {...overview}/>
      <DashboardMetric label="Valor de pedidos" icon={ClipboardCheck} section={summary.data?.sections.pedidos}
        value={r => moneyGt(r.valorNetoPedidos)} description="No equivale a dinero cobrado"
        href="/marcas-gt/pedidos" {...overview}/>
      <DashboardMetric label="Envíos activos" icon={Truck} section={summary.data?.sections.logistica}
        value={r => countGt(r.enviosEnRutaOIncidencia)} description="En ruta o con incidencia"
        href="/marcas-gt/transporte/envios" {...overview}/>
      <DashboardMetric label="Cuotas por vencer" icon={CalendarDays} section={summary.data?.sections.cartera}
        value={r => moneyGt(r.porVencer7Dias)} description="Próximos 7 días"
        href="/marcas-gt/facturacion/cuentas-por-cobrar" {...overview}/>
    </section>

    <section aria-label="Accesos rápidos" className="space-y-2">
      <p className={"text-[11px] font-semibold uppercase tracking-[.16em] " + mutedText}>Accesos rápidos</p>
      <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {shortcuts.map(shortcut => <Link key={shortcut.href} to={shortcut.href}
          className="group flex min-w-0 items-center justify-between gap-2 rounded-xl border border-[hsl(var(--app-border))] bg-[hsl(var(--app-card-bg))] px-3 py-3 text-sm font-medium transition-colors hover:bg-[hsl(var(--app-muted-bg))]">
          <span className="flex min-w-0 items-center gap-2"><shortcut.icon className="h-4 w-4 shrink-0 text-[hsl(var(--app-muted-foreground))]" />
            <span className="truncate">{shortcut.label}</span></span><ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-40 group-hover:opacity-100" />
        </Link>)}
      </nav>
    </section>

    <DashboardAttention source={source(alerts)} />

    <section className="space-y-3" aria-labelledby="dashboard-finance-title">
      <div><p className={"text-[11px] font-semibold uppercase tracking-[.16em] " + mutedText}>Análisis histórico</p>
        <h2 id="dashboard-finance-title" className="mt-1 text-lg font-semibold">Cobros, pedidos y cartera</h2></div>
      <div className="grid min-w-0 gap-3 xl:grid-cols-2">
        <CashChart section={graphs.data?.sections.cobrosDiarios} {...chartState} from={span.desde} to={span.hasta}/>
        <OrdersChart section={graphs.data?.sections.pedidosDiarios} {...chartState} from={span.desde} to={span.hasta}/>
        <AgingChart section={graphs.data?.sections.carteraAntiguedad} {...chartState}/>
        <DispatchChart section={graphs.data?.sections.despachosPorEstado} {...chartState}/>
      </div>
    </section>

    <DashboardAgenda source={source(agenda)}/>

    <section className="space-y-3" aria-labelledby="dashboard-ops-title">
      <div><p className={"text-[11px] font-semibold uppercase tracking-[.16em] " + mutedText}>Panorama de áreas</p>
        <h2 id="dashboard-ops-title" className="mt-1 text-lg font-semibold">Operación, abastecimiento y administración</h2></div>
      <div className="grid min-w-0 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
        <DashboardBlock title="Pedidos y despachos" icon={ClipboardCheck} section={summary.data?.sections.pedidos}
          href="/marcas-gt/pedidos" {...overview}>
          {v => <div className="divide-y divide-[hsl(var(--app-border))]">
            <DashboardInfoLine label="Pedidos del período" value={countGt(v.pedidosPeriodo)}/>
            <DashboardInfoLine label="Pendientes de validar" value={countGt(v.porValidar)} href="/marcas-gt/pedidos"/>
            <DashboardInfoLine label="Pendientes de salida" value={countGt(v.pendientesDeSalida)} href="/marcas-gt/despachos"/>
          </div>}
        </DashboardBlock>
        <DashboardBlock title="Bodegas e inventario" icon={Boxes} section={summary.data?.sections.inventario}
          href="/marcas-gt/inventario" {...overview}>
          {v => <div className="divide-y divide-[hsl(var(--app-border))]">
            <DashboardInfoLine label="Bodegas activas" value={countGt(v.bodegasActivas)} href="/marcas-gt/bodegas"/>
            <DashboardInfoLine label="Unidades disponibles" value={countGt(v.unidadesDisponibles)}/>
            <DashboardInfoLine label="Unidades reservadas" value={countGt(v.unidadesReservadas)}/>
            <DashboardInfoLine label="Referencias agotadas" value={countGt(v.referenciasAgotadas)}/>
          </div>}
        </DashboardBlock>
        <DashboardBlock title="Logística y entregas" icon={PackageCheck} section={summary.data?.sections.logistica}
          href="/marcas-gt/despachos" {...overview}>
          {v => <div className="divide-y divide-[hsl(var(--app-border))]">
            <DashboardInfoLine label="Despachos abiertos" value={countGt(v.despachosAbiertos)}/>
            <DashboardInfoLine label="Entregas del período" value={countGt(v.entregasPeriodo)} href="/marcas-gt/entregas"/>
            <DashboardInfoLine label="Incidencias abiertas" value={countGt(v.incidenciasAbiertas)} href="/marcas-gt/transporte/envios"/>
          </div>}
        </DashboardBlock>
        <DashboardBlock title="Abastecimiento" icon={Building2} section={summary.data?.sections.abastecimiento}
          href="/marcas-gt/requisiciones" {...overview}>
          {v => <div className="divide-y divide-[hsl(var(--app-border))]">
            <DashboardInfoLine label="Requisiciones por aprobar" value={countGt(v.requisicionesPorAprobar)} href="/marcas-gt/requisiciones"/>
            <DashboardInfoLine label="Transferencias en tránsito" value={countGt(v.transferenciasEnTransito)} href="/marcas-gt/transferencias"/>
          </div>}
        </DashboardBlock>
        <DashboardBlock title="Cartera y créditos" icon={CreditCard} section={summary.data?.sections.cartera}
          href="/marcas-gt/creditos/cartera" {...overview}>
          {v => <div className="divide-y divide-[hsl(var(--app-border))]">
            <DashboardInfoLine label="CxC abiertas" value={countGt(v.cuentasAbiertas)}/>
            <DashboardInfoLine label="Cuotas vencidas" value={countGt(v.cuentasVencidas)}/>
            <DashboardInfoLine label="Planes por activar" value={countGt(v.planesSinActivar)} href="/marcas-gt/creditos/cartera"/>
          </div>}
        </DashboardBlock>
        <DashboardBlock title="Facturación" icon={FileText} section={summary.data?.sections.facturacion}
          href="/marcas-gt/facturacion/facturas" {...overview}>
          {v => <div className="divide-y divide-[hsl(var(--app-border))]">
            <DashboardInfoLine label="Borradores" value={countGt(v.borradores)}/>
            <DashboardInfoLine label="Listas para emisión" value={countGt(v.listasEmision)}/>
            <DashboardInfoLine label="Emitidas en el período" value={countGt(v.emitidasPeriodo)}/>
            <DashboardInfoLine label="Monto emitido" value={moneyGt(v.montoEmitido)}/>
          </div>}
        </DashboardBlock>
        <DashboardBlock title="Clientes vinculados" icon={Users} section={summary.data?.sections.clientes}
          href="/marcas-gt/clientes" {...overview}>
          {v => <div className="divide-y divide-[hsl(var(--app-border))]">
            <DashboardInfoLine label="Con pedidos de la empresa" value={countGt(v.clientesConPedidos)}/>
            <DashboardInfoLine label="Con pedidos del período" value={countGt(v.clientesConPedidosPeriodo)}/>
            <p className={"pt-3 text-xs leading-relaxed " + mutedText}>No incluye clientes del catálogo sin pedidos.</p>
          </div>}
        </DashboardBlock>
        <DashboardBlock title="Conciliación de pagos" icon={TrendingUp} section={summary.data?.sections.finanzas}
          href="/marcas-gt/pagos" {...overview}>
          {v => <div className="divide-y divide-[hsl(var(--app-border))]">
            <DashboardInfoLine label="Cobros verificados" value={countGt(v.numeroCobros)}/>
            <DashboardInfoLine label="Pagos sin verificar" value={countGt(v.pagosPorVerificar)}/>
            <DashboardInfoLine label="Verificados sin aplicaciones" value={countGt(v.pagosVerificadosSinAplicaciones)}/>
            <p className={"pt-3 text-xs leading-relaxed " + mutedText}>El conteo sin aplicaciones no equivale al saldo financiero disponible.</p>
          </div>}
        </DashboardBlock>
      </div>
    </section>

    <DashboardLive source={source(live)}/>
    <DashboardActivity source={source(activity)}/>

    <footer className={"flex flex-wrap items-center justify-between gap-2 border-t border-[hsl(var(--app-border))] pt-4 text-xs " + mutedText}>
      <span>Indicadores de la empresa autenticada · Valores monetarios en GTQ</span>
      <Link to="/marcas-gt/reportes" className="inline-flex items-center gap-1 hover:underline">Ir a reportes <ArrowUpRight className="h-3.5 w-3.5" /></Link>
    </footer>
  </main>;
}
