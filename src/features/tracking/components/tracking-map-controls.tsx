import type { RefObject } from "react";

import {
  ControlPosition,
  MapControl,
  useMap,
} from "./tracking-google-compat";

import {
  Layers,
  Maximize,
  Minus,
  Plus,
  UsersRound,
  X,
} from "lucide-react";

import { AppButton } from "@/ui/components/app/primitives/app-button";

import type { TrackingRealtimeView } from "../api/tracking.types";
import { fitTrackingLiveViewport } from "./tracking-live-viewport";

type TrackingMapControlsProps = {
  rows: TrackingRealtimeView[];

  selectedId: number | null;

  fullscreenTargetRef: RefObject<HTMLDivElement>;

  onClearSelection: () => void;
};

export function TrackingMapControls({
  rows,
  selectedId,
  fullscreenTargetRef,
  onClearSelection,
}: TrackingMapControlsProps) {
  const map = useMap();

  if (!map) {
    return null;
  }

  const rowsWithLocation = rows.filter((row) => row.ubicacion !== null);

  const fitAll = () => {
    fitTrackingLiveViewport(map, rowsWithLocation);
  };

  const toggleMapType = () => {
    const currentType = map.getMapTypeId();

    map.setMapTypeId(
      currentType === "hybrid" ? "roadmap" : "hybrid",
    );
  };

  const handleFullscreen = async () => {
    const target = fullscreenTargetRef.current;

    if (!target) {
      return;
    }

    if (!document.fullscreenElement) {
      await target.requestFullscreen();

      return;
    }

    await document.exitFullscreen();
  };

  return (
    <MapControl position={ControlPosition.RIGHT_TOP}>
      <div className="m-2 flex flex-col gap-1 rounded-[var(--app-radius-md)] border border-border bg-background/90 p-1 shadow-lg backdrop-blur">
        <AppButton
          type="button"
          variant="ghost"
          size="iconXs"
          title="Mostrar todos"
          aria-label="Mostrar todos"
          onClick={fitAll}
        >
          <UsersRound className="h-3.5 w-3.5" />
        </AppButton>

        <AppButton
          type="button"
          variant="ghost"
          size="iconXs"
          title="Cambiar vista"
          aria-label="Cambiar vista"
          onClick={toggleMapType}
        >
          <Layers className="h-3.5 w-3.5" />
        </AppButton>

        <AppButton
          type="button"
          variant="ghost"
          size="iconXs"
          title="Pantalla completa"
          aria-label="Pantalla completa"
          onClick={() => void handleFullscreen()}
        >
          <Maximize className="h-3.5 w-3.5" />
        </AppButton>

        <div className="h-px bg-border" />

        <AppButton
          type="button"
          variant="ghost"
          size="iconXs"
          title="Acercar"
          aria-label="Acercar"
          onClick={() => map.setZoom((map.getZoom() ?? 12) + 1)}
        >
          <Plus className="h-3.5 w-3.5" />
        </AppButton>

        <AppButton
          type="button"
          variant="ghost"
          size="iconXs"
          title="Alejar"
          aria-label="Alejar"
          onClick={() => map.setZoom((map.getZoom() ?? 12) - 1)}
        >
          <Minus className="h-3.5 w-3.5" />
        </AppButton>

        {selectedId !== null ? (
          <>
            <div className="h-px bg-border" />

            <AppButton
              type="button"
              variant="ghost"
              size="iconXs"
              title="Quitar selección"
              aria-label="Quitar selección"
              onClick={onClearSelection}
            >
              <X className="h-3.5 w-3.5" />
            </AppButton>
          </>
        ) : null}
      </div>
    </MapControl>
  );
}
