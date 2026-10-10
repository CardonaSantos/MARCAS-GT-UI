import { Clock3 } from "lucide-react";

import { formatDateTime } from "@/features/common/formatters/value.formatters";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppEmptyState } from "@/ui/components/app/primitives/app-empty-state";
import { AppStatusDot } from "@/ui/components/app/primitives/app-status-dot";

import { BODEGA_EVENT_LABELS } from "../common/bodega.constants";
import type { BodegaEvent } from "../api/bodega.types";

interface BodegaEventListProps {
  events: BodegaEvent[];
}

export function BodegaEventList({ events }: BodegaEventListProps) {
  if (events.length === 0) {
    return (
      <AppEmptyState
        title="Sin actividad"
        description="Todavía no hay eventos registrados para esta bodega."
      />
    );
  }

  return (
    <AppCard size="sm" title="Actividad de la bodega" icon={<Clock3 />}>
      <ol className="divide-y divide-[hsl(var(--app-border))]">
        {events.map((event) => (
          <li key={event.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
            <div className="pt-1">
              <AppStatusDot tone="primary" size="sm" ringed />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">
                {BODEGA_EVENT_LABELS[event.tipo]}
              </p>

              {event.detalle ? (
                <p className="mt-1 text-sm text-[hsl(var(--app-muted-foreground))]">
                  {event.detalle}
                </p>
              ) : null}

              <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
                {formatDateTime(event.creadoEn)}
                {event.actor ? ` · ${event.actor.nombre}` : ""}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </AppCard>
  );
}
