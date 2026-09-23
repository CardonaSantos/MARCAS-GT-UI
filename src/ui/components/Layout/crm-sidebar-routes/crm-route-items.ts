import { AddMinus } from "@/Crm/Icons/AddMinus";
import { AlertShield } from "@/Crm/Icons/AlertShield";
import { NetworkChartFilled } from "@/Crm/Icons/ChartNetWork";
import { ListAltCheckOutline } from "@/Crm/Icons/cheklist";
import { MessageIcon } from "@/Crm/Icons/MessageIcon";
import { MetaIcon } from "@/Crm/Icons/MetaIcon";
import { TwotoneAppRegistration } from "@/Crm/Icons/TwotoneAppRegistration";
import { WhatsappIcon } from "@/Crm/Icons/WhatsappIcon";
import {
  BadgeCheck,
  BadgePlus,
  Bot,
  BotMessageSquare,
  Cable,
  ClipboardCheck,
  FileText,
  FileType,
  GalleryHorizontal,
  Home,
  Landmark,
  MapIcon,
  MapPin,
  MapPinned,
  MonitorSmartphone,
  NotebookPen,
  Route as RouteLucide,
  Router,
  Sheet,
  Tags,
  Target,
  Ticket,
  User,
  UserPlus,
  Users,
  Waypoints,
} from "lucide-react";

import type { Route } from "./crm-route-types";

export const dashboardRoute: Route = {
  icon: Home,
  label: "Dashboard",
  href: "/crm",
};

export const tecnicoDashboardRoute: Route = {
  icon: Home,
  label: "Dashboard",
  href: "/crm/tec-dashboard",
};

export const clientesRoute: Route = {
  icon: Users,
  label: "Clientes",
  submenu: [
    {
      icon: Users,
      label: "Listado de Clientes",
      href: "/crm-clientes",
    },
    {
      icon: UserPlus,
      label: "Nuevo Cliente",
      href: "/crm/crear-cliente-crm",
    },
  ],
};

export const clientesListadoRoute: Route = {
  icon: Users,
  label: "Clientes",
  submenu: [
    {
      icon: Users,
      label: "Listado de Clientes",
      href: "/crm-clientes",
    },
  ],
};

export const instalacionesRoute: Route = {
  icon: TwotoneAppRegistration,
  label: "Instalaciones",
  submenu: [
    {
      icon: ListAltCheckOutline,
      label: "Instalaciones registradas",
      href: "/crm/instalaciones",
    },
  ],
};

/**
 * Administración PPPoE completa.
 *
 * Se utiliza para roles que pueden:
 *
 * - administrar cuentas;
 * - consultar homologaciones.
 *
 * Actualmente:
 * - SUPER_ADMIN
 * - COORDINADOR_OPERACIONES
 */
export const pppoeRoute: Route = {
  icon: Router,
  label: "PPPoE",
  submenu: [
    {
      icon: Users,
      label: "Cuentas PPPoE",
      href: "/crm/pppoe/cuentas",
    },
    {
      icon: NetworkChartFilled,
      label: "Perfiles Homologados",
      href: "/crm/pppoe/homologacion-perfiles",
    },
  ],
};

/**
 * Administración PPPoE operativa.
 *
 * OFICINA puede administrar cuentas, suspender,
 * reactivar y activar, pero no administrar
 * homologaciones.
 */
export const pppoeOficinaRoute: Route = {
  icon: Router,
  label: "PPPoE",
  submenu: [
    {
      icon: Users,
      label: "Cuentas PPPoE",
      href: "/crm/pppoe/cuentas",
    },
  ],
};

export const instalacionesTecnicoRoute: Route = {
  icon: ListAltCheckOutline,
  label: "Instalaciones Asignadas",
  href: "/crm/instalaciones/tecnico",
};

export const ticketsTecnicoRoute: Route = {
  icon: ListAltCheckOutline,
  label: "Tickets Asignados",
  href: "/crm/tickets/tecnico",
};

export const soporteRoute: Route = {
  icon: MonitorSmartphone,
  label: "Soporte",
  submenu: [
    {
      icon: Ticket,
      label: "Tickets de Soporte",
      href: "/crm/tickets",
    },
    {
      icon: Target,
      label: "Metas de Soporte",
      href: "/crm/metas-soporte",
    },
    {
      icon: Tags,
      label: "Categorías de Soporte",
      href: "/crm/tags",
    },
  ],
};

