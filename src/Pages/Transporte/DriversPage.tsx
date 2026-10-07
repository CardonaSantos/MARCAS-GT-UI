import type { ColumnDef } from "@tanstack/react-table";
import { Plus, Truck } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { formatDateTime } from "@/features/common/formatters/value.formatters";
import { useTransportDrivers } from "@/features/transporte/api/transport.queries";
import type { TransportDriver } from "@/features/transporte/api/transport.types";
import { DRIVER_STATE_LABELS } from "@/features/transporte/common/transport.constants";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

export default function DriversPage() {
  const role = useStore((state) => state.userRol);
  const canManage = role === "ADMIN" || role === "BODEGA";
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [serverSearch, setServerSearch] = useState("");
  const query = useTransportDrivers({
    search: serverSearch || undefined,
  });
  const from = location.pathname + location.search;

  const columns: ColumnDef<TransportDriver, unknown>[] = [
    {
      accessorKey: "nombre",
      header: "Conductor",
      size: 220,
      meta: { grow: true },
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 125,
      cell: ({ row }) => (
        <AppBadge
          tone={
            row.original.estado === "DISPONIBLE"
              ? "success"
              : row.original.estado === "EN_RUTA"
                ? "primary"
                : row.original.estado === "INACTIVO"
                  ? "neutral"
                  : "warning"
          }
          size="xs"
        >
          {DRIVER_STATE_LABELS[row.original.estado]}
        </AppBadge>
      ),
    },
    {
      accessorKey: "telefono",
      header: "Teléfono",
      size: 130,
      cell: ({ row }) => row.original.telefono ?? "—",
    },
    {
      accessorKey: "licencia",
      header: "Licencia",
      size: 140,
      cell: ({ row }) => row.original.licencia ?? "—",
    },
    {
      id: "transportista",
      header: "Transportista",
      size: 190,
      cell: ({ row }) => row.original.transportista?.nombre ?? "Propio",
    },
    {
      accessorKey: "activo",
      header: "Activo",
      size: 85,
      cell: ({ row }) => (row.original.activo ? "Sí" : "No"),
    },
    {
      accessorKey: "creadoEn",
      header: "Creado",
      size: 155,
      cell: ({ row }) => formatDateTime(row.original.creadoEn),
    },
    createAppRowActionsColumn<TransportDriver>({
      actions: (row) => [
        {
          label: "Desactivar",
          hidden:
            !canManage ||
            !row.original.activo ||
            ["ASIGNADO", "EN_RUTA"].includes(row.original.estado),
          onClick: () =>
            navigate(
              "/marcas-gt/transporte/conductores/" +
                row.original.id +
                "/desactivar",
              { state: { from } },
            ),
        },
      ],
    }),
  ];

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Conductores"
          description="Conductores disponibles para asignación de rutas."
          backTo="/marcas-gt/transporte/envios"
          backLabel="Volver a transporte"
          actions={
            <>
              <AppButton asChild variant="secondary" size="sm">
                <Link to="/marcas-gt/transporte/transportistas" state={{ from }}>
                  <Truck className="h-4 w-4" />
                  Transportistas
                </Link>
              </AppButton>
              <AppButton asChild variant="secondary" size="sm">
                <Link to="/marcas-gt/transporte/vehiculos" state={{ from }}>
                  <Truck className="h-4 w-4" />
                  Vehículos
                </Link>
              </AppButton>
              {canManage ? (
                <AppButton asChild variant="primary" size="sm">
                  <Link
                    to="/marcas-gt/transporte/conductores/nuevo"
                    state={{ from }}
                  >
                    <Plus className="h-4 w-4" />
                    Nuevo conductor
                  </Link>
                </AppButton>
              ) : null}
            </>
          }
        />

        <AppDataTable
          data={query.data ?? []}
          columns={columns}
          getRowId={(row) => String(row.id)}
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          toolbar={
            <AppSearchInput
              value={search}
              onValueChange={setSearch}
              onDebouncedChange={setServerSearch}
              placeholder="Buscar conductor..."
            />
          }
          paginationMode="none"
          density="xs"
          responsiveMode="scroll"
          emptyTitle="Sin conductores"
        />
      </AppStack>
    </AppContainer>
  );
}
