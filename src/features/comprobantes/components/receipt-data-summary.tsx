import { ClipboardCheck, PackageCheck, Truck, UserRound } from "lucide-react";

import { AppCard } from "@/ui/components/app/primitives/app-card";
import type { ReceiptPreview } from "../api/receipt.types";
import { dateText, isDeliverySnapshot, isDispatchSnapshot } from "../common/receipt.helpers";

export function ReceiptDataSummary({ snapshot }: { snapshot: ReceiptPreview["snapshot"] }) {
  if (isDispatchSnapshot(snapshot)) {
    return (
      <div className="grid gap-3 lg:grid-cols-2">
        <AppCard title="Salida confirmada" icon={<PackageCheck />} size="sm">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-xs text-[hsl(var(--app-muted-foreground))]">Despacho</dt><dd className="font-medium">{snapshot.documento.numeroDespacho}</dd></div>
            <div><dt className="text-xs text-[hsl(var(--app-muted-foreground))]">Pedido</dt><dd className="font-medium">{snapshot.documento.numeroPedido}</dd></div>
            <div><dt className="text-xs text-[hsl(var(--app-muted-foreground))]">Operador</dt><dd className="font-medium">{snapshot.operadores.registradoPor.nombre}</dd></div>
            <div><dt className="text-xs text-[hsl(var(--app-muted-foreground))]">Fecha</dt><dd>{dateText(snapshot.fechas.salidaConfirmadaEn)}</dd></div>
            <div><dt className="text-xs text-[hsl(var(--app-muted-foreground))]">Bodega</dt><dd>{snapshot.bodega.nombre}</dd></div>
            <div><dt className="text-xs text-[hsl(var(--app-muted-foreground))]">Unidades</dt><dd className="font-semibold">{snapshot.resumen.unidadesSalidas}</dd></div>
          </dl>
        </AppCard>
        <AppCard title="Cliente y mercancía" icon={<UserRound />} size="sm">
          <p className="font-medium text-sm">{snapshot.cliente.nombreCompleto}</p>
          <p className="text-xs text-[hsl(var(--app-muted-foreground))]">{snapshot.cliente.direccion}</p>
          <ul className="mt-3 max-h-52 overflow-auto space-y-2" aria-label="Productos retirados">
            {snapshot.lineas.map((line) => (
              <li key={line.operacionDetalleId} className="flex gap-2 justify-between border-b border-[hsl(var(--app-border))] pb-2 text-sm">
                <span className="min-w-0 break-words">{line.producto.codigo} · {line.producto.nombre}</span>
                <strong className="shrink-0 tabular-nums">× {line.cantidad}</strong>
              </li>
            ))}
          </ul>
        </AppCard>
      </div>
    );
  }
  if (!isDeliverySnapshot(snapshot)) return null;
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <AppCard title="Resultado final" icon={<ClipboardCheck />} size="sm">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div><dt className="text-xs text-[hsl(var(--app-muted-foreground))]">Pedido</dt><dd className="font-medium">{snapshot.documento.numeroPedido}</dd></div>
          <div><dt className="text-xs text-[hsl(var(--app-muted-foreground))]">Estado</dt><dd className="font-medium">{snapshot.documento.estado.replace(/_/g, " ")}</dd></div>
          <div><dt className="text-xs text-[hsl(var(--app-muted-foreground))]">Aceptadas</dt><dd className="font-semibold">{snapshot.resumen.unidadesAceptadas}</dd></div>
          <div><dt className="text-xs text-[hsl(var(--app-muted-foreground))]">Rechazadas</dt><dd className="font-semibold">{snapshot.resumen.unidadesRechazadas}</dd></div>
          <div><dt className="text-xs text-[hsl(var(--app-muted-foreground))]">Receptor</dt><dd>{snapshot.receptor.nombre ?? "No registrado"}</dd></div>
          <div><dt className="text-xs text-[hsl(var(--app-muted-foreground))]">Fecha</dt><dd>{dateText(snapshot.fechas.finalizadaEn)}</dd></div>
        </dl>
      </AppCard>
      <AppCard title="Transporte y evidencias" icon={<Truck />} size="sm">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div><dt className="text-xs text-[hsl(var(--app-muted-foreground))]">Cliente</dt><dd>{snapshot.cliente.nombreCompleto}</dd></div>
          <div><dt className="text-xs text-[hsl(var(--app-muted-foreground))]">Responsable</dt><dd>{snapshot.operadores.responsableEntrega?.nombre ?? "—"}</dd></div>
          <div><dt className="text-xs text-[hsl(var(--app-muted-foreground))]">Envío</dt><dd>{snapshot.transporte?.numero ?? "—"}</dd></div>
          <div><dt className="text-xs text-[hsl(var(--app-muted-foreground))]">Evidencias</dt><dd>{snapshot.evidencias.length} registro(s)</dd></div>
        </dl>
        {snapshot.motivoNoEntrega ? (
          <p className="mt-3 text-xs">Motivo: {snapshot.motivoNoEntrega.replace(/_/g, " ")}</p>
        ) : null}
        <ul className="mt-3 max-h-44 overflow-auto space-y-2" aria-label="Resultado por producto">
          {snapshot.lineas.map((line) => (
            <li key={line.entregaDetalleId} className="border-b border-[hsl(var(--app-border))] pb-2 text-sm">
              <span className="font-medium">{line.producto.codigo} · {line.producto.nombre}</span>
              <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                Cargado {line.cargadoIntento ?? "—"} · Aceptado {line.cantidadAceptada} · Rechazado {line.cantidadRechazada}
              </p>
            </li>
          ))}
        </ul>
      </AppCard>
    </div>
  );
}
