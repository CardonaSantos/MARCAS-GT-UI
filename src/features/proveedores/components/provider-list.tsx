import { Mail, MapPin, Pencil, Phone, RefreshCw, SearchX, Trash2, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppEmptyState } from "@/ui/components/app/primitives/app-empty-state";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";

import type { Provider } from "../api/provider.types";

type FilterStatus = "all" | "active" | "inactive";
const PAGE_SIZE = 12;
const statusOptions: Array<{ value: FilterStatus; label: string }> = [
  { value: "all", label: "Todos los estados" },
  { value: "active", label: "Activos" },
  { value: "inactive", label: "Inactivos" },
];

interface ProviderListProps {
  providers: readonly Provider[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRetry: () => void;
  onEdit: (provider: Provider) => void;
  onDelete: (provider: Provider) => void;
}

export function ProviderList({
  providers, isLoading, isFetching, isError, onRetry, onEdit, onDelete,
}: ProviderListProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<FilterStatus>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("es");
    return [...providers]
      .filter((provider) => {
        if (status === "active" && !provider.activo) return false;
        if (status === "inactive" && provider.activo) return false;
        if (!term) return true;
        return [
          provider.nombre, provider.razonSocial, provider.rfc,
          provider.nombreContacto, provider.correo, provider.telefono,
          provider.ciudad, provider.pais,
        ].some((value) => value?.toLocaleLowerCase("es").includes(term));
      })
      .sort((a, b) => a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }));
  }, [providers, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const activeCount = providers.filter((item) => item.activo).length;

  return (
    <AppCard
      title="Directorio de proveedores"
      icon={<Users />}
      size="sm"
      action={
        <AppButton
          type="button" variant="ghost" size="sm"
          title="Actualizar listado" aria-label="Actualizar listado"
          loading={isFetching} disabled={isFetching}
          onClick={onRetry}
        >
          <RefreshCw className="h-4 w-4" />
        </AppButton>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(160px,220px)]">
          <AppSearchInput
            value={search}
            onValueChange={(value) => { setSearch(value); setPage(1); }}
            placeholder="Buscar nombre, NIT, contacto..."
            aria-label="Buscar proveedores"
          />
          <AppSingleSelect<FilterStatus>
            value={status}
            options={statusOptions}
            onChange={(value) => { setStatus(value ?? "all"); setPage(1); }}
            isClearable={false}
            isSearchable={false}
            aria-label="Estado del proveedor"
          />
        </div>

        <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
          {filtered.length} resultados · {activeCount} activos de {providers.length} registrados
        </p>

        {isLoading ? (
          <p role="status" className="py-8 text-center text-sm text-[hsl(var(--app-muted-foreground))]">
            Cargando proveedores...
          </p>
        ) : isError ? (
          <AppEmptyState
            preset="error" title="No se pudieron cargar los proveedores"
            action={<AppButton variant="secondary" onClick={onRetry}>Reintentar</AppButton>}
          />
        ) : filtered.length === 0 ? (
          <AppEmptyState
            preset={search || status !== "all" ? "search" : "empty"}
            title={search || status !== "all" ? "Sin coincidencias" : "Todavía no hay proveedores"}
            icon={search || status !== "all" ? <SearchX /> : undefined}
          />
        ) : (
          <>
            <ul role="list" aria-label="Listado de proveedores" className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
              {visible.map((provider) => (
                <li key={provider.id} className="flex min-w-0 flex-col justify-between gap-3 rounded-lg border border-[hsl(var(--app-border))] p-3">
                  <div className="min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold" title={provider.nombre}>{provider.nombre}</p>
                        {provider.razonSocial && provider.razonSocial !== provider.nombre ? (
                          <p className="truncate text-xs text-[hsl(var(--app-muted-foreground))]" title={provider.razonSocial}>
                            {provider.razonSocial}
                          </p>
                        ) : null}
                      </div>
                      <span className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-medium ${provider.activo
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-[hsl(var(--app-muted))] text-[hsl(var(--app-muted-foreground))]"}`}>
                        {provider.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-[hsl(var(--app-muted-foreground))]">
                      {provider.nombreContacto ? <p className="truncate">Contacto: {provider.nombreContacto}</p> : null}
                      {provider.telefono ? <p className="flex gap-2"><Phone className="h-3.5 w-3.5 shrink-0" />{provider.telefono}</p> : null}
                      {provider.correo ? <p className="flex min-w-0 gap-2"><Mail className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{provider.correo}</span></p> : null}
                      {provider.ciudad || provider.pais ? (
                        <p className="flex gap-2"><MapPin className="h-3.5 w-3.5 shrink-0" />{[provider.ciudad,provider.pais].filter(Boolean).join(", ")}</p>
                      ) : null}
                      {provider.rfc ? <p className="truncate">NIT / RFC: {provider.rfc}</p> : null}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 border-t border-[hsl(var(--app-border))] pt-2">
                    <AppButton type="button" size="sm" variant="outline" leftIcon={<Pencil />}
                      onClick={() => onEdit(provider)} aria-label={`Editar ${provider.nombre}`}>
                      Editar
                    </AppButton>
                    <AppButton type="button" size="sm" variant="ghost" leftIcon={<Trash2 />}
                      onClick={() => onDelete(provider)} aria-label={`Eliminar ${provider.nombre}`}>
                      Eliminar
                    </AppButton>
                  </div>
                </li>
              ))}
            </ul>
            {totalPages > 1 ? (
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[hsl(var(--app-border))] pt-3">
                <span className="text-xs tabular-nums text-[hsl(var(--app-muted-foreground))]">
                  Página {currentPage} de {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <AppButton type="button" size="sm" variant="secondary"
                    disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>
                    Anterior
                  </AppButton>
                  <AppButton type="button" size="sm" variant="secondary"
                    disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)}>
                    Siguiente
                  </AppButton>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </AppCard>
  );
}
