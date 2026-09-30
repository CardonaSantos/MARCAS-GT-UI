import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StoreState {
  authToken: string | null;

  empresaId: number | null;

  userNombre: string | null;
  userCorreo: string | null;
  userId: number | null;
  userRol: string | null;
  userActivo: boolean | null;

  setAuthSession: (data: {
    authToken: string;
    usuario: {
      id: number;
      nombre: string;
      correo: string;
      rol: string;
      activo: boolean;
      empresaId: number;
    };
  }) => void;

  setEmpresaId: (id: number) => void;

  clearAuth: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      authToken: null,

      empresaId: null,

      userNombre: null,
      userCorreo: null,
      userId: null,
      userRol: null,
      userActivo: null,

      setAuthSession: ({ authToken, usuario }) =>
        set({
          authToken,

          empresaId: usuario.empresaId,

          userId: usuario.id,
          userNombre: usuario.nombre,
          userCorreo: usuario.correo,
          userRol: usuario.rol,
          userActivo: usuario.activo,
        }),

      setEmpresaId: (id) =>
        set({
          empresaId: id,
        }),

      clearAuth: () =>
        set({
          authToken: null,
          empresaId: null,

          userNombre: null,
          userCorreo: null,
          userId: null,
          userRol: null,
          userActivo: null,
        }),
    }),
    {
      name: "marcas-auth",
    },
  ),
);
