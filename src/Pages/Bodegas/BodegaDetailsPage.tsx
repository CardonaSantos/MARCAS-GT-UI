import { Pencil, Power, PowerOff, Star, UserCog } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import {
  useActivateBodega,
  useSetPrincipalBodega,
} from "@/features/bodegas/api/bodega.mutations";
import { useBodega } from "@/features/bodegas/api/bodega.queries";
import {
  BODEGA_DETAIL_TABS,
  type BodegaDetailTab,
} from "@/features/bodegas/common/bodega.constants";
import { BodegaActivity } from "@/features/bodegas/components/bodega-activity";
import { BodegaDetailSummary } from "@/features/bodegas/components/bodega-detail-summary";
import { BodegaOperationalSummary } from "@/features/bodegas/components/bodega-operational-summary";
import { BodegaPageHeader } from "@/features/bodegas/components/bodega-page-header";
import { useUrlTabState } from "@/features/common/navigation/use-url-tab-state";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppStatusDot } from "@/ui/components/app/primitives/app-status-dot";
import { AppTabs } from "@/ui/components/app/primitives/app-tabs";

type RouteState = { from?: string } | null;

export default function BodegaDetailsPage() {
  const params = useParams();
  const location = useLocation();
  const id = Number(params.id);
  const role = useStore((state) => state.userRol);

  const listReturnTo =
    (location.state as RouteState)?.from ?? "/marcas-gt/bodegas";
  const currentDetailUrl = location.pathname + location.search;

  const isAdmin = role === "ADMIN";
  const canViewActivity = role === "ADMIN" || role === "BODEGA";

  const query = useBodega(id);
  const activateBodega = useActivateBodega();
  const setPrincipal = useSetPrincipalBodega();

  const allowedTabs: BodegaDetailTab[] = canViewActivity
    ? [...BODEGA_DETAIL_TABS]
    : ["resumen", "operacion"];

  const tabsState = useUrlTabState<BodegaDetailTab>({
    defaultValue: "resumen",
    allowedValues: allowedTabs,
  });

  const bodega = query.data;

  const tabs = bodega
    ? [
        {
          value: "resumen" as const,
          label: "Resumen",
          content: <BodegaDetailSummary bodega={bodega} />,
        },
        {
          value: "operacion" as const,
          label: "Operación",
          content: <BodegaOperationalSummary operation={bodega.operacion} />,
        },
        ...(canViewActivity
          ? [
              {
                value: "actividad" as const,
                label: "Actividad",
                content: <BodegaActivity bodegaId={id} />,
              },
            ]
          : []),
      ]
    : [];

  const actionState = {
    from: currentDetailUrl,
    listFrom: listReturnTo,
  };

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <BodegaPageHeader
          title={
            bodega ? (
              <span className="inline-flex flex-wrap items-center gap-2">
                {bodega.nombre}
                <AppStatusDot
                  tone={bodega.activo ? "success" : "danger"}
                  label={bodega.activo ? "Activa" : "Inactiva"}
                />
                {bodega.esPrincipal ? (
                  <AppBadge tone="primary" size="xs">
                    Principal
                  </AppBadge>
                ) : null}
              </span>
            ) : (
              "Detalle de bodega"
            )
          }
          description={bodega ? "Código " + bodega.codigo : undefined}
          backTo={listReturnTo}
          backLabel="Volver a bodegas"
          actions={
            bodega && isAdmin ? (
              <>
                <AppButton asChild variant="secondary" size="sm">
                  <Link
                    to={"/marcas-gt/bodegas/" + id + "/editar"}
                    state={actionState}
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Link>
                </AppButton>

                <AppButton asChild variant="secondary" size="sm">
                  <Link
                    to={"/marcas-gt/bodegas/" + id + "/responsable"}
                    state={actionState}
                  >
                    <UserCog className="h-4 w-4" />
                    Responsable
                  </Link>
                </AppButton>

                {!bodega.esPrincipal && bodega.activo ? (
                  <AppConfirmDialog
                    title="Establecer como bodega principal"
                    description="La bodega que actualmente sea principal dejará de serlo."
                    preset="confirm"
                    confirmText="Establecer principal"
                    isLoading={setPrincipal.isPending}
                    trigger={
                      <AppButton variant="secondary" size="sm" leftIcon={<Star />}>
                        Hacer principal
                      </AppButton>
                    }
                    onConfirm={async () => {
                      await setPrincipal.mutateAsync({ id });
                    }}
                  />
                ) : null}

                {!bodega.activo ? (
                  <AppConfirmDialog
                    title="Activar bodega"
                    description="La bodega volverá a estar disponible para nuevas operaciones."
                    preset="confirm"
                    confirmText="Activar"
                    isLoading={activateBodega.isPending}
                    trigger={
                      <AppButton variant="primary" size="sm" leftIcon={<Power />}>
                        Activar
                      </AppButton>
                    }
                    onConfirm={async () => {
                      await activateBodega.mutateAsync({ id });
                    }}
                  />
                ) : (
                  <AppButton asChild variant="danger" size="sm">
                    <Link
                      to={"/marcas-gt/bodegas/" + id + "/desactivar"}
                      state={actionState}
                    >
                      <PowerOff className="h-4 w-4" />
                      Desactivar
                    </Link>
                  </AppButton>
                )}
              </>
            ) : undefined
          }
        />

        <AppDataState
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !bodega}
          emptyTitle="Bodega no encontrada"
          emptyDescription="El registro solicitado no existe o ya no está disponible."
        >
          {bodega ? (
            <AppTabs
              tabs={tabs}
              value={tabsState.value}
              onValueChange={tabsState.setValue}
              variant="minimal"
              size="sm"
            />
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
