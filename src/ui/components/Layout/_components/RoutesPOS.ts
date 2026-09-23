// import {
//   ShoppingCart,
//   Package,
//   Users,
//   Box,
//   AlertCircle,
//   Clock,
//   Building,
//   CircleUser,
//   NotebookIcon,
//   SendToBackIcon,
//   NotepadText,
//   FileStack,
//   LucideIcon,
// } from "lucide-react";
// import {
//   Home,
//   ShieldCheck,
//   Ticket,
//   Wallet,
//   ClipboardList,
//   NotebookText,
//   CoinsIcon,
//   Bolt,
//   ClipboardPen,
//   FileText,
//   CreditCard,
//   WrenchIcon,
//   PackageOpen,
//   Tag,
//   Building2,
//   FileSpreadsheet,
//   Target,
//   Goal,
// } from "lucide-react";

// export interface Route {
//   icon: LucideIcon;
//   label: string;
//   href?: string;
//   submenu?: Route[];
// }

// export const menuVendedor = [
//   // Sección de Ventas
//   { icon: Home, label: "Home", href: "/" },
//   { icon: ShoppingCart, label: "Punto de Venta", href: "/punto-venta" },
//   { icon: Clock, label: "Historial de Ventas", href: "/historial/ventas" },

//   // Sección de Inventario y Stock
//   {
//     icon: Package,
//     label: "Inventario y Stock",
//     submenu: [
//       { icon: Package, label: "Inventario", href: "/inventario" },
//       {
//         icon: NotepadText,
//         label: "Historial Cambios Precio",
//         href: "/historial-cambios-precio",
//       },
//       {
//         icon: FileStack,
//         label: "Stock Eliminaciones",
//         href: "/stock-eliminaciones",
//       },
//       {
//         icon: ClipboardPen,
//         label: "Ventas Eliminaciones",
//         href: "/historial/ventas-eliminaciones",
//       },
//     ],
//   },

//   // Sección de Clientes
//   { icon: Users, label: "Clientes", href: "/clientes-manage" },

//   // Vencimientos
//   { icon: AlertCircle, label: "Vencimientos", href: "/vencimientos" },
//   { icon: ShieldCheck, label: "Garantía Manage", href: "/garantia/manage" },
//   { icon: CreditCard, label: "Créditos", href: "/creditos" },
//   { icon: WrenchIcon, label: "Reparaciones", href: "/reparaciones" },
// ];

// export const menuItemsAdmin = [
//   // Sección de Ventas
//   { icon: Home, label: "Home", href: "/" },
//   { icon: ShoppingCart, label: "Punto de Venta", href: "/punto-venta" },
//   { icon: Clock, label: "Historial de Ventas", href: "/historial/ventas" },
//   // Sección de Inventario y Stock con submenú
//   {
//     icon: Package,
//     label: "Inventario y Stock",
//     submenu: [
//       { icon: PackageOpen, label: "Inventario", href: "/inventario" },

//       { icon: Box, label: "Añadir Stock", href: "/adicion-stock" },
//       {
//         icon: NotepadText,
//         label: "Historial Cambios Precio",
//         href: "/historial-cambios-precio",
//       },
//       {
//         icon: FileStack,
//         label: "Stock Eliminaciones",
//         href: "/stock-eliminaciones",
//       },
//       { icon: NotebookIcon, label: "Entregas Stock", href: "/entregas-stock" },
//     ],
//   },

//   { icon: Tag, label: "Categorías", href: "/categorias" },

//   // Vencimientos
//   { icon: AlertCircle, label: "Vencimientos", href: "/vencimientos" },

//   // Sección de Transferencias
//   {
//     icon: SendToBackIcon,
//     label: "Transferencias",
//     submenu: [
//       {
//         icon: NotepadText,
//         label: "Transferir Productos",
//         href: "/transferencia",
//       },
//       {
//         icon: NotepadText,
//         label: "Transferencia Historial",
//         href: "/transferencia-historial",
//       },
//     ],
//   },

//   // Sección de Clientes y Proveedores con submenú
//   {
//     icon: Users,
//     label: "Clientes y Proveedores",
//     submenu: [
//       { icon: Users, label: "Clientes", href: "/clientes-manage" },
//       { icon: CircleUser, label: "Proveedores", href: "/agregar-proveedor" },
//     ],
//   },

//   // Sección de Sucursales
//   {
//     icon: Building,
//     label: "Sucursales",
//     submenu: [{ icon: Building, label: "Mis Sucursales", href: "/sucursal" }],
//   },
//   // Gestión de Garantías y Tickets
//   {
//     icon: ShieldCheck,
//     label: "Garantía y Ticket",
//     submenu: [
//       { icon: ShieldCheck, label: "Garantía Manage", href: "/garantia/manage" },
//       { icon: Ticket, label: "Ticket Manage", href: "/ticket/manage" },
//     ],
//   },

//   // Gestión de Caja
//   {
//     icon: Wallet,
//     label: "Caja",
//     submenu: [
//       {
//         icon: Wallet,
//         label: "Depósitos y Egresos",
//         href: "/depositos-egresos/",
//       },
//       { icon: ClipboardList, label: "Registrar Caja", href: "/registro-caja/" },
//       {
//         icon: NotebookText,
//         label: "Registros de Caja",
//         href: "/registros-caja/",
//       },
//       {
//         icon: CoinsIcon,
//         label: "Saldo y Egresos",
//         href: "/historial/depositos-egresos",
//       },
//     ],
//   },

//   // Configuración
//   // Ventas Eliminaciones y Plantillas de Créditos
//   {
//     icon: ClipboardPen,
//     label: "Gestión de Ventas",
//     submenu: [
//       {
//         icon: ClipboardPen,
//         label: "Ventas Eliminaciones",
//         href: "/historial/ventas-eliminaciones",
//       },
//       {
//         icon: FileText,
//         label: "Plantillas de Créditos",
//         href: "/plantillas-venta-cuotas",
//       },
//     ],
//   },

//   // Créditos
//   { icon: CreditCard, label: "Créditos", href: "/creditos" },
//   { icon: WrenchIcon, label: "Reparaciones", href: "/reparaciones" },

//   { icon: Target, label: "Metas", href: "/metas" },
//   { icon: Goal, label: "Mis Metas", href: "/mis-metas" },

//   { icon: Building2, label: "Resumen sucursales", href: "/sumary" },

//   { icon: FileSpreadsheet, label: "Reportes", href: "/reportes" },

//   { icon: Bolt, label: "Config", href: "/config/user" },
// ];

// // --- POS -------------------------------------------------
// export const POS_ROUTES: Record<string, Route[]> = {
//   ADMIN: menuItemsAdmin,
//   SUPER_ADMIN: menuItemsAdmin,
//   VENDEDOR: menuVendedor,
//   DEFAULT: menuVendedor,
// };
