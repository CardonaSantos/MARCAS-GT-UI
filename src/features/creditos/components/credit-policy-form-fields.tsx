import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import {
  AppFormCheckbox,
  AppFormInput,
  AppFormTextarea,
} from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

import type { CreditPolicyFormValues } from "../schemas/credit.schemas";

export function CreditPolicyFormFields() {
  const form = useFormContext<CreditPolicyFormValues>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "requisitos",
  });

  return (
    <AppStack gap="md">
      <AppCard
        title="Política"
        description="Define límites para solicitudes de crédito puro."
        size="sm"
      >
        <AppGrid cols={{ base: 1, md: 2 }} gap="md">
          <AppFormInput<CreditPolicyFormValues>
            name="nombre"
            label="Nombre"
            maxLength={160}
            required
          />

          <AppFormInput<CreditPolicyFormValues>
            name="montoMaximo"
            label="Monto máximo"
            inputMode="decimal"
            placeholder="Sin límite"
          />

          <AppFormInput<CreditPolicyFormValues>
            name="plazoMaximoDias"
            label="Plazo máximo (días)"
            type="number"
            min={1}
            max={3650}
            inputMode="numeric"
            placeholder="Sin límite"
          />

          <div className="md:col-span-2">
            <AppFormTextarea<CreditPolicyFormValues>
              name="descripcion"
              label="Descripción"
              maxLength={1000}
              rows={4}
              placeholder="Objetivo y alcance de esta política."
            />
          </div>
        </AppGrid>
      </AppCard>

      <AppCard
        title="Requisitos"
        description="Los requisitos activos se copian al expediente al crear la solicitud."
        size="sm"
        action={
          <AppButton
            type="button"
            variant="secondary"
            size="sm"
            leftIcon={<Plus />}
            disabled={fields.length >= 100}
            onClick={() =>
              append({
                codigo: "",
                nombre: "",
                descripcion: "",
                obligatorio: true,
                orden: String(fields.length),
                activo: true,
              })
            }
          >
            Agregar requisito
          </AppButton>
        }
      >
        <AppStack gap="sm">
          {fields.length === 0 ? (
            <div className="rounded-md border border-dashed border-[hsl(var(--app-border))] p-6 text-center text-sm text-[hsl(var(--app-muted-foreground))]">
              La política puede existir sin requisitos.
            </div>
          ) : null}

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-md border border-[hsl(var(--app-border))] p-3"
            >
              <div className="grid gap-3 lg:grid-cols-[140px_minmax(220px,1fr)_110px_auto]">
                <AppFormInput<CreditPolicyFormValues>
                  name={`requisitos.${index}.codigo`}
                  label="Código"
                  maxLength={60}
                  required
                />

                <AppFormInput<CreditPolicyFormValues>
                  name={`requisitos.${index}.nombre`}
                  label="Nombre"
                  maxLength={160}
                  required
                />

                <AppFormInput<CreditPolicyFormValues>
                  name={`requisitos.${index}.orden`}
                  label="Orden"
                  type="number"
                  min={0}
                  inputMode="numeric"
                />

                <div className="flex justify-end pt-6">
                  <AppButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label="Eliminar requisito"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </AppButton>
                </div>
              </div>

              <div className="mt-3">
                <AppFormInput<CreditPolicyFormValues>
                  name={`requisitos.${index}.descripcion`}
                  label="Descripción"
                  maxLength={500}
                />
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <AppFormCheckbox<CreditPolicyFormValues>
                  name={`requisitos.${index}.obligatorio`}
                  fieldLabel="Obligatorio"
                  fieldDescription="Debe resolverse antes de aprobar."
                />
                <AppFormCheckbox<CreditPolicyFormValues>
                  name={`requisitos.${index}.activo`}
                  fieldLabel="Activo"
                  fieldDescription="Se incluirá en nuevas solicitudes."
                />
              </div>
            </div>
          ))}
        </AppStack>
      </AppCard>
    </AppStack>
  );
}
