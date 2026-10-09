import { useEffect, useRef, useState } from "react";
import { MapPin, LocateFixed } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { useCustomerDepartments, useCustomerMunicipalities } from "@/features/clientes/api/customer-location.queries";
import { AppFormInput, AppFormSingleSelect, AppFormTextarea } from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid, AppGridItem } from "@/ui/components/app/primitives/app-grid";
import type { ProspectFormValues } from "../schemas/prospect.schemas";

export function ProspectLocationFields({ showGps }: { showGps: boolean }) {
  const { control, setValue } = useFormContext<ProspectFormValues>();
  const departamentoId = useWatch({ control, name: "departamentoId" });
  const previousDepartment = useRef(departamentoId);
  const departments = useCustomerDepartments();
  const municipalities = useCustomerMunicipalities(departamentoId);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (previousDepartment.current !== departamentoId) {
      setValue("municipioId", 0, { shouldDirty: true, shouldValidate: true });
      previousDepartment.current = departamentoId;
    }
  }, [departamentoId, setValue]);

  const locate = () => {
    if (!navigator.geolocation) {
      toast.warning("Tu navegador no dispone de geolocalización.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setValue("coordenadas", `${coords.latitude}, ${coords.longitude}`,
          { shouldDirty: true, shouldValidate: true });
        setLocating(false);
        toast.success("Coordenadas obtenidas.");
      },
      () => {
        setLocating(false);
        toast.error("No se pudo obtener la ubicación. Comprueba los permisos del navegador.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 },
    );
  };

  return (
    <AppCard title="Ubicación del prospecto" icon={<MapPin />} size="sm">
      <AppGrid cols={{ base: 1, sm: 2 }} gap="md">
        <AppFormSingleSelect<ProspectFormValues, number>
          name="departamentoId" label="Departamento" required
          options={[{ value: 0, label: "Seleccionar departamento" },
            ...(departments.data ?? []).map((d) => ({ value: d.id, label: d.nombre }))]}
          placeholder="Selecciona un departamento" isClearable={false}
          isLoading={departments.isLoading}
        />
        <AppFormSingleSelect<ProspectFormValues, number>
          name="municipioId" label="Municipio" required
          options={[{ value: 0, label: "Seleccionar municipio" },
            ...(municipalities.data ?? []).map((m) => ({ value: m.id, label: m.nombre }))]}
          placeholder={departamentoId ? "Selecciona un municipio" : "Selecciona departamento"}
          isDisabled={!departamentoId || municipalities.isLoading}
          isLoading={municipalities.isLoading}
          isClearable={false}
        />
        <AppGridItem span="full">
          <AppFormTextarea<ProspectFormValues>
            name="direccion" label="Dirección o referencia" rows={2} maxLength={350}
            placeholder="Dirección comercial, sector y referencias"
            required={showGps}
          />
        </AppGridItem>
        {showGps ? (
          <AppGridItem span="full">
            <div className="space-y-2">
              <AppFormInput<ProspectFormValues>
                name="coordenadas" label="Coordenadas GPS (opcional)"
                placeholder="15.665394, -91.711313"
                description="Latitud y longitud separadas por coma. Nunca es obligatorio compartir tu ubicación."
              />
              <AppButton type="button" variant="secondary" size="sm"
                leftIcon={<LocateFixed />} loading={locating} onClick={locate}>
                Obtener ubicación actual
              </AppButton>
            </div>
          </AppGridItem>
        ) : null}
        {(departments.isError || municipalities.isError) ? (
          <AppGridItem span="full">
            <p className="text-xs text-red-500" role="alert">
              No se pudieron cargar algunas ubicaciones. Vuelve a intentar más tarde.
            </p>
          </AppGridItem>
        ) : null}
      </AppGrid>
    </AppCard>
  );
}
