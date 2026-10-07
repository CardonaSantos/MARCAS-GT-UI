import { Battery, MapPin, Radio, Signal } from "lucide-react";

import { formatDateTime } from "@/features/common/formatters/value.formatters";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";

import type { DeliveryTrackingSnapshot } from "../api/delivery.types";

export function DeliveryTrackingPanel({
  tracking,
}: {
  tracking: DeliveryTrackingSnapshot | null;
}) {
  const hasTrackingData =
    tracking != null &&
    (tracking.sesionId != null ||
      tracking.ultimoHeartbeatEn != null ||
      tracking.capturadoEn != null ||
      tracking.latitud != null ||
      tracking.longitud != null);

  if (!tracking || !hasTrackingData) {
    return (
      <AppAlert
        tone="info"
        title="Sin ubicación disponible"
        description="El responsable asignado todavía no tiene una sesión o punto de tracking disponible."
      />
    );
  }

  return (
    <div className="space-y-4">
      {tracking.stale ? (
        <AppAlert
          tone="warning"
          title="Ubicación desactualizada"
          description="El último punto disponible tiene más de cinco minutos."
        />
      ) : null}

      <AppGrid cols={{ base: 1, sm: 2, xl: 4 }} gap="sm">
        <AppCard title="Sesión" icon={<Radio />} size="sm">
          <p className="text-lg font-semibold">
            {tracking.sesionActiva ? "Activa" : "Inactiva"}
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            {tracking.sesionId ? "Sesión #" + tracking.sesionId : "Sin sesión"}
          </p>
        </AppCard>
        <AppCard title="Ubicación" icon={<MapPin />} size="sm">
          <p className="text-sm font-semibold">
            {tracking.latitud != null && tracking.longitud != null
              ? tracking.latitud.toFixed(6) + ", " + tracking.longitud.toFixed(6)
              : "—"}
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            Precisión: {tracking.precisionM ?? "—"} m
          </p>
        </AppCard>
        <AppCard title="Velocidad" icon={<Signal />} size="sm">
          <p className="text-lg font-semibold">
            {tracking.velocidadMps != null
              ? (tracking.velocidadMps * 3.6).toFixed(1) + " km/h"
              : "—"}
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            Capturado {formatDateTime(tracking.capturadoEn)}
          </p>
        </AppCard>
        <AppCard title="Batería" icon={<Battery />} size="sm">
          <p className="text-lg font-semibold">
            {tracking.bateriaPct != null ? tracking.bateriaPct + "%" : "—"}
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            Heartbeat {formatDateTime(tracking.ultimoHeartbeatEn)}
          </p>
        </AppCard>
      </AppGrid>
    </div>
  );
}
