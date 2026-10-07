import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useCreateTransportDriver } from "@/features/transporte/api/transport.mutations";
import { toCreateDriverPayload } from "@/features/transporte/common/transport.mappers";
import { TransportCarrierFormSelect } from "@/features/transporte/components/transport-selects";
import {
  driverSchema,
  type DriverFormValues,
} from "@/features/transporte/schemas/transport.schemas";
import {
  AppForm,
  AppFormInput,
  AppFormSubmit,
} from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function CreateDriverPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const backTo = getReturnRoute(
    location.state,
    "/marcas-gt/transporte/conductores",
  );
  const mutation = useCreateTransportDriver();

  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      transportistaId: null,
      nombre: "",
      telefono: "",
      licencia: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: DriverFormValues) => {
    await mutation.mutateAsync(toCreateDriverPayload(values));
    navigate(backTo, { replace: true });
  };

  return (
    <AppContainer size="lg" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Nuevo conductor"
          description="Registra un conductor disponible para asignación."
          backTo={backTo}
          backLabel="Volver a conductores"
        />
        <AppForm form={form} onSubmit={onSubmit}>
          <AppStack gap="md">
            <AppCard title="Datos del conductor" size="sm">
              <div className="grid gap-3 md:grid-cols-2">
                <TransportCarrierFormSelect<DriverFormValues>
                  name="transportistaId"
                  label="Transportista interno"
                  mode="INTERNO"
                  activeOnly
                  placeholder="Propio / sin transportista"
                />
                <AppFormInput<DriverFormValues>
                  name="nombre"
                  label="Nombre"
                  maxLength={150}
                  required
                />
                <AppFormInput<DriverFormValues>
                  name="telefono"
                  label="Teléfono"
                  maxLength={50}
                />
                <AppFormInput<DriverFormValues>
                  name="licencia"
                  label="Licencia"
                  maxLength={100}
                />
              </div>
            </AppCard>
            <div className="flex justify-end gap-2">
              <AppButton asChild variant="secondary">
                <Link to={backTo}>Cancelar</Link>
              </AppButton>
              <AppFormSubmit<DriverFormValues>
                leftIcon={<Save />}
                loadingText="Guardando..."
                disableWhenInvalid
              >
                Crear conductor
              </AppFormSubmit>
            </div>
          </AppStack>
        </AppForm>
      </AppStack>
    </AppContainer>
  );
}
