import { Link } from "react-router-dom";
import { History, MapPinned } from "lucide-react";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { TrackingHistoryPanel } from "@/features/tracking/components/tracking-history-panel";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function TrackingHistoryPage() {
  return <AppContainer size="full" paddingX="none"><AppStack gap="md">
    <FeaturePageHeader title="Seguimiento de empleados"
      description="Jornadas registradas, sesiones GPS e historial de recorridos." />
    <nav aria-label="Vistas de seguimiento" className="flex items-center gap-1 border-b border-[hsl(var(--app-border))] pb-0.5 text-xs">
      <Link to="/marcas-gt/tracking" className="inline-flex items-center gap-2 px-4 py-3 text-[hsl(var(--app-muted-foreground))] hover:text-foreground"><MapPinned className="h-4 w-4" /> Mapa en vivo</Link>
      <Link to="/marcas-gt/tracking/historial" aria-current="page" className="inline-flex items-center gap-2 border-b-2 border-emerald-500 px-4 py-3 font-semibold"><History className="h-4 w-4" /> Jornadas</Link>
    </nav>
    <TrackingHistoryPanel />
  </AppStack></AppContainer>;
}
