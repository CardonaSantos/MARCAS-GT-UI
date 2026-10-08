import * as React from "react";
import { createPortal } from "react-dom";
import { GoogleMap, OverlayView } from "@react-google-maps/api";

/** Adapter for the CRM's visual Google Maps components without a second loader. */
const MapContext = React.createContext<google.maps.Map | null>(null);
export const useMap = () => React.useContext(MapContext);

type MapProps = {
  children: React.ReactNode; mapId?: string; reuseMaps?: boolean;
  defaultZoom: number; defaultCenter: google.maps.LatLngLiteral; className?: string;
  gestureHandling?: "auto" | "cooperative" | "greedy" | "none";
  disableDefaultUI?: boolean; mapTypeId?: "hybrid" | "roadmap" | "satellite" | "terrain";
  onClick?: () => void;
};
export function Map({children,defaultZoom,defaultCenter,className,gestureHandling="greedy",disableDefaultUI=true,mapTypeId="hybrid",onClick}: MapProps) {
  const [map, setMap] = React.useState<google.maps.Map | null>(null);
  // CRM passes initial camera values. Keep those stable when replay updates,
  // otherwise the map is recentered to its first point on every slider move.
  const initialCenter = React.useRef(defaultCenter).current;
  const initialZoom = React.useRef(defaultZoom).current;
  const options = React.useMemo<google.maps.MapOptions>(() => ({
    gestureHandling,disableDefaultUI,mapTypeId,clickableIcons:false,
    streetViewControl:false,fullscreenControl:false,
  }),[gestureHandling,disableDefaultUI,mapTypeId]);
  return <div className={"relative min-h-0 " + (className ?? "h-full w-full")}>
    <GoogleMap mapContainerStyle={{width:"100%",height:"100%"}} center={initialCenter} zoom={initialZoom}
      options={options} onLoad={setMap} onUnmount={() => setMap(null)} onClick={onClick}>
      <MapContext.Provider value={map}>{children}</MapContext.Provider>
    </GoogleMap>
  </div>;
}
type MarkerProps = {
  children: React.ReactNode;
  position: google.maps.LatLngLiteral;
  title?: string;
  zIndex?: number;
  /**
   * Default CRM-style markers are anchored at their bottom center.
   * Floating information cards attach to the exact GPS point instead.
   */
  anchor?: "bottom-center" | "point";
  onClick?: (event: {stop: () => void}) => void;
};

const bottomCenterOffset = (width: number, height: number) => ({
  x: -width / 2,
  y: -height,
});
const pointOffset = () => ({ x: 0, y: 0 });

export function AdvancedMarker({
  children, position, title, zIndex = 10,
  anchor = "bottom-center", onClick,
}: MarkerProps) {
  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      zIndex={zIndex}
      getPixelPositionOffset={anchor === "point" ? pointOffset : bottomCenterOffset}
    >
      <div
        title={title}
        className={anchor === "point" ? "relative h-0 w-0" : "relative w-max"}
        onClick={(event) => {
          event.stopPropagation();
          onClick?.({ stop: () => event.stopPropagation() });
        }}
      >
        {children}
      </div>
    </OverlayView>
  );
}
export const ControlPosition = { RIGHT_TOP:"RIGHT_TOP" } as const;
export function MapControl({children}:{position:typeof ControlPosition.RIGHT_TOP;children:React.ReactNode}) {
  const map=useMap();
  const [target,setTarget]=React.useState<HTMLDivElement|null>(null);
  React.useEffect(()=>{
    if(!map) return;
    const node=document.createElement("div");
    const controls=map.controls[google.maps.ControlPosition.RIGHT_TOP];
    controls.push(node);setTarget(node);
    return ()=>{const index=controls.getArray().indexOf(node);if(index>=0)controls.removeAt(index);setTarget(null);};
  },[map]);
  return target?createPortal(children,target):null;
}
