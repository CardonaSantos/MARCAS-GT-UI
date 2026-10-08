import type { ReactNode } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim();

function GoogleMapsScript({ children }: { children: ReactNode }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "marcas-google-maps-script",
    googleMapsApiKey: apiKey!,
    language: "es",
    region: "GT",
  });

  if (loadError) {
    return (
      <div role="alert" className="flex min-h-[180px] items-center justify-center rounded-lg border border-red-500/30 bg-red-500/5 p-6 text-center text-sm">
        Google Maps no pudo cargarse. Verifica la clave, los dominios autorizados y Maps JavaScript API.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div role="status" className="flex min-h-[180px] items-center justify-center rounded-lg border border-[hsl(var(--app-border))] bg-[hsl(var(--app-muted))] p-6 text-center text-sm">
        Cargando Google Maps…
      </div>
    );
  }

  return <>{children}</>;
}

/** La clave VITE_ es visible en el navegador: debe restringirse por HTTP referrer y API. */
export function GoogleMapsProvider({ children }: { children: ReactNode }) {
  if (!apiKey) {
    return (
      <div role="alert" className="flex min-h-[180px] items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/5 p-6 text-center text-sm">
        Google Maps no está configurado. Define VITE_GOOGLE_MAPS_API_KEY en el frontend.
      </div>
    );
  }

  return <GoogleMapsScript>{children}</GoogleMapsScript>;
}
