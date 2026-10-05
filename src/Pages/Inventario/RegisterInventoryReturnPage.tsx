import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { parsePositiveIntParam } from "@/features/common/navigation/url-state.utils";
import { useIdempotencyKey } from "@/features/common/utils/idempotency";
import { useRegisterInventoryReturn } from "@/features/inventario/api/inventory.mutations";
import { toRegisterReturnPayload } from "@/features/inventario/common/inventory.mappers";
import { InventoryReferenceFields } from "@/features/inventario/components/inventory-reference-fields";
import {
  InventoryBodegaFormSelect,
  InventoryProductFormSelect,
} from "@/features/inventario/components/inventory-selects";
import {
  registerInventoryReturnSchema,
  type RegisterInventoryReturnFormValues,
} from "@/features/inventario/schemas/inventory.schemas";
import {
  AppForm,
  AppFormInput,
  AppFormSubmit,
  AppFormTextarea,
} from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function RegisterInventoryReturnPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const backTo = getReturnRoute(location.state, "/marcas-gt/inventario");
  const listFrom = getListReturnRoute(location.state, backTo);
  const key = useIdempotencyKey("inventory-return");
  const mutation = useRegisterInventoryReturn();

  const form = useForm<RegisterInventoryReturnFormValues>({
    resolver: zodResolver(registerInventoryReturnSchema),
    defaultValues: {
      bodegaId: parsePositiveIntParam(searchParams.get("bodegaId")),
      productoId: parsePositiveIntParam(searchParams.get("productoId")),
      cantidad: "",
      costoUnitario: "",
      observaciones: "",
      referenciaTipo: "",
      referenciaId: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: RegisterInventoryReturnFormValues) => {
    const result = await mutation.mutateAsync(
      toRegisterReturnPayload(values, key),
    );

    navigate("/marcas-gt/inventario/stocks/" + result.stockId, {
      replace: true,
      state: { from: listFrom },
    });
  };

  return (
    <AppContainer size="xl" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Registrar devolución"
          description="Reintegra unidades al inventario y deja trazabilidad de la operación."
          backTo={backTo}
          backLabel="Volver"
        />

        <AppForm form={form} onSubmit={onSubmit}>
          <AppStack gap="md">
            <AppCard title="Existencia" size="sm">
              <AppGrid cols={{ base: 1, md: 2 }} gap="md">
                <InventoryBodegaFormSelect<RegisterInventoryReturnFormValues>
                  name="bodegaId"
                  label="Bodega"
                  required
                />

                <InventoryProductFormSelect<RegisterInventoryReturnFormValues>
                  name="productoId"
                  label="Producto"
                  required
                />

                <AppFormInput<RegisterInventoryReturnFormValues>
                  name="cantidad"
                  label="Cantidad"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  required
                />

                <AppFormInput<RegisterInventoryReturnFormValues>
                  name="costoUnitario"
                  label="Costo unitario"
                  description="Opcional."
                  inputMode="decimal"
                  placeholder="0.0000"
                />
              </AppGrid>
            </AppCard>

            <AppCard title="Referencia y observaciones" size="sm">
              <AppStack gap="md">
                <InventoryReferenceFields<RegisterInventoryReturnFormValues> />

                <AppFormTextarea<RegisterInventoryReturnFormValues>
                  name="observaciones"
                  label="Observaciones"
                  maxLength={500}
                  rows={4}
                  placeholder="Información adicional de la devolución."
                />
              </AppStack>
            </AppCard>

            <div className="flex justify-end gap-2">
              <AppButton asChild variant="secondary">
                <Link to={backTo}>Cancelar</Link>
              </AppButton>
              <AppFormSubmit<RegisterInventoryReturnFormValues>
                leftIcon={<RotateCcw />}
                loadingText="Registrando..."
                disableWhenInvalid
              >
                Registrar devolución
              </AppFormSubmit>
            </div>
          </AppStack>
        </AppForm>
      </AppStack>
    </AppContainer>
  );
}
