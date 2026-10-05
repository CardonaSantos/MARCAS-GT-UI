import { PackageSearch } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { useProductSelectables } from "@/features/common/catalogs/catalog.queries";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function InventoryAvailabilityPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = useStore((state) => state.userRol);
  const defaultBackTo =
    role === "VENDEDOR" ? "/marcas-gt/dashboard-empleado" : "/marcas-gt/inventario";
  const backTo = getReturnRoute(location.state, defaultBackTo);
  const [productoId, setProductoId] = useState<number | null>(null);

  const productsQuery = useProductSelectables();

  const productOptions = (productsQuery.data ?? []).map((product) => ({
    value: product.id,
    label: `${product.codigo} · ${product.nombre}`,
  }));

  return (
    <AppContainer size="lg" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Consultar disponibilidad"
          description="Selecciona un producto para consultar existencias disponibles por bodega."
          backTo={backTo}
          backLabel="Volver"
        />

        <AppCard
          title="Producto"
          description="La disponibilidad se consulta directamente del inventario por bodegas."
          icon={<PackageSearch />}
          size="sm"
        >
          <AppStack gap="md">
            <AppSingleSelect<number>
              value={productoId}
              options={productOptions}
              isLoading={productsQuery.isLoading}
              placeholder="Seleccionar producto"
              noOptionsText="No hay productos disponibles"
              onChange={setProductoId}
            />

            <div className="flex justify-end">
              <AppButton
                variant="primary"
                disabled={!productoId}
                leftIcon={<PackageSearch />}
                onClick={() => {
                  if (!productoId) return;

                  navigate(
                    "/marcas-gt/inventario/productos/" + productoId,
                    {
                      state: { from: location.pathname + location.search },
                    },
                  );
                }}
              >
                Consultar disponibilidad
              </AppButton>
            </div>
          </AppStack>
        </AppCard>
      </AppStack>
    </AppContainer>
  );
}
