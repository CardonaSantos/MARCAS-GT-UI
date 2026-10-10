import { Activity, AlertTriangle, ClipboardCheck, Clock3, CreditCard, PackageCheck, Route, Truck, Wallet, ArrowRightLeft } from "lucide-react";
import type { DashboardResponse } from "../api/dashboard.types";
import { dateGt, moneyGt, timeGt } from "../common/dashboard.utils";
import { DashboardBlock, DashboardRecord, DashboardInfoLine, mutedText } from "./dashboard-widgets";

type Source = {
  data?: DashboardResponse;
  isLoading: boolean;
  isError: boolean;
  retry: () => void;
};
export function DashboardAttention({ source }: { source: Source }) {
  const { data, isLoading, isError, retry } = source;
  const base = { loading: isLoading, error: isError, retry };
  return <section aria-labelledby="dashboard-alert-title" className="space-y-3">
    <div className="flex flex-wrap items-end justify-between gap-2">
      <div>
        <p className={"text-[11px] font-semibold uppercase tracking-[.16em] " + mutedText}>Pendientes y excepciones</p>
        <h2 id="dashboard-alert-title" className="mt-1 text-lg font-semibold tracking-tight">Requiere tu atención</h2>
      </div>
      <p className={"text-xs " + mutedText}>Accede directamente a cada registro</p>
    </div>
    <div className="grid min-w-0 gap-3 md:grid-cols-2 2xl:grid-cols-3">
      <DashboardBlock title="Cuotas vencidas" description="Cuentas con saldo y vencimiento anterior a hoy" icon={AlertTriangle}
        section={data?.sections.cuotasVencidas} href="/marcas-gt/facturacion/cuentas-por-cobrar" {...base}>
        {v => <div className="space-y-3">
          <div className="flex items-baseline justify-between gap-2"><strong className="text-xl tabular-nums">{v.total}</strong><span className="text-sm font-semibold tabular-nums">{moneyGt(v.monto)}</span></div>
          {v.items.length ? <div className="space-y-2">{v.items.slice(0, 3).map(item =>
            <DashboardRecord key={item.id} title={item.numeroDocumento || "Cuenta #" + item.id}
              detail={"Venció: " + dateGt(item.fechaVencimiento)}
              amount={moneyGt(item.saldoPendiente)}
              href={item.creditoId ? "/marcas-gt/creditos/cartera/" + item.creditoId : "/marcas-gt/facturacion/cuentas-por-cobrar"} />)}</div>
            : <p className={"text-xs " + mutedText}>Sin cuotas vencidas.</p>}
        </div>}
      </DashboardBlock>
      <DashboardBlock title="Pagos por verificar" description="Registros pendientes de confirmación" icon={Wallet}
        section={data?.sections.pagosPorVerificar} href="/marcas-gt/pagos" {...base}>
        {v => <div className="space-y-3"><strong className="text-xl tabular-nums">{v.total}</strong>
          {v.items.length ? <div className="space-y-2">{v.items.slice(0, 3).map(item =>
            <DashboardRecord key={item.id} title={"Pago #" + item.id}
              detail={"Cliente #" + item.clienteId + " · " + dateGt(item.fechaPago)}
              amount={moneyGt(item.monto)} href={"/marcas-gt/pagos/" + item.id} />)}</div>
            : <p className={"text-xs " + mutedText}>No hay pagos pendientes de verificación.</p>}</div>}
      </DashboardBlock>
      <DashboardBlock title="Créditos por aprobar" description="Solicitudes pendientes o en revisión" icon={CreditCard}
        section={data?.sections.creditosPorAprobar} href="/marcas-gt/creditos" {...base}>
        {v => <div className="space-y-3"><strong className="text-xl tabular-nums">{v.total}</strong>
          {v.items.length ? <div className="space-y-2">{v.items.slice(0, 3).map(item =>
            <DashboardRecord key={item.id} title={item.numero}
              detail={"Solicitado " + dateGt(item.solicitadaEn)}
              amount={moneyGt(item.montoSolicitado)}
              href={"/marcas-gt/creditos/solicitudes/" + item.id} />)}</div>
            : <p className={"text-xs " + mutedText}>Todas las solicitudes están atendidas.</p>}</div>}
      </DashboardBlock>
      <DashboardBlock title="Incidencias de transporte" description="Problemas abiertos o en atención" icon={Route}
        section={data?.sections.incidenciasTransporte} href="/marcas-gt/transporte/envios" {...base}>
        {v => <div className="space-y-3"><strong className="text-xl tabular-nums">{v.total}</strong>
          {v.items.length ? <div className="space-y-2">{v.items.slice(0, 3).map(item =>
            <DashboardRecord key={item.id} title={item.tipo.replace(/_/g, " ")}
              detail={"Envío #" + item.envioId + " · " + dateGt(item.reportadaEn)}
              badge={item.severidad} href={"/marcas-gt/transporte/envios/" + item.envioId} />)}</div>
            : <p className={"text-xs " + mutedText}>Sin incidencias abiertas.</p>}</div>}
      </DashboardBlock>
      <DashboardBlock title="Operaciones de despacho fallidas" description="Operaciones que requieren revisión" icon={PackageCheck}
        section={data?.sections.despachosFallidos} href="/marcas-gt/despachos/operaciones" {...base}>
        {v => <div className="space-y-3"><strong className="text-xl tabular-nums">{v.total}</strong>
          {v.items.length ? <div className="space-y-2">{v.items.slice(0, 3).map(item =>
            <DashboardRecord key={item.id} title={item.tipo.replace(/_/g, " ")}
              detail={"Despacho #" + item.ordenDespachoId + " · " + item.intentos + " intento(s)"}
              href={"/marcas-gt/despachos/" + item.ordenDespachoId} />)}</div>
            : <p className={"text-xs " + mutedText}>Sin operaciones fallidas.</p>}</div>}
      </DashboardBlock>
      <DashboardBlock title="Requisiciones por aprobar" description="Solicitudes de abastecimiento" icon={ClipboardCheck}
        section={data?.sections.requisicionesPorAprobar} href="/marcas-gt/requisiciones" {...base}>
        {v => <div className="space-y-3"><strong className="text-xl tabular-nums">{v.total}</strong>
          {v.items.length ? <div className="space-y-2">{v.items.slice(0, 3).map(item =>
            <DashboardRecord key={item.id} title={"Requisición #" + item.id}
              detail={"Bodega destino #" + item.bodegaDestinoId + " · " + dateGt(item.solicitadaEn)}
              href={"/marcas-gt/requisiciones/" + item.id} />)}</div>
            : <p className={"text-xs " + mutedText}>No hay requisiciones por aprobar.</p>}</div>}
      </DashboardBlock>
    </div>
  </section>;
}

