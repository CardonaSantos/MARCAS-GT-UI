import { CalendarClock, CheckCircle2, CircleX, ClipboardList, ContactRound } from "lucide-react";

import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppTextarea } from "@/ui/components/app/primitives/app-textarea";
import type { VisitRecord } from "../api/visit-workflow.types";
import {
  formatVisitDate, visitCustomerName, visitReasonLabel, visitTypeLabel,
} from "../common/visit-workflow.formatters";

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 space-y-1">
      <dt className="text-xs text-[hsl(var(--app-muted-foreground))]">{label}</dt>
      <dd className="break-words text-sm">{children || "—"}</dd>
    </div>
  );
}

interface Props {
  visit: VisitRecord;
  notes: string;
  onNotesChange: (value: string) => void;
  onFinish: () => void;
  onCancel: () => void;
  busy: boolean;
}
export function VisitActiveCard({
  visit, notes, onNotesChange, onFinish, onCancel, busy,
}: Props) {
  const c = visit.cliente;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-[hsl(var(--app-border))] px-3 py-2">
        <div className="flex items-center gap-2 text-sm">
          <CalendarClock className="h-4 w-4" />
          Visita #{visit.id} · {formatVisitDate(visit.inicio)}
        </div>
        <AppBadge tone="warning" size="sm">En curso</AppBadge>
      </div>

      <div className="grid min-w-0 items-start gap-4 lg:grid-cols-2">
        <AppCard title="Información del cliente" icon={<ContactRound />} size="sm">
          <dl className="grid min-w-0 gap-x-4 gap-y-4 sm:grid-cols-2">
            <Info label="Nombre">{visitCustomerName(c)}</Info>
            <Info label="Teléfono">
              <a href={`tel:${c.telefono}`} className="hover:underline">{c.telefono}</a>
            </Info>
            <Info label="Correo">
              {c.correo ? <a href={`mailto:${c.correo}`} className="break-all hover:underline">{c.correo}</a> : "—"}
            </Info>
            <Info label="Vendedor">{visit.vendedor?.nombre}</Info>
            <div className="sm:col-span-2">
              <Info label="Dirección">{c.direccion}</Info>
            </div>
            <Info label="Departamento">{c.departamento?.nombre}</Info>
            <Info label="Municipio">{c.municipio?.nombre}</Info>
          </dl>
        </AppCard>

        <AppCard title="Información de la visita" icon={<ClipboardList />} size="sm">
          <dl className="grid min-w-0 gap-x-4 gap-y-4 sm:grid-cols-2">
            <Info label="Motivo">{visitReasonLabel(visit.motivoVisita)}</Info>
            <Info label="Tipo">{visitTypeLabel(visit.tipoVisita)}</Info>
            <div className="sm:col-span-2">
              <Info label="Inicio">{formatVisitDate(visit.inicio)}</Info>
            </div>
          </dl>
          <div className="mt-4 space-y-2">
            <label htmlFor="visit-observations" className="text-sm font-medium">
              Observaciones de la visita
            </label>
            <AppTextarea
              id="visit-observations" rows={4} maxLength={3000}
              value={notes}
              onChange={(event) => onNotesChange(event.target.value)}
              placeholder="Escribe los acuerdos, necesidades o resultados de la visita."
              disabled={busy}
            />
            <p className="text-right text-xs text-[hsl(var(--app-muted-foreground))] tabular-nums">
              {notes.length}/3000
            </p>
          </div>
        </AppCard>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <AppButton variant="danger" size="sm" leftIcon={<CircleX />}
          onClick={onCancel} disabled={busy}>
          Cancelar visita
        </AppButton>
        <AppButton variant="primary" size="sm" leftIcon={<CheckCircle2 />}
          onClick={onFinish} disabled={busy}>
          Finalizar visita
        </AppButton>
      </div>
    </div>
  );
}
