import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, PowerOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { useDeactivateBodega } from "@/features/bodegas/api/bodega.mutations";
import { useBodega } from "@/features/bodegas/api/bodega.queries";
import { BodegaOperationalSummary } from "@/features/bodegas/components/bodega-operational-summary";
import { BodegaPageHeader } from "@/features/bodegas/components/bodega-page-header";
import {
  deactivateBodegaSchema,
  type DeactivateBodegaFormValues,
} from "@/features/bodegas/schemas/bodega.schemas";
import {
  AppForm,
  AppFormSubmit,
  AppFormTextarea,
} from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

type RouteState = {
  from?: string;
  listFrom?: string;
} | null;

export default function DeactivateBodegaPage() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const id = Number(params.id);
  const detailUrl = "/marcas-gt/bodegas/" + id;
  const routeState = location.state as RouteState;
  const returnTo = routeState?.from ?? detailUrl;
  const listReturnTo = routeState?.listFrom ?? "/marcas-gt/bodegas";

  const bodegaQuery = useBodega(id);
  const deactivateBodega = useDeactivateBodega();

  const form = useForm<DeactivateBodegaFormValues>({
    resolver: zodResolver(deactivateBodegaSchema),
    defaultValues: {
      motivo: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: DeactivateBodegaFormValues) => {
    if (!bodegaQuery.data?.puedeDesactivarse) return;

    await deactivateBodega.mutateAsync({
      id,
      payload: {
        motivo: values.motivo.trim(),
      },
    });

    navigate(returnTo, {
      replace: true,
      state: { from: listReturnTo },
    });
  };

  const bodega = bodegaQuery.data;
  const detailState = { from: listReturnTo };

  return (
    <AppContainer size="xl" paddingX="none">
      <AppStack gap="lg">
        <BodegaPageHeader
          title="Desactivar bodega"
          description="Verifica las dependencias operativas antes de retirar una bodega de operación."
          backTo={returnTo}
          backState={detailState}
          backLabel="Volver al detalle"
        />

        <AppDataState
          isLoading={bodegaQuery.isLoading}
          error={bodegaQuery.error}
          onRetry={() => void bodegaQuery.refetch()}
        >
          {bodega ? (
            <AppStack gap="md">
              <BodegaOperationalSummary operation={bodega.operacion} />

              {!bodega.puedeDesactivarse ? (
                <AppCard
                  title="La bodega no puede desactivarse"
                  description="Resuelve los siguientes bloqueos antes de continuar."
                  icon={<AlertTriangle />}
                  size="sm"
                  className="border-[hsl(var(--app-danger)/0.45)]"
                >
                  <ul className="list-disc space-y-1 pl-5 text-sm">
                    {bodega.bloqueosDesactivacion.map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                </AppCard>
              ) : (
                <AppForm form={form} onSubmit={onSubmit}>
                  <AppStack gap="md">
                    <AppCard
                      title="Motivo de desactivación"
                      description="Este motivo quedará registrado en la auditoría de la bodega."
                      icon={<PowerOff />}
                      size="sm"
                    >
                      <AppFormTextarea<DeactivateBodegaFormValues>
                        name="motivo"
                        label="Motivo"
                        placeholder="Describe por qué se desactiva esta bodega."
                        required
                        maxLength={300}
                        rows={5}
                      />
                    </AppCard>

                    <div className="flex justify-end gap-2">
                      <AppButton asChild variant="secondary">
                        <Link to={returnTo} state={detailState}>
                          Cancelar
                        </Link>
                      </AppButton>
                      <AppFormSubmit<DeactivateBodegaFormValues>
                        variant="danger"
                        leftIcon={<PowerOff />}
                        loadingText="Desactivando..."
                        disableWhenInvalid
                      >
                        Desactivar bodega
                      </AppFormSubmit>
                    </div>
                  </AppStack>
                </AppForm>
              )}
            </AppStack>
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
