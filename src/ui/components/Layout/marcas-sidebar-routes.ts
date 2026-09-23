import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Box,
  Boxes,
  Building2,
  Calendar,
  CalendarPlus,
  CheckSquare,
  ClipboardList,
  Clock,
  CreditCard,
  FileClock,
  FileSpreadsheet,
  Home,
  MapPin,
  MapPinned,
  PackagePlus,
  PieChart,
  ShoppingBag,
  ShoppingCart,
  Star,
  Tags,
  Truck,
  UserCog,
  UserPlus,
  UserPlus2,
  Users,
  Wallet,
} from "lucide-react";

export type MarcasRoute = {
  icon: LucideIcon;
  label: string;
  href?: string;
  submenu?: MarcasRoute[];
};

const adminRoutes: MarcasRoute[] = [
  {
    icon: Home,
    label: "Dashboard",
    submenu: [
      {
        icon: Home,
        label: "Página principal",
        href: "/marcas-gt/dashboard",
      },
      {
        icon: PieChart,
        label: "Estadísticas y gráficos",
        href: "/marcas-gt/analisis",
      },
      {
        icon: FileSpreadsheet,
        label: "Informes y reportes",
        href: "/marcas-gt/reportes",
      },
      {
        icon: Wallet,
        label: "Balance de cuentas",
        href: "/marcas-gt/saldos",
      },
    ],
  },
  {
    icon: ShoppingBag,
    label: "Ventas y clientes",
    submenu: [
      {
        icon: ShoppingBag,
        label: "Nueva venta",
        href: "/marcas-gt/hacer-ventas",
      },
      {
        icon: ClipboardList,
        label: "Historial de ventas",
        href: "/marcas-gt/ventas",
      },
      {
        icon: Users,
        label: "Directorio de clientes",
        href: "/marcas-gt/clientes",
      },
      {
        icon: UserPlus,
        label: "Registrar cliente",
        href: "/marcas-gt/crear-cliente",
      },
      {
        icon: CreditCard,
        label: "Gestión de créditos",
        href: "/marcas-gt/creditos",
      },
    ],
  },
  {
    icon: MapPin,
    label: "Prospectos y visitas",
    submenu: [
      {
        icon: Calendar,
        label: "Registro de prospectos",
        href: "/marcas-gt/historial-prospectos",
      },
      {
        icon: MapPin,
        label: "Registro de visitas",
        href: "/marcas-gt/historial-visitas",
      },
      {
        icon: CalendarPlus,
        label: "Programar visita",
        href: "/marcas-gt/visita",
      },
      {
        icon: UserPlus2,
        label: "Nuevo prospecto",
        href: "/marcas-gt/prospecto",
      },
    ],
  },
  {
    icon: Users,
    label: "Empleados",
    submenu: [
      {
        icon: UserCog,
        label: "Administración de usuarios",
        href: "/marcas-gt/usuarios",
      },
      {
        icon: MapPinned,
        label: "Ubicación de empleados",
        href: "/marcas-gt/empleados",
      },
      {
        icon: FileClock,
        label: "Control de asistencia",
        href: "/marcas-gt/historial-empleados-check",
      },
      {
        icon: Clock,
        label: "Registro de jornada",
        href: "/marcas-gt/registrar-entrada-salida",
      },
    ],
  },
  {
    icon: Boxes,
    label: "Inventario",
    submenu: [
      {
        icon: Boxes,
        label: "Catálogo de productos",
        href: "/marcas-gt/ver-productos",
      },
      {
        icon: PackagePlus,
        label: "Nuevo producto",
        href: "/marcas-gt/crear-productos",
      },
      {
        icon: Tags,
        label: "Categorías de productos",
        href: "/marcas-gt/crear-categoria",
      },
      {
        icon: BarChart3,
        label: "Control de inventario",
        href: "/marcas-gt/asignar-stock",
      },
      {
        icon: Truck,
        label: "Directorio de proveedores",
        href: "/marcas-gt/proveedor",
      },
      {
        icon: Box,
        label: "Registro de entregas",
        href: "/marcas-gt/registro-entregas",
      },
    ],
  },
  {
    icon: Building2,
    label: "Empresa",
    submenu: [
      {
        icon: Building2,
        label: "Información corporativa",
        href: "/marcas-gt/empresa-info",
      },
    ],
  },
];

const sellerRoutes: MarcasRoute[] = [
  {
    icon: Home,
    label: "Inicio del empleado",
    href: "/marcas-gt/dashboard-empleado",
  },
  {
    icon: ShoppingBag,
    label: "Realizar venta",
    href: "/marcas-gt/hacer-ventas",
  },
  {
    icon: Users,
    label: "Gestión de clientes",
    href: "/marcas-gt/clientes",
  },
  {
    icon: CheckSquare,
    label: "Registro de entrada/salida",
    href: "/marcas-gt/registrar-entrada-salida",
  },
  {
    icon: MapPin,
    label: "Registrar visita",
    href: "/marcas-gt/visita",
  },
  {
    icon: Star,
    label: "Registrar prospecto",
    href: "/marcas-gt/prospecto",
  },
  {
    icon: ShoppingCart,
    label: "Mis ventas",
    href: "/marcas-gt/mis-ventas",
  },
];

export function getMarcasRoutesByRole(role?: string | null) {
  return role === "ADMIN" ? adminRoutes : sellerRoutes;
}
