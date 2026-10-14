import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDownToLine, RefreshCw } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { useProductSelectables } from "@/features/common/catalogs/catalog.queries";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { parsePositiveIntParam } from "@/features/common/navigation/url-state.utils";
import { useIdempotencyKey } from "@/features/common/utils/idempotency";
import { useRegisterInventoryEntry } from "@/features/inventario/api/inventory.mutations";
import { toRegisterEntryPayload } from "@/features/inventario/common/inventory.mappers";
import { InventoryReferenceFields } from "@/features/inventario/components/inventory-reference-fields";
import { InventoryEntryAvailability } from "@/features/inventario/components/inventory-entry-availability";
import {
  InventoryBodegaFormSelect,
  InventoryProductFormSelect,
  InventoryProviderFormSelect,
} from "@/features/inventario/components/inventory-selects";
import {
  registerInventoryEntrySchema,
  type RegisterInventoryEntryFormValues,
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

export default function RegisterInventoryEntryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const backTo = getReturnRoute(location.state, "/marcas-gt/inventario");
  const listFrom = getListReturnRoute(location.state, backTo);
  const key = useIdempotencyKey("inventory-entry");

  const mutation = useRegisterInventoryEntry();
  const productsQuery = useProductSelectables();

  const form = useForm<RegisterInventoryEntryFormValues>({
    resolver: zodResolver(registerInventoryEntrySchema),
    defaultValues: {
      bodegaId: parsePositiveIntParam(searchParams.get("bodegaId")),
      productoId: parsePositiveIntParam(searchParams.get("productoId")),
      cantidad: "",
      costoUnitario: "",
      proveedorId: null,
      observaciones: "",
      referenciaTipo: "",
      referenciaId: "",
    },
    mode: "onTouched",
  });

  const [bodegaId, productoId, cantidad] = useWatch({
    control: form.control,
    name: ["bodegaId", "productoId", "cantidad"],
  });

  const onSubmit = async (values: RegisterInventoryEntryFormValues) => {
    const result = await mutation.mutateAsync(
      toRegisterEntryPayload(values, key),
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
          title="Registrar entrada"
          description="Incrementa la existencia real de un producto en una bodega."
          backTo={backTo}
          backLabel="Volver"
        />

        <AppForm form={form} onSubmit={onSubmit}>
          <AppStack gap="md">
            <AppCard
              title="Existencia"
              size="sm"
              action={
                <AppButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  leftIcon={<RefreshCw />}
                  loading={productsQuery.isFetching}
                  loadingText="Actualizando..."
                  onClick={() => void productsQuery.refetch()}
                >
                  Actualizar existencias
                </AppButton>
              }
            >
              <AppGrid cols={{ base: 1, md: 2 }} gap="md">
                <InventoryBodegaFormSelect<RegisterInventoryEntryFormValues>
                  name="bodegaId"
                  label="Bodega"
                  required
                  placeholder="Seleccionar bodega"
                />

                <InventoryProductFormSelect<RegisterInventoryEntryFormValues>
                  name="productoId"
                  label="Producto"
                  required
                  placeholder="Seleccionar producto"
                  showAvailability
                />

                <AppFormInput<RegisterInventoryEntryFormValues>
                  name="cantidad"
                  label="Cantidad"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  required
                />

                <AppFormInput<RegisterInventoryEntryFormValues>
                  name="costoUnitario"
                  label="Costo unitario"
                  inputMode="decimal"
                  placeholder="0.0000"
                  required
                />

                <InventoryProviderFormSelect<RegisterInventoryEntryFormValues>
                  name="proveedorId"
                  label="Proveedor"
                  placeholder="Proveedor opcional"
                  isClearable
                />
              </AppGrid>
              <InventoryEntryAvailability
                productoId={productoId}
                bodegaId={bodegaId}
                cantidad={cantidad}
                productsQuery={productsQuery}
              />
            </AppCard>

            <AppCard title="Referencia y observaciones" size="sm">
              <AppStack gap="md">
                <InventoryReferenceFields<RegisterInventoryEntryFormValues> />
                <AppFormTextarea<RegisterInventoryEntryFormValues>
                  name="observaciones"
                  label="Observaciones"
                  maxLength={500}
                  rows={4}
                  placeholder="Información adicional de la entrada."
                />
              </AppStack>
            </AppCard>

            <div className="flex justify-end gap-2">
              <AppButton asChild variant="secondary">
                <Link to={backTo}>Cancelar</Link>
              </AppButton>
              <AppFormSubmit<RegisterInventoryEntryFormValues>
                leftIcon={<ArrowDownToLine />}
                loadingText="Registrando..."
                disableWhenInvalid
              >
                Registrar entrada
              </AppFormSubmit>
            </div>
          </AppStack>
        </AppForm>
      </AppStack>
    </AppContainer>
  );
}
