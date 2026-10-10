import { z } from "zod";

export const visitReasons = [
  { value: "COMPRA_CLIENTE", label: "Compra del cliente" },
  { value: "PRESENTACION_PRODUCTOS", label: "Presentación de productos" },
  { value: "NEGOCIACION_PRECIOS", label: "Negociación de precios" },
  { value: "ENTREGA_MUESTRAS", label: "Entrega de muestras" },
  { value: "PLANIFICACION_PEDIDOS", label: "Planificación de pedidos" },
  { value: "CONSULTA_CLIENTE", label: "Consulta del cliente" },
  { value: "SEGUIMIENTO", label: "Seguimiento" },
  { value: "PROMOCION", label: "Promoción" },
  { value: "OTRO", label: "Otro motivo" },
] as const;
export const visitTypes = [
  { value: "PRESENCIAL", label: "Presencial" },
  { value: "VIRTUAL", label: "Virtual" },
] as const;

export const startVisitSchema = z.object({
  clienteId: z.number().int().min(1, "Selecciona un cliente."),
  motivoVisita: z.enum([
    "COMPRA_CLIENTE", "PRESENTACION_PRODUCTOS", "NEGOCIACION_PRECIOS",
    "ENTREGA_MUESTRAS", "PLANIFICACION_PEDIDOS", "CONSULTA_CLIENTE",
    "SEGUIMIENTO", "PROMOCION", "OTRO",
  ], { message: "Selecciona un motivo." }),
  tipoVisita: z.enum(["PRESENCIAL", "VIRTUAL"], {
    message: "Selecciona el tipo de visita.",
  }),
});
export const finishVisitSchema = z.object({
  observaciones: z.string().trim().max(3000, "Máximo 3000 caracteres."),
});
export const cancelVisitSchema = z.object({
  motivoCancelacion: z.string().trim()
    .min(1, "Indica por qué se cancela la visita.")
    .max(2000, "Máximo 2000 caracteres."),
});
export type StartVisitValues = z.infer<typeof startVisitSchema>;
export type FinishVisitValues = z.infer<typeof finishVisitSchema>;
export type CancelVisitValues = z.infer<typeof cancelVisitSchema>;
