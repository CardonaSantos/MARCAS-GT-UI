import { zodResolver } from "@hookform/resolvers/zod";
import { LocateFixed, Play } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useIdempotencyKey } from "@/features/common/utils/idempotency";
import { useStartDelivery } from "@/features/entregas/api/delivery.mutations";
import { useDelivery } from "@/features/entregas/api/delivery.queries";
import { getCurrentPosition } from "@/features/entregas/common/delivery-geolocation";
import { toStartDeliveryPayload } from "@/features/entregas/common/delivery.mappers";
import {
  startDeliverySchema,
  type StartDeliveryFormValues,
} from "@/features/entregas/schemas/delivery.schemas";
import {
  AppForm,
  AppFormInput,
  AppFormSubmit,
} from "@/ui/components/app/form";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function StartDeliveryPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const detailUrl = "/marcas-gt/entregas/" + id;
  const backTo = getReturnRoute(location.state, detailUrl);
  const listFrom = getListReturnRoute(location.state, "/marcas-gt/entregas");
  const key = useIdempotencyKey("delivery-start");
  const query = useDelivery(id);
  const mutation = useStartDelivery();
  const [locating, setLocating] = useState(false);

  const form = useForm<StartDeliveryFormValues>({
    resolver: zodResolver(startDeliverySchema),
    defaultValues: { latitud: "", longitud: "" },
    mode: "onTouched",
  });

  const locate = async () => {
    try {
      setLocating(true);
      const position = await getCurrentPosition();
      form.setValue("latitud", String(position.latitud), {
        shouldDirty: true,
        shouldValidate: true,
      });
      form.setValue("longitud", String(position.longitud), {
        shouldDirty: true,
        shouldValidate: true,
      });
      toast.success("Ubicación actual capturada.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo obtener la ubicación.");
    } finally {
      setLocating(false);
    }
  };

  const onSubmit = async (values: StartDeliveryFormValues) => {
    if (!query.data?.acciones.puedeIniciar) return;
    await mutation.mutateAsync({
      id,
      payload: toStartDeliveryPayload(values, key),
    });
    navigate(detailUrl, {
      replace: true,
      state: { from: listFrom },
    });
  };

  return (
    <AppContainer size="lg" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Iniciar atención"
          description={
            query.data
              ? "Entrega #" + query.data.id + " · " + query.data.cliente.nombreCompleto
              : undefined
          }
          backTo={backTo}
          backLabel="Volver a la entrega"
        />

        <AppDataState
          isLoading={query.isLoading}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !query.data}
          emptyTitle="Entrega no encontrada"
        >
          {query.data ? (
            <AppForm form={form} onSubmit={onSubmit}>
              <AppStack gap="md">
                <AppAlert
                  tone="info"
                  title="Inicio de atención"
                  description="La entrega pasará de PENDIENTE a EN_RUTA. Puedes capturar la ubicación donde inicia la atención."
                />
                <AppCard title="Ubicación inicial" size="sm">
                  <div className="grid gap-3 md:grid-cols-2">
                    <AppFormInput<StartDeliveryFormValues>
                      name="latitud"
                      label="Latitud"
                      type="number"
                      step="any"
                    />
                    <AppFormInput<StartDeliveryFormValues>
                      name="longitud"
                      label="Longitud"
                      type="number"
                      step="any"
                    />
                  </div>
                  <div className="mt-3">
                    <AppButton
                      type="button"
                      variant="secondary"
                      size="sm"
                      leftIcon={<LocateFixed />}
                      disabled={locating}
                      onClick={() => void locate()}
                    >
                      {locating ? "Obteniendo ubicación..." : "Usar ubicación actual"}
                    </AppButton>
                  </div>
                </AppCard>
                <div className="flex justify-end gap-2">
                  <AppButton asChild variant="secondary">
                    <Link to={backTo}>Cancelar</Link>
                  </AppButton>
                  <AppFormSubmit<StartDeliveryFormValues>
                    leftIcon={<Play />}
                    loadingText="Iniciando..."
                    disableWhenInvalid
                    disabled={!query.data.acciones.puedeIniciar}
                  >
                    Iniciar atención
                  </AppFormSubmit>
                </div>
              </AppStack>
            </AppForm>
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
