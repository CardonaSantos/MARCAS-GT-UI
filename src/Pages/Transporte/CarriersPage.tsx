import type { ColumnDef } from "@tanstack/react-table";
import { Plus, Truck, Warehouse } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { formatDateTime } from "@/features/common/formatters/value.formatters";
import { useTransportCarriers } from "@/features/transporte/api/transport.queries";
import type { TransportCarrier } from "@/features/transporte/api/transport.types";
import { SHIPMENT_MODE_LABELS } from "@/features/transporte/common/transport.constants";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

export default function CarriersPage() {
  const role = useStore((state) => state.userRol);
  const canManage = role === "ADMIN" || role === "BODEGA";
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [serverSearch, setServerSearch] = useState("");
  const query = useTransportCarriers({
    search: serverSearch || undefined,
  });
  const from = location.pathname + location.search;

  const columns: ColumnDef<TransportCarrier, unknown>[] = [
    {
      accessorKey: "codigo",
      header: "Código",
      size: 105,
      cell: ({ row }) => row.original.codigo ?? "—",
    },
    {
      accessorKey: "nombre",
      header: "Transportista",
      size: 220,
      meta: { grow: true },
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      size: 105,
      cell: ({ row }) => SHIPMENT_MODE_LABELS[row.original.tipo],
    },
    {
      accessorKey: "telefono",
      header: "Teléfono",
      size: 130,
      cell: ({ row }) => row.original.telefono ?? "—",
    },
    {
      accessorKey: "correo",
      header: "Correo",
      size: 200,
      meta: { grow: true },
      cell: ({ row }) => row.original.correo ?? "—",
    },
    {
      accessorKey: "activo",
      header: "Estado",
      size: 95,
      cell: ({ row }) => (
        <AppBadge tone={row.original.activo ? "success" : "neutral"} size="xs">
          {row.original.activo ? "Activo" : "Inactivo"}
        </AppBadge>
      ),
    },
    {
      accessorKey: "creadoEn",
      header: "Creado",
      size: 155,
      cell: ({ row }) => formatDateTime(row.original.creadoEn),
    },
    createAppRowActionsColumn<TransportCarrier>({
      actions: (row) => [
        {
          label: "Desactivar",
          hidden: !canManage || !row.original.activo,
          onClick: () =>
            navigate(
              "/marcas-gt/transporte/transportistas/" +
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
          title="Transportistas"
          description="Directorio de operadores internos y proveedores externos de transporte."
          backTo="/marcas-gt/transporte/envios"
          backLabel="Volver a transporte"
          actions={
            <>
              <AppButton asChild variant="secondary" size="sm">
                <Link to="/marcas-gt/transporte/vehiculos" state={{ from }}>
                  <Truck className="h-4 w-4" />
                  Vehículos
                </Link>
              </AppButton>
              <AppButton asChild variant="secondary" size="sm">
                <Link to="/marcas-gt/transporte/conductores" state={{ from }}>
                  <Warehouse className="h-4 w-4" />
                  Conductores
                </Link>
              </AppButton>
              {canManage ? (
                <AppButton asChild variant="primary" size="sm">
                  <Link
                    to="/marcas-gt/transporte/transportistas/nuevo"
                    state={{ from }}
                  >
                    <Plus className="h-4 w-4" />
                    Nuevo transportista
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
              placeholder="Buscar transportista..."
            />
          }
          paginationMode="none"
          density="xs"
          responsiveMode="scroll"
          emptyTitle="Sin transportistas"
        />
      </AppStack>
    </AppContainer>
  );
}
