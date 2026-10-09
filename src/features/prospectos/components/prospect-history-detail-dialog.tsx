import { Link } from "react-router-dom";
import { MapPin, UserRoundPlus } from "lucide-react";

import { AppButton } from "@/ui/components/app/primitives/app-button";
import {
  AppDialog, AppDialogBody, AppDialogContent, AppDialogFooter,
  AppDialogHeader, AppDialogTitle, AppDialogDescription,
} from "@/ui/components/app/primitives/app-dialog";
import { useProspectHistoryDetail } from "../api/prospect-history.queries";
import {
  formatProspectDate, formatProspectDuration,
  prospectDisplayName, prospectStatusLabel,
} from "../common/prospect-history.formatters";

function Field({ title, value }: { title: string; value?: string | null }) {
  return (
    <div className="min-w-0 space-y-1">
      <dt className="text-xs text-[hsl(var(--app-muted-foreground))]">{title}</dt>
      <dd className="break-words text-sm">{value?.trim() || "—"}</dd>
    </div>
  );
}

interface Props {
  id: number | null;
  onClose: () => void;
  onConvert: (id: number) => void;
}

export function ProspectHistoryDetailDialog({ id, onClose, onConvert }: Props) {
  const query = useProspectHistoryDetail(id);
  const prospect = query.data;
  const mapsUrl = prospect?.ubicacion
    ? `https://www.google.com/maps?q=${prospect.ubicacion.latitud},${prospect.ubicacion.longitud}`
    : null;
  const canConvert = Boolean(prospect?.estado === "FINALIZADO" && prospect.clienteId === null &&
    (prospect.nombreCompleto?.trim() || prospect.empresaTienda?.trim()) && prospect.telefono?.trim());

  return (
    <AppDialog open={id !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <AppDialogContent size="4xl" viewport="tall">
        <AppDialogHeader>
          <AppDialogTitle>Ficha del prospecto</AppDialogTitle>
          <AppDialogDescription>
            Información registrada, tiempo de seguimiento y vinculación comercial.
          </AppDialogDescription>
        </AppDialogHeader>
        <AppDialogBody className="space-y-5 py-3">
          {query.isLoading ? (
            <p role="status" className="text-sm">Cargando información del prospecto...</p>
          ) : null}
          {query.isError ? (
            <div className="space-y-2">
              <p role="alert" className="text-sm text-red-500">No se pudo consultar el detalle.</p>
              <AppButton size="sm" variant="secondary" onClick={() => void query.refetch()}>
                Reintentar
              </AppButton>
            </div>
          ) : null}
          {prospect ? (
            <>
              <section className="space-y-3">
                <h3 className="text-base font-semibold">{prospectDisplayName(prospect)}</h3>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <Field title="Empresa o tienda" value={prospect.empresaTienda} />
                  <Field title="Estado" value={prospectStatusLabel(prospect.estado)} />
                  <Field title="Vendedor" value={prospect.vendedor?.nombre} />
                  <Field title="Teléfono" value={prospect.telefono} />
                  <Field title="Correo" value={prospect.correo} />
                  <Field title="Departamento" value={prospect.departamento?.nombre} />
                  <Field title="Municipio" value={prospect.municipio?.nombre} />
                  <Field title="Dirección" value={prospect.direccion} />
                </dl>
              </section>

              <section className="space-y-3 border-t border-[hsl(var(--app-border))] pt-3">
                <h3 className="text-sm font-semibold">Seguimiento</h3>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <Field title="Inicio" value={formatProspectDate(prospect.inicio)} />
                  <Field title="Finalización" value={formatProspectDate(prospect.fin)} />
                  <Field title="Duración" value={formatProspectDuration(prospect.duracionMinutos)} />
                  <Field title="Cliente vinculado"
                    value={prospect.clienteId ? `#${prospect.clienteId}` : "Sin vincular"} />
                </dl>
              </section>

              <section className="space-y-3 border-t border-[hsl(var(--app-border))] pt-3">
                <h3 className="text-sm font-semibold">Perfil comercial</h3>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <Field title="Tipo de cliente" value={prospect.tipoCliente} />
                  <Field title="Volumen de compra" value={prospect.volumenCompra} />
                  <Field title="Presupuesto mensual" value={prospect.presupuestoMensual} />
                  <Field title="Contacto preferido" value={prospect.preferenciaContacto} />
                  <Field title="Intereses" value={prospect.categoriasInteres?.join(", ")} />
                  <Field title={prospect.estado === "CERRADO" ? "Motivo de cancelación" : "Comentarios"}
                    value={prospect.comentarios} />
                </dl>
              </section>

              {mapsUrl ? (
                <section className="border-t border-[hsl(var(--app-border))] pt-3">
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[hsl(var(--app-primary))] underline-offset-2 hover:underline">
                    <MapPin className="h-4 w-4" />
                    Ver ubicación GPS en Google Maps
                  </a>
                </section>
              ) : null}
              {prospect.estado === "FINALIZADO" && !prospect.clienteId && !canConvert ? (
                <p className="rounded-md border border-[hsl(var(--app-border))] p-3 text-xs"
                  role="note">
                  Para generar un cliente se necesita el nombre o empresa y un teléfono registrados.
                </p>
              ) : null}
            </>
          ) : null}
        </AppDialogBody>
        <AppDialogFooter className="flex flex-wrap justify-end gap-2">
          {prospect?.clienteId ? (
            <AppButton asChild size="sm" variant="secondary">
              <Link to="/marcas-gt/clientes">Ver directorio de clientes</Link>
            </AppButton>
          ) : null}
          {prospect && canConvert ? (
            <AppButton size="sm" variant="primary" leftIcon={<UserRoundPlus />}
              onClick={() => { onClose(); onConvert(prospect.id); }}>
              Generar cliente
            </AppButton>
          ) : null}
          <AppButton size="sm" variant="secondary" onClick={onClose}>Cerrar</AppButton>
        </AppDialogFooter>
      </AppDialogContent>
    </AppDialog>
  );
}
