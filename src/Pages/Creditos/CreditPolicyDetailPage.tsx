import { Pencil, Power, PowerOff } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";

import { useStore } from "@/Context/ContextSucursal";
import {
  formatDateTime,
  formatDecimal,
  formatInteger,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useSetCreditPolicyStatus } from "@/features/creditos/api/credit.mutations";
import { useCreditPolicy } from "@/features/creditos/api/credit.queries";
import type { CreditPolicyRequirement } from "@/features/creditos/api/credit.types";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";

function Value({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
        {label}
      </dt>
      <dd className="mt-1 text-sm">{value}</dd>
    </div>
  );
}

export default function CreditPolicyDetailPage() {
  const params = useParams();
  const location = useLocation();
  const id = Number(params.id);
  const role = useStore((state) => state.userRol);
  const isAdmin = role === "ADMIN";
  const backTo = getReturnRoute(
    location.state,
    "/marcas-gt/creditos/politicas",
  );
  const currentUrl = location.pathname + location.search;

  const query = useCreditPolicy(id);
  const statusMutation = useSetCreditPolicyStatus();
  const policy = query.data;

  const columns: ColumnDef<CreditPolicyRequirement, unknown>[] = [
    { accessorKey: "codigo", header: "Código", size: 120 },
    {
      accessorKey: "nombre",
      header: "Nombre",
      size: 220,
      meta: { grow: true },
    },
    {
      accessorKey: "obligatorio",
      header: "Obligatorio",
      size: 105,
      cell: ({ row }) => (row.original.obligatorio ? "Sí" : "No"),
    },
    {
      accessorKey: "orden",
      header: "Orden",
      size: 80,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.orden),
    },
    {
      accessorKey: "activo",
      header: "Estado",
      size: 100,
      cell: ({ row }) => (
        <AppBadge tone={row.original.activo ? "success" : "neutral"} size="xs">
          {row.original.activo ? "Activo" : "Inactivo"}
        </AppBadge>
      ),
    },
    {
      accessorKey: "descripcion",
      header: "Descripción",
      size: 280,
      meta: { grow: true, truncate: false },
      cell: ({ row }) => row.original.descripcion ?? "—",
    },
  ];

  return (
    <AppContainer size="xl" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title={
            policy ? (
              <span className="inline-flex items-center gap-2">
                {policy.nombre}
                <AppBadge tone={policy.activo ? "success" : "neutral"} size="xs">
                  {policy.activo ? "Activa" : "Inactiva"}
                </AppBadge>
              </span>
            ) : (
              "Detalle de política"
            )
          }
          description="Configuración y requisitos de la política de crédito."
          backTo={backTo}
          backLabel="Volver a políticas"
          actions={
            policy && isAdmin ? (
              <>
                <AppButton asChild variant="secondary" size="sm">
                  <Link
                    to={"/marcas-gt/creditos/politicas/" + id + "/editar"}
                    state={{ from: currentUrl, listFrom: backTo }}
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Link>
                </AppButton>

                {policy.activo ? (
                  <AppButton asChild variant="danger" size="sm">
                    <Link
                      to={
                        "/marcas-gt/creditos/politicas/" +
                        id +
                        "/desactivar"
                      }
                      state={{ from: currentUrl, listFrom: backTo }}
                    >
                      <PowerOff className="h-4 w-4" />
                      Desactivar
                    </Link>
                  </AppButton>
                ) : (
                  <AppConfirmDialog
                    title="Activar política"
                    description="La política volverá a estar disponible para nuevas solicitudes."
                    preset="success"
                    confirmText="Activar"
                    loadingText="Activando..."
                    isLoading={statusMutation.isPending}
                    trigger={
                      <AppButton
                        variant="primary"
                        size="sm"
                        leftIcon={<Power />}
                      >
                        Activar
                      </AppButton>
                    }
                    onConfirm={async () => {
                      await statusMutation.mutateAsync({
                        id,
                        payload: { activo: true },
                      });
                    }}
                  />
                )}
              </>
            ) : undefined
          }
        />

        <AppDataState
          isLoading={query.isLoading}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !policy}
          emptyTitle="Política no encontrada"
        >
          {policy ? (
            <AppStack gap="md">
              {Number(policy.porcentajeAnticipo ?? 0) > 0 ? (
                <AppAlert
                  tone="warning"
                  title="Política no compatible con nuevas solicitudes CREDITO"
                  description="Esta política legacy exige anticipo. El flujo nuevo de Crédito puro sólo ofrece políticas con anticipo mínimo de 0%."
                />
              ) : null}

              <AppGrid cols={{ base: 1, md: 2, xl: 4 }} gap="sm">
                <AppCard title="Monto máximo" size="sm">
                  <p className="text-xl font-semibold">
                    {formatMoney(policy.montoMaximo, "Sin límite")}
                  </p>
                </AppCard>
                <AppCard title="Plazo máximo" size="sm">
                  <p className="text-xl font-semibold">
                    {policy.plazoMaximoDias == null
                      ? "Sin límite"
                      : formatInteger(policy.plazoMaximoDias) + " días"}
                  </p>
                </AppCard>
                <AppCard title="Anticipo mínimo" size="sm">
                  <p className="text-xl font-semibold">
                    {formatDecimal(policy.porcentajeAnticipo ?? 0)}%
                  </p>
                </AppCard>
                <AppCard title="Requisitos activos" size="sm">
                  <p className="text-xl font-semibold">
                    {formatInteger(
                      policy.requisitos.filter((item) => item.activo).length,
                    )}
                  </p>
                </AppCard>
                <AppCard title="Versión" size="sm">
                  <p className="text-xl font-semibold">
                    {formatInteger(policy.version)}
                  </p>
                </AppCard>
              </AppGrid>

              <AppCard title="Información" size="sm">
                <dl className="grid gap-4 md:grid-cols-2">
                  <Value label="Descripción" value={policy.descripcion ?? "—"} />
                  <Value
                    label="Motivo de inactivación"
                    value={policy.motivoInactivacion ?? "—"}
                  />
                  <Value
                    label="Creada"
                    value={formatDateTime(policy.creadoEn)}
                  />
                  <Value
                    label="Actualizada"
                    value={formatDateTime(policy.actualizadoEn)}
                  />
                  <Value
                    label="Inactivada"
                    value={formatDateTime(policy.inactivadaEn)}
                  />
                </dl>
              </AppCard>

              <AppCard title="Requisitos" size="sm">
                <AppDataTable
                  data={policy.requisitos}
                  columns={columns}
                  getRowId={(row) => String(row.id)}
                  paginationMode="none"
                  density="xs"
                  responsiveMode="scroll"
                  enableColumnVisibility
                  emptyTitle="Sin requisitos"
                  emptyDescription="La política no tiene requisitos configurados."
                />
              </AppCard>
            </AppStack>
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
