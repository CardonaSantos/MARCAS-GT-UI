import {
  BadgeDollarSign,
  CalendarClock,
  ClipboardCheck,
  Landmark,
  Phone,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  formatDateTime,
  formatInteger,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";

import {
  CREDIT_APPLICATION_STATE_LABELS,
  CREDIT_APPLICATION_STATE_TONES,
  CREDIT_DECISION_LABELS,
  CREDIT_INTEGRATION_LABELS,
  CREDIT_INTEGRATION_TONES,
} from "../common/credit.constants";
import type { CreditDetail } from "../api/credit.types";

function DetailValue({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
        {label}
      </dt>
      <dd className="mt-1 text-sm">{value ?? "—"}</dd>
    </div>
  );
}

export function CreditDetailSummary({ credit }: { credit: CreditDetail }) {
  return (
    <div className="space-y-4">

      <AppGrid cols={{ base: 1, md: 2, xl: 4 }} gap="sm">
        <AppCard title="Solicitado" icon={<BadgeDollarSign />} size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {formatMoney(credit.montos.solicitado)}
          </p>
        </AppCard>

        <AppCard title="Autorizado" icon={<ClipboardCheck />} size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {formatMoney(credit.montos.autorizado)}
          </p>
        </AppCard>

        <AppCard title="Financiado" icon={<Landmark />} size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {formatMoney(credit.montos.financiado)}
          </p>
        </AppCard>

        <AppCard title="Saldo pendiente" size="sm">
          <p className="text-2xl font-semibold tabular-nums">
            {credit.cuentasPorCobrar.cantidad === 0
              ? "—"
              : formatMoney(credit.cuentasPorCobrar.saldoPendiente)}
          </p>
          {credit.cuentasPorCobrar.cantidad === 0 ? (
            <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
              Sin CxC generadas. Las cuotas se activarán tras entregar el pedido.
            </p>
          ) : null}
        </AppCard>
      </AppGrid>

      <AppGrid cols={{ base: 1, lg: 2 }} gap="sm">
        <AppCard title="Solicitud" icon={<ClipboardCheck />} size="sm">
          <dl className="grid gap-4 sm:grid-cols-2">
            <DetailValue label="Número" value={credit.numero} />
            <DetailValue
              label="Estado"
              value={
                <AppBadge
                  tone={CREDIT_APPLICATION_STATE_TONES[credit.estado]}
                  size="xs"
                >
                  {CREDIT_APPLICATION_STATE_LABELS[credit.estado]}
                </AppBadge>
              }
            />
            <DetailValue
              label="Plazo solicitado"
              value={formatInteger(credit.plazos.solicitadoDias) + " días"}
            />
            <DetailValue
              label="Plazo autorizado"
              value={
                credit.plazos.autorizadoDias == null
                  ? "—"
                  : formatInteger(credit.plazos.autorizadoDias) + " días"
              }
            />
            <DetailValue
              label="Política"
              value={
                credit.politica ? (
                  <Link
                    to={"/marcas-gt/creditos/politicas/" + credit.politica.id}
                    className="font-medium text-[hsl(var(--app-primary))] hover:underline"
                  >
                    {credit.politica.nombre}
                  </Link>
                ) : (
                  "Sin política"
                )
              }
            />
            <DetailValue label="Versión" value={credit.version} />
          </dl>
        </AppCard>

        <AppCard title="Pedido origen" icon={<ShoppingCart />} size="sm">
          <dl className="grid gap-4 sm:grid-cols-2">
            <DetailValue
              label="Pedido"
              value={
                <Link
                  to={"/marcas-gt/pedidos/" + credit.origen.pedido.id}
                  className="font-medium text-[hsl(var(--app-primary))] hover:underline"
                >
                  {credit.origen.pedido.numero}
                </Link>
              }
            />
            <DetailValue
              label="Estado"
              value={credit.origen.pedido.estado}
            />
            <DetailValue
              label="Estado de pago"
              value={credit.origen.pedido.estadoPago}
            />
            <DetailValue
              label="Total"
              value={formatMoney(credit.origen.pedido.total)}
            />
            <DetailValue
              label="Visita"
              value={
                credit.origen.visita
                  ? "#" + credit.origen.visita.id
                  : "Sin visita"
              }
            />
            <DetailValue
              label="Creado"
              value={formatDateTime(credit.origen.pedido.creadoEn)}
            />
          </dl>
        </AppCard>
      </AppGrid>

      <AppGrid cols={{ base: 1, lg: 2 }} gap="sm">
        <AppCard title="Cliente" icon={<UserRound />} size="sm">
          <dl className="grid gap-4 sm:grid-cols-2">
            <DetailValue
              label="Nombre"
              value={credit.cliente.nombreCompleto}
            />
            <DetailValue
              label="Teléfono"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  {credit.cliente.telefono}
                </span>
              }
            />
            <DetailValue
              label="Correo"
              value={credit.cliente.correo ?? "—"}
            />
            <DetailValue
              label="Dirección"
              value={credit.cliente.direccion}
            />
          </dl>
        </AppCard>

        <AppCard title="Responsables" icon={<UserRound />} size="sm">
          <dl className="grid gap-4 sm:grid-cols-2">
            <DetailValue
              label="Vendedor"
              value={credit.vendedor.nombre}
            />
            <DetailValue
              label="Solicitante"
              value={credit.solicitante.nombre}
            />
            <DetailValue
              label="Correo vendedor"
              value={credit.vendedor.correo}
            />
            <DetailValue
              label="Correo solicitante"
              value={credit.solicitante.correo}
            />
          </dl>
        </AppCard>
      </AppGrid>

      <AppGrid cols={{ base: 1, lg: 2 }} gap="sm">
        <AppCard title="Expediente" size="sm">
          <dl className="grid gap-4 sm:grid-cols-3">
            <DetailValue
              label="Requisitos"
              value={
                formatInteger(credit.expediente.requisitosCumplidos) +
                " / " +
                formatInteger(credit.expediente.requisitos)
              }
            />
            <DetailValue
              label="Referencias verificadas"
              value={
                formatInteger(credit.expediente.referenciasVerificadas) +
                " / " +
                formatInteger(credit.expediente.referencias)
              }
            />
            <DetailValue
              label="Documentos validados"
              value={
                formatInteger(credit.expediente.documentosValidados) +
                " / " +
                formatInteger(credit.expediente.documentos)
              }
            />
            <DetailValue
              label="Req. pendientes"
              value={formatInteger(credit.expediente.requisitosPendientes)}
            />
            <DetailValue
              label="Ref. pendientes"
              value={formatInteger(credit.expediente.referenciasPendientes)}
            />
            <DetailValue
              label="Docs. pendientes"
              value={formatInteger(credit.expediente.documentosPendientes)}
            />
          </dl>
        </AppCard>

        <AppCard title="Integración con Pedido" size="sm">
          {credit.integracion ? (
            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailValue
                label="Estado"
                value={
                  <AppBadge
                    tone={CREDIT_INTEGRATION_TONES[credit.integracion.estado]}
                    size="xs"
                  >
                    {CREDIT_INTEGRATION_LABELS[credit.integracion.estado]}
                  </AppBadge>
                }
              />
              <DetailValue
                label="Intentos"
                value={formatInteger(credit.integracion.intentos)}
              />
              <DetailValue
                label="Actor"
                value={credit.integracion.actor.nombre}
              />
              <DetailValue
                label="Aplicada"
                value={formatDateTime(credit.integracion.aplicadaEn)}
              />
              <div className="sm:col-span-2">
                <DetailValue
                  label="Último error"
                  value={credit.integracion.ultimoError ?? "—"}
                />
              </div>
            </dl>
          ) : (
            <p className="text-sm text-[hsl(var(--app-muted-foreground))]">
              Aún no existe una operación de integración.
            </p>
          )}
        </AppCard>
      </AppGrid>

      {credit.decision || credit.credito ? (
        <AppGrid cols={{ base: 1, lg: 2 }} gap="sm">
          <AppCard title="Decisión" size="sm">
            {credit.decision ? (
              <dl className="grid gap-4 sm:grid-cols-2">
                <DetailValue
                  label="Resultado"
                  value={CREDIT_DECISION_LABELS[credit.decision.tipo]}
                />
                <DetailValue
                  label="Decidido por"
                  value={credit.decision.decididoPor.nombre}
                />
                <DetailValue
                  label="Fecha"
                  value={formatDateTime(credit.decision.creadoEn)}
                />
                <DetailValue
                  label="Observaciones"
                  value={credit.decision.observaciones ?? "—"}
                />
              </dl>
            ) : (
              <p className="text-sm text-[hsl(var(--app-muted-foreground))]">
                Sin decisión.
              </p>
            )}
          </AppCard>

          <AppCard title="Crédito generado" icon={<Landmark />} size="sm">
            {credit.credito ? (
              <dl className="grid gap-4 sm:grid-cols-2">
                <DetailValue
                  label="Número"
                  value={credit.credito.numero ?? "#" + credit.credito.id}
                />
                <DetailValue
                  label="Estado"
                  value={credit.credito.estado}
                />
                <DetailValue
                  label="Aprobado por"
                  value={credit.credito.aprobadoPor?.nombre ?? "—"}
                />
                <DetailValue
                  label="Aprobado"
                  value={formatDateTime(credit.credito.aprobadoEn)}
                />
              </dl>
            ) : (
              <p className="text-sm text-[hsl(var(--app-muted-foreground))]">
                Todavía no se ha generado un crédito.
              </p>
            )}
          </AppCard>
        </AppGrid>
      ) : null}

      <AppCard title="Fechas" icon={<CalendarClock />} size="sm">
        <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <DetailValue
            label="Solicitada"
            value={formatDateTime(credit.fechas.solicitadaEn)}
          />
          <DetailValue
            label="Actualizada"
            value={formatDateTime(credit.fechas.actualizadoEn)}
          />
          <DetailValue
            label="En revisión"
            value={formatDateTime(credit.fechas.enRevisionEn)}
          />
          <DetailValue
            label="Resuelta"
            value={formatDateTime(credit.fechas.resueltaEn)}
          />
          <DetailValue
            label="Cancelada"
            value={formatDateTime(credit.fechas.canceladaEn)}
          />
        </dl>
      </AppCard>

      {credit.motivo || credit.motivoCancelacion ? (
        <AppCard title="Motivos y observaciones" size="sm">
          <dl className="grid gap-4 lg:grid-cols-2">
            <DetailValue
              label="Motivo de solicitud"
              value={credit.motivo ?? "—"}
            />
            <DetailValue
              label="Motivo de cancelación"
              value={credit.motivoCancelacion ?? "—"}
            />
          </dl>
        </AppCard>
      ) : null}
    </div>
  );
}