export const soporteTicketsRoute: Route = {
  icon: MonitorSmartphone,
  label: "Soporte",
  submenu: [
    {
      icon: Ticket,
      label: "Tickets de Soporte",
      href: "/crm/tickets",
    },
  ],
};

export const desinstalacionesRoute: Route = {
  icon: AddMinus,
  label: "Desinstalaciones",
  submenu: [
    {
      icon: ListAltCheckOutline,
      label: "Desinstalaciones registradas",
      href: "/crm/desinstalaciones",
    },
    {
      icon: AlertShield,
      label: "Autorizaciones",
      href: "/crm/desinstalacion-auth",
    },
  ],
};

export const serviciosRoute: Route = {
  icon: Waypoints,
  label: "Servicios",
  submenu: [
    {
      icon: BadgeCheck,
      label: "Servicio Principal",
      href: "/crm-servicios-internet",
    },
    {
      icon: BadgePlus,
      label: "Servicios Adicionales",
      href: "/crm-servicios",
    },
  ],
};

export const facturacionZonaRoute: Route = {
  icon: MapPinned,
  label: "Facturación por Zona",
  href: "/crm-facturacion-zona",
};

export const sectoresRoute: Route = {
  icon: MapPin,
  label: "Sectores",
  href: "/crm-sectores",
};

export const botMensajeriaRoute: Route = {
  icon: WhatsappIcon,
  label: "Bot y Mensajería",
  submenu: [
    {
      icon: Bot,
      label: "Bot",
      href: "/crm/bot",
    },
    {
      icon: BotMessageSquare,
      label: "Mensajería Whatsapp",
      href: "/crm/bot/whatsapp?page=1",
    },
    {
      icon: GalleryHorizontal,
      label: "Galería",
      href: "crm/bot/whatsapp/galery",
    },
    {
      icon: MetaIcon,
      label: "Plantillas Meta",
      href: "/crm/whatsapp-campaign-templates",
    },
    {
      icon: MessageIcon,
      label: "Enviar campaña",
      href: "/crm/whatsapp-campaign-messaging",
    },
  ],
};

export const galeriaRoute: Route = {
  icon: WhatsappIcon,
  label: "Bot y Mensajería",
  submenu: [
    {
      icon: GalleryHorizontal,
      label: "Galería",
      href: "crm/bot/whatsapp/galery",
    },
  ],
};

export const plantillasContratosRoute: Route = {
  icon: FileText,
  label: "Plantillas contratos",
  href: "/crm-contrato-plantilla",
};

export const rutasCobroRoute: Route = {
  icon: MapIcon,
  label: "Rutas Cobro",
  submenu: [
    {
      icon: MapPin,
      label: "Rutas",
      href: "/crm/ruta",
    },
    {
      icon: ClipboardCheck,
      label: "Mis rutas",
      href: "/crm/rutas-asignadas",
    },
  ],
};

export const opticoRoute: Route = {
  icon: Cable,
  label: "Optico",
  submenu: [
    {
      icon: RouteLucide,
      label: "OLT",
      href: "/crm/olt",
    },
    {
      icon: Router,
      label: "Routers Mk",
      href: "crm/routers?tab=mk",
    },
  ],
};

export const creditosRoute: Route = {
  icon: Landmark,
  label: "Créditos",
  submenu: [
    {
      icon: NotebookPen,
      label: "Registrar Crédito",
      href: "/crm/credito",
    },
    {
      icon: FileText,
      label: "Créditos",
      href: "/crm/credito-registros",
    },
    {
      icon: FileType,
      label: "Contrato",
      href: "/crm/contrato",
    },
  ],
};

export const registrosEliminadosRoute: Route = {
  icon: MapIcon,
  label: "Registros eliminados",
  submenu: [
    {
      icon: MapPin,
      label: "Facturas eliminadas (demo)",
      href: "/crm/facturas-eliminadas",
    },
  ],
};

export const reportsRoute: Route = {
  icon: Sheet,
  label: "Reports",
  href: "/crm/reports",
};

export const perfilRoute: Route = {
  icon: User,
  label: "Perfil",
  href: "/crm/perfil",
};

export const usuariosRoute: Route = {
  icon: Users,
  label: "Usuarios",
  href: "/crm/usuarios",
};
