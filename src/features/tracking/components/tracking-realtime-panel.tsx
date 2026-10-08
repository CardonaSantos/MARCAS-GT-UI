import * as React from "react";

import { LocateFixed, MapPin, RadioTower } from "lucide-react";

import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppInline } from "@/ui/components/app/primitives/app-inline";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

import { useTrackingRealtime } from "../api/tracking.queries";
import { useTrackingSocket } from "../realtime/use-tracking-socket";
import { GoogleMapsProvider } from "@/features/common/maps/google-maps-provider";

import { TrackingRealtimeMap } from "./tracking-realtime-map";

export function TrackingRealtimePanel() {
  const query = useTrackingRealtime();
  useTrackingSocket();

  const rows = query.data ?? [];

  const activeCount = rows.length;

  const withLocationCount = React.useMemo(
    () => rows.filter((row) => row.ubicacion !== null).length,
    [rows],
  );

  const withoutLocationCount = activeCount - withLocationCount;

  return (
    <AppStack gap="sm">
      <AppInline gap="xs" wrap align="center">
        <AppBadge tone="success" appearance="soft" size="xs">
          {activeCount} en seguimiento
        </AppBadge>

        <AppBadge tone="info" appearance="soft" size="xs">
          {withLocationCount} con ubicación
        </AppBadge>

        {withoutLocationCount > 0 ? (
          <AppBadge tone="warning" appearance="soft" size="xs">
            {withoutLocationCount} esperando GPS
          </AppBadge>
        ) : null}
      </AppInline>

      {withoutLocationCount > 0 && !query.isLoading ? (
        <AppAlert
          tone="info"
          variant="soft"
          size="xs"
          icon={<RadioTower className="h-4 w-4" />}
          title="Hay jornadas activas todavía sin coordenada"
          description="También aparecen en el selector de técnicos y se incorporarán al mapa al recibir su primer GPS."
        />
      ) : null}

      <AppCard
        variant="outline"
        size="xs"
        radius="lg"
        className="min-w-0 overflow-hidden"
        title={
          <AppInline gap="xs" align="center" className="min-w-0">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />

            <span className="truncate">Mapa en vivo</span>
          </AppInline>
        }
        action={
          <AppInline gap="xs" align="center">
            <LocateFixed className="h-3.5 w-3.5 text-muted-foreground" />

            <span className="text-xs text-muted-foreground">
              {withLocationCount} visibles
            </span>
          </AppInline>
        }
      >
        <AppDataState
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          isEmpty={!query.isLoading && activeCount === 0}
          onRetry={() => void query.refetch()}
          loadingVariant="skeleton-card"
          emptyTitle="Sin técnicos en seguimiento"
          emptyDescription="Cuando un empleado active una sesión de seguimiento aparecerá aquí."
          minHeight="lg"
        >
          <div
            className={[
              "min-h-[32rem] min-w-0",
              "h-[clamp(32rem,calc(100dvh-15rem),64rem)]",
            ].join(" ")}
          >
            <GoogleMapsProvider><TrackingRealtimeMap rows={rows} /></GoogleMapsProvider>
          </div>
        </AppDataState>
      </AppCard>
    </AppStack>
  );
}
