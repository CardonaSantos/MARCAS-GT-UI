import { AddMinus } from "@/Crm/Icons/AddMinus";
import { AlertShield } from "@/Crm/Icons/AlertShield";
import { CustomIconProps, NetworkChartFilled } from "@/Crm/Icons/ChartNetWork";
import { ListAltCheckOutline } from "@/Crm/Icons/cheklist";
import { MessageIcon } from "@/Crm/Icons/MessageIcon";
import { MetaIcon } from "@/Crm/Icons/MetaIcon";
import { TwotoneAppRegistration } from "@/Crm/Icons/TwotoneAppRegistration";
import { WhatsappIcon } from "@/Crm/Icons/WhatsappIcon";
import {
  Home,
  Users,
  Ticket,
  FileText,
  UserPlus,
  Waypoints,
  Tags,
  MonitorSmartphone,
  MapIcon,
  MapPinned,
  MapPin,
  User,
  Target,
  ClipboardCheck,
  Sheet,
  Route,
  Router,
  Cable,
  Bot,
  BotMessageSquare,
  Landmark,
  NotebookPen,
  FileType,
  GalleryHorizontal,
  BadgeCheck,
  BadgePlus,
  LucideIcon,
} from "lucide-react";

import type { ComponentType, SVGProps } from "react";

export type AppRouteIconProps = Omit<
  SVGProps<SVGSVGElement>,
  "ref" | "size"
> & {
  size?: number;
};

export type AppRouteIcon = LucideIcon | ComponentType<CustomIconProps>;

export type Route = {
  icon: AppRouteIcon;

  label: string;

  href?: string;

  submenu?: Route[];
};

export const routesCrm_SuperAdmin = [
  {
    icon: Home,
    label: "Dashboard",
    href: "/crm",
  },
  // CLIENTES
  {
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
  },

  // INSTALACIONES
  {
    icon: TwotoneAppRegistration,
    label: "Instalaciones",
    submenu: [
      {
        icon: ListAltCheckOutline,
        label: "Instalaciones registradas",
        href: "/crm/instalaciones",
      },

      {
        icon: NetworkChartFilled,
        label: "Perfiles Homologados",
        href: "/crm/pppoe/homologacion-perfiles",
      },
    ],
  },
  // SOPORTE
  {
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
  },

  // INSTALACIONES
  {
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
  },

  {
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
  },

  {
    icon: MapPinned,
    label: "Facturación por Zona",
    href: "/crm-facturacion-zona",
  },
  {
    icon: MapPin,
    label: "Sectores",
    href: "/crm-sectores",
  },

  {
    icon: WhatsappIcon,
    label: "Bot y Mensajería",
    submenu: [
      { icon: Bot, label: "Bot", href: "/crm/bot" },
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
  },

  {
    icon: FileText,
    label: "Plantillas contratos",
    href: "/crm-contrato-plantilla",
  },

  {
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
  },

  {
    icon: Cable,
    label: "Optico",
    submenu: [
      {
        icon: Route,
        label: "OLT",
        href: "/crm/olt",
      },

      {
        icon: Router,
        label: "Routers Mk",
        href: "crm/routers?tab=mk",
      },
    ],
  },

  {
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
  },

  {
    icon: MapIcon,
    label: "Registros eliminados",
    submenu: [
      {
        icon: MapPin,
        label: "Facturas eliminadas (demo)",
        href: "/crm/facturas-eliminadas",
      },
    ],
  },

  { icon: Sheet, label: "Reports", href: "/crm/reports" },

  { icon: User, label: "Perfil", href: "/crm/perfil" },
  { icon: Users, label: "Usuarios", href: "/crm/usuarios" },
];

export const routesCrm_Admin = [
  { icon: Home, label: "Dashboard", href: "/crm" },

  {
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
  },

  {
    icon: MonitorSmartphone,
    label: "Soporte",
    submenu: [
      { icon: Ticket, label: "Tickets de Soporte", href: "/crm/tickets" },
      { icon: Target, label: "Metas de Soporte", href: "/crm/metas-soporte" },

      {
        icon: Tags,
        label: "Categorías de Soporte",
        href: "/crm/tags",
      },
    ],
  },
  {
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
  },

  {
    icon: MapPinned,
    label: "Facturación por Zona",
    href: "/crm-facturacion-zona",
  },
  {
    icon: MapPin,
    label: "Sectores",
    href: "/crm-sectores",
  },

  {
    icon: BotMessageSquare,
    label: "Bot y Mensajería",
    submenu: [
      { icon: Bot, label: "Bot", href: "/crm/bot" },
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
    ],
  },

  {
    icon: FileText,
    label: "Plantillas contratos",
    href: "/crm-contrato-plantilla",
  },

  {
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
  },

  {
    icon: Cable,
    label: "Optico",
    submenu: [
      {
        icon: Route,
        label: "OLT",
        href: "/crm/olt",
      },

      {
        icon: Router,
        label: "Routers Mk",
        href: "crm/routers?tab=mk",
      },
    ],
  },

  {
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
  },

  {
    icon: MapIcon,
    label: "Registros eliminados",
    submenu: [
      {
        icon: MapPin,
        label: "Facturas eliminadas (demo)",
        href: "/crm/facturas-eliminadas",
      },
    ],
  },

  { icon: Sheet, label: "Reports", href: "/crm/reports" },

  { icon: User, label: "Perfil", href: "/crm/perfil" },
];

export const routesCrm_Cobrador = [
  { icon: Home, label: "Dashboard", href: "/crm" },

  {
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
  },

  {
    icon: MonitorSmartphone,
    label: "Soporte",
    submenu: [
      { icon: Ticket, label: "Tickets de Soporte", href: "/crm/tickets" },
    ],
  },

  {
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
  },

  {
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
  },

  { icon: User, label: "Perfil", href: "/crm/perfil" },
];

export const routesCrm_Oficina = [
  { icon: User, label: "Perfil", href: "/crm/perfil" },
];

export const routesCrm_Tecnico = [
  { icon: Home, label: "Dashboard", href: "/crm/tec-dashboard" },
  {
    icon: ListAltCheckOutline,
    label: "Instalaciones Asignadas",
    href: "/crm/instalaciones/tecnico",
  },
  {
    icon: MonitorSmartphone,
    label: "Soporte",
    submenu: [
      { icon: Ticket, label: "Tickets de Soporte", href: "/crm/tickets" },
    ],
  },
  { icon: User, label: "Perfil", href: "/crm/perfil" },
];

export const routesCrm_Otro = [{ icon: Home, label: "Inicio", href: "/crm" }];

export const CRM_ROUTES: Record<string, Route[]> = {
  ADMIN: routesCrm_Admin,
  COBRADOR: routesCrm_Cobrador,
  TECNICO: routesCrm_Tecnico,
  OFICINA: routesCrm_Oficina,
  SUPER_ADMIN: routesCrm_SuperAdmin,
  DEFAULT: routesCrm_Otro,
};
