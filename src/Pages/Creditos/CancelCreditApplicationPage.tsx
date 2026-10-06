import { zodResolver } from "@hookform/resolvers/zod";
import { XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useIdempotencyKey } from "@/features/common/utils/idempotency";
import { useCancelCreditApplication } from "@/features/creditos/api/credit.mutations";
import { useCreditApplication } from "@/features/creditos/api/credit.queries";
import {
  creditReasonSchema,
  type CreditReasonFormValues,
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

export default function CancelCreditApplicationPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const detailUrl = "/marcas-gt/creditos/solicitudes/" + id;
  const backTo = getReturnRoute(location.state, detailUrl);
  const listFrom = getListReturnRoute(location.state, "/marcas-gt/creditos");
  const key = useIdempotencyKey("credit-cancel");

  const query = useCreditApplication(id);
  const mutation = useCancelCreditApplication();

  const form = useForm<CreditReasonFormValues>({
    resolver: zodResolver(creditReasonSchema),
    defaultValues: { motivo: "" },
    mode: "onTouched",
  });

  const onSubmit = async (values: CreditReasonFormValues) => {
    if (!query.data?.acciones.puedeCancelar) return;

    await mutation.mutateAsync({
      id,
      payload: {
        motivo: values.motivo.trim(),
        claveIdempotencia: key,
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
          title="Cancelar solicitud"
          description={query.data?.numero}
          backTo={backTo}
          backState={{ from: listFrom }}
          backLabel="Volver al detalle"
        />

        <AppDataState
          isLoading={query.isLoading}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !query.data}
          emptyTitle="Solicitud no encontrada"
        >
          {query.data?.acciones.puedeCancelar ? (
            <AppForm form={form} onSubmit={onSubmit}>
              <AppStack gap="md">
                <AppCard
                  title="Motivo de cancelación"
                  description="La cancelación también se integra con el pedido relacionado."
                  size="sm"
                >
                  <AppFormTextarea<CreditReasonFormValues>
                    name="motivo"
                    label="Motivo"
                    required
                    maxLength={1000}
                    rows={5}
                  />
                </AppCard>

                <div className="flex justify-end gap-2">
                  <AppButton asChild variant="secondary">
                    <Link to={backTo} state={{ from: listFrom }}>
                      Volver
                    </Link>
                  </AppButton>
                  <AppFormSubmit<CreditReasonFormValues>
                    variant="danger"
                    leftIcon={<XCircle />}
                    loadingText="Cancelando..."
                    disableWhenInvalid
                  >
                    Cancelar solicitud
                  </AppFormSubmit>
                </div>
              </AppStack>
            </AppForm>
          ) : query.data ? (
            <AppCard
              title="La solicitud no puede cancelarse"
              description="El estado actual no permite esta operación."
              size="sm"
            />
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
