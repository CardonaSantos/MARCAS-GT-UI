import { Building2, CalendarClock, Package, Tag } from "lucide-react";

import {
  formatDateTime,
  formatInteger,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";

import type { InventoryStockDetail } from "../api/inventory.types";

function DetailValue({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
        {label}
      </dt>
      <dd className="mt-1 text-sm">{value}</dd>
    </div>
  );
}

export function InventoryStockOverview({
  stock,
}: {
  stock: InventoryStockDetail;
}) {
  return (
    <div className="space-y-4">
      <AppGrid cols={{ base: 1, md: 2, xl: 4 }} gap="sm">
        <AppCard title="Stock real" size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {formatInteger(stock.cantidadReal)}
          </p>
        </AppCard>
        <AppCard title="Reservado" size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {formatInteger(stock.cantidadReservada)}
          </p>
        </AppCard>
        <AppCard title="Disponible" size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {formatInteger(stock.cantidadDisponible)}
          </p>
        </AppCard>
        <AppCard title="Valor de inventario" size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {formatMoney(stock.valorInventario)}
          </p>
        </AppCard>
      </AppGrid>

      <AppGrid cols={{ base: 1, lg: 2 }} gap="sm">
        <AppCard title="Producto" icon={<Package />} size="sm">
          <dl className="grid gap-4 sm:grid-cols-2">
            <DetailValue label="Código" value={stock.producto.codigo} />
            <DetailValue label="Nombre" value={stock.producto.nombre} />
            <DetailValue
              label="Costo promedio"
              value={formatMoney(stock.costoPromedio)}
            />
            <DetailValue label="Versión" value={stock.version} />
          </dl>
        </AppCard>

        <AppCard title="Bodega" icon={<Building2 />} size="sm">
          <dl className="grid gap-4 sm:grid-cols-2">
            <DetailValue label="Código" value={stock.bodega.codigo} />
            <DetailValue label="Nombre" value={stock.bodega.nombre} />
            <DetailValue
              label="Principal"
              value={stock.bodega.esPrincipal ? "Sí" : "No"}
            />
          </dl>
        </AppCard>
      </AppGrid>

      <AppCard title="Auditoría" icon={<CalendarClock />} size="sm">
        <dl className="grid gap-4 sm:grid-cols-3">
          <DetailValue
            label="Registro creado"
            value={formatDateTime(stock.creadoEn)}
          />
          <DetailValue
            label="Última actualización"
            value={formatDateTime(stock.actualizadoEn)}
          />
          <DetailValue
            label="Identificador de stock"
            value={
              <span className="inline-flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                {stock.id}
              </span>
            }
          />
        </dl>
      </AppCard>
    </div>
  );
}
