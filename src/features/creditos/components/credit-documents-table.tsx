import { ExternalLink, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { marcasApi } from "@/API/api";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { getApiErrorMessage } from "@/lib/api-error";
import { useLocation, useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";

import { formatDateTime } from "@/features/common/formatters/value.formatters";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

import {
  CREDIT_DOCUMENT_STATE_LABELS,
  CREDIT_DOCUMENT_STATE_TONES,
  CREDIT_DOCUMENT_TYPE_LABELS,
} from "../common/credit.constants";
import type { CreditDocument } from "../api/credit.types";

export function CreditDocumentsTable({
  creditId,
  data,
  canReview,
}: {
  creditId: number;
  data: CreditDocument[];
  canReview: boolean;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.pathname + location.search;

  const openDocument = (documentId: number) => {
    const popup = window.open("about:blank", "_blank");
    if (popup) popup.opener = null;
    void marcasApi.get<{ url: string }>(
      marcasEndpoints.creditos.applications.documentFile(creditId, documentId),
    ).then(({ url }) => {
      if (!/^https:\/\//i.test(url)) throw new Error("El documento no tiene un enlace seguro.");
      if (popup && !popup.closed) popup.location.replace(url);
      else window.open(url, "_blank", "noopener,noreferrer");
    }).catch((error: unknown) => {
      popup?.close();
      toast.error(getApiErrorMessage(error));
    });
  };

  const columns: ColumnDef<CreditDocument, unknown>[] = [
    {
      accessorKey: "tipo",
      header: "Tipo",
      size: 170,
      cell: ({ row }) => CREDIT_DOCUMENT_TYPE_LABELS[row.original.tipo],
    },
    {
      accessorKey: "url",
      header: "Documento",
      size: 260,
      meta: { grow: true },
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => openDocument(row.original.id)}
          className="inline-flex max-w-full items-center gap-1.5 text-left font-medium text-[hsl(var(--app-primary))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--app-ring))]"
          title="Abrir documento de crédito"
        >
          <span className="truncate">
            {row.original.observaciones || "Documento #" + row.original.id}
          </span>
          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
        </button>
      ),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 115,
      cell: ({ row }) => (
        <AppBadge
          tone={CREDIT_DOCUMENT_STATE_TONES[row.original.estado]}
          size="xs"
        >
          {CREDIT_DOCUMENT_STATE_LABELS[row.original.estado]}
        </AppBadge>
      ),
    },
    {
      accessorKey: "mimeType",
      header: "MIME",
      size: 130,
      cell: ({ row }) => row.original.mimeType ?? "—",
    },
    {
      accessorKey: "size",
      header: "Bytes",
      size: 95,
      meta: { align: "right" },
      cell: ({ row }) => row.original.size ?? "—",
    },
    {
      id: "revisadoPor",
      header: "Revisado por",
      size: 150,
      cell: ({ row }) => row.original.revisadoPor?.nombre ?? "—",
    },
    {
      accessorKey: "revisadoEn",
      header: "Revisado",
      size: 150,
      cell: ({ row }) => formatDateTime(row.original.revisadoEn),
    },
    createAppRowActionsColumn<CreditDocument>({
      actions: (row) => [
        {
          label: "Revisar documento",
          icon: <ShieldCheck />,
          hidden: !canReview,
          onClick: () =>
            navigate(
              "/marcas-gt/creditos/solicitudes/" +
                creditId +
                "/documentos/" +
                row.original.id +
                "/revisar",
              { state: { from: returnTo } },
            ),
        },
      ],
    }),
  ];

  return (
    <AppDataTable
      data={data}
      columns={columns}
      getRowId={(row) => String(row.id)}
      paginationMode="none"
      density="xs"
      responsiveMode="scroll"
      enableColumnVisibility
      emptyTitle="Sin documentos"
      emptyDescription="Todavía no se han registrado documentos en el expediente."
    />
  );
}
