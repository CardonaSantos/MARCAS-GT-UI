import { CalendarClock, MapPin, Phone, UserRound } from "lucide-react";

import { formatDateTime } from "@/features/common/formatters/value.formatters";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";
import { AppStatusDot } from "@/ui/components/app/primitives/app-status-dot";

import type { BodegaDetail } from "../api/bodega.types";

function DetailValue({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-[hsl(var(--app-foreground))]">
        {value ?? "—"}
      </dd>
    </div>
  );
}

export function BodegaDetailSummary({ bodega }: { bodega: BodegaDetail }) {
  return (
    <div className="space-y-4">
      <AppCard title="Información general" size="sm">
        <dl>
          <AppGrid cols={{ base: 1, md: 2, xl: 4 }} gap="md">
            <DetailValue label="Código" value={bodega.codigo} />
            <DetailValue label="Nombre" value={bodega.nombre} />
            <DetailValue
              label="Estado"
              value={
                <AppStatusDot
                  tone={bodega.activo ? "success" : "danger"}
                  label={bodega.activo ? "Activa" : "Inactiva"}
                />
              }
            />
            <DetailValue
              label="Tipo"
              value={bodega.esPrincipal ? "Principal" : "Secundaria"}
            />
          </AppGrid>

          {bodega.descripcion ? (
            <div className="mt-4 border-t border-[hsl(var(--app-border))] pt-4">
              <DetailValue label="Descripción" value={bodega.descripcion} />
            </div>
          ) : null}
        </dl>
      </AppCard>

      <AppGrid cols={{ base: 1, lg: 2 }} gap="sm">
        <AppCard title="Ubicación y contacto" icon={<MapPin />} size="sm">
          <dl className="grid gap-4 sm:grid-cols-2">
            <DetailValue label="Dirección" value={bodega.direccion ?? "—"} />
            <DetailValue
              label="Teléfono"
              value={
                bodega.telefono ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {bodega.telefono}
                  </span>
                ) : (
                  "—"
                )
              }
            />
          </dl>
        </AppCard>

        <AppCard title="Responsable" icon={<UserRound />} size="sm">
          {bodega.responsable ? (
            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailValue label="Nombre" value={bodega.responsable.nombre} />
              <DetailValue label="Rol" value={bodega.responsable.rol} />
              <DetailValue label="Correo" value={bodega.responsable.correo} />
              <DetailValue
                label="Estado"
                value={bodega.responsable.activo ? "Activo" : "Inactivo"}
              />
            </dl>
          ) : (
            <p className="text-sm text-[hsl(var(--app-muted-foreground))]">
              Esta bodega no tiene responsable asignado.
            </p>
          )}
        </AppCard>
      </AppGrid>

      <AppCard title="Auditoría" icon={<CalendarClock />} size="sm">
        <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DetailValue label="Creada" value={formatDateTime(bodega.creadoEn)} />
          <DetailValue
            label="Actualizada"
            value={formatDateTime(bodega.actualizadoEn)}
          />
          <DetailValue
            label="Inactivada"
            value={formatDateTime(bodega.inactivadaEn)}
          />
          <DetailValue
            label="Motivo de inactivación"
            value={bodega.motivoInactivacion ?? "—"}
          />
        </dl>
      </AppCard>
    </div>
  );
}
