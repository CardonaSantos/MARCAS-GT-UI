import { zodResolver } from "@hookform/resolvers/zod";
import { Save, UserRound } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { useAssignBodegaResponsible } from "@/features/bodegas/api/bodega.mutations";
import {
  useBodega,
  useBodegaResponsibleOptions,
} from "@/features/bodegas/api/bodega.queries";
import { BodegaPageHeader } from "@/features/bodegas/components/bodega-page-header";
import { toAssignResponsiblePayload } from "@/features/bodegas/common/bodega.mappers";
import {
  assignBodegaResponsibleSchema,
  type AssignBodegaResponsibleFormValues,
} from "@/features/bodegas/schemas/bodega.schemas";
import {
  AppForm,
  AppFormSingleSelect,
  AppFormSubmit,
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

export default function BodegaResponsiblePage() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const id = Number(params.id);
  const detailUrl = "/marcas-gt/bodegas/" + id;
  const routeState = location.state as RouteState;
  const returnTo = routeState?.from ?? detailUrl;
  const listReturnTo = routeState?.listFrom ?? "/marcas-gt/bodegas";

  const bodegaQuery = useBodega(id);
  const usersQuery = useBodegaResponsibleOptions();
  const assignResponsible = useAssignBodegaResponsible();

  const form = useForm<AssignBodegaResponsibleFormValues>({
    resolver: zodResolver(assignBodegaResponsibleSchema),
    defaultValues: {
      responsableId: null,
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!bodegaQuery.data) return;

    form.reset({
      responsableId: bodegaQuery.data.responsable?.id ?? null,
    });
  }, [bodegaQuery.data, form]);

  const responsibleUsers = [...(usersQuery.data ?? [])];

  if (
    bodegaQuery.data?.responsable &&
    !responsibleUsers.some(
      (user) => user.id === bodegaQuery.data?.responsable?.id,
    )
  ) {
    responsibleUsers.push(bodegaQuery.data.responsable);
  }

  const options = responsibleUsers
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
    .map((user) => ({
      value: user.id,
      label: user.nombre,
    }));

  const onSubmit = async (values: AssignBodegaResponsibleFormValues) => {
    await assignResponsible.mutateAsync({
      id,
      payload: toAssignResponsiblePayload(values),
    });

    navigate(returnTo, {
      replace: true,
      state: { from: listReturnTo },
    });
  };

  const detailState = { from: listReturnTo };

  return (
    <AppContainer size="lg" paddingX="none">
      <AppStack gap="lg">
        <BodegaPageHeader
          title="Responsable de bodega"
          description="Asigna o remueve al usuario responsable de esta bodega."
          backTo={returnTo}
          backState={detailState}
          backLabel="Volver al detalle"
        />

        <AppDataState
          isLoading={bodegaQuery.isLoading}
          error={bodegaQuery.error}
          onRetry={() => void bodegaQuery.refetch()}
        >
          <AppForm form={form} onSubmit={onSubmit}>
            <AppStack gap="md">
              <AppCard
                title={bodegaQuery.data?.nombre ?? "Bodega"}
                description={
                  bodegaQuery.data?.responsable
                    ? "Responsable actual: " + bodegaQuery.data.responsable.nombre
                    : "Actualmente no tiene responsable asignado."
                }
                icon={<UserRound />}
                size="sm"
              >
                <AppFormSingleSelect<
                  AssignBodegaResponsibleFormValues,
                  number
                >
                  name="responsableId"
                  label="Responsable"
                  description="El backend permite únicamente usuarios activos con rol ADMIN o BODEGA."
                  options={options}
                  isLoading={usersQuery.isLoading}
                  placeholder="Seleccionar responsable"
                  isClearable
                />
              </AppCard>

              <div className="flex justify-end gap-2">
                <AppButton asChild variant="secondary">
                  <Link to={returnTo} state={detailState}>
                    Cancelar
                  </Link>
                </AppButton>
                <AppFormSubmit<AssignBodegaResponsibleFormValues>
                  leftIcon={<Save />}
                  loadingText="Guardando..."
                  disableWhenInvalid
                  disabled={!form.formState.isDirty}
                >
                  Guardar responsable
                </AppFormSubmit>
              </div>
            </AppStack>
          </AppForm>
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
