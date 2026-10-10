import type { ColumnDef } from "@tanstack/react-table";
import { Plus, Truck, Users } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  formatDecimal,
  formatDateTime,
} from "@/features/common/formatters/value.formatters";
import { useTransportVehicles } from "@/features/transporte/api/transport.queries";
import type { TransportVehicle } from "@/features/transporte/api/transport.types";
import { VEHICLE_STATE_LABELS } from "@/features/transporte/common/transport.constants";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

export default function VehiclesPage() {
  const role = useStore((state) => state.userRol);
  const canManage = role === "ADMIN" || role === "BODEGA";
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [serverSearch, setServerSearch] = useState("");
  const query = useTransportVehicles({
    search: serverSearch || undefined,
  });
  const from = location.pathname + location.search;

  const columns: ColumnDef<TransportVehicle, unknown>[] = [
    {
      accessorKey: "placa",
      header: "Placa",
      size: 115,
    },
    {
      id: "vehiculo",
      header: "Vehículo",
      size: 220,
      meta: { grow: true },
      cell: ({ row }) =>
        [row.original.marca, row.original.modelo].filter(Boolean).join(" ") ||
        "—",
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 140,
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
          {VEHICLE_STATE_LABELS[row.original.estado]}
        </AppBadge>
      ),
    },
    {
      id: "transportista",
      header: "Transportista",
      size: 190,
      cell: ({ row }) => row.original.transportista?.nombre ?? "Propio",
    },
    {
      accessorKey: "capacidadKg",
      header: "Capacidad",
      size: 110,
      meta: { align: "right" },
      cell: ({ row }) =>
        row.original.capacidadKg == null
          ? "—"
          : formatDecimal(row.original.capacidadKg) + " kg",
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
    createAppRowActionsColumn<TransportVehicle>({
      actions: (row) => [
        {
          label: "Desactivar",
          hidden:
            !canManage ||
            !row.original.activo ||
            ["RESERVADO", "EN_RUTA"].includes(row.original.estado),
          onClick: () =>
            navigate(
              "/marcas-gt/transporte/vehiculos/" +
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
          title="Vehículos"
          description="Flota disponible para transporte interno."
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
                <Link to="/marcas-gt/transporte/conductores" state={{ from }}>
                  <Users className="h-4 w-4" />
                  Conductores
                </Link>
              </AppButton>
              {canManage ? (
                <AppButton asChild variant="primary" size="sm">
                  <Link
                    to="/marcas-gt/transporte/vehiculos/nuevo"
                    state={{ from }}
                  >
                    <Plus className="h-4 w-4" />
                    Nuevo vehículo
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
              placeholder="Buscar placa, marca o modelo..."
            />
          }
          paginationMode="none"
          density="xs"
          responsiveMode="scroll"
          emptyTitle="Sin vehículos"
        />
      </AppStack>
    </AppContainer>
  );
}
