import type { FinishProspectPayload, ProspectRecord, StartProspectPayload } from "../api/prospect.types";
import { emptyProspect, type ProspectFormValues } from "../schemas/prospect.schemas";

export function toProspectForm(p: ProspectRecord): ProspectFormValues {
  return {
    ...emptyProspect,
    nombreCompleto: p.nombreCompleto ?? "",
    apellido: p.apellido ?? "",
    empresaTienda: p.empresaTienda ?? "",
    telefono: p.telefono ?? "",
    correo: p.correo ?? "",
    direccion: p.direccion ?? "",
    departamentoId: p.departamentoId ?? 0,
    municipioId: p.municipioId ?? 0,
    tipoCliente: p.tipoCliente ?? "",
    categoriasInteres: p.categoriasInteres ?? [],
    volumenCompra: p.volumenCompra ?? "",
    presupuestoMensual: p.presupuestoMensual ?? "",
    preferenciaContacto: p.preferenciaContacto ?? "",
    comentarios: p.comentarios ?? "",
    coordenadas: p.ubicacion ? `${p.ubicacion.latitud}, ${p.ubicacion.longitud}` : "",
  };
}
export function toStartPayload(v: ProspectFormValues): StartProspectPayload {
  return {
    ...(v.nombreCompleto ? { nombreCompleto: v.nombreCompleto.trim() } : {}),
    ...(v.apellido ? { apellido: v.apellido.trim() } : {}),
    ...(v.empresaTienda ? { empresaTienda: v.empresaTienda.trim() } : {}),
    ...(v.telefono ? { telefono: v.telefono.trim() } : {}),
    ...(v.correo ? { correo: v.correo.trim() } : {}),
    ...(v.direccion ? { direccion: v.direccion.trim() } : {}),
    departamentoId: v.departamentoId,
    municipioId: v.municipioId,
  };
}
export function toFinishPayload(v: ProspectFormValues): FinishProspectPayload {
  const [latitud, longitud] = v.coordenadas
    ? v.coordenadas.split(",").map((s) => Number(s.trim())) : [];
  return {
    ...toStartPayload(v),
    tipoCliente: v.tipoCliente,
    categoriasInteres: [...v.categoriasInteres],
    ...(v.volumenCompra ? { volumenCompra: v.volumenCompra } : {}),
    ...(v.presupuestoMensual ? { presupuestoMensual: v.presupuestoMensual } : {}),
    ...(v.preferenciaContacto ? { preferenciaContacto: v.preferenciaContacto } : {}),
    ...(v.comentarios.trim() ? { comentarios: v.comentarios.trim() } : {}),
    ...(v.coordenadas ? { latitud, longitud } : {}),
  };
}
