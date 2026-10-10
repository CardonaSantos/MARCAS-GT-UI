import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useCreateTransportCarrier } from "@/features/transporte/api/transport.mutations";
import {
  SHIPMENT_MODES,
  SHIPMENT_MODE_LABELS,
} from "@/features/transporte/common/transport.constants";
import { toCreateCarrierPayload } from "@/features/transporte/common/transport.mappers";
import {
  carrierSchema,
  type CarrierFormValues,
} from "@/features/transporte/schemas/transport.schemas";
import {
  AppForm,
  AppFormInput,
  AppFormSingleSelect,
  AppFormSubmit,
} from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function CreateCarrierPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const backTo = getReturnRoute(
    location.state,
    "/marcas-gt/transporte/transportistas",
  );
  const mutation = useCreateTransportCarrier();

  const form = useForm<CarrierFormValues>({
    resolver: zodResolver(carrierSchema),
    defaultValues: {
      codigo: "",
      tipo: "EXTERNO",
      nombre: "",
      telefono: "",
      correo: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: CarrierFormValues) => {
    await mutation.mutateAsync(toCreateCarrierPayload(values));
    navigate(backTo, { replace: true });
  };

  return (
    <AppContainer size="lg" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Nuevo transportista"
          description="Registra un operador interno o proveedor de transporte externo."
          backTo={backTo}
          backLabel="Volver a transportistas"
        />
        <AppForm form={form} onSubmit={onSubmit}>
          <AppStack gap="md">
            <AppCard title="Datos del transportista" size="sm">
              <div className="grid gap-3 md:grid-cols-2">
                <AppFormInput<CarrierFormValues>
                  name="codigo"
                  label="Código"
                  maxLength={80}
                />
                <AppFormSingleSelect<CarrierFormValues, string>
                  name="tipo"
                  label="Tipo"
                  options={SHIPMENT_MODES.map((value) => ({
                    value,
                    label: SHIPMENT_MODE_LABELS[value],
                  }))}
                  required
                />
                <AppFormInput<CarrierFormValues>
                  name="nombre"
                  label="Nombre"
                  maxLength={150}
                  required
                />
                <AppFormInput<CarrierFormValues>
                  name="telefono"
                  label="Teléfono"
                  maxLength={50}
                />
                <AppFormInput<CarrierFormValues>
                  name="correo"
                  label="Correo"
                  maxLength={150}
                />
              </div>
            </AppCard>
            <div className="flex justify-end gap-2">
              <AppButton asChild variant="secondary">
                <Link to={backTo}>Cancelar</Link>
              </AppButton>
              <AppFormSubmit<CarrierFormValues>
                leftIcon={<Save />}
                loadingText="Guardando..."
                disableWhenInvalid
              >
                Crear transportista
              </AppFormSubmit>
            </div>
          </AppStack>
        </AppForm>
      </AppStack>
    </AppContainer>
  );
}
