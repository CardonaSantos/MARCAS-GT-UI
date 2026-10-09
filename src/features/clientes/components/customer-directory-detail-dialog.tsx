import { History, Pencil } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { AppButton } from "@/ui/components/app/primitives/app-button";
import {
  AppDialog, AppDialogBody, AppDialogContent, AppDialogDescription,
  AppDialogFooter, AppDialogHeader, AppDialogTitle,
} from "@/ui/components/app/primitives/app-dialog";

import { useCustomerDirectoryDetail } from "../api/customer-directory.queries";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0 space-y-1">
      <dt className="text-xs text-[hsl(var(--app-muted-foreground))]">{label}</dt>
      <dd className="break-words text-sm">{value || "—"}</dd>
    </div>
  );
}
const display = (value: string | null | undefined) => value?.trim() || "—";

interface Props {
  id: number | null;
  onClose: () => void;
  canManage: boolean;
}
export function CustomerDirectoryDetailDialog({ id, onClose, canManage }: Props) {
  const location = useLocation();
  const from = location.pathname + location.search;
  const detail = useCustomerDirectoryDetail(id);
  const customer = detail.data;
  const mapsUrl = customer?.ubicacion
    ? `https://www.google.com/maps?q=${customer.ubicacion.latitud},${customer.ubicacion.longitud}`
    : null;
  return (
    <AppDialog open={id !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <AppDialogContent size="4xl" viewport="tall">
        <AppDialogHeader>
          <AppDialogTitle>Ficha del cliente</AppDialogTitle>
          <AppDialogDescription>
            Información de contacto, perfil comercial y actividad.
          </AppDialogDescription>
        </AppDialogHeader>
        <AppDialogBody className="space-y-5 py-3">
          {detail.isLoading ? <p role="status" className="text-sm">Cargando ficha...</p> : null}
          {detail.isError ? (
            <div className="space-y-2">
              <p role="alert" className="text-sm text-red-500">No se pudo cargar el cliente.</p>
              <AppButton type="button" variant="secondary" size="sm" onClick={() => void detail.refetch()}>Reintentar</AppButton>
            </div>
          ) : null}
          {customer ? (
            <>
              <section className="space-y-3">
                <h3 className="text-base font-semibold">
                  {[customer.nombre, customer.apellido].filter(Boolean).join(" ")}
                </h3>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <Field label="Teléfono" value={customer.telefono} />
                  <Field label="Correo" value={display(customer.correo)} />
                  <Field label="Tipo" value={display(customer.tipoCliente)} />
                  <Field label="Preferencia de contacto" value={display(customer.preferenciaContacto)} />
                  <Field label="Departamento" value={customer.departamento?.nombre} />
                  <Field label="Municipio" value={customer.municipio?.nombre} />
                  <Field label="Dirección" value={display(customer.direccion)} />
                  <Field label="Registrado el" value={new Date(customer.creadoEn).toLocaleDateString("es-GT")} />
                </dl>
                {mapsUrl ? (
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex text-sm text-[hsl(var(--app-primary))] underline-offset-2 hover:underline">
                    Abrir ubicación GPS en Google Maps
                  </a>
                ) : null}
              </section>
              <section className="space-y-3 border-t border-[hsl(var(--app-border))] pt-3">
                <h3 className="text-sm font-semibold">Perfil comercial</h3>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <Field label="Volumen estimado" value={display(customer.volumenCompra)} />
                  <Field label="Presupuesto mensual" value={display(customer.presupuestoMensual)} />
                  <Field label="Categorías de interés" value={customer.categoriasInteres.join(", ") || "—"} />
                  <Field label="Comentarios" value={display(customer.comentarios)} />
                </dl>
              </section>
              <section className="space-y-3 border-t border-[hsl(var(--app-border))] pt-3">
                <h3 className="text-sm font-semibold">Actividad registrada</h3>
                <dl className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {[
                    ["Ventas", customer.actividad.ventas],
                    ["Pedidos", customer.actividad.pedidos],
                    ["Visitas", customer.actividad.visitas],
                    ["Solicitudes de crédito", customer.actividad.solicitudesCredito],
                    ["Entregas", customer.actividad.entregas],
                  ].map(([label, count]) => (
                    <div key={label} className="rounded-md border border-[hsl(var(--app-border))] p-3 text-center">
                      <dt className="text-xs text-[hsl(var(--app-muted-foreground))]">{label}</dt>
                      <dd className="mt-1 text-lg font-semibold tabular-nums">{count}</dd>
                    </div>
                  ))}
                </dl>
              </section>
              {customer.perfilFiscal ? (
                <section className="space-y-2 border-t border-[hsl(var(--app-border))] pt-3">
                  <h3 className="text-sm font-semibold">Perfil fiscal</h3>
                  <dl className="grid gap-3 sm:grid-cols-2">
                    <Field label="Nombre fiscal" value={customer.perfilFiscal.nombreFiscal} />
                    <Field label="Identificación" value={customer.perfilFiscal.identificacion} />
                    <Field label="Tipo" value={customer.perfilFiscal.tipoIdentificacion} />
                    <Field label="Correo fiscal" value={display(customer.perfilFiscal.correoFiscal)} />
                  </dl>
                </section>
              ) : null}
            </>
          ) : null}
        </AppDialogBody>
        <AppDialogFooter className="flex flex-wrap justify-end gap-2">
          {customer ? (
            <>
              <AppButton asChild size="sm" variant="secondary">
                <Link to={`/marcas-gt/historial-cliente-ventas/${customer.id}`} state={{ from }}>
                  <History className="h-4 w-4" /> Historial de ventas
                </Link>
              </AppButton>
              {canManage ? (
                <AppButton asChild size="sm" variant="primary">
                  <Link to={`/marcas-gt/editar-cliente/${customer.id}`} state={{ from }}>
                    <Pencil className="h-4 w-4" /> Editar
                  </Link>
                </AppButton>
              ) : null}
            </>
          ) : null}
          <AppButton type="button" variant="secondary" size="sm" onClick={onClose}>Cerrar</AppButton>
        </AppDialogFooter>
      </AppDialogContent>
    </AppDialog>
  );
}
