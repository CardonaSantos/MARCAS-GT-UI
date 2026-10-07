import type {
  CompanyFiscalProfilePayload,
  CustomerFiscalProfilePayload,
  EstablishmentFiscalPayload,
  PrepareInvoicePayload,
  ProductFiscalProfilePayload,
} from "../api/billing.types";
import type {
  CompanyFiscalFormValues,
  CustomerFiscalFormValues,
  EstablishmentFiscalFormValues,
  PrepareInvoiceFormValues,
  ProductFiscalFormValues,
} from "../schemas/billing.schemas";

function text(value?: string | null) {
  const normalized = value?.trim() ?? "";
  return normalized || undefined;
}

export function toPrepareInvoicePayload(
  values: PrepareInvoiceFormValues,
): PrepareInvoicePayload {
  const establishmentId = values.establecimientoId?.trim()
    ? Number(values.establecimientoId)
    : undefined;

  return {
    tipoDte: values.tipoDte.trim().toUpperCase(),
    entorno: values.entorno,
    ...(establishmentId ? { establecimientoId: establishmentId } : {}),
    ...(text(values.serieInterna)
      ? { serieInterna: text(values.serieInterna) }
      : {}),
    ...(text(values.versionEsquema)
      ? { versionEsquema: text(values.versionEsquema) }
      : {}),
  };
}

export function toCompanyFiscalPayload(
  empresaId: number,
  values: CompanyFiscalFormValues,
): CompanyFiscalProfilePayload {
  return {
    empresaId,
    nit: values.nit.trim(),
    razonSocial: values.razonSocial.trim(),
    afiliacionIva: values.afiliacionIva.trim(),
    direccion: values.direccion.trim(),
    municipio: values.municipio.trim(),
    departamento: values.departamento.trim(),
    pais: values.pais.trim().toUpperCase(),
    preciosIncluyenImpuestos: values.preciosIncluyenImpuestos,
    ...(text(values.correoFiscal) ? { correoFiscal: text(values.correoFiscal) } : {}),
    ...(text(values.codigoPostal) ? { codigoPostal: text(values.codigoPostal) } : {}),
    ...(text(values.tasaIvaDefault)
      ? { tasaIvaDefault: text(values.tasaIvaDefault) }
      : {}),
  };
}

export function toEstablishmentFiscalPayload(
  empresaId: number,
  values: EstablishmentFiscalFormValues,
): EstablishmentFiscalPayload {
  return {
    empresaId,
    codigoSat: Number(values.codigoSat),
    nombreComercial: values.nombreComercial.trim(),
    direccion: values.direccion.trim(),
    municipio: values.municipio.trim(),
    departamento: values.departamento.trim(),
    pais: values.pais.trim().toUpperCase(),
    esPrincipal: values.esPrincipal,
    ...(text(values.correo) ? { correo: text(values.correo) } : {}),
    ...(text(values.codigoPostal) ? { codigoPostal: text(values.codigoPostal) } : {}),
  };
}

export function toCustomerFiscalPayload(
  values: CustomerFiscalFormValues,
): CustomerFiscalProfilePayload {
  return {
    tipoIdentificacion: values.tipoIdentificacion,
    identificacion: values.identificacion.trim(),
    nombreFiscal: values.nombreFiscal.trim(),
    pais: values.pais.trim().toUpperCase(),
    ...(text(values.correoFiscal) ? { correoFiscal: text(values.correoFiscal) } : {}),
    ...(text(values.direccion) ? { direccion: text(values.direccion) } : {}),
    ...(text(values.codigoPostal) ? { codigoPostal: text(values.codigoPostal) } : {}),
    ...(text(values.municipio) ? { municipio: text(values.municipio) } : {}),
    ...(text(values.departamento)
      ? { departamento: text(values.departamento) }
      : {}),
  };
}

export function toProductFiscalPayload(
  values: ProductFiscalFormValues,
): ProductFiscalProfilePayload {
  const taxableUnit = values.codigoUnidadGravable?.trim()
    ? Number(values.codigoUnidadGravable)
    : undefined;

  return {
    bienOServicio: values.bienOServicio,
    unidadMedida: values.unidadMedida.trim(),
    activo: values.activo,
    ...(text(values.descripcionFiscal)
      ? { descripcionFiscal: text(values.descripcionFiscal) }
      : {}),
    ...(text(values.nombreCortoImpuesto)
      ? { nombreCortoImpuesto: text(values.nombreCortoImpuesto) }
      : {}),
    ...(taxableUnit !== undefined ? { codigoUnidadGravable: taxableUnit } : {}),
  };
}