export function DashboardAgenda({ source }: { source: Source }) {
  const { data, isLoading, isError, retry } = source;
  const base = { loading: isLoading, error: isError, retry };
  return <section className="space-y-3" aria-labelledby="dashboard-agenda-title">
    <div><p className={"text-[11px] font-semibold uppercase tracking-[.16em] " + mutedText}>Próximas actividades</p>
      <h2 id="dashboard-agenda-title" className="mt-1 text-lg font-semibold">Agenda administrativa</h2></div>
    <div className="grid min-w-0 gap-3 lg:grid-cols-2 2xl:grid-cols-4">
      <DashboardBlock title="Vencimientos próximos" description="Cuentas por cobrar de los siguientes 7 días" icon={Clock3}
        section={data?.sections.proximosCobros} href="/marcas-gt/facturacion/cuentas-por-cobrar" {...base}>
        {v => <div className="space-y-2"><div className="flex items-baseline justify-between gap-2"><strong className="text-xl">{v.total}</strong><span className="font-semibold tabular-nums">{moneyGt(v.monto)}</span></div>
          {v.items.slice(0, 4).map(item => <DashboardRecord key={item.id} title={"CxC #" + item.id}
            detail={dateGt(item.fechaVencimiento)} amount={moneyGt(item.saldoPendiente)}
            href={item.creditoId ? "/marcas-gt/creditos/cartera/" + item.creditoId : "/marcas-gt/facturacion/cuentas-por-cobrar"} />)}
          {!v.total && <p className={"text-xs " + mutedText}>Sin vencimientos en los próximos siete días.</p>}
        </div>}
      </DashboardBlock>
      <DashboardBlock title="Pedidos pendientes" description="Validación, preparación o salida" icon={ClipboardCheck}
        section={data?.sections.pedidosPendientes} href="/marcas-gt/pedidos" {...base}>
        {v => <div className="space-y-2"><strong className="text-xl">{v.total}</strong>
          {v.items.slice(0, 4).map(item => <DashboardRecord key={item.id} title={item.numero}
            detail={dateGt(item.creadoEn)} badge={item.estado} href={"/marcas-gt/pedidos/" + item.id} />)}
          {!v.total && <p className={"text-xs " + mutedText}>Sin pedidos pendientes.</p>}
        </div>}
      </DashboardBlock>
      <DashboardBlock title="Salidas programadas" description="Próximos siete días" icon={Truck}
        section={data?.sections.salidasProgramadas} href="/marcas-gt/transporte/envios" {...base}>
        {v => <div className="space-y-2"><strong className="text-xl">{v.total}</strong>
          {v.items.slice(0, 4).map(item => <DashboardRecord key={item.id} title={item.numero}
            detail={dateGt(item.salidaProgramadaEn)} badge={item.estado}
            href={"/marcas-gt/transporte/envios/" + item.id} />)}
          {!v.total && <p className={"text-xs " + mutedText}>Sin salidas próximas.</p>}
        </div>}
      </DashboardBlock>
      <DashboardBlock title="Transferencias por recibir" description="En tránsito o con recepción parcial" icon={ArrowRightLeft}
        section={data?.sections.transferenciasPorRecibir} href="/marcas-gt/transferencias" {...base}>
        {v => <div className="space-y-2"><strong className="text-xl">{v.total}</strong>
          {v.items.slice(0, 4).map(item => <DashboardRecord key={item.id} title={"Transferencia #" + item.id}
            detail={"Bodega " + item.bodegaOrigenId + " → " + item.bodegaDestinoId}
            badge={item.estado} href={"/marcas-gt/transferencias/" + item.id} />)}
          {!v.total && <p className={"text-xs " + mutedText}>Sin transferencias pendientes.</p>}
        </div>}
      </DashboardBlock>
    </div>
  </section>;
}

