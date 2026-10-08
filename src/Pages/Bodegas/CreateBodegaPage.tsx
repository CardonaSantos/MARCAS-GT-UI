import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useCreateBodega } from "@/features/bodegas/api/bodega.mutations";
import { useBodegaResponsibleOptions } from "@/features/bodegas/api/bodega.queries";
import { BodegaBasicFormFields } from "@/features/bodegas/components/bodega-basic-form-fields";
import { BodegaPageHeader } from "@/features/bodegas/components/bodega-page-header";
import { toCreateBodegaPayload } from "@/features/bodegas/common/bodega.mappers";
import {
  createBodegaSchema,
  type CreateBodegaFormValues,
} from "@/features/bodegas/schemas/bodega.schemas";
import {
  AppForm,
  AppFormSingleSelect,
  AppFormSubmit,
  AppFormSwitch,
} from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

type RouteState = { from?: string } | null;

export default function CreateBodegaPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const backTo = (location.state as RouteState)?.from ?? "/marcas-gt/bodegas";

  const responsibleQuery = useBodegaResponsibleOptions();
  const createBodega = useCreateBodega();

  const form = useForm<CreateBodegaFormValues>({
    resolver: zodResolver(createBodegaSchema),
    defaultValues: {
      codigo: "",
      nombre: "",
      descripcion: "",
      direccion: "",
      telefono: "",
      esPrincipal: false,
      responsableId: null,
    },
    mode: "onTouched",
  });

  const responsibleOptions = (responsibleQuery.data ?? []).map((user) => ({
    value: user.id,
    label: user.nombre,
  }));

  const onSubmit = async (values: CreateBodegaFormValues) => {
    const created = await createBodega.mutateAsync(
      toCreateBodegaPayload(values),
    );

    navigate("/marcas-gt/bodegas/" + created.id, {
      replace: true,
      state: { from: backTo },
    });
  };

  return (
    <AppContainer size="xl" paddingX="none">
      <AppStack gap="lg">
        <BodegaPageHeader
          title="Nueva bodega"
          description="Registra un nuevo centro de almacenamiento para la operación."
          backTo={backTo}
          backLabel="Volver a bodegas"
        />

        <AppForm form={form} onSubmit={onSubmit}>
          <AppStack gap="md">
            <AppCard
              title="Información de la bodega"
              description="Datos generales, ubicación y contacto."
              size="sm"
            >
              <BodegaBasicFormFields<CreateBodegaFormValues> />
            </AppCard>

            <AppCard
              title="Administración"
              description="Configura el responsable y la prioridad operativa."
              size="sm"
            >
              <AppStack gap="md">
                <AppFormSingleSelect<CreateBodegaFormValues, number>
                  name="responsableId"
                  label="Responsable"
                  description=""
                  options={responsibleOptions}
                  placeholder="Seleccionar responsable"
                  isLoading={responsibleQuery.isLoading}
                />

                <AppFormSwitch<CreateBodegaFormValues>
                  name="esPrincipal"
                  fieldLabel="Bodega principal"
                  fieldDescription=""
                  label="Establecer como principal"
                />
              </AppStack>
            </AppCard>

            <div className="flex justify-end gap-2">
              <AppButton asChild variant="secondary">
                <Link to={backTo}>Cancelar</Link>
              </AppButton>
              <AppFormSubmit<CreateBodegaFormValues>
                leftIcon={<Save />}
                loadingText="Creando..."
                disableWhenInvalid
              >
                Crear bodega
              </AppFormSubmit>
            </div>
          </AppStack>
        </AppForm>
      </AppStack>
    </AppContainer>
  );
}
