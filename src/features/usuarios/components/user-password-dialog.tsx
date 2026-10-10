import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AppForm, AppFormInput, AppFormSubmit } from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import {
  AppDialog, AppDialogBody, AppDialogContent, AppDialogDescription,
  AppDialogFooter, AppDialogHeader, AppDialogTitle,
} from "@/ui/components/app/primitives/app-dialog";
import { useChangeUserPassword } from "../api/user.mutations";
import type { SystemUser } from "../api/user.types";
import { resetPasswordSchema, type ResetPasswordFormValues } from "../schemas/user.schemas";

const blank: ResetPasswordFormValues = {
  adminPassword: "", newPassword: "", confirmPassword: "",
};

export function UserPasswordDialog({ user, onClose }: {
  user: SystemUser | null; onClose: () => void;
}) {
  const mutation = useChangeUserPassword();
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema), defaultValues: blank, mode: "onTouched",
  });
  const { reset } = form;
  useEffect(() => { reset(blank); }, [user?.id, reset]);

  const submit = async (values: ResetPasswordFormValues) => {
    if (!user) return;
    try {
      await mutation.mutateAsync({
        id: user.id, payload: { adminPassword: values.adminPassword, newPassword: values.newPassword },
      });
      reset(blank);
      onClose();
    } catch {
      // Conservar los datos para corregirlos, nunca registrar claves en consola.
    }
  };

  return (
    <AppDialog open={user !== null} onOpenChange={(open) => {
      if (!open && !mutation.isPending) onClose();
    }}>
      <AppDialogContent size="lg" viewport="tall"
        onEscapeKeyDown={(event) => { if (mutation.isPending) event.preventDefault(); }}
        onInteractOutside={(event) => { if (mutation.isPending) event.preventDefault(); }}>
        <AppDialogHeader>
          <AppDialogTitle className="flex items-center gap-2">
            <KeyRound className="h-4 w-4" /> Restablecer contraseña
          </AppDialogTitle>
          <AppDialogDescription>
            {user ? `Cambiar acceso de ${user.nombre}.` : "Cambiar acceso."}
            {" "}Confirma tu identidad con la contraseña del administrador.
          </AppDialogDescription>
        </AppDialogHeader>
        <AppForm form={form} onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <AppDialogBody className="min-h-0 space-y-4 py-3">
            <AppFormInput<ResetPasswordFormValues> name="adminPassword"
              label="Tu contraseña de administrador" type="password" autoComplete="current-password" required />
            <AppFormInput<ResetPasswordFormValues> name="newPassword"
              label="Nueva contraseña" type="password" autoComplete="new-password"
              hint="Mínimo 8 caracteres." required />
            <AppFormInput<ResetPasswordFormValues> name="confirmPassword"
              label="Confirmar nueva contraseña" type="password" autoComplete="new-password" required />
          </AppDialogBody>
          <AppDialogFooter className="flex flex-wrap justify-end gap-2 pt-3">
            <AppButton type="button" variant="secondary" disabled={mutation.isPending}
              onClick={() => { reset(blank); onClose(); }}>Cancelar</AppButton>
            <AppFormSubmit<ResetPasswordFormValues> leftIcon={<Save />}
              loadingText="Actualizando..." disabled={mutation.isPending}>Guardar contraseña</AppFormSubmit>
          </AppDialogFooter>
        </AppForm>
      </AppDialogContent>
    </AppDialog>
  );
}
