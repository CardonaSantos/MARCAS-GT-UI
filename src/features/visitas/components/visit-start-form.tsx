import { ClipboardList, UserRound } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AppForm, AppFormSingleSelect, AppFormSubmit } from "@/ui/components/app/form";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";
import { useVisitCustomerOptions } from "../common/use-visit-customer-options";
import {
  startVisitSchema, visitReasons, visitTypes, type StartVisitValues,
} from "../schemas/visit-workflow.schemas";

interface Props {
  busy: boolean;
  onReady: (values: StartVisitValues) => void;
}

export function VisitStartForm({ busy, onReady }: Props) {
  const customers = useVisitCustomerOptions();
  const form = useForm<StartVisitValues>({
    resolver: zodResolver(startVisitSchema),
    defaultValues: { clienteId: 0 },
    mode: "onTouched",
  });
  const selectedId = form.watch("clienteId");

  // Conservar la opción elegida al realizar una búsqueda nueva.
  useEffect(() => {
    if (selectedId > 0) customers.pick(selectedId);
  }, [selectedId, customers.customers.data]);

  return (
    <AppForm form={form} onSubmit={onReady} className="space-y-4">
      <AppCard title="Datos de la visita" size="sm" icon={<ClipboardList />}
        description="Selecciona el cliente y los datos básicos para iniciar el seguimiento.">
        <AppGrid cols={{ base: 1, md: 2 }} gap="md">
          <div className="md:col-span-2">
            <AppFormSingleSelect<StartVisitValues, number>
              name="clienteId" label="Cliente" required
              options={customers.options}
              onInputChange={(value, meta) => {
                if (meta.action === "input-change") customers.setInput(value);
              }}
              placeholder="Busca por nombre, apellido, teléfono o correo"
              isSearchable isClearable
              isLoading={customers.customers.isFetching}
              noOptionsText={customers.customers.isError
                ? "No se pudieron consultar los clientes" : "Sin coincidencias"}
              description="La búsqueda utiliza el directorio de clientes y consulta un máximo de 20 resultados."
            />
          </div>
          <AppFormSingleSelect<StartVisitValues, StartVisitValues["motivoVisita"]>
            name="motivoVisita" label="Motivo de la visita" required
            options={[...visitReasons]}
            placeholder="Selecciona un motivo"
            isClearable={false}
          />
          <AppFormSingleSelect<StartVisitValues, StartVisitValues["tipoVisita"]>
            name="tipoVisita" label="Tipo de visita" required
            options={[...visitTypes]}
            placeholder="Selecciona el tipo de visita"
            isClearable={false}
          />
        </AppGrid>
        {customers.customers.isError ? (
          <div role="alert" className="mt-3 flex flex-wrap items-center gap-2 text-xs text-red-500">
            No se pudo consultar el directorio de clientes.
          </div>
        ) : null}
      </AppCard>
      <div className="flex flex-wrap justify-end">
        <AppFormSubmit<StartVisitValues>
          size="sm" variant="primary" disabled={busy || customers.customers.isError}
          leftIcon={<UserRound />} loadingText="Iniciando...">
          Iniciar visita
        </AppFormSubmit>
      </div>
    </AppForm>
  );
}
