import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StoreState {
  authToken: string | null;

  sucursalId: number | null;

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
    };
  }) => void;

  setSucursalId: (id: number) => void;

  clearAuth: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      authToken: null,

      sucursalId: null,

      userNombre: null,
      userCorreo: null,
      userId: null,
      userRol: null,
      userActivo: null,

      setAuthSession: ({ authToken, usuario }) =>
        set({
          authToken,

          userId: usuario.id,
          userNombre: usuario.nombre,
          userCorreo: usuario.correo,
          userRol: usuario.rol,
          userActivo: usuario.activo,
        }),

      setSucursalId: (id) =>
        set({
          sucursalId: id,
        }),

      clearAuth: () =>
        set({
          authToken: null,
          sucursalId: null,

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
