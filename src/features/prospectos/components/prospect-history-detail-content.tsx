import type { ReactNode } from "react";
import { Clock3, ContactRound, MapPinned, ShoppingBasket } from "lucide-react";

import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import type { ProspectHistoryDetail, ProspectState } from "../api/prospect-history.types";
import {
  formatProspectDate, formatProspectDuration,
  prospectStatusLabel,
} from "../common/prospect-history.formatters";

function Datum({ label, children }: { label: string; children?: ReactNode }) {
  return (
    <div className="min-w-0 space-y-1">
      <dt className="text-xs text-[hsl(var(--app-muted-foreground))]">{label}</dt>
      <dd className="min-w-0 break-words text-sm">{children === null || children === undefined || children === "" ? "—" : children}</dd>
    </div>
  );
}

function Status({ status }: { status: ProspectState }) {
  return (
    <AppBadge
      tone={status === "FINALIZADO" ? "success" : status === "CERRADO" ? "danger" : "warning"}
      appearance="soft" size="sm"
    >
      {prospectStatusLabel(status)}
    </AppBadge>
  );
}

export function ProspectHistoryDetailContent({ prospect }: { prospect: ProspectHistoryDetail }) {
  const mapsUrl = prospect.ubicacion
    ? `https://www.google.com/maps?q=${prospect.ubicacion.latitud},${prospect.ubicacion.longitud}`
    : null;

  return (
    <div className="grid min-w-0 items-start gap-4 xl:grid-cols-2">
      <AppCard title="Información del prospecto" icon={<ContactRound />} size="sm">
        <dl className="grid min-w-0 gap-x-5 gap-y-4 sm:grid-cols-2">
          <Datum label="Nombres">{prospect.nombreCompleto}</Datum>
          <Datum label="Apellidos">{prospect.apellido}</Datum>
          <Datum label="Empresa o tienda">{prospect.empresaTienda}</Datum>
          <Datum label="Tipo de cliente">{prospect.tipoCliente}</Datum>
          <Datum label="Teléfono">
            {prospect.telefono ? <a className="hover:underline" href={`tel:${prospect.telefono}`}>{prospect.telefono}</a> : null}
          </Datum>
          <Datum label="Correo electrónico">
            {prospect.correo ? <a className="break-all text-[hsl(var(--app-primary))] hover:underline" href={`mailto:${prospect.correo}`}>{prospect.correo}</a> : null}
          </Datum>
        </dl>
      </AppCard>

      <AppCard title="Seguimiento y estado" icon={<Clock3 />} size="sm">
        <dl className="grid min-w-0 gap-x-5 gap-y-4 sm:grid-cols-2">
          <Datum label="Estado"><Status status={prospect.estado} /></Datum>
          <Datum label="Vendedor">{prospect.vendedor?.nombre}</Datum>
          <Datum label="Fecha de registro">{formatProspectDate(prospect.creadoEn)}</Datum>
          <Datum label="Inicio">{formatProspectDate(prospect.inicio)}</Datum>
          <Datum label="Finalización">{formatProspectDate(prospect.fin)}</Datum>
          <Datum label="Duración">{formatProspectDuration(prospect.duracionMinutos)}</Datum>
          <Datum label="Cliente vinculado">{prospect.clienteId ? `#${prospect.clienteId}` : "Sin vincular"}</Datum>
          <Datum label="Última actualización">{formatProspectDate(prospect.actualizadoEn)}</Datum>
        </dl>
      </AppCard>

      <AppCard title="Perfil comercial" icon={<ShoppingBasket />} size="sm">
        <dl className="grid min-w-0 gap-x-5 gap-y-4 sm:grid-cols-2">
          <Datum label="Volumen de compra">{prospect.volumenCompra}</Datum>
          <Datum label="Presupuesto mensual">{prospect.presupuestoMensual}</Datum>
          <Datum label="Contacto preferido">{prospect.preferenciaContacto}</Datum>
          <Datum label="Categorías de interés">{prospect.categoriasInteres?.join(", ")}</Datum>
          <div className="sm:col-span-2">
            <Datum label={prospect.estado === "CERRADO" ? "Motivo de cancelación" : "Comentarios"}>
              {prospect.comentarios}
            </Datum>
          </div>
        </dl>
      </AppCard>

      <AppCard title="Ubicación" icon={<MapPinned />} size="sm">
        <dl className="grid min-w-0 gap-x-5 gap-y-4 sm:grid-cols-2">
          <Datum label="Departamento">{prospect.departamento?.nombre}</Datum>
          <Datum label="Municipio">{prospect.municipio?.nombre}</Datum>
          <div className="sm:col-span-2">
            <Datum label="Dirección o referencia">{prospect.direccion}</Datum>
          </div>
          {prospect.ubicacion ? (
            <>
              <Datum label="Latitud">{prospect.ubicacion.latitud}</Datum>
              <Datum label="Longitud">{prospect.ubicacion.longitud}</Datum>
            </>
          ) : null}
        </dl>
        {mapsUrl ? (
          <a
            href={mapsUrl} target="_blank" rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--app-primary))] underline-offset-2 hover:underline"
          >
            <MapPinned className="h-4 w-4" /> Abrir ubicación en Google Maps
          </a>
        ) : (
          <p className="mt-4 text-xs text-[hsl(var(--app-muted-foreground))]">
            No se registraron coordenadas GPS para este prospecto.
          </p>
        )}
      </AppCard>
    </div>
  );
}
