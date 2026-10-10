import type { ReactNode } from "react";
import { Banknote, CalendarClock, ContactRound, MapPin, ShoppingCart, UserRound } from "lucide-react";

import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import type { VisitHistoryDetail } from "../api/visit-history.types";
import { customerName, visitDate, visitDuration, visitStatusLabel } from "../common/visit-history.formatters";
import { visitReasonLabel, visitTypeLabel } from "../common/visit-workflow.formatters";

const money = (v: number | string | null) => {
  const n = Number(v);
  return v === null || !Number.isFinite(n)
    ? "—" : new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ" }).format(n);
};

function Field({ label, children }: { label: string; children?: ReactNode }) {
  return (
    <div className="min-w-0 space-y-1">
      <dt className="text-xs text-[hsl(var(--app-muted-foreground))]">{label}</dt>
      <dd className="min-w-0 break-words text-sm">
        {children === null || children === undefined || children === "" ? "—" : children}
      </dd>
    </div>
  );
}

export function VisitHistoryDetailContent({ visit }: { visit: VisitHistoryDetail }) {
  const c = visit.cliente;
  const googleMaps = c.ubicacion
    ? `https://www.google.com/maps?q=${c.ubicacion.latitud},${c.ubicacion.longitud}`
    : null;

  return (
    <div className="grid min-w-0 items-start gap-4 xl:grid-cols-2">
      <AppCard title="Registro de visita" icon={<CalendarClock />} size="sm">
        <dl className="grid min-w-0 gap-x-5 gap-y-4 sm:grid-cols-2">
          <Field label="Estado">
            <AppBadge tone={visit.estadoVisita === "FINALIZADA" ? "success"
              : visit.estadoVisita === "CANCELADA" ? "danger" : "warning"} size="sm">
              {visitStatusLabel(visit.estadoVisita)}
            </AppBadge>
          </Field>
          <Field label="Tipo">{visitTypeLabel(visit.tipoVisita)}</Field>
          <Field label="Motivo">{visitReasonLabel(visit.motivoVisita)}</Field>
          <Field label="Duración">{visitDuration(visit.duracionMinutos)}</Field>
          <Field label="Inicio">{visitDate(visit.inicio)}</Field>
          <Field label="Finalización">{visitDate(visit.fin)}</Field>
          <Field label="Registro creado">{visitDate(visit.creadoEn)}</Field>
          <Field label="Última actualización">{visitDate(visit.actualizadoEn)}</Field>
          <div className="sm:col-span-2">
            <Field label={visit.estadoVisita === "CANCELADA"
              ? "Motivo de cancelación" : "Observaciones"}>
              {visit.observaciones}
            </Field>
          </div>
        </dl>
      </AppCard>

      <AppCard title="Cliente y contacto" icon={<ContactRound />} size="sm">
        <dl className="grid min-w-0 gap-x-5 gap-y-4 sm:grid-cols-2">
          <Field label="Cliente">{customerName(c)}</Field>
          <Field label="Tipo de cliente">{c.tipoCliente}</Field>
          <Field label="Teléfono">
            {c.telefono ? <a href={`tel:${c.telefono}`} className="hover:underline">{c.telefono}</a> : null}
          </Field>
          <Field label="Correo">
            {c.correo ? <a href={`mailto:${c.correo}`}
              className="break-all hover:underline">{c.correo}</a> : null}
          </Field>
          <Field label="Presupuesto mensual">{c.presupuestoMensual}</Field>
          <Field label="Contacto preferido">{c.preferenciaContacto}</Field>
          <div className="sm:col-span-2">
            <Field label="Intereses">{c.categoriasInteres?.join(", ")}</Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Comentarios del cliente">{c.comentarios}</Field>
          </div>
        </dl>
      </AppCard>

      <AppCard title="Vendedor y ubicación" icon={<UserRound />} size="sm">
        <dl className="grid min-w-0 gap-x-5 gap-y-4 sm:grid-cols-2">
          <Field label="Vendedor">{visit.vendedor.nombre}</Field>
          <Field label="Correo del vendedor">{visit.vendedor.correo}</Field>
          <Field label="Departamento">{c.departamento?.nombre}</Field>
          <Field label="Municipio">{c.municipio?.nombre}</Field>
          <div className="sm:col-span-2">
            <Field label="Dirección del cliente">{c.direccion}</Field>
          </div>
        </dl>
        {googleMaps ? (
          <a href={googleMaps} target="_blank" rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-[hsl(var(--app-primary))] hover:underline">
            <MapPin className="h-4 w-4" /> Ver ubicación registrada del cliente
          </a>
        ) : (
          <p className="mt-4 text-xs text-[hsl(var(--app-muted-foreground))]">
            Este cliente no tiene coordenadas registradas.
          </p>
        )}
      </AppCard>

      <AppCard title="Ventas vinculadas" icon={<Banknote />} size="sm">
        {visit.ventas.length ? (
          <div className="space-y-3">
            <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
              {visit._count.ventas} venta(s) vinculada(s). Mostrando hasta 30 recientes.
            </p>
            <div className="divide-y divide-[hsl(var(--app-border))]">
              {visit.ventas.map((sale) => (
                <dl key={sale.id} className="grid grid-cols-2 gap-3 py-3 text-sm">
                  <Field label="Venta">#{sale.id}</Field>
                  <Field label="Fecha">{visitDate(sale.timestamp)}</Field>
                  <Field label="Monto">{money(sale.monto)}</Field>
                  <Field label="Total con descuento">{money(sale.montoConDescuento)}</Field>
                  <Field label="Pago">{sale.metodoPago.replace(/_/g, " ")}</Field>
                  <Field label="Referencia">{sale.referenciaPago}</Field>
                </dl>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-[hsl(var(--app-muted-foreground))]">
            No hay ventas relacionadas con esta visita.
          </p>
        )}
      </AppCard>

      <div className="xl:col-span-2">
        <AppCard title="Pedidos vinculados" icon={<ShoppingCart />} size="sm">
          {visit.pedidos.length ? (
            <div className="space-y-3">
              <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                {visit._count.pedidos} pedido(s) vinculado(s). Mostrando hasta 30 recientes.
              </p>
              <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {visit.pedidos.map((order) => (
                  <dl key={order.id} className="grid grid-cols-2 gap-3 rounded-md border border-[hsl(var(--app-border))] p-3">
                    <Field label="Pedido">{order.numero || `#${order.id}`}</Field>
                    <Field label="Fecha">{visitDate(order.creadoEn)}</Field>
                    <Field label="Total">{money(order.total)}</Field>
                    <Field label="Estado">{order.estado.replace(/_/g, " ")}</Field>
                    <Field label="Estado de pago">{order.estadoPago.replace(/_/g, " ")}</Field>
                  </dl>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-[hsl(var(--app-muted-foreground))]">
              No hay pedidos relacionados con esta visita.
            </p>
          )}
        </AppCard>
      </div>
    </div>
  );
}
