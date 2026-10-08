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
  const options = React.useMemo<google.maps.MapOptions>(() => ({
    gestureHandling,disableDefaultUI,mapTypeId,clickableIcons:false,
    streetViewControl:false,fullscreenControl:false,
  }),[gestureHandling,disableDefaultUI,mapTypeId]);
  return <div className={"relative min-h-0 " + (className ?? "h-full w-full")}>
    <GoogleMap mapContainerStyle={{width:"100%",height:"100%"}} center={defaultCenter} zoom={defaultZoom}
      options={options} onLoad={setMap} onUnmount={() => setMap(null)} onClick={onClick}>
      <MapContext.Provider value={map}>{children}</MapContext.Provider>
    </GoogleMap>
  </div>;
}
type MarkerProps = {
  children: React.ReactNode; position: google.maps.LatLngLiteral;
  title?: string; zIndex?: number; onClick?: (event: {stop: () => void}) => void;
};
export function AdvancedMarker({children,position,title,zIndex=10,onClick}:MarkerProps) {
  return <OverlayView position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
    <div title={title} className="absolute left-0 top-0"
      style={{transform:"translate(-50%, -100%)",zIndex}}
      onClick={(event) => {event.stopPropagation();onClick?.({stop:()=>event.stopPropagation()});}}>
      {children}
    </div>
  </OverlayView>;
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
