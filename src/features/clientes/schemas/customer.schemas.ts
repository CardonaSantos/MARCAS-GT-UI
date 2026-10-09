import { z } from "zod";

const optionalText = (max: number) =>
  z.string().trim().max(max, `Máximo ${max} caracteres.`);

const coordinates = z.string().trim().refine((text) => {
  if (!text) return true;
  const pair = text.split(",").map((x) => x.trim());
  if (pair.length !== 2 || pair.some((x) => !/^-?\d+(?:\.\d+)?$/.test(x))) return false;
  const [lat, lng] = pair.map(Number);
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}, "Escribe latitud, longitud válidas (ej. 15.66, -91.71).");

export const customerSchema = z.object({
  nombre: z.string().trim().min(1, "Ingresa los nombres.").max(150, "Máximo 150 caracteres."),
  apellido: z.string().trim().min(1, "Ingresa los apellidos.").max(150, "Máximo 150 caracteres."),
  correo: z.string().trim().email("Ingresa un correo válido.").max(250, "Máximo 250 caracteres."),
  telefono: z.string().trim().min(1, "Ingresa el teléfono.").max(50, "Máximo 50 caracteres."),
  direccion: optionalText(350),
  departamentoId: z.number().int().nonnegative(),
  municipioId: z.number().int().nonnegative(),
  coordenadas: coordinates,
  tipoCliente: z.string(),
  categoriasInteres: z.array(z.string()).max(30),
  volumenCompra: z.string(),
  presupuestoMensual: z.string(),
  preferenciaContacto: z.string(),
  comentarios: optionalText(2000),
  descuentoInicial: z.string().trim().refine(
    (text) => /^(?:0|[1-9]\d?)(?:\.\d{1,2})?$|^100(?:\.0{1,2})?$/.test(text),
    "El descuento debe estar entre 0 y 100 %, con hasta 2 decimales.",
  ),
}).superRefine((data, ctx) => {
  if (data.municipioId > 0 && data.departamentoId === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["departamentoId"],
      message: "Selecciona primero el departamento.",
    });
  }
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

export const emptyCustomerForm: CustomerFormValues = {
  nombre: "",
  apellido: "",
  correo: "",
  telefono: "",
  direccion: "",
  departamentoId: 0,
  municipioId: 0,
  coordenadas: "",
  tipoCliente: "",
  categoriasInteres: [],
  volumenCompra: "",
  presupuestoMensual: "",
  preferenciaContacto: "",
  comentarios: "",
  descuentoInicial: "0",
};

export const customerTypeOptions = [
  { value: "Minorista", label: "Minorista" },
  { value: "Mayorista", label: "Mayorista" },
  { value: "Boutique", label: "Boutique / tienda especializada" },
  { value: "TiendaEnLinea", label: "Tienda en línea" },
  { value: "ClienteIndividual", label: "Cliente individual" },
];

export const customerInterestOptions = [
  "Ropa de Mujer", "Ropa de Hombre", "Ropa Infantil", "Accesorios", "Calzado",
  "Ropa Deportiva", "Ropa Formal", "Ropa de Trabajo", "Ropa de Marca",
].map((label) => ({ value: label, label }));

export const customerPurchaseVolumeOptions = [
  { value: "bajo", label: "Bajo (1–30 unidades al mes)" },
  { value: "medio", label: "Medio (31–90 unidades al mes)" },
  { value: "alto", label: "Alto (91–150 unidades al mes)" },
  { value: "muyAlto", label: "Muy alto (más de 150 unidades al mes)" },
];

export const customerMonthlyBudgetOptions = [
  { value: "menos5000", label: "Menos de Q5,000" },
  { value: "5000-10000", label: "Q5,000–Q10,000" },
  { value: "10001-20000", label: "Q10,001–Q20,000" },
  { value: "mas20000", label: "Más de Q20,000" },
];

export const customerContactPreferenceOptions = [
  { value: "email", label: "Correo electrónico" },
  { value: "telefono", label: "Teléfono" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "visita", label: "Visita presencial" },
];
