// Sidebar organizado por grupos con accesibilidad y estética
import {
  BarChart3,
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
  Star,
  Tags,
  Truck,
  UserCog,
  UserPlus,
  UserPlus2,
  Wallet,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ShoppingCart, Users, Box } from "lucide-react";
import { useStore } from "@/Context/ContextSucursal";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const adminGroups = [
  {
    label: "Dashboard",
    items: [
      { icon: Home, label: "Página Principal", href: "/" },
      {
        icon: PieChart,
        label: "Estadísticas y Gráficos",
        href: "/marcas-gt/analisis",
      },
      {
        icon: FileSpreadsheet,
        label: "Informes y Reportes",
        href: "/marcas-gt/reportes",
      },
      { icon: Wallet, label: "Balance de Cuentas", href: "/marcas-gt/saldos" },
    ],
  },
  {
    label: "Ventas y Clientes",
    items: [
      {
        icon: ShoppingBag,
        label: "Nueva Venta",
        href: "/marcas-gt/hacer-ventas",
      },
      {
        icon: ClipboardList,
        label: "Historial de Ventas",
        href: "/marcas-gt/ventas",
      },
      {
        icon: Users,
        label: "Directorio de Clientes",
        href: "/marcas-gt/clientes",
      },
      {
        icon: UserPlus,
        label: "Registrar Cliente",
        href: "/marcas-gt/crear-cliente",
      },
      {
        icon: CreditCard,
        label: "Gestión de Créditos",
        href: "/marcas-gt/creditos",
      },
    ],
  },
  {
    label: "Prospectos y Visitas",
    items: [
      {
        icon: Calendar,
        label: "Registro de Prospectos",
        href: "/marcas-gt/historial-prospectos",
      },
      {
        icon: MapPin,
        label: "Registro de Visitas",
        href: "/marcas-gt/historial-visitas",
      },
      {
        icon: CalendarPlus,
        label: "Programar Visita",
        href: "/marcas-gt/visita",
      },
      {
        icon: UserPlus2,
        label: "Nuevo Prospecto",
        href: "/marcas-gt/prospecto",
      },
    ],
  },
  {
    label: "Empleados",
    items: [
      {
        icon: UserCog,
        label: "Administración de Usuarios",
        href: "/marcas-gt/usuarios",
      },
      {
        icon: MapPinned,
        label: "Ubicación de Empleados",
        href: "/marcas-gt/empleados",
      },
      {
        icon: FileClock,
        label: "Control de Asistencia",
        href: "/marcas-gt/historial-empleados-check",
      },
      {
        icon: Clock,
        label: "Registro de Jornada",
        href: "/marcas-gt/registrar-entrada-salida",
      },
    ],
  },
  {
    label: "Inventario",
    items: [
      {
        icon: Boxes,
        label: "Catálogo de Productos",
        href: "/marcas-gt/ver-productos",
      },
      {
        icon: PackagePlus,
        label: "Nuevo Producto",
        href: "/marcas-gt/crear-productos",
      },
      {
        icon: Tags,
        label: "Categorías de Productos",
        href: "/marcas-gt/crear-categoria",
      },
      {
        icon: BarChart3,
        label: "Control de Inventario",
        href: "/marcas-gt/asignar-stock",
      },
      {
        icon: Truck,
        label: "Directorio de Proveedores",
        href: "/marcas-gt/proveedor",
      },
      {
        icon: Box,
        label: "Registro de Entregas",
        href: "/marcas-gt/registro-entregas",
      },
    ],
  },
  {
    label: "Empresa",
    items: [
      {
        icon: Building2,
        label: "Información Corporativa",
        href: "/marcas-gt/empresa-info",
      },
    ],
  },
];

const vendedorRoutes = [
  {
    icon: Home,
    label: "Inicio del Empleado",
    href: "/marcas-gt/dashboard-empleado",
  },
  {
    icon: ShoppingBag,
    label: "Realizar Venta",
    href: "/marcas-gt/hacer-ventas",
  },
  { icon: Users, label: "Gestión de Clientes", href: "/marcas-gt/clientes" },
  {
    icon: CheckSquare,
    label: "Registro de Entrada/Salida",
    href: "/marcas-gt/registrar-entrada-salida",
  },
  { icon: MapPin, label: "Registrar Visita", href: "/marcas-gt/visita" },
  { icon: Star, label: "Registrar Prospecto", href: "/marcas-gt/prospecto" },
  { icon: ShoppingCart, label: "Mis Ventas", href: "/marcas-gt/mis-ventas" },
];

export function AppSidebar() {
  const rolUser = useStore((state) => state.userRol);

  const isAdmin = rolUser === "ADMIN";

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <div className="overflow-y-auto">
          {isAdmin ? (
            adminGroups.map((group) => (
              <SidebarGroup key={group.label}>
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton asChild>
                          <Link
                            to={item.href}
                            className="flex items-center gap-2"
                          >
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <item.icon className="h-4 w-4 shrink-0" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{item.label}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))
          ) : (
            <SidebarGroup>
              <SidebarGroupLabel>Empleado</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {vendedorRoutes.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton asChild>
                        <Link
                          to={item.href}
                          className="flex items-center gap-2"
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <item.icon className="h-4 w-4 shrink-0" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{item.label}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
