import { zodResolver } from "@hookform/resolvers/zod";
import { Save, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { useCreateUser } from "@/features/usuarios/api/user.mutations";
import {
  USER_ROLE_OPTIONS,
  type CreateUserPayload,
  type MarcasUserRole,
} from "@/features/usuarios/api/user.types";
import {
  createUserSchema,
  type CreateUserFormValues,
} from "@/features/usuarios/schemas/user.schemas";
import { useAppFormHandlers } from "@/ui/components/app/handlers";
import {
  AppForm,
  AppFormInput,
  AppFormSingleSelect,
  AppFormSubmit,
} from "@/ui/components/app/form";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

const RETURN_TO = "/marcas-gt/usuarios";

export default function CreateUser() {
  const navigate = useNavigate();
  const empresaId = useStore((state) => state.empresaId);
  const mutation = useCreateUser();
  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      nombre: "",
      correo: "",
      contrasena: "",
      confirmarContrasena: "",
      rol: undefined,
    },
    mode: "onTouched",
  });
  const handlers = useAppFormHandlers(form);

  const onSubmit = async (values: CreateUserFormValues) => {
    if (!empresaId || empresaId <= 0) {
      form.setError("root", {
        type: "manual",
        message:
          "Tu sesión no tiene una empresa válida. Vuelve a iniciar sesión.",
      });
      return;
    }

    const payload: CreateUserPayload = {
      nombre: values.nombre,
      correo: values.correo,
      contrasena: values.contrasena,
      rol: values.rol,
      empresaId,
    };

    try {
      // POST /users devuelve authToken del nuevo usuario. Se ignora
      // intencionalmente para conservar la sesión del administrador.
      await mutation.mutateAsync(payload);
      handlers.reset();
      navigate(RETURN_TO, { replace: true });
    } catch {
      // El hook muestra el error. Mantener los campos para corregirlos.
    }
  };

  return (
    <AppContainer size="xl" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Registrar usuario"
          description="Registra una cuenta y asigna su rol operativo."
          backTo={RETURN_TO}
          backLabel="Volver a usuarios"
        />

        {!empresaId || empresaId <= 0 ? (
          <AppAlert
            tone="danger"
            title="Empresa no disponible"
            description="No puedes crear usuarios sin una empresa válida en tu sesión."
          />
        ) : null}

        <AppForm form={form} onSubmit={onSubmit}>
          <AppStack gap="md">
            <AppCard
              title="Datos de acceso"
              icon={<UserPlus />}
              size="sm"
              description="Datos de identificación y contraseña inicial."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <AppFormInput<CreateUserFormValues>
                  name="nombre"
                  label="Nombre completo"
                  required
                  placeholder="Nombre del empleado"
                  autoComplete="name"
                  maxLength={120}
                />
                <AppFormInput<CreateUserFormValues>
                  name="correo"
                  label="Correo electrónico"
                  required
                  type="email"
                  placeholder="correo@empresa.com"
                  autoComplete="off"
                />
                <AppFormInput<CreateUserFormValues>
                  name="contrasena"
                  label="Contraseña"
                  type="password"
                  required
                  autoComplete="new-password"
                  hint="Mínimo 8 caracteres."
                />
                <AppFormInput<CreateUserFormValues>
                  name="confirmarContrasena"
                  label="Confirmar contraseña"
                  type="password"
                  required
                  autoComplete="new-password"
                />
              </div>
            </AppCard>

            <AppCard
              title="Rol y permisos"
              size="sm"
              description="Define el perfil operativo que utilizará la cuenta."
            >
              <AppFormSingleSelect<CreateUserFormValues, MarcasUserRole>
                name="rol"
                label="Rol del usuario"
                required
                options={USER_ROLE_OPTIONS}
                placeholder="Seleccionar rol"
                isClearable={false}
                isSearchable={false}
              />
            </AppCard>

            {form.formState.errors.root?.message ? (
              <AppAlert
                tone="danger"
                title="No se pudo registrar el usuario"
                description={form.formState.errors.root.message}
              />
            ) : null}

            <div className="flex justify-end gap-2">
              <AppButton asChild variant="secondary">
                <Link to={RETURN_TO}>Cancelar</Link>
              </AppButton>
              <AppFormSubmit<CreateUserFormValues>
                leftIcon={<Save />}
                loadingText="Registrando..."
                disabled={!empresaId || mutation.isPending}
              >
                Registrar usuario
              </AppFormSubmit>
            </div>
          </AppStack>
        </AppForm>
      </AppStack>
    </AppContainer>
  );
}
