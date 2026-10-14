import { formatInteger } from "@/features/common/formatters/value.formatters";
import type { ProductSelectable } from "@/features/common/catalogs/catalog.types";
import type { UseQueryResult } from "@tanstack/react-query";

type Props = {
  productoId: number | null;
  bodegaId: number | null;
  cantidad: string;
  productsQuery: UseQueryResult<ProductSelectable[], Error>;
};

/**
 * Vista informativa; la cantidad definitiva la decide la transacción de
 * registro de entrada. Nunca consulta ni suma el Stock legacy.
 */
export function InventoryEntryAvailability({
  productoId,
  bodegaId,
  cantidad,
  productsQuery,
}: Props) {
  if (!productoId) return null;

  const item = productsQuery.data?.find((product) => product.id === productoId);
  const inventory = item?.inventario;
  const quantity = Number(cantidad.trim());
  const validQuantity = /^[1-9]\d*$/.test(cantidad.trim()) && Number.isSafeInteger(quantity);
  const warehouse = inventory?.bodegas.find((b) => b.id === bodegaId);
  const currentReal = warehouse?.real ?? 0;
  const currentReserved = warehouse?.reservado ?? 0;
  const currentAvailable = warehouse?.disponible ?? 0;

  return (
    <div
      className="mt-3 rounded-md border border-[hsl(var(--app-border))] p-3 text-sm"
      role="status"
      aria-live="polite"
    >
      {productsQuery.isError ? (
        <p className="text-amber-600">
          No se pudo consultar el inventario. Intenta actualizar existencias.
        </p>
      ) : inventory ? (
        <div className="space-y-3">
          <div>
            <p className="mb-2 text-xs font-medium text-[hsl(var(--app-muted-foreground))]">
              Existencias del producto en las bodegas activas
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              <span>Real: <strong className="tabular-nums">{formatInteger(inventory.totales.real)}</strong></span>
              <span>Reservado: <strong className="tabular-nums">{formatInteger(inventory.totales.reservado)}</strong></span>
              <span>Disponible: <strong className="tabular-nums">{formatInteger(inventory.totales.disponible)}</strong></span>
            </div>
          </div>

          {inventory.bodegas.length > 0 ? (
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-[hsl(var(--app-muted-foreground))]">
              {inventory.bodegas.map((bodega) => (
                <span key={bodega.id}>
                  {bodega.nombre}{bodega.esPrincipal ? " (principal)" : ""}:
                  {" "}<strong className="tabular-nums">{formatInteger(bodega.disponible)}</strong> disponibles
                  {" "}(real {formatInteger(bodega.real)}, reservado {formatInteger(bodega.reservado)})
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
              Sin existencias registradas en bodegas activas.
            </p>
          )}

          {bodegaId ? (
            <div className="border-t border-[hsl(var(--app-border))] pt-3">
              <p className="font-medium">
                {warehouse?.nombre ?? "Bodega seleccionada"} · entrada a registrar
              </p>
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-[hsl(var(--app-muted-foreground))]">Existencia real actual</p>
                  <p className="font-semibold tabular-nums">{formatInteger(currentReal)}</p>
                </div>
                <div>
                  <p className="text-xs text-[hsl(var(--app-muted-foreground))]">Reservadas</p>
                  <p className="font-semibold tabular-nums">{formatInteger(currentReserved)}</p>
                </div>
                <div>
                  <p className="text-xs text-[hsl(var(--app-muted-foreground))]">Disponible actual</p>
                  <p className="font-semibold tabular-nums">{formatInteger(currentAvailable)}</p>
                </div>
                <div>
                  <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                    Real después de la entrada
                  </p>
                  <p className="font-semibold tabular-nums">
                    {validQuantity
                      ? formatInteger(currentReal + quantity)
                      : "Indica cantidad"}
                  </p>
                </div>
              </div>
              {validQuantity ? (
                <p className="mt-2 text-xs text-[hsl(var(--app-muted-foreground))]">
                  Se añadirán {formatInteger(quantity)} unidades en esta bodega.
                  Disponible estimado después: {formatInteger(currentAvailable + quantity)}.
                </p>
              ) : null}
            </div>
          ) : (
            <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
              Selecciona la bodega de destino para calcular la existencia después de la entrada.
            </p>
          )}
          <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
            Información orientativa. Puede cambiar por movimientos de inventario.
            El registro de entrada solo incrementa la bodega seleccionada.
          </p>
        </div>
      ) : productsQuery.isLoading || productsQuery.isFetching ? (
        <p className="text-xs text-[hsl(var(--app-muted-foreground))]">Consultando existencias...</p>
      ) : (
        <p className="text-xs text-amber-600">
          El inventario nuevo no está disponible en esta consulta.
          Comprueba que el servidor tenga la actualización de existencias.
        </p>
      )}
    </div>
  );
}
