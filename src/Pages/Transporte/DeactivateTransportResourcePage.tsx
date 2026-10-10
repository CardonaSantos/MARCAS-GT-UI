import { zodResolver } from "@hookform/resolvers/zod";
import { XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import {
  useDeactivateTransportCarrier,
  useDeactivateTransportDriver,
  useDeactivateTransportVehicle,
} from "@/features/transporte/api/transport.mutations";
import {
  deactivateTransportResourceSchema,
  type DeactivateTransportResourceFormValues,
} from "@/features/transporte/schemas/transport.schemas";
import {
  AppForm,
  AppFormSubmit,
  AppFormTextarea,
} from "@/ui/components/app/form";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

type ResourceKind = "transportista" | "vehiculo" | "conductor";

const config: Record<
  ResourceKind,
  { title: string; fallback: string }
> = {
  transportista: {
    title: "Desactivar transportista",
    fallback: "/marcas-gt/transporte/transportistas",
  },
  vehiculo: {
    title: "Desactivar vehículo",
    fallback: "/marcas-gt/transporte/vehiculos",
  },
  conductor: {
    title: "Desactivar conductor",
    fallback: "/marcas-gt/transporte/conductores",
  },
};

export default function DeactivateTransportResourcePage({
  kind,
}: {
  kind: ResourceKind;
}) {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const settings = config[kind];
  const backTo = getReturnRoute(location.state, settings.fallback);
  const carrierMutation = useDeactivateTransportCarrier();
  const vehicleMutation = useDeactivateTransportVehicle();
  const driverMutation = useDeactivateTransportDriver();

  const form = useForm<DeactivateTransportResourceFormValues>({
    resolver: zodResolver(deactivateTransportResourceSchema),
    defaultValues: { motivo: "" },
    mode: "onTouched",
  });

  const onSubmit = async (
    values: DeactivateTransportResourceFormValues,
  ) => {
    const variables = {
      id,
      payload: { motivo: values.motivo.trim() },
    };

    if (kind === "transportista") {
      await carrierMutation.mutateAsync(variables);
    } else if (kind === "vehiculo") {
      await vehicleMutation.mutateAsync(variables);
    } else {
      await driverMutation.mutateAsync(variables);
    }

    navigate(backTo, { replace: true });
  };

  return (
    <AppContainer size="lg" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title={settings.title}
          backTo={backTo}
          backLabel="Volver"
        />
        <AppForm form={form} onSubmit={onSubmit}>
          <AppStack gap="md">
            <AppAlert
              tone="warning"
              title="Recurso fuera de operación"
              description="La acción conserva el historial. Vehículos reservados/en ruta y conductores asignados/en ruta no pueden desactivarse."
            />
            <AppCard title="Motivo" size="sm">
              <AppFormTextarea<DeactivateTransportResourceFormValues>
                name="motivo"
                label="Motivo de inactivación"
                rows={5}
                maxLength={500}
                required
              />
            </AppCard>
            <div className="flex justify-end gap-2">
              <AppButton asChild variant="secondary">
                <Link to={backTo}>Cancelar</Link>
              </AppButton>
              <AppFormSubmit<DeactivateTransportResourceFormValues>
                variant="danger"
                leftIcon={<XCircle />}
                loadingText="Desactivando..."
                disableWhenInvalid
              >
                Desactivar
              </AppFormSubmit>
            </div>
          </AppStack>
        </AppForm>
      </AppStack>
    </AppContainer>
  );
}
