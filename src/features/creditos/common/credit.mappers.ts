import { normalizeCreditAdvance } from "./credit-advance.utils";
import type {
  AddCreditDocumentPayload,
  AddCreditReferencePayload,
  ApproveCreditPayload,
  CreateCreditApplicationPayload,
  CreateCreditPolicyPayload,
  CreditDetail,
  CreditPolicy,
  ReviewCreditDocumentPayload,
  ReviewCreditReferencePayload,
  ReviewCreditRequirementPayload,
  UpdateCreditApplicationPayload,
  UpdateCreditPolicyPayload,
  UpdateCreditReferencePayload,
} from "../api/credit.types";
import type {
  CreditApplicationFormValues,
  CreditApprovalFormValues,
  CreditDocumentFormValues,
  CreditDocumentReviewFormValues,
  CreditPolicyFormValues,
  CreditReferenceFormValues,
  CreditReferenceReviewFormValues,
  CreditRequirementReviewFormValues,
} from "../schemas/credit.schemas";

function requiredId(value: number | null, field: string) {
  if (value === null) {
    throw new Error(`Falta el campo requerido: ${field}`);
  }

  return value;
}

function nullableText(value: string) {
  const normalized = value.trim();
  return normalized || null;
}

function optionalMoney(value: string) {
  const normalized = value.trim();
  return normalized ? Number(normalized).toFixed(2) : null;
}

export function toCreateCreditApplicationPayload(
  values: CreditApplicationFormValues,
): CreateCreditApplicationPayload {
  return {
    pedidoId: requiredId(values.pedidoId, "pedidoId"),
    politicaId: values.politicaId,
    montoSolicitado: Number(values.montoSolicitado).toFixed(2),
    plazoDias: Number(values.plazoDias),
    anticipoPropuesto: normalizeCreditAdvance(values.anticipoPropuesto),
    motivo: nullableText(values.motivo),
  };
}

export function toUpdateCreditApplicationPayload(
  values: CreditApplicationFormValues,
): UpdateCreditApplicationPayload {
  return {
    politicaId: values.politicaId,
    montoSolicitado: Number(values.montoSolicitado).toFixed(2),
    plazoDias: Number(values.plazoDias),
    anticipoPropuesto: normalizeCreditAdvance(values.anticipoPropuesto),
    motivo: nullableText(values.motivo),
  };
}

export function toCreditApplicationFormValues(
  credit: CreditDetail,
): CreditApplicationFormValues {
  return {
    pedidoId: credit.origen.pedido.id,
    politicaId: credit.politica?.id ?? null,
    montoSolicitado: Number(credit.montos.solicitado).toFixed(2),
    condicionPago: credit.origen.pedido.condicionPago,
    anticipoPropuesto: credit.montos.anticipoPropuesto,
    plazoDias: String(credit.plazos.solicitadoDias),
    motivo: credit.motivo ?? "",
  };
}

export function toApproveCreditPayload(
  values: CreditApprovalFormValues,
  claveIdempotencia: string,
): ApproveCreditPayload {
  return {
    montoAutorizado: Number(values.montoAutorizado).toFixed(2),
    plazoAutorizadoDias: Number(values.plazoAutorizadoDias),
    anticipoRequerido: normalizeCreditAdvance(values.anticipoRequerido),
    observaciones: nullableText(values.observaciones),
    claveIdempotencia,
  };
}

export function toAddCreditReferencePayload(
  values: CreditReferenceFormValues,
): AddCreditReferencePayload {
  return {
    tipo: values.tipo,
    nombre: values.nombre.trim(),
    telefono: values.telefono.trim(),
    relacion: nullableText(values.relacion),
    observaciones: nullableText(values.observaciones),
  };
}

export function toUpdateCreditReferencePayload(
  values: CreditReferenceFormValues,
): UpdateCreditReferencePayload {
  return {
    nombre: values.nombre.trim(),
    telefono: values.telefono.trim(),
    relacion: nullableText(values.relacion),
    observaciones: nullableText(values.observaciones),
  };
}

export function toReviewCreditReferencePayload(
  values: CreditReferenceReviewFormValues,
): ReviewCreditReferencePayload {
  return {
    resultado: values.resultado,
    observaciones: nullableText(values.observaciones),
  };
}

export function toAddCreditDocumentPayload(
  values: CreditDocumentFormValues,
): AddCreditDocumentPayload {
  return {
    tipo: values.tipo,
    url: values.url.trim(),
    key: nullableText(values.key),
    mimeType: nullableText(values.mimeType),
    size: values.size.trim() ? Number(values.size) : null,
    observaciones: nullableText(values.observaciones),
  };
}

export function toReviewCreditDocumentPayload(
  values: CreditDocumentReviewFormValues,
): ReviewCreditDocumentPayload {
  return {
    estado: values.estado,
    observaciones: nullableText(values.observaciones),
  };
}

export function toReviewCreditRequirementPayload(
  values: CreditRequirementReviewFormValues,
): ReviewCreditRequirementPayload {
  return {
    estado: values.estado,
    observaciones: nullableText(values.observaciones),
  };
}

export function toCreateCreditPolicyPayload(
  values: CreditPolicyFormValues,
): CreateCreditPolicyPayload {
  return {
    nombre: values.nombre.trim(),
    descripcion: nullableText(values.descripcion),
    montoMaximo: optionalMoney(values.montoMaximo),
    plazoMaximoDias: values.plazoMaximoDias.trim()
      ? Number(values.plazoMaximoDias)
      : null,
    requisitos: values.requisitos.map((requirement, index) => ({
      codigo: requirement.codigo.trim().toUpperCase(),
      nombre: requirement.nombre.trim(),
      descripcion: nullableText(requirement.descripcion),
      obligatorio: requirement.obligatorio,
      orden: requirement.orden.trim()
        ? Number(requirement.orden)
        : index,
      activo: requirement.activo,
    })),
  };
}

export function toUpdateCreditPolicyPayload(
  values: CreditPolicyFormValues,
): UpdateCreditPolicyPayload {
  return toCreateCreditPolicyPayload(values);
}

export function toCreditPolicyFormValues(
  policy: CreditPolicy,
): CreditPolicyFormValues {
  return {
    nombre: policy.nombre,
    descripcion: policy.descripcion ?? "",
    montoMaximo: policy.montoMaximo ?? "",
    plazoMaximoDias:
      policy.plazoMaximoDias == null ? "" : String(policy.plazoMaximoDias),
    requisitos: policy.requisitos.map((requirement) => ({
      codigo: requirement.codigo,
      nombre: requirement.nombre,
      descripcion: requirement.descripcion ?? "",
      obligatorio: requirement.obligatorio,
      orden: String(requirement.orden),
      activo: requirement.activo,
    })),
  };
}
