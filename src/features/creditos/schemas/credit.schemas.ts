import { z } from "zod";

import {
  CREDIT_DOCUMENT_TYPES,
  CREDIT_REFERENCE_TYPES,
} from "../common/credit.constants";

const nullableSelectId = z.number().int().positive().nullable();

function requireSelect(
  value: number | null,
  path: string,
  message: string,
  ctx: z.RefinementCtx,
) {
  if (value !== null) return;

  ctx.addIssue({
    code: "custom",
    path: [path],
    message,
  });
}

const moneyText = z
  .string()
  .trim()
  .regex(/^\d{1,10}(?:\.\d{1,2})?$/, "Ingresa un monto válido.");

const optionalMoneyText = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^\d{1,10}(?:\.\d{1,2})?$/.test(value),
    "Ingresa un monto válido.",
  );

const positiveIntegerText = z
  .string()
  .trim()
  .regex(/^[1-9]\d*$/, "Ingresa un entero mayor que cero.");

const optionalPositiveIntegerText = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^[1-9]\d*$/.test(value),
    "Ingresa un entero mayor que cero.",
  );

const optionalText = (max: number) =>
  z.string().trim().max(max, `Máximo ${max} caracteres.`);

export const creditApplicationFormSchema = z
  .object({
    pedidoId: nullableSelectId,
    politicaId: nullableSelectId,
    montoSolicitado: moneyText,
    plazoDias: positiveIntegerText,
    motivo: optionalText(1000),
  })
  .superRefine((values, ctx) => {
    requireSelect(
      values.pedidoId,
      "pedidoId",
      "Selecciona un pedido.",
      ctx,
    );
  });

export const creditReasonSchema = z.object({
  motivo: z
    .string()
    .trim()
    .min(3, "El motivo debe tener al menos 3 caracteres.")
    .max(1000, "Máximo 1000 caracteres."),
});

export const creditApprovalSchema = z.object({
  montoAutorizado: moneyText,
  plazoAutorizadoDias: positiveIntegerText,
  anticipoRequerido: z.literal("0.00"),
  observaciones: optionalText(1000),
});

export const creditReferenceSchema = z.object({
  tipo: z.enum(CREDIT_REFERENCE_TYPES),
  nombre: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(160, "Máximo 160 caracteres."),
  telefono: z
    .string()
    .trim()
    .min(3, "El teléfono debe tener al menos 3 caracteres.")
    .max(60, "Máximo 60 caracteres."),
  relacion: optionalText(160),
  observaciones: optionalText(500),
});

export const creditReferenceReviewSchema = z.object({
  resultado: z.enum(["VERIFICADA", "NO_VERIFICADA", "RECHAZADA"]),
  observaciones: optionalText(500),
});

export const creditDocumentSchema = z.object({
  tipo: z.enum(CREDIT_DOCUMENT_TYPES),
  url: z
    .string()
    .trim()
    .min(1, "La URL o ubicación del documento es obligatoria.")
    .max(2000, "Máximo 2000 caracteres."),
  key: optionalText(1000),
  mimeType: optionalText(200),
  size: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^\d+$/.test(value),
      "El tamaño debe expresarse como un entero en bytes.",
    ),
  observaciones: optionalText(500),
});

export const creditDocumentReviewSchema = z.object({
  estado: z.enum(["VALIDADO", "RECHAZADO"]),
  observaciones: optionalText(500),
});

export const creditRequirementReviewSchema = z.object({
  estado: z.enum(["CUMPLIDO", "NO_CUMPLE", "EXONERADO"]),
  observaciones: optionalText(500),
});

const policyRequirementSchema = z.object({
  codigo: z
    .string()
    .trim()
    .min(1, "El código es obligatorio.")
    .max(60, "Máximo 60 caracteres."),
  nombre: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(160, "Máximo 160 caracteres."),
  descripcion: optionalText(500),
  obligatorio: z.boolean(),
  orden: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^\d+$/.test(value),
      "El orden debe ser un entero mayor o igual a cero.",
    ),
  activo: z.boolean(),
});

export const creditPolicyFormSchema = z
  .object({
    nombre: z
      .string()
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres.")
      .max(160, "Máximo 160 caracteres."),
    descripcion: optionalText(1000),
    montoMaximo: optionalMoneyText,
    plazoMaximoDias: optionalPositiveIntegerText,
    requisitos: z.array(policyRequirementSchema).max(100, "Máximo 100 requisitos."),
  })
  .superRefine((values, ctx) => {
    const seen = new Set<string>();

    values.requisitos.forEach((requirement, index) => {
      const code = requirement.codigo.trim().toUpperCase();
      if (!code) return;

      if (seen.has(code)) {
        ctx.addIssue({
          code: "custom",
          path: ["requisitos", index, "codigo"],
          message: "El código de requisito está duplicado.",
        });
      }

      seen.add(code);
    });
  });

export const creditPolicyDeactivateSchema = z.object({
  motivo: z
    .string()
    .trim()
    .min(3, "El motivo debe tener al menos 3 caracteres.")
    .max(500, "Máximo 500 caracteres."),
});

export type CreditApplicationFormValues = z.infer<
  typeof creditApplicationFormSchema
>;
export type CreditReasonFormValues = z.infer<typeof creditReasonSchema>;
export type CreditApprovalFormValues = z.infer<typeof creditApprovalSchema>;
export type CreditReferenceFormValues = z.infer<typeof creditReferenceSchema>;
export type CreditReferenceReviewFormValues = z.infer<
  typeof creditReferenceReviewSchema
>;
export type CreditDocumentFormValues = z.infer<typeof creditDocumentSchema>;
export type CreditDocumentReviewFormValues = z.infer<
  typeof creditDocumentReviewSchema
>;
export type CreditRequirementReviewFormValues = z.infer<
  typeof creditRequirementReviewSchema
>;
export type CreditPolicyFormValues = z.infer<typeof creditPolicyFormSchema>;
export type CreditPolicyDeactivateFormValues = z.infer<
  typeof creditPolicyDeactivateSchema
>;
