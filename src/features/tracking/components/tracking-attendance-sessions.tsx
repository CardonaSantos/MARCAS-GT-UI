import { Battery, Clock3, Crosshair, MapPin } from "lucide-react";

import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppInline } from "@/ui/components/app/primitives/app-inline";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

import type {
  TrackingAttendanceDetail,
  TrackingLocation,
} from "../api/tracking.types";

import {
  formatMinutes,
  formatTime,
  stateLabel,
  stateTone,
} from "./tracking-attendance.utils";

type Props = {
  detail: TrackingAttendanceDetail;
  locations: TrackingLocation[];
  totalLocations: number;
};

export function TrackingAttendanceSessions({
  detail,
  locations,
  totalLocations,
}: Props) {
  const recentLocations = [...locations].reverse().slice(0, 30);

  return (
    <AppStack gap="md">
      <AppCard
        variant="outline"
        size="sm"
        radius="lg"
        title="Timeline de sesiones"
        description="Cada activación del tracking se conserva como una sesión independiente."
      >
        <div className="relative">
          <div className="absolute bottom-3 left-[0.55rem] top-3 w-px bg-border" />

          <AppStack gap="sm">
            {detail.sesiones.map((session) => (
              <div key={session.id} className="relative pl-7">
                <div
                  className={[
                    "absolute left-0 top-3 z-10 size-[1.1rem] rounded-full border-[3px] border-background",
                    session.estado === "ACTIVA"
                      ? "bg-success"
                      : session.estado === "EXPIRADA"
                        ? "bg-warning"
                        : "bg-muted-foreground",
                  ].join(" ")}
                />

                <div className="rounded-[var(--app-radius-md)] border border-border p-3">
                  <AppInline align="center" justify="between" gap="sm" wrap>
                    <AppInline gap="xs" align="center" wrap>
                      <span className="text-xs font-semibold">
                        Sesión #{session.id}
                      </span>

                      <AppBadge
                        tone={stateTone(session.estado)}
                        appearance="soft"
                        size="xs"
                      >
                        {stateLabel(session.estado)}
                      </AppBadge>
                    </AppInline>

                    <AppBadge tone="primary" appearance="outline" size="xs">
                      {formatMinutes(session.duracionMinutos)}
                    </AppBadge>
                  </AppInline>

                  <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-5">
                    <Value
                      label="Inicio"
                      value={formatTime(session.iniciadoEn)}
                      icon={<Clock3 className="h-3.5 w-3.5" />}
                    />
                    <Value
                      label={session.finalizadoEn ? "Final" : "Heartbeat"}
                      value={formatTime(
                        session.finalizadoEn ?? session.ultimoHeartbeatEn,
                      )}
                      icon={<Clock3 className="h-3.5 w-3.5" />}
                    />
                    <Value
                      label="Puntos"
                      value={String(session.puntosRegistrados)}
                      icon={<MapPin className="h-3.5 w-3.5" />}
                    />
                    <Value
                      label="Batería inicial"
                      value={
                        session.bateriaInicial === null
                          ? "—"
                          : `${session.bateriaInicial}%`
                      }
                      icon={<Battery className="h-3.5 w-3.5" />}
                    />
                    <Value
                      label="Batería final"
                      value={
                        session.bateriaFinal === null
                          ? "—"
                          : `${session.bateriaFinal}%`
                      }
                      icon={<Battery className="h-3.5 w-3.5" />}
                    />
                  </div>
                </div>
              </div>
            ))}
          </AppStack>
        </div>
      </AppCard>

      <AppCard
        variant="outline"
        size="sm"
        radius="lg"
        title="Últimos puntos GPS registrados"
        description="Vista rápida de los puntos más recientes del lote cargado."
        action={
          <AppBadge tone="info" appearance="soft" size="xs">
            {totalLocations} total
          </AppBadge>
        }
      >
        {recentLocations.length === 0 ? (
          <div className="rounded-[var(--app-radius-md)] border border-dashed border-border p-5 text-center text-xs text-muted-foreground">
            No hay ubicaciones para mostrar.
          </div>
        ) : (
          <div className="max-h-[22rem] overflow-auto rounded-[var(--app-radius-md)] border border-border">
            <div className="min-w-[42rem]">
              {recentLocations.map((location) => (
                <div
                  key={location.id}
                  className="grid grid-cols-[7rem_6rem_6rem_7rem_minmax(12rem,1fr)] gap-2 border-b border-border px-3 py-2 text-[11px] last:border-b-0"
                >
                  <span>
                    {formatTime(location.capturadoEn ?? location.recibidoEn)}
                  </span>
                  <span>
                    {location.sesionTrackingId
                      ? `#${location.sesionTrackingId}`
                      : "—"}
                  </span>
                  <span>
                    {location.bateria === null ? "—" : `${location.bateria}%`}
                  </span>
                  <AppInline gap="xs" align="center">
                    <Crosshair className="h-3 w-3 text-primary" />
                    {location.precision === null
                      ? "—"
                      : `${location.precision.toFixed(1)} m`}
                  </AppInline>
                  <span className="truncate font-mono text-[10px]">
                    {location.latitud.toFixed(6)},{" "}
                    {location.longitud.toFixed(6)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </AppCard>
    </AppStack>
  );
}

function Value({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <AppInline gap="xs" align="center" wrap={false} className="min-w-0">
      <span className="shrink-0 text-primary">{icon}</span>
      <div className="min-w-0">
        <div className="truncate text-[9px] text-muted-foreground">{label}</div>
        <div className="truncate text-[11px] font-medium">{value}</div>
      </div>
    </AppInline>
  );
}
