"use client";

import * as React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";
import {
  useAppAsyncAction,
  useAppDisclosure,
  useAppStateHandlers,
} from "@/components/app/handlers";

import logo from "@/assets/LogoCrmPng.png";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import { useInvalidateQk } from "@/Crm/CrmHooks/hooks/useInvalidateQk/useInvalidateQk";
import { useGetNotification } from "@/Crm/CrmHooks/hooks/use-notifications/useNotification";
import { useSocketEvent } from "@/Crm/WEB/SocketProvider";
import { useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import {
  useGetMyUserProfile,
  type UserExtendedProfile,
} from "@/Crm/CrmHooks/hooks/useUsuarios/use-usuers";

import { AppSidebar } from "./app-sidebar";
import NotificationDetailModal from "./NotificationsComponents/NotificationDetailModal";
import type { CrmTokenPayload } from "./_components/layout-crm.helpers";
import { LayoutTopbar } from "./_components/layout-topbar";
import { AppSidebarProvider } from "../app/primitives/app-sidebar-shell";

interface LayoutProps {
  children?: React.ReactNode;
}

interface LayoutUiState {
  selectedNotification: any | null;
}

function useRequestNotificationPermission() {
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
      void Notification.requestPermission();
    }
  }, []);
}

export default function LayoutCrm({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isCrmLocation = location.pathname.startsWith("/crm");
  const erpLink = import.meta.env.VITE_ERP_LINK;
  const crmLink = import.meta.env.VITE_CRM_LINK;

  useRequestNotificationPermission();

  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;

  const setNombre = useStoreCrm((state) => state.setNombre);
  const setCorreo = useStoreCrm((state) => state.setCorreo);
  const setActivo = useStoreCrm((state) => state.setActivo);
  const setRol = useStoreCrm((state) => state.setRol);
  const setUserId = useStoreCrm((state) => state.setUserIdCrm);
  const setEmpresaId = useStoreCrm((state) => state.setEmpresaId);

  const nombre = useStoreCrm((state) => state.nombre);
  const correo = useStoreCrm((state) => state.correo);
  const empresaId = useStoreCrm((state) => state.empresaId);

  const invalidateQk = useInvalidateQk();

  const deleteAllDialog = useAppDisclosure();
  const notificationDetailDialog = useAppDisclosure();

  const ui = useAppStateHandlers<LayoutUiState>({
    selectedNotification: null,
  });

  const { data: notifications } = useGetNotification();

  const secureNotifications = notifications?.notifications ?? [];
  const secureNotificationsBot = notifications?.botsNotifications ?? [];

  const { data: empresaInfo } = useCrmQuery<any>(
    ["empresa-info", empresaId],
    `empresa/${empresaId}/details`,
    undefined,
    {
      enabled: Boolean(empresaId),
    },
  );

  const { data: userData = {} as UserExtendedProfile } =
    useGetMyUserProfile(userId);

  React.useEffect(() => {
    const storedTokenCRM = localStorage.getItem("tokenAuthCRM");
    if (!storedTokenCRM) return;

    try {
      const decodedCrm = jwtDecode<CrmTokenPayload>(storedTokenCRM);

      setNombre(decodedCrm.nombre);
      setCorreo(decodedCrm.correo);
      setActivo(decodedCrm.activo);
      setRol(decodedCrm.rol);
      setUserId(decodedCrm.id);
      setEmpresaId(decodedCrm.empresaId);
    } catch (error) {
      console.error("Error decodificando tokenAuthCRM:", error);
    }
  }, [setNombre, setCorreo, setActivo, setRol, setUserId, setEmpresaId]);

  useSocketEvent(
    "notifications:system",
    () => {
      // invalidateQk("notificationsSystemQkeys.all");
    },
    [invalidateQk],
  );

  const deleteNotification = React.useCallback(async (_id: number) => {
    toast.info("El módulo de notificaciones aún no está listo en el servidor.");
  }, []);

  const deleteAllAction = useAppAsyncAction(
    async () => {
      toast.info(
        "El módulo de notificaciones aún no está listo en el servidor.",
      );
    },
    {
      preventConcurrent: true,
    },
  );

  const deleteAllNotifications = React.useCallback(async () => {
    await deleteAllAction.run();
    deleteAllDialog.close();
  }, [deleteAllAction, deleteAllDialog]);

  const selectNotification = React.useCallback(
    (notification: any) => {
      ui.setField("selectedNotification", notification);
      notificationDetailDialog.open();
    },
    [notificationDetailDialog, ui],
  );

  const handleLogout = React.useCallback(() => {
    localStorage.removeItem("tokenAuthCRM");
    toast.info("Sesión cerrada correctamente");
    window.location.reload();
  }, []);

  const handleProfile = React.useCallback(() => {
    navigate("/crm/perfil");
  }, [navigate]);

  return (
    <AppSidebarProvider>
      <div className="flex h-screen overflow-hidden bg-[hsl(var(--app-background,var(--background)))] text-[hsl(var(--app-foreground,var(--foreground)))]">
        <AppSidebar />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <LayoutTopbar
            logoSrc={logo}
            empresaNombre={empresaInfo?.nombre}
            isCrmLocation={isCrmLocation}
            erpLink={erpLink}
            crmLink={crmLink}
            userName={userData?.nombre || nombre}
            userEmail={userData?.correo || correo}
            userRole={userData?.rol || userData.rol}
            userAvatarUrl={userData?.perfil?.avatar?.url}
            systemNotifications={secureNotifications}
            botNotifications={secureNotificationsBot}
            isLoadingNotifications={false}
            openDeleteAllNoti={deleteAllDialog.isOpen}
            setOpenDeleteAllNoti={deleteAllDialog.setOpen}
            onDeleteNotification={deleteNotification}
            onDeleteAllNotifications={deleteAllNotifications}
            onSelectNotification={selectNotification}
            onProfile={handleProfile}
            onLogout={handleLogout}
          />

          <main className="min-h-0 flex-1 overflow-y-auto">
            <div className="h-full w-full">{children || <Outlet />}</div>
          </main>
        </div>

        <AppConfirmDialog
          open={deleteAllDialog.isOpen}
          onOpenChange={deleteAllDialog.setOpen}
          preset="delete"
          tone="danger"
          title="Eliminar todas las notificaciones"
          description="¿Seguro que deseas eliminar todas tus notificaciones? Esta acción no se puede deshacer."
          confirmText="Sí, eliminar todo"
          cancelText="Cancelar"
          loadingText="Eliminando..."
          isLoading={deleteAllAction.isLoading}
          preventClose={deleteAllAction.isLoading}
          onConfirm={deleteAllNotifications}
        />

        <NotificationDetailModal
          notification={ui.state.selectedNotification}
          open={notificationDetailDialog.isOpen}
          onOpenChange={notificationDetailDialog.setOpen}
        />
      </div>
    </AppSidebarProvider>
  );
}
