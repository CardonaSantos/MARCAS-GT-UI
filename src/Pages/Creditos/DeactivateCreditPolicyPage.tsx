import { zodResolver } from "@hookform/resolvers/zod";
import { PowerOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useSetCreditPolicyStatus } from "@/features/creditos/api/credit.mutations";
import { useCreditPolicy } from "@/features/creditos/api/credit.queries";
import {
  creditPolicyDeactivateSchema,
  type CreditPolicyDeactivateFormValues,
} from "@/features/creditos/schemas/credit.schemas";
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

export default function DeactivateCreditPolicyPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const detailUrl = "/marcas-gt/creditos/politicas/" + id;
  const backTo = getReturnRoute(location.state, detailUrl);
  const listFrom = getListReturnRoute(
    location.state,
    "/marcas-gt/creditos/politicas",
  );

  const query = useCreditPolicy(id);
  const mutation = useSetCreditPolicyStatus();

  const form = useForm<CreditPolicyDeactivateFormValues>({
    resolver: zodResolver(creditPolicyDeactivateSchema),
    defaultValues: { motivo: "" },
    mode: "onTouched",
  });

  const onSubmit = async (values: CreditPolicyDeactivateFormValues) => {
    if (!query.data?.activo) return;

    await mutation.mutateAsync({
      id,
      payload: {
        activo: false,
        motivo: values.motivo.trim(),
      },
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
          title="Desactivar política"
          description={query.data?.nombre}
          backTo={backTo}
          backState={{ from: listFrom }}
          backLabel="Volver al detalle"
        />

        <AppDataState
          isLoading={query.isLoading}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !query.data}
          emptyTitle="Política no encontrada"
        >
          {query.data?.activo ? (
            <AppForm form={form} onSubmit={onSubmit}>
              <AppStack gap="md">
                <AppCard
                  title="Motivo"
                  description="Las solicitudes existentes conservan su snapshot de requisitos."
                  size="sm"
                >
                  <AppFormTextarea<CreditPolicyDeactivateFormValues>
                    name="motivo"
                    label="Motivo de inactivación"
                    required
                    maxLength={500}
                    rows={5}
                  />
                </AppCard>

                <div className="flex justify-end gap-2">
                  <AppButton asChild variant="secondary">
                    <Link to={backTo} state={{ from: listFrom }}>
                      Volver
                    </Link>
                  </AppButton>
                  <AppFormSubmit<CreditPolicyDeactivateFormValues>
                    variant="danger"
                    leftIcon={<PowerOff />}
                    loadingText="Desactivando..."
                    disableWhenInvalid
                  >
                    Desactivar política
                  </AppFormSubmit>
                </div>
              </AppStack>
            </AppForm>
          ) : query.data ? (
            <AppCard
              title="La política ya está inactiva"
              description="No hay ninguna acción pendiente."
              size="sm"
            />
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
