import "./App.css";
import Login from "./components/Auth/Login";
import Dashboard from "./Pages/Dashboard";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import CreateUser from "./components/Auth/CreateUser";
import { Toaster } from "sonner";
import Customers from "./Pages/Customers";
import Users from "./Pages/Users";
import Sales from "./Pages/Sales";
import Employees from "./Pages/Employees";
import SellerHistory from "./Pages/SellerHistory";
import CreateProduct from "./Pages/CreateProduct";
import StockPage from "./Pages/StockPage";
import ViewProducts from "./Pages/ViewProducts";
import MakeSale from "./Pages/MakeSale";
import CheckInCheckOut from "./Pages/CheckInCheckOut";
import CrearCategoria from "./Pages/CrearCategoria";
import CrearProveedor from "./Pages/CrearProveedor";
import StockDeliveryRecords from "./Pages/StockDeliveryRecords";
import CreateClient from "./Pages/CreateClient";
import ProspectoFormulario from "./Pages/ProspectoFormulario";
import ProspectoHistorial from "./Pages/ProspectoHistorial";
import ProspectoUbicacion from "./Pages/MapProspect/ProspectoUbicacion";
import PdfPage from "./components/PDF/PdfPage";
// import DeliveryPdfPage from "./components/PDF/DeliveryPdfPage";
import EditCustomer from "./Pages/Tools/EditCustomer";
import {
  ProtectedRoute,
  ProtectedRouteRoles,
} from "./components/Auth/ProtectedRoute";
import DashboardEmp from "./Pages/DashboardEmployee/DashboardEmp";
import { ProtectedRouteAdmin } from "./components/Auth/ProtectedRouteAdmin";
import MySales from "./Pages/EmployePages/MySales";
import RegistroVisita from "./Pages/RegistroVisita";
import VisitasTable from "./Pages/Dates/VisitasTable";
import CustomerSales from "./Pages/CustomerSales/CustomerSales";
import { MarcasLayout } from "./ui/components/Layout/layout-marcas";
import VentaPdfPage from "./components/PDF/VentasPDF/VentaPdfPage";
import EmpresaForm from "./Pages/Empresa/EmpresaForm";
import ChatsAnalytics from "./Pages/Analytics/ChatsAnalytics";
import Reportes from "./Pages/Reportes/Reportes";
import RestablecerContrasena from "./Pages/Recovery/RestablecerContrasena";
import Saldos from "./Pages/Saldos/Saldos";
import PaymentCreditPage from "./components/PDF/PDF CREDITOS/PaymentCreditPage";
import Creditos from "./Pages/Creditos/Creditos";
import Cancelados from "./Pages/Cancelados/Cancelados";
import BodegasPage from "./Pages/Bodegas/BodegasPage";
import CreateBodegaPage from "./Pages/Bodegas/CreateBodegaPage";
import BodegaDetailsPage from "./Pages/Bodegas/BodegaDetailsPage";
import EditBodegaPage from "./Pages/Bodegas/EditBodegaPage";
import BodegaResponsiblePage from "./Pages/Bodegas/BodegaResponsiblePage";
import DeactivateBodegaPage from "./Pages/Bodegas/DeactivateBodegaPage";
import InventoryPage from "./Pages/Inventario/InventoryPage";
import InventoryAvailabilityPage from "./Pages/Inventario/InventoryAvailabilityPage";
import InventoryMovementsPage from "./Pages/Inventario/InventoryMovementsPage";
import InventoryStockDetailPage from "./Pages/Inventario/InventoryStockDetailPage";
import InventoryProductPage from "./Pages/Inventario/InventoryProductPage";
import InventoryReservationsPage from "./Pages/Inventario/InventoryReservationsPage";
import InventoryReservationDetailPage from "./Pages/Inventario/InventoryReservationDetailPage";
import CreateInventoryReservationPage from "./Pages/Inventario/CreateInventoryReservationPage";
import RegisterInventoryEntryPage from "./Pages/Inventario/RegisterInventoryEntryPage";
import AdjustInventoryPage from "./Pages/Inventario/AdjustInventoryPage";
import RegisterInventoryReturnPage from "./Pages/Inventario/RegisterInventoryReturnPage";
import ReleaseInventoryReservationPage from "./Pages/Inventario/ReleaseInventoryReservationPage";
import CancelInventoryReservationPage from "./Pages/Inventario/CancelInventoryReservationPage";
import OrdersPage from "./Pages/Pedidos/OrdersPage";
import CreateOrderPage from "./Pages/Pedidos/CreateOrderPage";
import OrderDetailPage from "./Pages/Pedidos/OrderDetailPage";
import EditOrderPage from "./Pages/Pedidos/EditOrderPage";
import CancelOrderPage from "./Pages/Pedidos/CancelOrderPage";
// import MakeSalePage from "./Pages/MakeSales/MakeSalePage";
function App() {
  return (
    <>
      <Router>
        {/* Notificaciones */}
        <Toaster
          position="top-right"
          richColors={true}
          duration={3000}
          closeButton={true}
        />

        <Routes>
          {/* Redirecciona a dashboard */}
          <Route path="/" element={<Navigate to="/marcas-gt/dashboard" />} />

          {/* Rutas no protegidas */}
          <Route path="/marcas-gt/login" element={<Login />} />
          <Route path="/marcas-gt/register" element={<CreateUser />} />

          {/* Rutas protegidas con Layout */}
          <Route element={<MarcasLayout />}>
            <Route
              path="/marcas-gt/dashboard"
              element={
                <ProtectedRouteAdmin>
                  <Dashboard />
                </ProtectedRouteAdmin>
              }
            />

            <Route
              path="/marcas-gt/dashboard-empleado"
              element={
                <ProtectedRoute>
                  <DashboardEmp />
                </ProtectedRoute>
              }
            />

            <Route
              path="/marcas-gt/bodegas"
              element={
                <ProtectedRoute>
                  <BodegasPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marcas-gt/bodegas/nueva"
              element={
                <ProtectedRouteAdmin>
                  <CreateBodegaPage />
                </ProtectedRouteAdmin>
              }
            />
            <Route
              path="/marcas-gt/bodegas/:id"
              element={
                <ProtectedRoute>
                  <BodegaDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marcas-gt/bodegas/:id/editar"
              element={
                <ProtectedRouteAdmin>
                  <EditBodegaPage />
                </ProtectedRouteAdmin>
              }
            />
            <Route
              path="/marcas-gt/bodegas/:id/responsable"
              element={
                <ProtectedRouteAdmin>
                  <BodegaResponsiblePage />
                </ProtectedRouteAdmin>
              }
            />
            <Route
              path="/marcas-gt/bodegas/:id/desactivar"
              element={
                <ProtectedRouteAdmin>
                  <DeactivateBodegaPage />
                </ProtectedRouteAdmin>
              }
            />

            <Route
              path="/marcas-gt/inventario"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA", "CONTABILIDAD"]}>
                  <InventoryPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/inventario/disponibilidad"
              element={
                <ProtectedRouteRoles
                  roles={["ADMIN", "BODEGA", "CONTABILIDAD", "VENDEDOR"]}
                >
                  <InventoryAvailabilityPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/inventario/movimientos"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA", "CONTABILIDAD"]}>
                  <InventoryMovementsPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/inventario/stocks/:id"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA", "CONTABILIDAD"]}>
                  <InventoryStockDetailPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/inventario/productos/:productoId"
              element={
                <ProtectedRouteRoles
                  roles={["ADMIN", "BODEGA", "CONTABILIDAD", "VENDEDOR"]}
                >
                  <InventoryProductPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/inventario/reservas"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <InventoryReservationsPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/inventario/reservas/nueva"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <CreateInventoryReservationPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/inventario/reservas/:id"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <InventoryReservationDetailPage />
                </ProtectedRouteRoles>
              }
            />
        </Routes>
      </Router>
    </>
  );
}

// ACTUALIZAR LA CREACION DE CLIENTES,
// Creacion de flujo de visita a cliente,
// Solucionar el error de prospectos historial mapa,
// Filtros,
// Check empleados historial, mejorar y filtros,
// Mejorar el card de venta, modelar el PDF, poner filtros,
// gestion de unstable_useViewTransitionState mejorar,
// clientes mejorar vista, filtros,
// dashboard, poner totales y otros
// notificacines,
//PROVEEDORES MEJORAR
// flujo de peticion de porcentajes

export default App;
