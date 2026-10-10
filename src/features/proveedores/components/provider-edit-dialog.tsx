import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useAppFormHandlers } from "@/ui/components/app/handlers";
import { AppForm, AppFormSubmit } from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import {
  AppDialog, AppDialogBody, AppDialogContent, AppDialogFooter,
  AppDialogHeader, AppDialogTitle, AppDialogDescription,
} from "@/ui/components/app/primitives/app-dialog";

import { useUpdateProvider } from "../api/provider.mutations";
import type { Provider } from "../api/provider.types";
import { toProviderForm, toProviderPayload } from "../common/provider.mappers";
import { emptyProviderForm, providerSchema, type ProviderFormValues } from "../schemas/provider.schemas";
import { ProviderFormFields } from "./provider-form-fields";

interface Props {
  provider: Provider | null;
  onClose: () => void;
}

export function ProviderEditDialog({ provider, onClose }: Props) {
  const mutation = useUpdateProvider();
  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(providerSchema),
    defaultValues: emptyProviderForm,
    mode: "onTouched",
  });
  const handlers = useAppFormHandlers(form);

  useEffect(() => {
    handlers.reset(provider ? toProviderForm(provider) : emptyProviderForm);
  }, [provider, handlers.reset]);

  const onSubmit = async (values: ProviderFormValues) => {
    if (!provider) return;
    try {
      await mutation.mutateAsync({
        id: provider.id,
        payload: toProviderPayload(values),
      });
      onClose();
    } catch {
      // El hook muestra el error; mantener los cambios para reintentar.
    }
  };

  return (
    <AppDialog
      open={provider !== null}
      onOpenChange={(open) => { if (!open && !mutation.isPending) onClose(); }}
    >
      <AppDialogContent
        size="3xl"
        viewport="tall"
        onEscapeKeyDown={(event) => { if (mutation.isPending) event.preventDefault(); }}
        onInteractOutside={(event) => { if (mutation.isPending) event.preventDefault(); }}
      >
        <AppDialogHeader>
          <AppDialogTitle className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Editar proveedor
          </AppDialogTitle>
          <AppDialogDescription>
            Los campos opcionales se pueden dejar vacíos. Nombre obligatorio.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppForm form={form} onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <AppDialogBody className="min-h-0 space-y-3 py-3">
            <ProviderFormFields />
          </AppDialogBody>
          <AppDialogFooter className="flex shrink-0 flex-wrap justify-end gap-2 pt-3">
            <AppButton type="button" variant="secondary" disabled={mutation.isPending} onClick={onClose}>
              Cancelar
            </AppButton>
            <AppFormSubmit<ProviderFormValues> leftIcon={<Save />}
              loadingText="Guardando..." disabled={mutation.isPending}>
              Guardar cambios
            </AppFormSubmit>
          </AppDialogFooter>
        </AppForm>
      </AppDialogContent>
    </AppDialog>
  );
}
