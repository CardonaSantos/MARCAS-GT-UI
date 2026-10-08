import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import logo from "@/assets/images/logoEmpresa.png";
import { useStore } from "@/Context/ContextSucursal";
import { useLogin } from "@/features/auth/api/auth.mutations";
import { getLoginHome } from "@/features/auth/api/auth.types";
import {
  loginResponseSchema,
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login.schemas";
import { useAppFormHandlers } from "@/ui/components/app/handlers";
import { AppForm, AppFormInput, AppFormSubmit } from "@/ui/components/app/form";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAuthSession = useStore((state) => state.setAuthSession);
  const login = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { correo: "", contrasena: "" },
    mode: "onTouched",
  });
  const handlers = useAppFormHandlers(form);

  const onSubmit = async (values: LoginFormValues) => {
    form.clearErrors("root");

    try {
      const response = await login.mutateAsync(values);
      const parsed = loginResponseSchema.safeParse(response);

      if (!parsed.success) {
        form.setError("root", {
          type: "server",
          message: "La respuesta del servidor no contiene una sesión válida.",
        });
        return;
      }

      const { authToken, usuario } = parsed.data;
      if (!usuario.activo) {
        form.setError("root", {
          type: "server",
          message: "Esta cuenta está inactiva. Contacta al administrador.",
        });
        return;
      }

      const empresaId = usuario.empresaId;
      if (!empresaId) {
        form.setError("root", {
          type: "server",
          message:
            "Tu cuenta no tiene una empresa asignada. Contacta al administrador.",
        });
        return;
      }

      // Impedir que queden visibles consultas de un usuario anterior
      // cuando se inicia sesión con otra cuenta en el mismo navegador.
      queryClient.clear();
      setAuthSession({ authToken, usuario: { ...usuario, empresaId } });
      handlers.reset();
      toast.success("Sesión iniciada correctamente.");
      navigate(getLoginHome(usuario.rol), { replace: true });
    } catch {
      // useLogin ya notifica los errores HTTP; conservar los campos.
    }
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-4 py-8">
      <AppContainer size="md" paddingX="none" className="w-full">
        <AppCard
          size="md"
          title=""
          description=""
          className="mx-auto w-full max-w-md text-center p-2"
        >
          <AppStack gap="lg">
            <div className="flex justify-center">
              <img
                src={logo}
                alt="MARCAS GT"
                className="h-auto max-h-24 w-auto max-w-[180px] object-contain"
              />
            </div>

            <AppForm form={form} onSubmit={onSubmit}>
              <AppStack gap="md">
                <AppFormInput<LoginFormValues>
                  name="correo"
                  label="Correo electrónico"
                  type="email"
                  autoComplete="username"
                  placeholder="correo@empresa.com"
                  required
                />

                <AppFormInput<LoginFormValues>
                  name="contrasena"
                  label="Contraseña"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Ingresa tu contraseña"
                  required
                />

                {form.formState.errors.root?.message ? (
                  <AppAlert
                    tone="danger"
                    title="No se pudo iniciar sesión"
                    description={form.formState.errors.root.message}
                  />
                ) : null}

                <AppFormSubmit<LoginFormValues>
                  className="w-full"
                  leftIcon={<LogIn />}
                  loadingText="Verificando..."
                  disabled={login.isPending}
                >
                  Iniciar sesión
                </AppFormSubmit>
              </AppStack>
            </AppForm>
          </AppStack>
        </AppCard>
      </AppContainer>
    </div>
  );
}
