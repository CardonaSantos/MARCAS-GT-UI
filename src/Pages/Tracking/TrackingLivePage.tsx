import { Link } from "react-router-dom";
import { MapPinned, History, RadioTower } from "lucide-react";
import { TrackingRealtimePanel } from "@/features/tracking/components/tracking-realtime-panel";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
export default function TrackingLivePage() {
  return <AppContainer size="full" paddingX="none"><AppStack gap="md">
    <FeaturePageHeader title="Seguimiento de empleados"
      description="Posiciones GPS de las sesiones activas, confirmadas por el servidor." />
    <nav aria-label="Vistas de seguimiento" className="flex items-center gap-1 border-b border-[hsl(var(--app-border))] pb-0.5 text-xs">
      <Link to="/marcas-gt/tracking" aria-current="page" className="inline-flex items-center gap-2 border-b-2 border-emerald-500 px-4 py-3 font-semibold"><MapPinned className="h-4 w-4" /> Mapa en vivo</Link>
      <Link to="/marcas-gt/tracking/historial" className="inline-flex items-center gap-2 px-4 py-3 text-[hsl(var(--app-muted-foreground))] hover:text-foreground"><History className="h-4 w-4" /> Jornadas</Link>
    </nav>
    <TrackingRealtimePanel />
    <p className="flex items-center gap-1.5 text-xs text-[hsl(var(--app-muted-foreground))]"><RadioTower className="h-3.5 w-3.5" />Un empleado sin coordenadas aparecerá en el selector como «Esperando GPS».</p>
  </AppStack></AppContainer>;
}
