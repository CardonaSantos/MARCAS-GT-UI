import { Link, useLocation } from "react-router-dom";
import { History, Pencil, Warehouse } from "lucide-react";

import { formatDateTime, formatInteger, formatMoney } from "@/features/common/formatters/value.formatters";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppDialog, AppDialogBody, AppDialogContent, AppDialogFooter,
  AppDialogHeader, AppDialogTitle, AppDialogDescription } from "@/ui/components/app/primitives/app-dialog";
import placeholder from "@/assets/images/placeholder.jpg";

import { useCatalogProduct } from "../api/catalog.queries";
import type { CatalogMovement } from "../api/catalog.types";

function Movements({ rows }: { rows: CatalogMovement[] }) {
  if (!rows.length) return <p className="text-xs text-[hsl(var(--app-muted-foreground))]">Sin movimientos registrados.</p>;
  return (
    <ul className="divide-y divide-[hsl(var(--app-border))] text-xs">
      {rows.map((movement) => (
        <li key={movement.id} className="grid gap-1 py-2 sm:grid-cols-[1fr_auto]">
          <div className="min-w-0">
            <p className="font-medium">{movement.tipo.replaceAll("_", " ")} · {formatInteger(movement.cantidad)} u.</p>
            <p className="text-[hsl(var(--app-muted-foreground))]">
              {movement.bodega.nombre}
              {movement.proveedor ? ` · Proveedor: ${movement.proveedor.nombre}` : ""}
              {movement.referencia ? ` · ${movement.referencia.tipo} #${movement.referencia.id}` : ""}
            </p>
          </div>
          <time className="text-[hsl(var(--app-muted-foreground))]">{formatDateTime(movement.creadoEn)}</time>
        </li>
      ))}
    </ul>
  );
}

interface Props {
  id: number | null;
  onClose: () => void;
  onEdit: (id: number) => void;
}