export function DashboardLive({ source }: { source: Source }) {
  const { data, isLoading, isError, retry } = source;
  const base = { loading: isLoading, error: isError, retry };
  return <section className="space-y-3" aria-labelledby="dashboard-live-title">
    <div><p className={"text-[11px] font-semibold uppercase tracking-[.16em] " + mutedText}>Operación actual</p>
      <h2 id="dashboard-live-title" className="mt-1 text-lg font-semibold">Transporte y personal en campo</h2></div>
    <div className="grid min-w-0 gap-3 lg:grid-cols-2">
      <DashboardBlock title="Envíos activos" description="Viajes en ruta o con incidencia" icon={Truck}
        section={data?.sections.enviosEnRuta} href="/marcas-gt/transporte/envios" {...base}>
        {v => <div className="space-y-3"><DashboardInfoLine label="Viajes activos" value={v.total}/>
          {v.items.length ? v.items.slice(0, 5).map(item => <DashboardRecord key={item.id} title={item.numero}
            detail={"Conductor #" + (item.conductorId ?? "sin asignar") + " · Inicio " + timeGt(item.salidaEn)}
            badge={item.estado} href={"/marcas-gt/transporte/envios/" + item.id} />)
            : <p className={"text-xs " + mutedText}>No hay envíos en ruta actualmente.</p>}
        </div>}
      </DashboardBlock>
      <DashboardBlock title="Personal en campo" description="Sesiones de tracking (no sesiones web)" icon={Activity}
        section={data?.sections.personalEnCampo} href="/marcas-gt/tracking" linkLabel="Abrir mapa" {...base}>
        {v => <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><span className={"block text-xs " + mutedText}>Sesiones activas</span><strong className="text-xl tabular-nums">{v.sesionesActivas}</strong></div>
            <div><span className={"block text-xs " + mutedText}>Sin señal reciente</span><strong className="text-xl tabular-nums">{v.sinHeartbeat10Min}</strong></div>
          </div>
          {v.items.length ? v.items.slice(0, 5).map(person => <DashboardRecord key={person.id}
            title={person.nombre} detail={person.rol + " · Última señal " + timeGt(person.ultimoHeartbeatEn)}
            href="/marcas-gt/tracking" />) :
            <p className={"text-xs " + mutedText}>No hay jornadas de tracking activas.</p>}
        </div>}
      </DashboardBlock>
    </div>
  </section>;
}

export function DashboardActivity({ source }: { source: Source }) {
  const { data, isLoading, isError, retry } = source;
  const base = { loading: isLoading, error: isError, retry };
  return <section className="space-y-3" aria-labelledby="dashboard-activity-title">
    <div><p className={"text-[11px] font-semibold uppercase tracking-[.16em] " + mutedText}>Últimos movimientos</p>
      <h2 id="dashboard-activity-title" className="mt-1 text-lg font-semibold">Actividad reciente</h2></div>
    <div className="grid min-w-0 gap-3 lg:grid-cols-3">
      <DashboardBlock title="Pedidos" icon={ClipboardCheck} section={data?.sections.ultimosPedidos}
        href="/marcas-gt/pedidos" {...base} isEmpty={v => v.length === 0}>
        {v => <div className="space-y-2">{v.slice(0, 5).map(item => <DashboardRecord key={item.id} title={item.numero}
          detail={dateGt(item.actualizadoEn)} badge={item.estado}
          href={"/marcas-gt/pedidos/" + item.id} />)}</div>}
      </DashboardBlock>
      <DashboardBlock title="Pagos" icon={Wallet} section={data?.sections.ultimosPagos}
        href="/marcas-gt/pagos" {...base} isEmpty={v => v.length === 0}>
        {v => <div className="space-y-2">{v.slice(0, 5).map(item => <DashboardRecord key={item.id} title={"Pago #" + item.id}
          detail={dateGt(item.fechaPago)} amount={moneyGt(item.monto)}
          href={"/marcas-gt/pagos/" + item.id} />)}</div>}
      </DashboardBlock>
      <DashboardBlock title="Envíos" icon={Truck} section={data?.sections.ultimosEnvios}
        href="/marcas-gt/transporte/envios" {...base} isEmpty={v => v.length === 0}>
        {v => <div className="space-y-2">{v.slice(0, 5).map(item => <DashboardRecord key={item.id} title={item.numero}
          detail={dateGt(item.actualizadoEn)} badge={item.estado}
          href={"/marcas-gt/transporte/envios/" + item.id} />)}</div>}
      </DashboardBlock>
    </div>
  </section>;
}
