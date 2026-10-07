import { z } from "zod";

import {
  BANK_REQUIRED_METHODS,
  PAYMENT_METHODS,
} from "../common/payment.constants";

export const registerPaymentSchema = z
  .object({
    clienteId: z.number().int().positive(),
    pedidoId: z.number().int().positive().nullable(),
    bancoId: z.number().int().positive().nullable(),
    metodo: z.enum(PAYMENT_METHODS),
    moneda: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z]{3,8}$/, "Moneda inválida."),
    monto: z
      .string()
      .trim()
      .regex(/^\d+(\.\d{1,2})?$/, "Monto inválido.")
      .refine((value) => Number(value) > 0, "El monto debe ser mayor a cero."),
    referencia: z.string().trim().max(200).optional(),
    fechaPago: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || !Number.isNaN(new Date(value).getTime()),
        "Fecha inválida.",
      )
      .optional(),
    observaciones: z.string().trim().max(1000).optional(),
  })
  .superRefine((values, ctx) => {
    if (BANK_REQUIRED_METHODS.includes(values.metodo)) {
      if (!values.bancoId) {
        ctx.addIssue({
          code: "custom",
          path: ["bancoId"],
          message: "Selecciona el banco.",
        });
      }
      if (!values.referencia?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["referencia"],
          message: "Este método requiere referencia.",
        });
      }
    }
  });

export const paymentReasonSchema = z.object({
  motivo: z.string().trim().min(3).max(1000),
});

export const paymentProofSchema = z.object({
  url: z.string().trim().url("Ingresa una URL válida.").max(2000),
  key: z.string().trim().max(500).optional(),
  mimeType: z.string().trim().max(200).optional(),
  size: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" ||
        (Number.isInteger(Number(value)) && Number(value) >= 0),
      "Tamaño inválido.",
    )
    .optional(),
  descripcion: z.string().trim().max(1000).optional(),
});

export const applyPaymentSchema = z.object({
  cuentaPorCobrarId: z.number().int().positive(),
  monto: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Monto inválido.")
    .refine((value) => Number(value) > 0, "El monto debe ser mayor a cero."),
});

export type RegisterPaymentFormValues = z.infer<typeof registerPaymentSchema>;
export type PaymentReasonFormValues = z.infer<typeof paymentReasonSchema>;
export type PaymentProofFormValues = z.infer<typeof paymentProofSchema>;
export type ApplyPaymentFormValues = z.infer<typeof applyPaymentSchema>;
