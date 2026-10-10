import { ArrowRight, ArrowUpRight, LayoutDashboard, Route } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "@/Context/ContextSucursal";
import { getMarcasRoutesByRole, type MarcasRoute } from "@/ui/components/Layout/marcas-sidebar-routes";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { mutedText } from "../components/dashboard-widgets";

function flattenRoutes(routes: MarcasRoute[]): MarcasRoute[] {
  return routes.flatMap(route => route.submenu ? flattenRoutes(route.submenu) : route.href ? [route] : []);
}

export default function EmployeeDashboardPage() {
  const role = useStore(s => s.userRol);
  const name = useStore(s => s.userNombre);
  const destinations = flattenRoutes(getMarcasRoutesByRole(role))
    .filter(route => route.href && route.href !== "/marcas-gt/dashboard-empleado");
  const seen = new Set<string>();
  const quickLinks = destinations.filter(item => {
    if (!item.href || seen.has(item.href)) return false;
    seen.add(item.href);
    return true;
  }).slice(0, 18);
  return <main className="mx-auto w-full max-w-6xl space-y-5 px-3 py-6 sm:px-5 lg:px-8">
    <header className="rounded-2xl border border-[hsl(var(--app-border))] bg-[hsl(var(--app-card-bg))] p-5 sm:p-7">
      <div className={"flex items-center gap-2 text-xs font-semibold uppercase tracking-widest " + mutedText}>
        <LayoutDashboard className="h-4 w-4" /> Espacio de trabajo
      </div>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
        {name ? "Bienvenido, " + name : "Inicio de trabajo"}
      </h1>
      <p className={"mt-2 max-w-xl text-sm leading-relaxed " + mutedText}>
        Accede directamente a las funciones de tu puesto. Las opciones respetan el menú disponible para tu rol.
      </p>
      <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-[hsl(var(--app-border))] px-3 py-1 text-xs font-medium">
        <Route className="h-3.5 w-3.5" /> {role ?? "Empleado"}
      </span>
    </header>
    <section aria-labelledby="quick-actions" className="space-y-3">
      <h2 id="quick-actions" className="text-base font-semibold">Tus rutas operativas</h2>
      {quickLinks.length ? (
        <nav aria-label="Accesos de trabajo" className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map(item => <AppCard key={item.href} className="h-full" size="sm">
            <Link to={item.href!} className="group flex min-h-20 min-w-0 items-center justify-between gap-3 rounded-lg outline-offset-2">
              <span className="flex min-w-0 items-center gap-3">
                <span className="rounded-lg bg-[hsl(var(--app-muted-bg))] p-2.5">
                  <item.icon className="h-5 w-5 shrink-0" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{item.label}</span>
                  <span className={"mt-0.5 block text-xs " + mutedText}>Abrir módulo</span>
                </span>
              </span>
              <ArrowUpRight className={"h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 " + mutedText} />
            </Link>
          </AppCard>)}
        </nav>
      ) : <AppCard size="sm">
        <p className="text-sm">No hay rutas disponibles para este rol. Contacta al administrador.</p>
      </AppCard>}
    </section>
    {role === "ADMIN" && <Link to="/marcas-gt/dashboard" className="inline-flex items-center gap-2 text-sm font-medium hover:underline">
      Volver al centro de control <ArrowRight className="h-4 w-4"/>
    </Link>}
  </main>;
}
