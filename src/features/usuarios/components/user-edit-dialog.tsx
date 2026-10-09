import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  AppForm,
  AppFormInput,
  AppFormSingleSelect,
  AppFormSubmit,
  AppFormSwitch,
} from "@/ui/components/app/form";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogFooter,
  AppDialogHeader,
  AppDialogTitle,
} from "@/ui/components/app/primitives/app-dialog";
import { useUpdateSystemUser } from "../api/user.mutations";
import {
  USER_ROLE_OPTIONS,
  type MarcasUserRole,
  type SystemUser,
} from "../api/user.types";
import {
  editUserSchema,
  type EditUserFormValues,
} from "../schemas/user.schemas";

const blank: EditUserFormValues = {
  nombre: "",
  correo: "",
  rol: "VENDEDOR",
  activo: true,
};

interface Props {
  user: SystemUser | null;
  currentUserId: number | null;
  onClose: () => void;
}
export function UserEditDialog({ user, currentUserId, onClose }: Props) {
  const mutation = useUpdateSystemUser();
  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: blank,
    mode: "onTouched",
  });
  const { reset } = form;
  useEffect(() => {
    reset(
      user
        ? {
            nombre: user.nombre,
            correo: user.correo,
            rol: user.rol,
            activo: user.activo,
          }
        : blank,
    );
  }, [user, reset]);

  const self = user?.id === currentUserId;
  const submit = async (values: EditUserFormValues) => {
    if (!user) return;
    try {
      await mutation.mutateAsync({ id: user.id, payload: values });
      onClose();
    } catch {
      // Mantener campos y diálogo para corregir y reintentar.
    }
  };

  return (
    <AppDialog
      open={user !== null}
      onOpenChange={(open) => {
        if (!open && !mutation.isPending) onClose();
      }}
    >
      <AppDialogContent
        size="xl"
        viewport="tall"
        onEscapeKeyDown={(event) => {
          if (mutation.isPending) event.preventDefault();
        }}
        onInteractOutside={(event) => {
          if (mutation.isPending) event.preventDefault();
        }}
      >
        <AppDialogHeader>
          <AppDialogTitle className="flex items-center gap-2">
            <Pencil className="h-4 w-4" /> Editar usuario
          </AppDialogTitle>
        </AppDialogHeader>
        <AppForm
          form={form}
          onSubmit={submit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <AppDialogBody className="min-h-0 space-y-4 py-3">
            <AppFormInput<EditUserFormValues>
              name="nombre"
              label="Nombre completo"
              required
              autoComplete="name"
              maxLength={120}
            />
            <AppFormInput<EditUserFormValues>
              name="correo"
              label="Correo electrónico"
              required
              type="email"
              autoComplete="off"
              maxLength={250}
            />
            <AppFormSingleSelect<EditUserFormValues, MarcasUserRole>
              name="rol"
              label="Rol operativo"
              required
              options={
                self
                  ? USER_ROLE_OPTIONS.filter(
                      (option) => option.value === "ADMIN",
                    )
                  : USER_ROLE_OPTIONS
              }
              isClearable={false}
              isSearchable={false}
            />
            {self ? (
              <p className="text-sm text-[hsl(var(--app-muted-foreground))]">
                Esta cuenta debe permanecer activa.
              </p>
            ) : (
              <AppFormSwitch<EditUserFormValues>
                name="activo"
                fieldLabel="Cuenta activa"
                fieldDescription="Una cuenta inactiva no puede iniciar sesión ni utilizar sesiones anteriores."
              />
            )}
            {self ? (
              <AppAlert
                tone="info"
                title="Cuenta del administrador actual"
                description="No puedes desactivar tu propia cuenta ni quitarte el rol administrador."
              />
            ) : null}
          </AppDialogBody>
          <AppDialogFooter className="flex flex-wrap justify-end gap-2 pt-3">
            <AppButton
              type="button"
              variant="secondary"
              disabled={mutation.isPending}
              onClick={onClose}
            >
              Cancelar
            </AppButton>
            <AppFormSubmit<EditUserFormValues>
              leftIcon={<Save />}
              loadingText="Guardando..."
              disabled={mutation.isPending}
            >
              Guardar cambios
            </AppFormSubmit>
          </AppDialogFooter>
        </AppForm>
      </AppDialogContent>
    </AppDialog>
  );
}
