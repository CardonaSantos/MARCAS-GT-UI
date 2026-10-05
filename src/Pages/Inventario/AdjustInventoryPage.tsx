import { zodResolver } from "@hookform/resolvers/zod";
import { PencilLine } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
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
import { useAdjustInventory } from "@/features/inventario/api/inventory.mutations";
import { toAdjustInventoryPayload } from "@/features/inventario/common/inventory.mappers";
import {
  InventoryBodegaFormSelect,
  InventoryProductFormSelect,
} from "@/features/inventario/components/inventory-selects";
import {
  adjustInventorySchema,
  type AdjustInventoryFormValues,
} from "@/features/inventario/schemas/inventory.schemas";
import {
  AppForm,
  AppFormInput,
  AppFormSingleSelect,
  AppFormSubmit,
  AppFormTextarea,
} from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

const adjustmentOptions = [
  { value: "ENTRADA", label: "Entrada" },
  { value: "SALIDA", label: "Salida" },
] as const;

export default function AdjustInventoryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const backTo = getReturnRoute(location.state, "/marcas-gt/inventario");
  const listFrom = getListReturnRoute(location.state, backTo);
  const key = useIdempotencyKey("inventory-adjustment");
  const mutation = useAdjustInventory();

  const form = useForm<AdjustInventoryFormValues>({
    resolver: zodResolver(adjustInventorySchema),
    defaultValues: {
      bodegaId: parsePositiveIntParam(searchParams.get("bodegaId")),
      productoId: parsePositiveIntParam(searchParams.get("productoId")),
      tipo: "ENTRADA",
      cantidad: "",
      costoUnitario: "",
      motivo: "",
    },
    mode: "onTouched",
  });

  const tipo = useWatch({ control: form.control, name: "tipo" });

  const onSubmit = async (values: AdjustInventoryFormValues) => {
    const result = await mutation.mutateAsync(
      toAdjustInventoryPayload(values, key),
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
          title="Ajustar inventario"
          description="Corrige existencias mediante un ajuste auditado de entrada o salida."
          backTo={backTo}
          backLabel="Volver"
        />

        <AppForm form={form} onSubmit={onSubmit}>
          <AppStack gap="md">
            <AppCard title="Ajuste" size="sm">
              <AppGrid cols={{ base: 1, md: 2 }} gap="md">
                <InventoryBodegaFormSelect<AdjustInventoryFormValues>
                  name="bodegaId"
                  label="Bodega"
                  required
                />

                <InventoryProductFormSelect<AdjustInventoryFormValues>
                  name="productoId"
                  label="Producto"
                  required
                />

                <AppFormSingleSelect<AdjustInventoryFormValues, "ENTRADA" | "SALIDA">
                  name="tipo"
                  label="Tipo de ajuste"
                  options={[...adjustmentOptions]}
                  isClearable={false}
                  required
                />

                <AppFormInput<AdjustInventoryFormValues>
                  name="cantidad"
                  label="Cantidad"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  required
                />

                <AppFormInput<AdjustInventoryFormValues>
                  name="costoUnitario"
                  label="Costo unitario"
                  description={
                    tipo === "ENTRADA"
                      ? "Opcional. Si se indica, participa en el costo promedio."
                      : "Opcional para salidas de ajuste."
                  }
                  inputMode="decimal"
                  placeholder="0.0000"
                />

                <div className="md:col-span-2">
                  <AppFormTextarea<AdjustInventoryFormValues>
                    name="motivo"
                    label="Motivo"
                    required
                    maxLength={500}
                    rows={4}
                    placeholder="Describe la razón del ajuste."
                  />
                </div>
              </AppGrid>
            </AppCard>

            <div className="flex justify-end gap-2">
              <AppButton asChild variant="secondary">
                <Link to={backTo}>Cancelar</Link>
              </AppButton>
              <AppFormSubmit<AdjustInventoryFormValues>
                leftIcon={<PencilLine />}
                loadingText="Registrando..."
                disableWhenInvalid
              >
                Registrar ajuste
              </AppFormSubmit>
            </div>
          </AppStack>
        </AppForm>
      </AppStack>
    </AppContainer>
  );
}
