import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { RotateCcw } from "lucide-react";
import { useLocation, useSearchParams } from "react-router-dom";

import { useUserSelectables } from "@/features/common/catalogs/catalog.queries";
import { formatDateTime } from "@/features/common/formatters/value.formatters";
import {
  parseEnumParam,
  parsePositiveIntParam,
  setSearchParam,
} from "@/features/common/navigation/url-state.utils";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppDatePicker } from "@/ui/components/app/primitives/app-date-picker";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";

import { useOrderEvents } from "../api/order.queries";
import type { OrderEvent, OrderEventType } from "../api/order.types";
import {
  ORDER_EVENT_FILTER_TYPES,
  ORDER_EVENT_LABELS,
} from "../common/order.constants";

type FilterableEventType = Exclude<
  OrderEventType,
  "CREDITO_APROBADO" | "CREDITO_RECHAZADO"
>;

const eventOptions = ORDER_EVENT_FILTER_TYPES.map((value) => ({
  value,
  label: ORDER_EVENT_LABELS[value],
}));

export function OrderActivity({ orderId }: { orderId: number }) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const usersQuery = useUserSelectables();

  const page =
    parsePositiveIntParam(searchParams.get("eventPage"), 1) ?? 1;
  const limit =
    parsePositiveIntParam(searchParams.get("eventLimit"), 20) ?? 20;
  const tipo = parseEnumParam<FilterableEventType>(
    searchParams.get("eventTipo"),
    ORDER_EVENT_FILTER_TYPES,
  );
  const usuarioId = parsePositiveIntParam(
    searchParams.get("eventUsuarioId"),
  );
  const fechaDesde = searchParams.get("eventDesde") ?? "";
  const fechaHasta = searchParams.get("eventHasta") ?? "";

  const query = useOrderEvents(orderId, {
    page,
    limit,
    tipo: tipo ?? undefined,
    usuarioId: usuarioId ?? undefined,
    fechaDesde: fechaDesde || undefined,
    fechaHasta: fechaHasta || undefined,
  });

  const updateUrl = (
    patch: Record<string, string | number | null | undefined>,
  ) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) =>
      setSearchParam(next, key, value),
    );
    setSearchParams(next, {
      replace: true,
      state: location.state,
    });
  };

  const reset = () => {
    const next = new URLSearchParams(searchParams);
    [
      "eventPage",
      "eventTipo",
      "eventUsuarioId",
      "eventDesde",
      "eventHasta",
    ].forEach((key) => next.delete(key));
    setSearchParams(next, {
      replace: true,
      state: location.state,
    });
  };

  const columns: ColumnDef<OrderEvent, unknown>[] = [
    {
      accessorKey: "creadoEn",
      header: "Fecha",
      size: 155,
      cell: ({ row }) => formatDateTime(row.original.creadoEn),
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      size: 185,
      cell: ({ row }) => ORDER_EVENT_LABELS[row.original.tipo],
    },
    {
      id: "actor",
      header: "Usuario",
      size: 165,
      cell: ({ row }) => row.original.actor?.nombre ?? "Sistema",
    },
    {
      accessorKey: "detalle",
      header: "Detalle",
      size: 320,
      meta: { grow: true, truncate: false },
      cell: ({ row }) => row.original.detalle ?? "—",
    },
    {
      id: "referenciaTipo",
      header: "Tipo referencia",
      size: 155,
      cell: ({ row }) => row.original.referencia?.tipo ?? "—",
    },
    {
      id: "referenciaId",
      header: "ID referencia",
      size: 105,
      meta: { align: "right" },
      cell: ({ row }) => row.original.referencia?.id ?? "—",
    },
  ];

  const meta = query.data?.meta;
  const hasFilters =
    tipo !== null ||
    usuarioId !== null ||
    Boolean(fechaDesde) ||
    Boolean(fechaHasta);

  const setPagination = (next: PaginationState) => {
    updateUrl({
      eventPage: next.pageIndex + 1,
      eventLimit: next.pageSize,
    });
  };

  return (
    <AppDataTable
      data={query.data?.data ?? []}
      columns={columns}
      getRowId={(row) => String(row.id)}
      isLoading={query.isLoading}
      isFetching={query.isFetching}
      error={query.error}
      onRetry={() => void query.refetch()}
      toolbar={
        <div className="grid w-full gap-2 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_auto]">
          <AppSingleSelect<FilterableEventType>
            value={tipo}
            options={eventOptions}
            onChange={(value) =>
              updateUrl({ eventTipo: value, eventPage: 1 })
            }
            placeholder="Tipo de evento"
          />

          <AppSingleSelect<number>
            value={usuarioId}
            options={(usersQuery.data ?? []).map((user) => ({
              value: user.id,
              label: user.nombre,
            }))}
            isLoading={usersQuery.isLoading}
            onChange={(value) =>
              updateUrl({ eventUsuarioId: value, eventPage: 1 })
            }
            placeholder="Usuario"
          />

          <AppDatePicker
            value={fechaDesde}
            outputFormat="iso"
            boundary="startOfDay"
            aria-label="Evento desde"
            onChange={(value) =>
              updateUrl({ eventDesde: value ?? null, eventPage: 1 })
            }
          />

          <AppDatePicker
            value={fechaHasta}
            outputFormat="iso"
            boundary="endOfDay"
            aria-label="Evento hasta"
            onChange={(value) =>
              updateUrl({ eventHasta: value ?? null, eventPage: 1 })
            }
          />

          <AppButton
            variant="secondary"
            size="sm"
            leftIcon={<RotateCcw />}
            disabled={!hasFilters}
            onClick={reset}
          >
            Limpiar
          </AppButton>
        </div>
      }
      paginationMode="server"
      pagination={{
        pageIndex: page - 1,
        pageSize: limit,
        totalRows: meta?.total ?? 0,
        pageCount: Math.max(meta?.totalPages ?? 1, 1),
        onPaginationChange: setPagination,
      }}
      density="xs"
      stickyHeader
      responsiveMode="scroll"
      enableColumnVisibility
      emptyTitle="Sin actividad"
      emptyDescription="No hay eventos que coincidan con los filtros."
    />
  );
}
