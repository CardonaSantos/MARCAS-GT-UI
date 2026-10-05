import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { useUpdateBodega } from "@/features/bodegas/api/bodega.mutations";
import { useBodega } from "@/features/bodegas/api/bodega.queries";
import { BodegaBasicFormFields } from "@/features/bodegas/components/bodega-basic-form-fields";
import { BodegaPageHeader } from "@/features/bodegas/components/bodega-page-header";
import { toUpdateBodegaPayload } from "@/features/bodegas/common/bodega.mappers";
import {
  updateBodegaSchema,
  type UpdateBodegaFormValues,
} from "@/features/bodegas/schemas/bodega.schemas";
import { AppForm, AppFormSubmit } from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

type RouteState = {
  from?: string;
  listFrom?: string;
} | null;

export default function EditBodegaPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const id = Number(params.id);
  const detailUrl = "/marcas-gt/bodegas/" + id;
  const routeState = location.state as RouteState;
  const returnTo = routeState?.from ?? detailUrl;
  const listReturnTo = routeState?.listFrom ?? "/marcas-gt/bodegas";

  const bodegaQuery = useBodega(id);
  const updateBodega = useUpdateBodega();

  const form = useForm<UpdateBodegaFormValues>({
    resolver: zodResolver(updateBodegaSchema),
    defaultValues: {
      codigo: "",
      nombre: "",
      descripcion: "",
      direccion: "",
      telefono: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!bodegaQuery.data) return;

    form.reset({
      codigo: bodegaQuery.data.codigo,
      nombre: bodegaQuery.data.nombre,
      descripcion: bodegaQuery.data.descripcion ?? "",
      direccion: bodegaQuery.data.direccion ?? "",
      telefono: bodegaQuery.data.telefono ?? "",
    });
  }, [bodegaQuery.data, form]);

  const onSubmit = async (values: UpdateBodegaFormValues) => {
    await updateBodega.mutateAsync({
      id,
      payload: toUpdateBodegaPayload(values),
    });

    navigate(returnTo, {
      replace: true,
      state: { from: listReturnTo },
    });
  };

  const detailState = { from: listReturnTo };

  return (
    <AppContainer size="xl" paddingX="none">
      <AppStack gap="lg">
        <BodegaPageHeader
          title="Editar bodega"
          description="Actualiza únicamente la información general de la bodega."
          backTo={returnTo}
          backState={detailState}
          backLabel="Volver al detalle"
        />

        <AppDataState
          isLoading={bodegaQuery.isLoading}
          error={bodegaQuery.error}
          onRetry={() => void bodegaQuery.refetch()}
          loadingVariant="skeleton-card"
        >
          <AppForm form={form} onSubmit={onSubmit}>
            <AppStack gap="md">
              <AppCard
                title="Información de la bodega"
                description="El estado, responsable y condición principal se administran mediante operaciones separadas."
                size="sm"
              >
                <BodegaBasicFormFields<UpdateBodegaFormValues />
              </AppCard>

              <div className="flex justify-end gap-2">
                <AppButton asChild variant="secondary">
                  <Link to={returnTo} state={detailState}>
                    Cancelar
                  </Link>
                </AppButton>
                <AppFormSubmit<UpdateBodegaFormValues>
                  leftIcon={<Save />}
                  loadingText="Guardando..."
                  disableWhenInvalid
                  disabled={!form.formState.isDirty}
                >
                  Guardar cambios
                </AppFormSubmit>
              </div>
            </AppStack>
          </AppForm>
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
