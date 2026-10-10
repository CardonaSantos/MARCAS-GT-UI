import type { CreateCustomerPayload } from "../api/customer.types";
import type { CustomerFormValues } from "../schemas/customer.schemas";

/** Mapea únicamente campos de CreateCustomerDto; los nombres textuales de ubicación no se guardan duplicados. */
export function toCreateCustomerPayload(values: CustomerFormValues): CreateCustomerPayload {
  const coordinates = values.coordenadas.trim();
  const [latitud, longitud] = coordinates ? coordinates.split(",").map((s) => Number(s.trim())) : [];
  const trimmed = (value: string) => value.trim();
  return {
    nombre: trimmed(values.nombre),
    apellido: trimmed(values.apellido),
    correo: trimmed(values.correo),
    telefono: trimmed(values.telefono),
    // Prisma Cliente.direccion es NOT NULL; el endpoint permite texto vacío.
    direccion: trimmed(values.direccion),
    ...(values.departamentoId > 0 ? { departamentoId: values.departamentoId } : {}),
    ...(values.municipioId > 0 ? { municipioId: values.municipioId } : {}),
    ...(coordinates ? { latitud, longitud } : {}),
    ...(values.tipoCliente ? { tipoCliente: values.tipoCliente } : {}),
    categoriasInteres: [...values.categoriasInteres],
    ...(values.volumenCompra ? { volumenCompra: values.volumenCompra } : {}),
    ...(values.presupuestoMensual ? { presupuestoMensual: values.presupuestoMensual } : {}),
    ...(values.preferenciaContacto ? { preferenciaContacto: values.preferenciaContacto } : {}),
    ...(values.comentarios.trim() ? { comentarios: trimmed(values.comentarios) } : {}),
    ...(Number(values.descuentoInicial) > 0
      ? { descuentoInicial: Number(values.descuentoInicial) }
      : {}),
  };
}
