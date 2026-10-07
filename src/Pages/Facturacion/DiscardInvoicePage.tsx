import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useIdempotencyKey } from "@/features/common/utils/idempotency";
import { useDiscardInvoice } from "@/features/facturacion/api/billing.mutations";
import { useInvoice } from "@/features/facturacion/api/billing.queries";
import {
  discardInvoiceSchema,
  type DiscardInvoiceFormValues,
} from "@/features/facturacion/schemas/billing.schemas";
import {
  AppForm,
  AppFormSubmit,
  AppFormTextarea,
} from "@/ui/components/app/form";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function DiscardInvoicePage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const detailUrl = "/marcas-gt/facturacion/facturas/" + id;
  const backTo = getReturnRoute(location.state, detailUrl);
  const listFrom = getListReturnRoute(location.state, "/marcas-gt/facturacion/facturas");
  const key = useIdempotencyKey("billing-discard");
  const query = useInvoice(id);
  const mutation = useDiscardInvoice();

  const form = useForm<DiscardInvoiceFormValues>({
    resolver: zodResolver(discardInvoiceSchema),
    defaultValues: { motivo: "" },
    mode: "onTouched",
  });

  const onSubmit = async (values: DiscardInvoiceFormValues) => {
    if (!query.data?.acciones.puedeDescartar) return;
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
          title="Descartar factura"
          description={query.data ? "Factura #" + query.data.id : undefined}
          backTo={backTo}
          backLabel="Volver a la factura"
        />
        <AppDataState
          isLoading={query.isLoading}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !query.data}
          emptyTitle="Factura no encontrada"
        >
          {query.data ? (
            <AppForm form={form} onSubmit={onSubmit}>
              <AppStack gap="md">
                <AppAlert
                  tone="warning"
                  title="Descartar borrador"
                  description="Se liberarán las cantidades de entrega reservadas por esta factura para que puedan volver a facturarse. DESCARTADA no equivale a ANULADA FEL."
                />
                <AppCard title="Motivo" size="sm">
                  <AppFormTextarea<DiscardInvoiceFormValues>
                    name="motivo"
                    label="Motivo de descarte"
                    rows={5}
                    maxLength={1000}
                    required
                  />
                </AppCard>
                <div className="flex justify-end gap-2">
                  <AppButton asChild variant="secondary">
                    <Link to={backTo}>Cancelar</Link>
                  </AppButton>
                  <AppFormSubmit<DiscardInvoiceFormValues>
                    variant="danger"
                    leftIcon={<Trash2 />}
                    loadingText="Descartando..."
                    disableWhenInvalid
                    disabled={!query.data.acciones.puedeDescartar}
                  >
                    Descartar factura
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
