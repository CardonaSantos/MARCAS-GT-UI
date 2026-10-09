import { z } from "zod";

const gps = z.string().trim().refine((value) => {
  if (!value) return true;
  const parts = value.split(",").map((x) => x.trim());
  if (parts.length !== 2 || parts.some((x) => !/^-?\d+(?:\.\d+)?$/.test(x))) return false;
  const [lat, lng] = parts.map(Number);
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}, "Ingresa latitud, longitud válidas (ej. 15.66, -91.71).");

const base = z.object({
  nombreCompleto: z.string().trim().max(150),
  apellido: z.string().trim().max(150),
  empresaTienda: z.string().trim().max(200),
  telefono: z.string().trim().max(50),
  correo: z.union([z.literal(""), z.string().trim().email("Correo electrónico inválido.")]).refine((s) => s.length <= 250),
  direccion: z.string().trim().max(350),
  departamentoId: z.number().int().min(1, "Selecciona un departamento."),
  municipioId: z.number().int().min(1, "Selecciona un municipio."),
  tipoCliente: z.string(),
  categoriasInteres: z.array(z.string()).max(30),
  volumenCompra: z.string().max(80),
  presupuestoMensual: z.string().max(80),
  preferenciaContacto: z.string().max(80),
  comentarios: z.string().trim().max(2000),
  coordenadas: gps,
});
const needsName = (data: z.infer<typeof base>, ctx: z.RefinementCtx) => {
  if (!data.nombreCompleto && !data.empresaTienda) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["nombreCompleto"],
      message: "Indica el nombre o la empresa del prospecto." });
  }
};
export const prospectStartSchema = base.superRefine(needsName);
export const prospectFinishSchema = base.superRefine((data, ctx) => {
  needsName(data, ctx);
  if (!data.tipoCliente) ctx.addIssue({
    code: z.ZodIssueCode.custom, path: ["tipoCliente"], message: "Selecciona un tipo de cliente.",
  });
  if (!data.direccion) ctx.addIssue({
    code: z.ZodIssueCode.custom, path: ["direccion"], message: "La dirección es obligatoria al finalizar.",
  });
});
export type ProspectFormValues = z.infer<typeof base>;
export const emptyProspect: ProspectFormValues = {
  nombreCompleto: "", apellido: "", empresaTienda: "", telefono: "", correo: "",
  direccion: "", departamentoId: 0, municipioId: 0, tipoCliente: "",
  categoriasInteres: [], volumenCompra: "", presupuestoMensual: "",
  preferenciaContacto: "", comentarios: "", coordenadas: "",
};
