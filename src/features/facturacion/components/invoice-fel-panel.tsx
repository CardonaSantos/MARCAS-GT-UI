import type { ColumnDef } from "@tanstack/react-table";

import { formatDateTime } from "@/features/common/formatters/value.formatters";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";

import { useFelOperations } from "../api/billing.queries";
import type {
  FelOperation,
  InvoiceFiscalDocument,
} from "../api/billing.types";
import {
  FISCAL_STATE_LABELS,
  FISCAL_STATE_TONES,
} from "../common/billing.constants";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";

export function InvoiceFelPanel({
  invoiceId,
  fiscal,
}: {
  invoiceId: number;
  fiscal: InvoiceFiscalDocument | null;
}) {
  const query = useFelOperations(invoiceId);

  const columns: ColumnDef<FelOperation, unknown>[] = [
    { accessorKey: "tipo", header: "Operación", size: 150 },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 130,
      cell: ({ row }) => row.original.estado.replace(/_+/g, " "),
    },
    {
      accessorKey: "intentos",
      header: "Intentos",
      size: 80,
      meta: { align: "right" },
    },
    {
      id: "proveedor",
      header: "Proveedor",
      size: 150,
      cell: ({ row }) =>
        row.original.proveedorConfig?.proveedorFel?.nombre ?? "—",
    },
    {
      accessorKey: "ultimoMensajeError",
      header: "Último error",
      size: 260,
      meta: { grow: true },
      cell: ({ row }) => row.original.ultimoMensajeError ?? "—",
    },
    {
      accessorKey: "creadoEn",
      header: "Creada",
      size: 155,
      cell: ({ row }) => formatDateTime(row.original.creadoEn),
    },
  ];

  return (
    <div className="space-y-4">
      <AppAlert
        tone="info"
        title="Integración FEL externa pendiente"
        description="La V1 sólo prepara el documento fiscal. No se certifica, reintenta, reconcilia ni anula con Grupo CDS hasta habilitar credenciales y contrato del proveedor."
      />

      {fiscal ? (
        <AppCard title="Documento fiscal preparado" size="sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs text-[hsl(var(--app-muted-foreground))]">Estado</p>
              <div className="mt-1">
                <AppBadge tone={FISCAL_STATE_TONES[fiscal.estado]} size="xs">
                  {FISCAL_STATE_LABELS[fiscal.estado]}
                </AppBadge>
              </div>
            </div>
            <div>
              <p className="text-xs text-[hsl(var(--app-muted-foreground))]">DTE interno</p>
              <p className="mt-1 text-sm font-medium">
                {fiscal.serieInterna + "-" + fiscal.numeroInterno}
              </p>
            </div>
            <div>
              <p className="text-xs text-[hsl(var(--app-muted-foreground))]">Entorno</p>
              <p className="mt-1 text-sm font-medium">{fiscal.entorno}</p>
            </div>
            <div>
              <p className="text-xs text-[hsl(var(--app-muted-foreground))]">UUID FEL</p>
              <p className="mt-1 text-sm font-medium">{fiscal.uuid ?? "Pendiente"}</p>
            </div>
            <div>
              <p className="text-xs text-[hsl(var(--app-muted-foreground))]">Serie FEL</p>
              <p className="mt-1 text-sm font-medium">{fiscal.serieFel ?? "Pendiente"}</p>
            </div>
            <div>
              <p className="text-xs text-[hsl(var(--app-muted-foreground))]">Proveedor</p>
              <p className="mt-1 text-sm font-medium">{fiscal.proveedor?.nombre ?? "Sin configuración"}</p>
            </div>
          </div>
        </AppCard>
      ) : (
        <AppAlert
          tone="warning"
          title="Documento fiscal no preparado"
          description="La factura continúa como borrador comercial."
        />
      )}

      <AppDataTable
        data={query.data?.data ?? []}
        columns={columns}
        getRowId={(row) => String(row.id)}
        isLoading={query.isLoading}
        isFetching={query.isFetching}
        error={query.error}
        onRetry={() => void query.refetch()}
        paginationMode="none"
        density="xs"
        responsiveMode="scroll"
        emptyTitle="Sin operaciones FEL"
        emptyDescription="Es normal mientras la integración externa permanezca deshabilitada."
      />
    </div>
  );
}
