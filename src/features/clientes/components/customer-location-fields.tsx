import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import { AppFormInput, AppFormSingleSelect, AppFormTextarea } from "@/ui/components/app/form";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid, AppGridItem } from "@/ui/components/app/primitives/app-grid";
import { useCustomerDepartments, useCustomerMunicipalities } from "../api/customer-location.queries";
import type { CustomerFormValues } from "../schemas/customer.schemas";

export function CustomerLocationFields() {
  const { control, setValue } = useFormContext<CustomerFormValues>();
  const departmentId = useWatch({ control, name: "departamentoId" });
  const previous = useRef(departmentId);
  const departments = useCustomerDepartments();
  const municipalities = useCustomerMunicipalities(departmentId);

  // Evitar enviar un municipio que pertenece al departamento anterior.
  useEffect(() => {
    if (previous.current !== departmentId) {
      setValue("municipioId", 0, { shouldValidate: true, shouldDirty: true });
      previous.current = departmentId;
    }
  }, [departmentId, setValue]);

  return (
    <AppCard title="Dirección y ubicación" icon={<MapPin />} size="sm">
      <AppGrid cols={{ base: 1, sm: 2 }} gap="md">
        <AppFormSingleSelect<CustomerFormValues, number>
          name="departamentoId" label="Departamento"
          options={[{ value: 0, label: "Sin seleccionar" }, ...(departments.data ?? []).map((d) => ({ value: d.id, label: d.nombre }))]}
          placeholder="Selecciona un departamento"
          noOptionsText="Sin departamentos"
          isLoading={departments.isLoading}
          isClearable={false}
        />
        <AppFormSingleSelect<CustomerFormValues, number>
          name="municipioId" label="Municipio"
          options={[{ value: 0, label: "Sin seleccionar" }, ...(municipalities.data ?? []).map((m) => ({ value: m.id, label: m.nombre }))]}
          placeholder={departmentId ? "Selecciona un municipio" : "Selecciona antes un departamento"}
          isDisabled={!departmentId || municipalities.isLoading}
          isLoading={municipalities.isLoading}
          isClearable
          noOptionsText="Sin municipios"
        />
        <AppGridItem span="full">
          <AppFormTextarea<CustomerFormValues>
            name="direccion" label="Dirección o referencia" rows={2}
            placeholder="Calle, zona, cantón y referencias de ubicación"
            maxLength={350}
          />
        </AppGridItem>
        <AppGridItem span="full">
          <AppFormInput<CustomerFormValues>
            name="coordenadas" label="Coordenadas GPS (opcional)"
            placeholder="15.665394, -91.711313"
            autoComplete="off"
            description="Latitud y longitud separadas por coma; se guardan solo cuando proporcionas ambas."
          />
        </AppGridItem>
        {departments.isError || municipalities.isError ? (
          <AppGridItem span="full">
            <p role="alert" className="text-xs text-red-500">
              No se pudo cargar la ubicación. Actualiza la página para intentarlo de nuevo.
            </p>
          </AppGridItem>
        ) : null}
      </AppGrid>
    </AppCard>
  );
}
