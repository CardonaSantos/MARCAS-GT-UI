import { Building2, Clock3, ShoppingCart, UserRound } from "lucide-react";

import {
  formatDateTime,
  formatDecimal,
  formatInteger,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

import type { DispatchDetail } from "../api/dispatch.types";
import {
  DISPATCH_STATE_LABELS,
  DISPATCH_STATE_TONES,
} from "../common/dispatch.constants";

function Value({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
        {label}
      </p>
      <div className="mt-1 text-sm font-medium">{children}</div>
    </div>
  );
}

export function DispatchDetailSummary({
  dispatch,
}: {
  dispatch: DispatchDetail;
}) {
  return (
    <AppStack gap="md">
      {dispatch.advertencias.map((warning) => (
        <AppAlert
          key={warning.codigo}
          tone={
            warning.nivel === "CRITICO"
              ? "danger"
              : warning.nivel === "ADVERTENCIA"
                ? "warning"
                : "info"
          }
          title={warning.codigo.replaceAll("_", " ")}
          description={warning.mensaje}
        />
      ))}

      <AppGrid cols={{ base: 1, md: 2, xl: 4 }} gap="sm">
        <AppCard title="Programadas" size="sm">
          <p className="text-2xl font-semibold">
            {formatInteger(dispatch.progreso.unidadesProgramadas)}
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            {formatInteger(dispatch.progreso.productos)} productos
          </p>
        </AppCard>

        <AppCard title="Preparadas" size="sm">
          <p className="text-2xl font-semibold">
            {formatInteger(dispatch.progreso.unidadesPreparadas)}
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            {formatDecimal(dispatch.progreso.porcentajePreparacion)}%
          </p>
        </AppCard>

        <AppCard title="Despachadas" size="sm">
          <p className="text-2xl font-semibold">
            {formatInteger(dispatch.progreso.unidadesDespachadas)}
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            {formatDecimal(dispatch.progreso.porcentajeDespacho)}%
          </p>
        </AppCard>

        <AppCard title="Operaciones fallidas" size="sm">
          <p className="text-2xl font-semibold">
            {formatInteger(dispatch.operaciones.fallidas)}
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
            {formatInteger(dispatch.operaciones.total)} operaciones registradas
          </p>
        </AppCard>
      </AppGrid>

      <AppGrid cols={{ base: 1, xl: 2 }} gap="sm">
        <AppCard title="Orden de despacho" icon={<ShoppingCart />} size="sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <Value label="Número">{dispatch.numero}</Value>
            <Value label="Estado">
              <AppBadge tone={DISPATCH_STATE_TONES[dispatch.estado]} size="xs">
                {DISPATCH_STATE_LABELS[dispatch.estado]}
              </AppBadge>
            </Value>
            <Value label="Pedido">{dispatch.pedido.numero}</Value>
            <Value label="Estado del pedido">{dispatch.pedido.estado}</Value>
            <Value label="Condición de pago">
              {dispatch.pedido.condicionPago}
            </Value>
            <Value label="Total">{formatMoney(dispatch.pedido.total)}</Value>
          </div>
        </AppCard>

        <AppCard title="Bodega" icon={<Building2 />} size="sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <Value label="Código">{dispatch.bodega.codigo}</Value>
            <Value label="Nombre">{dispatch.bodega.nombre}</Value>
            <Value label="Principal">
              {dispatch.bodega.esPrincipal ? "Sí" : "No"}
            </Value>
            <Value label="Vendedor">{dispatch.pedido.vendedor.nombre}</Value>
          </div>
        </AppCard>

        <AppCard title="Cliente" icon={<UserRound />} size="sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <Value label="Nombre">{dispatch.cliente.nombreCompleto}</Value>
            <Value label="Teléfono">{dispatch.cliente.telefono}</Value>
            <Value label="Correo">{dispatch.cliente.correo ?? "—"}</Value>
            <Value label="Dirección">{dispatch.cliente.direccion}</Value>
          </div>
        </AppCard>

        <AppCard title="Tiempos" icon={<Clock3 />} size="sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <Value label="Creado">{formatDateTime(dispatch.tiempos.creadoEn)}</Value>
            <Value label="Programado">
              {formatDateTime(dispatch.tiempos.programadoEn)}
            </Value>
            <Value label="Preparación iniciada">
              {formatDateTime(dispatch.tiempos.preparacionIniciadaEn)}
            </Value>
            <Value label="Preparado">
              {formatDateTime(dispatch.tiempos.preparadoEn)}
            </Value>
            <Value label="Despachado">
              {formatDateTime(dispatch.tiempos.despachadoEn)}
            </Value>
            <Value label="Ciclo total">
              {dispatch.tiempos.horasCicloTotal == null
                ? "—"
                : formatDecimal(dispatch.tiempos.horasCicloTotal) + " h"}
            </Value>
          </div>
        </AppCard>
      </AppGrid>

      <AppCard title="Observaciones" size="sm">
        <p className="whitespace-pre-wrap text-sm">
          {dispatch.observaciones || "Sin observaciones."}
        </p>
        {dispatch.motivoCancelacion ? (
          <div className="mt-4 border-t border-[hsl(var(--app-border))] pt-4">
            <Value label="Motivo de cancelación">
              {dispatch.motivoCancelacion}
            </Value>
          </div>
        ) : null}
      </AppCard>
    </AppStack>
  );
}
