import type { ColumnDef } from "@tanstack/react-table";
import { Link, useLocation } from "react-router-dom";
import {
  Banknote,
  FileText,
  PackageCheck,
  Truck,
  WalletCards,
} from "lucide-react";

import {
  formatDateTime,
  formatInteger,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";

import type { OrderDetail } from "../api/order.types";

type CreditRow = OrderDetail["solicitudesCredito"][number];
type DispatchRow = OrderDetail["despachos"][number];
type DeliveryRow = OrderDetail["entregas"][number];
type PaymentRow = OrderDetail["pagosDetalle"][number];
type InvoiceRow = OrderDetail["facturas"][number];

function StatusValue({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs text-[hsl(var(--app-muted-foreground))]">{label}</p>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}

export function OrderOperationsPanel({ order }: { order: OrderDetail }) {
  const location = useLocation();
  const currentUrl = location.pathname + location.search;
  const creditColumns: ColumnDef<CreditRow, unknown>[] = [
    {
      accessorKey: "id",
      header: "Solicitud",
      size: 90,
      cell: ({ row }) => "#" + row.original.id,
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 140,
      cell: ({ row }) => (
        <AppBadge tone="neutral" size="xs">
          {row.original.estado}
        </AppBadge>
      ),
    },
    {
      accessorKey: "montoSolicitado",
      header: "Monto",
      size: 120,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.montoSolicitado),
    },
    {
      accessorKey: "plazoDias",
      header: "Plazo",
      size: 90,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.plazoDias) + " días",
    },
    {
      accessorKey: "anticipoPropuesto",
      header: "Anticipo",
      size: 115,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.anticipoPropuesto),
    },
    {
      accessorKey: "solicitadaEn",
      header: "Solicitada",
      size: 150,
      cell: ({ row }) => formatDateTime(row.original.solicitadaEn),
    },
    {
      accessorKey: "resueltaEn",
      header: "Resuelta",
      size: 150,
      cell: ({ row }) => formatDateTime(row.original.resueltaEn),
    },
  ];

  const dispatchColumns: ColumnDef<DispatchRow, unknown>[] = [
    {
      accessorKey: "id",
      header: "Despacho",
      size: 90,
      cell: ({ row }) => (
        <Link
          to={"/marcas-gt/despachos/" + row.original.id}
          state={{ from: currentUrl }}
          className="font-medium text-[hsl(var(--app-primary))] hover:underline"
        >
          #{row.original.id}
        </Link>
      ),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 150,
      cell: ({ row }) => (
        <AppBadge tone="neutral" size="xs">
          {row.original.estado}
        </AppBadge>
      ),
    },
    {
      id: "bodega",
      header: "Bodega",
      size: 180,
      meta: { grow: true },
      cell: ({ row }) => row.original.bodega.nombre,
    },
    {
      id: "preparadoPor",
      header: "Preparado por",
      size: 160,
      cell: ({ row }) => row.original.preparadoPor?.nombre ?? "—",
    },
    {
      accessorKey: "programadoEn",
      header: "Programado",
      size: 150,
      cell: ({ row }) => formatDateTime(row.original.programadoEn),
    },
    {
      accessorKey: "preparadoEn",
      header: "Preparado",
      size: 150,
      cell: ({ row }) => formatDateTime(row.original.preparadoEn),
    },
    {
      accessorKey: "despachadoEn",
      header: "Despachado",
      size: 150,
      cell: ({ row }) => formatDateTime(row.original.despachadoEn),
    },
  ];

  const deliveryColumns: ColumnDef<DeliveryRow, unknown>[] = [
    {
      accessorKey: "id",
      header: "Entrega",
      size: 90,
      cell: ({ row }) => "#" + row.original.id,
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 150,
      cell: ({ row }) => (
        <AppBadge tone="neutral" size="xs">
          {row.original.estado}
        </AppBadge>
      ),
    },
    {
      id: "registradoPor",
      header: "Registrado por",
      size: 170,
      cell: ({ row }) => row.original.registradoPor?.nombre ?? "—",
    },
    {
      accessorKey: "entregadoEn",
      header: "Entregado",
      size: 150,
      cell: ({ row }) => formatDateTime(row.original.entregadoEn),
    },
    {
      accessorKey: "creadoEn",
      header: "Creado",
      size: 150,
      cell: ({ row }) => formatDateTime(row.original.creadoEn),
    },
  ];

  const paymentColumns: ColumnDef<PaymentRow, unknown>[] = [
    {
      accessorKey: "id",
      header: "Pago",
      size: 80,
      cell: ({ row }) => "#" + row.original.id,
    },
    {
      accessorKey: "metodo",
      header: "Método",
      size: 130,
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 130,
      cell: ({ row }) => (
        <AppBadge tone="neutral" size="xs">
          {row.original.estado}
        </AppBadge>
      ),
    },
    {
      accessorKey: "monto",
      header: "Monto",
      size: 115,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.monto),
    },
    {
      accessorKey: "referencia",
      header: "Referencia",
      size: 140,
      cell: ({ row }) => row.original.referencia ?? "—",
    },
    {
      accessorKey: "fechaPago",
      header: "Fecha de pago",
      size: 150,
      cell: ({ row }) => formatDateTime(row.original.fechaPago),
    },
    {
      accessorKey: "verificadoEn",
      header: "Verificado",
      size: 150,
      cell: ({ row }) => formatDateTime(row.original.verificadoEn),
    },
  ];

  const invoiceColumns: ColumnDef<InvoiceRow, unknown>[] = [
    {
      accessorKey: "id",
      header: "Factura",
      size: 90,
      cell: ({ row }) => "#" + row.original.id,
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 140,
      cell: ({ row }) => (
        <AppBadge tone="neutral" size="xs">
          {row.original.estado}
        </AppBadge>
      ),
    },
    {
      accessorKey: "serie",
      header: "Serie",
      size: 100,
      cell: ({ row }) => row.original.serie ?? "—",
    },
    {
      accessorKey: "numero",
      header: "Número",
      size: 110,
      cell: ({ row }) => row.original.numero ?? "—",
    },
    {
      accessorKey: "total",
      header: "Total",
      size: 115,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.total),
    },
    {
      accessorKey: "emitidaEn",
      header: "Emitida",
      size: 150,
      cell: ({ row }) => formatDateTime(row.original.emitidaEn),
    },
    {
      accessorKey: "fechaVencimiento",
      header: "Vencimiento",
      size: 150,
      cell: ({ row }) => formatDateTime(row.original.fechaVencimiento),
    },
  ];

  return (
    <AppStack gap="md">
      <AppGrid cols={{ base: 1, md: 2, xl: 5 }} gap="sm">
        <AppCard title="Crédito" icon={<WalletCards />} size="sm">
          <StatusValue
            label="Estado"
            value={order.credito?.estado ?? (order.acciones.requiereCredito ? "Requerido" : "No requerido")}
          />
          <div className="mt-3">
            <StatusValue
              label="Monto solicitado"
              value={formatMoney(order.credito?.montoSolicitado)}
            />
          </div>
        </AppCard>

        <AppCard title="Despacho" icon={<Truck />} size="sm">
          <StatusValue
            label="Estado"
            value={order.despacho?.estado ?? "Sin despacho"}
          />
          <div className="mt-3">
            <StatusValue
              label="Bodega"
              value={order.despacho?.bodega.nombre ?? "—"}
            />
          </div>
        </AppCard>

        <AppCard title="Entrega" icon={<PackageCheck />} size="sm">
          <StatusValue
            label="Estado"
            value={order.entrega?.estado ?? "Sin entrega"}
          />
          <div className="mt-3">
            <StatusValue
              label="Entregada"
              value={formatDateTime(order.entrega?.entregadoEn)}
            />
          </div>
        </AppCard>

        <AppCard title="Pagos" icon={<Banknote />} size="sm">
          <StatusValue
            label="Registros"
            value={formatInteger(order.pagos.cantidad)}
          />
          <div className="mt-3">
            <StatusValue
              label="Verificado"
              value={formatMoney(order.pagos.montoVerificado)}
            />
          </div>
        </AppCard>

        <AppCard title="Factura" icon={<FileText />} size="sm">
          <StatusValue
            label="Estado"
            value={order.factura?.estado ?? "Sin factura"}
          />
          <div className="mt-3">
            <StatusValue
              label="Total"
              value={formatMoney(order.factura?.total)}
            />
          </div>
        </AppCard>
      </AppGrid>

      <AppCard title="Solicitudes de crédito" size="sm">
        <AppDataTable
          data={order.solicitudesCredito}
          columns={creditColumns}
          getRowId={(row) => String(row.id)}
          paginationMode="none"
          density="xs"
          responsiveMode="scroll"
          emptyTitle="Sin solicitudes de crédito"
          emptyDescription="Este pedido todavía no tiene expedientes de crédito."
        />
      </AppCard>

      <AppCard title="Despachos" size="sm">
        <AppDataTable
          data={order.despachos}
          columns={dispatchColumns}
          getRowId={(row) => String(row.id)}
          paginationMode="none"
          density="xs"
          responsiveMode="scroll"
          emptyTitle="Sin despachos"
          emptyDescription="Todavía no se han generado órdenes de despacho."
        />
      </AppCard>

      <AppCard title="Entregas" size="sm">
        <AppDataTable
          data={order.entregas}
          columns={deliveryColumns}
          getRowId={(row) => String(row.id)}
          paginationMode="none"
          density="xs"
          responsiveMode="scroll"
          emptyTitle="Sin entregas"
          emptyDescription="Todavía no existen entregas para este pedido."
        />
      </AppCard>

      <AppCard title="Pagos" size="sm">
        <AppDataTable
          data={order.pagosDetalle}
          columns={paymentColumns}
          getRowId={(row) => String(row.id)}
          paginationMode="none"
          density="xs"
          responsiveMode="scroll"
          emptyTitle="Sin pagos"
          emptyDescription="Todavía no existen pagos asociados al pedido."
        />
      </AppCard>

      <AppCard title="Facturas" size="sm">
        <AppDataTable
          data={order.facturas}
          columns={invoiceColumns}
          getRowId={(row) => String(row.id)}
          paginationMode="none"
          density="xs"
          responsiveMode="scroll"
          emptyTitle="Sin facturas"
          emptyDescription="Todavía no existen facturas para este pedido."
        />
      </AppCard>
    </AppStack>
  );
}