export function ProductCatalogDetailDialog({ id, onClose, onEdit }: Props) {
  const location = useLocation();
  const currentUrl = location.pathname + location.search;
  const query = useCatalogProduct(id);
  const product = query.data;

  return (
    <AppDialog open={id !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <AppDialogContent size="5xl" viewport="tall">
        <AppDialogHeader>
          <AppDialogTitle>Ficha del producto</AppDialogTitle>
          <AppDialogDescription>
            Información comercial, disponibilidad por bodega y movimientos recientes.
          </AppDialogDescription>
        </AppDialogHeader>
        <AppDialogBody className="space-y-5 py-3">
          {query.isLoading ? <p role="status" className="text-sm">Cargando producto...</p> : null}
          {query.isError ? (
            <div className="space-y-2">
              <p role="alert" className="text-sm text-red-500">No se pudo cargar el detalle.</p>
              <AppButton size="sm" variant="secondary" onClick={() => void query.refetch()}>Reintentar</AppButton>
            </div>
          ) : null}
          {product ? (
            <>
              <div className="grid gap-4 sm:grid-cols-[140px_minmax(0,1fr)]">
                <img src={product.imagenPrincipal || placeholder} alt={product.nombre}
                  className="h-36 w-full rounded-lg border border-[hsl(var(--app-border))] object-contain" />
                <div className="min-w-0 space-y-2">
                  <h3 className="text-lg font-semibold">{product.nombre}</h3>
                  <p className="text-xs text-[hsl(var(--app-muted-foreground))]">{product.codigoProducto}</p>
                  <p className="text-sm">{product.descripcion || "Sin descripción"}</p>
                  <p className="text-xs">{product.categorias.map((c) => c.nombre).join(" · ") || "Sin categorías"}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span>Venta: <strong>{formatMoney(product.precio)}</strong></span>
                    <span>Precio de costo: <strong>{product.costoReferencia === null ? "—" : formatMoney(product.costoReferencia)}</strong></span>
                  </div>
                </div>
              </div>

              {product.imagenes.length > 1 ? (
                <div className="flex flex-wrap gap-2">
                  {product.imagenes.map((img) => (
                    <a key={img.id} href={img.url} target="_blank" rel="noreferrer"
                      aria-label={`Abrir imagen ${img.id}`}>
                      <img src={img.url} alt="" className="h-16 w-16 rounded border border-[hsl(var(--app-border))] object-cover" />
                    </a>
                  ))}
                </div>
              ) : null}

              <section className="space-y-2">
                <h4 className="flex items-center gap-2 text-sm font-semibold"><Warehouse className="h-4 w-4" /> Existencias por bodega</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Real", count: product.inventario.totales.real },
                    { label: "Reservado", count: product.inventario.totales.reservado },
                    { label: "Disponible", count: product.inventario.totales.disponible },
                  ].map((item) => (
                    <div key={item.label} className="rounded-md border border-[hsl(var(--app-border))] p-2 text-center">
                      <p className="text-lg font-semibold tabular-nums">{formatInteger(item.count)}</p>
                      <p className="text-xs text-[hsl(var(--app-muted-foreground))]">{item.label}</p>
                    </div>
                  ))}
                </div>
                {product.inventario.bodegas.length ? (
                  <div className="overflow-x-auto rounded-md border border-[hsl(var(--app-border))]">
                    <table className="w-full min-w-[520px] text-left text-xs">
                      <thead className="bg-[hsl(var(--app-muted))]">
                        <tr><th className="p-2">Bodega</th><th className="p-2 text-right">Real</th>
                          <th className="p-2 text-right">Reservado</th><th className="p-2 text-right">Disponible</th>
                          <th className="p-2 text-right">Costo promedio</th></tr>
                      </thead>
                      <tbody>
                        {product.inventario.bodegas.map((stock) => (
                          <tr key={stock.stockId} className="border-t border-[hsl(var(--app-border))]">
                            <td className="p-2">{stock.bodega.nombre}</td>
                            <td className="p-2 text-right">{formatInteger(stock.real)}</td>
                            <td className="p-2 text-right">{formatInteger(stock.reservado)}</td>
                            <td className="p-2 text-right">{formatInteger(stock.disponible)}</td>
                            <td className="p-2 text-right">{formatMoney(stock.costoPromedio)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <p className="text-xs text-[hsl(var(--app-muted-foreground))]">Todavía no hay stock en bodegas.</p>}
              </section>

              <section className="grid gap-3 md:grid-cols-2">
                <div className="min-w-0 space-y-2 rounded-md border border-[hsl(var(--app-border))] p-3">
                  <h4 className="text-sm font-semibold">Entradas y proveedores recientes</h4>
                  <Movements rows={product.ingresosRecientes} />
                  <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                    Los proveedores registrados en entradas no identifican el origen exacto de las unidades restantes.
                  </p>
                </div>
                <div className="min-w-0 space-y-2 rounded-md border border-[hsl(var(--app-border))] p-3">
                  <h4 className="text-sm font-semibold">Últimos movimientos</h4>
                  <Movements rows={product.movimientosRecientes} />
                </div>
              </section>

              {product.perfilFiscal ? (
                <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                  Perfil fiscal: {product.perfilFiscal.bienOServicio} · Unidad {product.perfilFiscal.unidadMedida}
                  {!product.perfilFiscal.activo ? " · Inactivo" : ""}
                </p>
              ) : null}
              {product.stockLegacy && product.stockLegacy.diferenciaConInventarioReal !== 0 ? (
                <p className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs" role="note">
                  Conciliación pendiente: el stock antiguo registra {formatInteger(product.stockLegacy.cantidad)}
                  {" "}y el nuevo inventario registra {formatInteger(product.inventario.totales.real)}.
                  Las existencias oficiales de esta ficha provienen únicamente de StockBodega.
                </p>
              ) : null}
            </>
          ) : null}
        </AppDialogBody>
        <AppDialogFooter className="flex flex-wrap justify-end gap-2">
          {product ? (
            <>
              <AppButton asChild variant="secondary" size="sm">
                <Link to={`/marcas-gt/inventario/productos/${product.id}`} state={{ from: currentUrl }}>
                  <History className="h-4 w-4" /> Kardex y disponibilidad
                </Link>
              </AppButton>
              <AppButton size="sm" variant="primary" leftIcon={<Pencil />}
                onClick={() => { onClose(); onEdit(product.id); }}>
                Editar
              </AppButton>
            </>
          ) : null}
          <AppButton variant="secondary" size="sm" onClick={onClose}>Cerrar</AppButton>
        </AppDialogFooter>
      </AppDialogContent>
    </AppDialog>
  );
}
