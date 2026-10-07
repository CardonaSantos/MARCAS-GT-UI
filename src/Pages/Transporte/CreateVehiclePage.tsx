import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useCreateTransportVehicle } from "@/features/transporte/api/transport.mutations";
import { toCreateVehiclePayload } from "@/features/transporte/common/transport.mappers";
import { TransportCarrierFormSelect } from "@/features/transporte/components/transport-selects";
import {
  vehicleSchema,
  type VehicleFormValues,
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

export default function CreateVehiclePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const backTo = getReturnRoute(
    location.state,
    "/marcas-gt/transporte/vehiculos",
  );
  const mutation = useCreateTransportVehicle();

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      transportistaId: null,
      placa: "",
      marca: "",
      modelo: "",
      capacidadKg: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: VehicleFormValues) => {
    await mutation.mutateAsync(toCreateVehiclePayload(values));
    navigate(backTo, { replace: true });
  };

  return (
    <AppContainer size="lg" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Nuevo vehículo"
          description="Registra una unidad disponible para transporte interno."
          backTo={backTo}
          backLabel="Volver a vehículos"
        />
        <AppForm form={form} onSubmit={onSubmit}>
          <AppStack gap="md">
            <AppCard title="Datos del vehículo" size="sm">
              <div className="grid gap-3 md:grid-cols-2">
                <TransportCarrierFormSelect<VehicleFormValues>
                  name="transportistaId"
                  label="Transportista interno"
                  mode="INTERNO"
                  activeOnly
                  placeholder="Propio / sin transportista"
                />
                <AppFormInput<VehicleFormValues>
                  name="placa"
                  label="Placa"
                  maxLength={30}
                  required
                />
                <AppFormInput<VehicleFormValues>
                  name="marca"
                  label="Marca"
                  maxLength={80}
                />
                <AppFormInput<VehicleFormValues>
                  name="modelo"
                  label="Modelo"
                  maxLength={80}
                />
                <AppFormInput<VehicleFormValues>
                  name="capacidadKg"
                  label="Capacidad (kg)"
                  type="number"
                  min={0.01}
                  step="0.01"
                />
              </div>
            </AppCard>
            <div className="flex justify-end gap-2">
              <AppButton asChild variant="secondary">
                <Link to={backTo}>Cancelar</Link>
              </AppButton>
              <AppFormSubmit<VehicleFormValues>
                leftIcon={<Save />}
                loadingText="Guardando..."
                disableWhenInvalid
              >
                Crear vehículo
              </AppFormSubmit>
            </div>
          </AppStack>
        </AppForm>
      </AppStack>
    </AppContainer>
  );
}
