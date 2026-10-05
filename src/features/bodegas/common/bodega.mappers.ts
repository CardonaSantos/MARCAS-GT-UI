import type {
  AssignBodegaResponsiblePayload,
  CreateBodegaPayload,
  UpdateBodegaPayload,
} from "../api/bodega.types";
import type {
  AssignBodegaResponsibleFormValues,
  CreateBodegaFormValues,
  UpdateBodegaFormValues,
} from "../schemas/bodega.schemas";

function nullableText(value: string) {
  const normalized = value.trim();
  return normalized ? normalized : null;
}

export function toCreateBodegaPayload(
  values: CreateBodegaFormValues,
): CreateBodegaPayload {
  return {
    codigo: values.codigo.trim(),
    nombre: values.nombre.trim(),
    descripcion: nullableText(values.descripcion),
    direccion: nullableText(values.direccion),
    telefono: nullableText(values.telefono),
    esPrincipal: values.esPrincipal,
    responsableId: values.responsableId,
  };
}

export function toUpdateBodegaPayload(
  values: UpdateBodegaFormValues,
): UpdateBodegaPayload {
  return {
    codigo: values.codigo.trim(),
    nombre: values.nombre.trim(),
    descripcion: nullableText(values.descripcion),
    direccion: nullableText(values.direccion),
    telefono: nullableText(values.telefono),
  };
}

export function toAssignResponsiblePayload(
  values: AssignBodegaResponsibleFormValues,
): AssignBodegaResponsiblePayload {
  return {
    responsableId: values.responsableId,
  };
}
