import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  parseEnumParam,
  parsePositiveIntParam,
  setSearchParam,
} from "@/features/common/navigation/url-state.utils";
import { useRetryDispatchOperation } from "@/features/despachos/api/dispatch.mutations";
import { useDispatchOperations } from "@/features/despachos/api/dispatch.queries";
import type {
  DispatchOperationState,
  DispatchOperationType,
} from "@/features/despachos/api/dispatch.types";
import {
  DISPATCH_OPERATION_STATES,
  DISPATCH_OPERATION_STATE_LABELS,
  DISPATCH_OPERATION_TYPES,
  DISPATCH_OPERATION_TYPE_LABELS,
} from "@/features/despachos/common/dispatch.constants";
import { DispatchOperationsTable } from "@/features/despachos/components/dispatch-operations-table";
import { DispatchUserSelect } from "@/features/despachos/components/dispatch-selects";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDatePicker } from "@/ui/components/app/primitives/app-date-picker";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

const typeOptions = DISPATCH_OPERATION_TYPES.map((value) => ({
  value,
  label: DISPATCH_OPERATION_TYPE_LABELS[value],
}));
const stateOptions = DISPATCH_OPERATION_STATES.map((value) => ({
  value,
  label: DISPATCH_OPERATION_STATE_LABELS[value],
}));

export default function DispatchOperationsPage() {
  const location = useLocation();
  const role = useStore((state) => state.userRol);
  const canOperate = role === "ADMIN" || role === "BODEGA";
  const [params, setParams] = useSearchParams();
  const [retryingId, setRetryingId] = useState<number | null>(null);

  const page = parsePositiveIntParam(params.get("page"), 1) ?? 1;
  const limit = parsePositiveIntParam(params.get("limit"), 20) ?? 20;
  const tipo = parseEnumParam(params.get("tipo"), DISPATCH_OPERATION_TYPES);
  const estado = parseEnumParam(
    params.get("estado"),
    DISPATCH_OPERATION_STATES,
  );
  const usuarioId = parsePositiveIntParam(params.get("usuarioId"));
  const fechaDesde = params.get("fechaDesde") ?? "";
  const fechaHasta = params.get("fechaHasta") ?? "";

  const query = useDispatchOperations({
    page,
    limit,
    tipo: tipo ?? undefined,
    estado: estado ?? undefined,
    usuarioId: usuarioId ?? undefined,
    fechaDesde: fechaDesde || undefined,
    fechaHasta: fechaHasta || undefined,
  });
  const retry = useRetryDispatchOperation();

  const update = (
    patch: Record<string, string | number | null | undefined>,
  ) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([key, value]) =>
      setSearchParam(next, key, value),
    );
    setParams(next, { replace: true });
  };

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Operaciones de despacho"
          description="Audita las sagas de reserva, salida y liberación."
          backTo={
            (location.state as { from?: string } | null)?.from ??
            "/marcas-gt/despachos"
          }
          backLabel="Volver a despachos"
        />

        <DispatchOperationsTable
          data={query.data?.data ?? []}
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetryQuery={() => void query.refetch()}
          canOperate={canOperate}
          canPrintReceipt={canOperate}
          retryingOperationId={retryingId}
          onRetryOperation={async (operationId) => {
            setRetryingId(operationId);
            try {
              await retry.mutateAsync({ operationId });
            } finally {
              setRetryingId(null);
            }
          }}
          showDispatch
          pagination={{
            pageIndex: page - 1,
            pageSize: limit,
            totalRows: query.data?.meta.total ?? 0,
            pageCount: Math.max(query.data?.meta.totalPages ?? 1, 1),
            onPaginationChange: (next) =>
              update({
                page: next.pageIndex + 1,
                limit: next.pageSize,
              }),
          }}
          toolbar={
            <div className="grid w-full gap-2 md:grid-cols-2 xl:grid-cols-6">
              <AppSingleSelect<DispatchOperationType>
                value={tipo}
                options={typeOptions}
                onChange={(value) => update({ tipo: value, page: 1 })}
                placeholder="Tipo"
              />
              <AppSingleSelect<DispatchOperationState>
                value={estado}
                options={stateOptions}
                onChange={(value) => update({ estado: value, page: 1 })}
                placeholder="Estado"
              />
              <DispatchUserSelect
                value={usuarioId}
                onChange={(value) => update({ usuarioId: value, page: 1 })}
                placeholder="Usuario"
              />
              <AppDatePicker
                value={fechaDesde}
                outputFormat="iso"
                boundary="startOfDay"
                aria-label="Desde"
                onChange={(value) =>
                  update({ fechaDesde: value ?? null, page: 1 })
                }
              />
              <AppDatePicker
                value={fechaHasta}
                outputFormat="iso"
                boundary="endOfDay"
                aria-label="Hasta"
                onChange={(value) =>
                  update({ fechaHasta: value ?? null, page: 1 })
                }
              />
              <AppButton
                variant="secondary"
                size="sm"
                leftIcon={<RotateCcw />}
                onClick={() =>
                  setParams(new URLSearchParams(), { replace: true })
                }
              >
                Limpiar
              </AppButton>
            </div>
          }
        />
      </AppStack>
    </AppContainer>
  );
}
