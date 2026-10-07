import { z } from "zod";

import {
  FISCAL_ENVIRONMENTS,
  FISCAL_IDENTITY_TYPES,
  FISCAL_ITEM_TYPES,
} from "../common/billing.constants";

export const prepareInvoiceSchema = z.object({
  tipoDte: z.string().trim().min(2).max(8),
  entorno: z.enum(FISCAL_ENVIRONMENTS),
  establecimientoId: z.string().trim().optional(),
  serieInterna: z.string().trim().max(40).optional(),
  versionEsquema: z.string().trim().max(30).optional(),
});

export const discardInvoiceSchema = z.object({
  motivo: z.string().trim().min(3).max(1000),
});

export const companyFiscalSchema = z.object({
  nit: z.string().trim().min(2).max(16),
  razonSocial: z.string().trim().min(2).max(200),
  afiliacionIva: z.string().trim().min(1).max(16),
  correoFiscal: z.string().trim().email().or(z.literal("")).optional(),
  direccion: z.string().trim().min(2).max(300),
  codigoPostal: z.string().trim().max(30).optional(),
  municipio: z.string().trim().min(2).max(120),
  departamento: z.string().trim().min(2).max(120),
  pais: z.string().trim().min(2).max(3),
  preciosIncluyenImpuestos: z.boolean(),
  tasaIvaDefault: z
    .string()
    .trim()
    .regex(/^\d{1,3}(\.\d{1,4})?$/, "Tasa inválida.")
    .or(z.literal(""))
    .optional(),
});

export const establishmentFiscalSchema = z.object({
  codigoSat: z
    .string()
    .trim()
    .refine((value) => Number.isInteger(Number(value)) && Number(value) >= 0, "Código SAT inválido."),
  nombreComercial: z.string().trim().min(2).max(200),
  correo: z.string().trim().email().or(z.literal("")).optional(),
  direccion: z.string().trim().min(2).max(300),
  codigoPostal: z.string().trim().max(30).optional(),
  municipio: z.string().trim().min(2).max(120),
  departamento: z.string().trim().min(2).max(120),
  pais: z.string().trim().min(2).max(3),
  esPrincipal: z.boolean(),
});

export const customerFiscalSchema = z.object({
  clienteId: z.number().int().positive(),
  tipoIdentificacion: z.enum(FISCAL_IDENTITY_TYPES),
  identificacion: z.string().trim().min(1).max(32),
  nombreFiscal: z.string().trim().min(2).max(200),
  correoFiscal: z.string().trim().email().or(z.literal("")).optional(),
  direccion: z.string().trim().max(300).optional(),
  codigoPostal: z.string().trim().max(30).optional(),
  municipio: z.string().trim().max(120).optional(),
  departamento: z.string().trim().max(120).optional(),
  pais: z.string().trim().min(2).max(3),
});

export const productFiscalSchema = z.object({
  productoId: z.number().int().positive(),
  bienOServicio: z.enum(FISCAL_ITEM_TYPES),
  unidadMedida: z.string().trim().min(1).max(16),
  descripcionFiscal: z.string().trim().max(1000).optional(),
  nombreCortoImpuesto: z.string().trim().max(50).optional(),
  codigoUnidadGravable: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || (Number.isInteger(Number(value)) && Number(value) >= 0),
      "Código de unidad gravable inválido.",
    )
    .optional(),
  activo: z.boolean(),
});

export type PrepareInvoiceFormValues = z.infer<typeof prepareInvoiceSchema>;
export type DiscardInvoiceFormValues = z.infer<typeof discardInvoiceSchema>;
export type CompanyFiscalFormValues = z.infer<typeof companyFiscalSchema>;
export type EstablishmentFiscalFormValues = z.infer<typeof establishmentFiscalSchema>;
export type CustomerFiscalFormValues = z.infer<typeof customerFiscalSchema>;
export type ProductFiscalFormValues = z.infer<typeof productFiscalSchema>;
