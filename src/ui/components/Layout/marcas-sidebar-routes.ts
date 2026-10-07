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
  Landmark,
  MapPin,
  MapPinned,
  PackageCheck,
  PackagePlus,
  PencilLine,
  PieChart,
  ShoppingBag,
  ShoppingCart,
  RotateCcw,
  ReceiptText,
  Settings2,
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
  activePaths?: string[];
  exactPaths?: string[];
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
        icon: ShoppingCart,
        label: "Pedidos",
        href: "/marcas-gt/pedidos",
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
        label: "Solicitudes de crédito",
        href: "/marcas-gt/creditos",
        exactPaths: ["/marcas-gt/creditos"],
        activePaths: ["/marcas-gt/creditos/solicitudes"],
      },
      {
        icon: Landmark,
        label: "Cartera de crédito",
        href: "/marcas-gt/creditos/cartera",
        activePaths: ["/marcas-gt/creditos/cartera"],
      },
      {
        icon: Settings2,
        label: "Políticas de crédito",
        href: "/marcas-gt/creditos/politicas",
        activePaths: ["/marcas-gt/creditos/politicas"],
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
        icon: Building2,
        label: "Bodegas",
        href: "/marcas-gt/bodegas",
      },
      {
        icon: BarChart3,
        label: "Existencias",
        href: "/marcas-gt/inventario",
      },
      {
        icon: ClipboardList,
        label: "Requisiciones",
        href: "/marcas-gt/requisiciones",
        activePaths: ["/marcas-gt/requisiciones"],
      },
      {
        icon: Boxes,
        label: "Consultar disponibilidad",
        href: "/marcas-gt/inventario/disponibilidad",
      },
      {
        icon: FileClock,
        label: "Movimientos",
        href: "/marcas-gt/inventario/movimientos",
      },
      {
        icon: ClipboardList,
        label: "Reservas",
        href: "/marcas-gt/inventario/reservas",
      },
      {
        icon: Truck,
        label: "Despachos",
        href: "/marcas-gt/despachos",
      },
      {
        icon: PackagePlus,
        label: "Registrar entrada",
        href: "/marcas-gt/inventario/entradas/nueva",
      },
      {
        icon: PencilLine,
        label: "Ajustar inventario",
        href: "/marcas-gt/inventario/ajustes/nuevo",
      },
      {
        icon: RotateCcw,
        label: "Registrar devolución",
        href: "/marcas-gt/inventario/devoluciones/nueva",
      },
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
    icon: Truck,
    label: "Logística",
    submenu: [
      {
        icon: Truck,
        label: "Envíos",
        href: "/marcas-gt/transporte/envios",
      },
      {
        icon: PackageCheck,
        label: "Entregas",
        href: "/marcas-gt/entregas",
      },
      {
        icon: Users,
        label: "Transportistas",
        href: "/marcas-gt/transporte/transportistas",
      },
      {
        icon: Truck,
        label: "Vehículos",
        href: "/marcas-gt/transporte/vehiculos",
      },
      {
        icon: UserCog,
        label: "Conductores",
        href: "/marcas-gt/transporte/conductores",
      },
    ],
  },
  {
    icon: ReceiptText,
    label: "Finanzas",
    submenu: [
      {
        icon: ReceiptText,
        label: "Facturación",
        href: "/marcas-gt/facturacion/facturas",
      },
      {
        icon: Landmark,
        label: "Cuentas por cobrar",
        href: "/marcas-gt/facturacion/cuentas-por-cobrar",
      },
      {
        icon: Wallet,
        label: "Pagos",
        href: "/marcas-gt/pagos",
      },
      {
        icon: Building2,
        label: "Bancos",
        href: "/marcas-gt/pagos/bancos",
      },
      {
        icon: Settings2,
        label: "Configuración fiscal",
        href: "/marcas-gt/facturacion/configuracion-fiscal",
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
    icon: ShoppingCart,
    label: "Pedidos",
    href: "/marcas-gt/pedidos",
  },
  {
    icon: Truck,
    label: "Despachos",
    href: "/marcas-gt/despachos",
  },
  {
    icon: Truck,
    label: "Envíos",
    href: "/marcas-gt/transporte/envios",
  },
  {
    icon: PackageCheck,
    label: "Entregas",
    href: "/marcas-gt/entregas",
  },
  {
    icon: ReceiptText,
    label: "Finanzas",
    submenu: [
      {
        icon: ReceiptText,
        label: "Facturas",
        href: "/marcas-gt/facturacion/facturas",
      },
      {
        icon: Landmark,
        label: "Cuentas por cobrar",
        href: "/marcas-gt/facturacion/cuentas-por-cobrar",
      },
      {
        icon: Wallet,
        label: "Pagos",
        href: "/marcas-gt/pagos",
      },
    ],
  },
  {
    icon: CreditCard,
    label: "Solicitudes de crédito",
    href: "/marcas-gt/creditos",
    exactPaths: ["/marcas-gt/creditos"],
        activePaths: ["/marcas-gt/creditos/solicitudes"],
  },
  {
    icon: Landmark,
    label: "Cartera de crédito",
    href: "/marcas-gt/creditos/cartera",
    activePaths: ["/marcas-gt/creditos/cartera"],
  },
  {
    icon: Settings2,
    label: "Políticas de crédito",
    href: "/marcas-gt/creditos/politicas",
    activePaths: ["/marcas-gt/creditos/politicas"],
  },
  {
    icon: Users,
    label: "Gestión de clientes",
    href: "/marcas-gt/clientes",
  },
  {
    icon: Boxes,
    label: "Disponibilidad de productos",
    href: "/marcas-gt/inventario/disponibilidad",
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

const warehouseRoutes: MarcasRoute[] = [
  {
    icon: Home,
    label: "Inicio",
    href: "/marcas-gt/dashboard-empleado",
  },
  {
    icon: ShoppingCart,
    label: "Pedidos",
    href: "/marcas-gt/pedidos",
  },
  {
    icon: Boxes,
    label: "Operación de bodega",
    submenu: [
      {
        icon: Building2,
        label: "Bodegas",
        href: "/marcas-gt/bodegas",
      },
      {
        icon: BarChart3,
        label: "Existencias",
        href: "/marcas-gt/inventario",
      },
      {
        icon: ClipboardList,
        label: "Requisiciones",
        href: "/marcas-gt/requisiciones",
        activePaths: ["/marcas-gt/requisiciones"],
      },
      {
        icon: Boxes,
        label: "Consultar disponibilidad",
        href: "/marcas-gt/inventario/disponibilidad",
      },
      {
        icon: FileClock,
        label: "Movimientos",
        href: "/marcas-gt/inventario/movimientos",
      },
      {
        icon: ClipboardList,
        label: "Reservas",
        href: "/marcas-gt/inventario/reservas",
      },
      {
        icon: Truck,
        label: "Despachos",
        href: "/marcas-gt/despachos",
      },
      {
        icon: PackagePlus,
        label: "Registrar entrada",
        href: "/marcas-gt/inventario/entradas/nueva",
      },
      {
        icon: PencilLine,
        label: "Ajustar inventario",
        href: "/marcas-gt/inventario/ajustes/nuevo",
      },
      {
        icon: RotateCcw,
        label: "Registrar devolución",
        href: "/marcas-gt/inventario/devoluciones/nueva",
      },
    ],
  },
  {
    icon: Truck,
    label: "Logística",
    submenu: [
      {
        icon: Truck,
        label: "Envíos",
        href: "/marcas-gt/transporte/envios",
      },
      {
        icon: PackageCheck,
        label: "Entregas",
        href: "/marcas-gt/entregas",
      },
      {
        icon: Users,
        label: "Transportistas",
        href: "/marcas-gt/transporte/transportistas",
      },
      {
        icon: Truck,
        label: "Vehículos",
        href: "/marcas-gt/transporte/vehiculos",
      },
      {
        icon: UserCog,
        label: "Conductores",
        href: "/marcas-gt/transporte/conductores",
      },
    ],
  },
];

const accountingRoutes: MarcasRoute[] = [
  {
    icon: Home,
    label: "Inicio",
    href: "/marcas-gt/dashboard-empleado",
  },
  {
    icon: ShoppingCart,
    label: "Pedidos",
    href: "/marcas-gt/pedidos",
  },
  {
    icon: CreditCard,
    label: "Créditos",
    submenu: [
      {
        icon: ClipboardList,
        label: "Solicitudes de crédito",
        href: "/marcas-gt/creditos",
        exactPaths: ["/marcas-gt/creditos"],
        activePaths: ["/marcas-gt/creditos/solicitudes"],
      },
      {
        icon: Landmark,
        label: "Cartera de crédito",
        href: "/marcas-gt/creditos/cartera",
        activePaths: ["/marcas-gt/creditos/cartera"],
      },
      {
        icon: Settings2,
        label: "Políticas de crédito",
        href: "/marcas-gt/creditos/politicas",
        activePaths: ["/marcas-gt/creditos/politicas"],
      },
    ],
  },
  {
    icon: Boxes,
    label: "Inventario",
    submenu: [
      {
        icon: Building2,
        label: "Bodegas",
        href: "/marcas-gt/bodegas",
      },
      {
        icon: BarChart3,
        label: "Existencias",
        href: "/marcas-gt/inventario",
      },
      {
        icon: ClipboardList,
        label: "Requisiciones",
        href: "/marcas-gt/requisiciones",
        activePaths: ["/marcas-gt/requisiciones"],
      },
      {
        icon: Boxes,
        label: "Consultar disponibilidad",
        href: "/marcas-gt/inventario/disponibilidad",
      },
      {
        icon: FileClock,
        label: "Movimientos",
        href: "/marcas-gt/inventario/movimientos",
      },
      {
        icon: Truck,
        label: "Despachos",
        href: "/marcas-gt/despachos",
      },
    ],
  },
  {
    icon: Truck,
    label: "Logística",
    submenu: [
      {
        icon: Truck,
        label: "Envíos",
        href: "/marcas-gt/transporte/envios",
      },
      {
        icon: PackageCheck,
        label: "Entregas",
        href: "/marcas-gt/entregas",
      },
      {
        icon: Users,
        label: "Transportistas",
        href: "/marcas-gt/transporte/transportistas",
      },
      {
        icon: Truck,
        label: "Vehículos",
        href: "/marcas-gt/transporte/vehiculos",
      },
      {
        icon: UserCog,
        label: "Conductores",
        href: "/marcas-gt/transporte/conductores",
      },
    ],
  },
  {
    icon: ReceiptText,
    label: "Finanzas",
    submenu: [
      {
        icon: ReceiptText,
        label: "Facturación",
        href: "/marcas-gt/facturacion/facturas",
      },
      {
        icon: Landmark,
        label: "Cuentas por cobrar",
        href: "/marcas-gt/facturacion/cuentas-por-cobrar",
      },
      {
        icon: Wallet,
        label: "Pagos",
        href: "/marcas-gt/pagos",
      },
      {
        icon: Building2,
        label: "Bancos",
        href: "/marcas-gt/pagos/bancos",
      },
      {
        icon: Settings2,
        label: "Configuración fiscal",
        href: "/marcas-gt/facturacion/configuracion-fiscal",
      },
    ],
  },
];

const deliveryRoutes: MarcasRoute[] = [
  {
    icon: Home,
    label: "Inicio",
    href: "/marcas-gt/dashboard-empleado",
  },
  {
    icon: Truck,
    label: "Mis envíos",
    href: "/marcas-gt/transporte/envios",
  },
  {
    icon: PackageCheck,
    label: "Mis entregas",
    href: "/marcas-gt/entregas",
  },
  {
    icon: CheckSquare,
    label: "Registro de entrada/salida",
    href: "/marcas-gt/registrar-entrada-salida",
  },
];

export function getMarcasRoutesByRole(role?: string | null) {
  if (role === "ADMIN") return adminRoutes;
  if (role === "BODEGA") return warehouseRoutes;
  if (role === "CONTABILIDAD") return accountingRoutes;
  if (role === "REPARTIDOR") return deliveryRoutes;

  return sellerRoutes;
}
