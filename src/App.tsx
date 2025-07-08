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
import HistorialVentas from "./Pages/SaleCard";
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
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import DashboardEmp from "./Pages/DashboardEmployee/DashboardEmp";
import { ProtectedRouteAdmin } from "./components/Auth/ProtectedRouteAdmin";
import MySales from "./Pages/EmployePages/MySales";
import RegistroVisita from "./Pages/RegistroVisita";
import VisitasTable from "./Pages/Dates/VisitasTable";
import CustomerSales from "./Pages/CustomerSales/CustomerSales";
import Layout2 from "./components/Layout/Layout2";
import VentaPdfPage from "./components/PDF/VentasPDF/VentaPdfPage";
import EmpresaForm from "./Pages/Empresa/EmpresaForm";
import ChatsAnalytics from "./Pages/Analytics/ChatsAnalytics";
import Reportes from "./Pages/Reportes/Reportes";
import RestablecerContrasena from "./Pages/Recovery/RestablecerContrasena";
import Saldos from "./Pages/Saldos/Saldos";
import PaymentCreditPage from "./components/PDF/PDF CREDITOS/PaymentCreditPage";
import Creditos from "./Pages/Creditos/Creditos";
import Cancelados from "./Pages/Cancelados/Cancelados";
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
          <Route element={<Layout2 />}>
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
              path="/marcas-gt/clientes"
              element={
                <ProtectedRoute>
                  <Customers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marcas-gt/usuarios"
              element={
                <ProtectedRouteAdmin>
                  <Users />
                </ProtectedRouteAdmin>
              }
            />
            <Route
              path="/marcas-gt/ventas"
              element={
                <ProtectedRouteAdmin>
                  <Sales />
                </ProtectedRouteAdmin>
              }
            />
            <Route
              path="/marcas-gt/comprobante-venta"
              element={
                <ProtectedRoute>
                  <PdfPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/marcas-gt/empleados"
              element={
                <ProtectedRouteAdmin>
                  <Employees />
                </ProtectedRouteAdmin>
              }
            />
            <Route
              path="/marcas-gt/historial-prospectos"
              element={
                <ProtectedRouteAdmin>
                  <ProspectoHistorial />
                </ProtectedRouteAdmin>
              }
            />
            <Route
              path="/marcas-gt/historial-empleados-check"
              element={
                <ProtectedRouteAdmin>
                  <SellerHistory />
                </ProtectedRouteAdmin>
              }
            />
            <Route
              path="/marcas-gt/crear-productos"
              element={
                <ProtectedRouteAdmin>
                  <CreateProduct />
                </ProtectedRouteAdmin>
              }
            />
            <Route
              path="/marcas-gt/asignar-stock"
              element={
                <ProtectedRouteAdmin>
                  <StockPage />
                </ProtectedRouteAdmin>
              }
            />
            <Route
              path="/marcas-gt/ver-productos"
              element={
                <ProtectedRouteAdmin>
                  <ViewProducts />
                </ProtectedRouteAdmin>
              }
            />
            <Route
              path="/marcas-gt/hacer-ventas"
              element={
                <ProtectedRoute>
                  <MakeSale />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marcas-gt/historial-ventas"
              element={
                <ProtectedRoute>
                  <HistorialVentas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marcas-gt/registrar-entrada-salida"
              element={
                <ProtectedRoute>
                  <CheckInCheckOut />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marcas-gt/crear-categoria"
              element={
                <ProtectedRouteAdmin>
                  <CrearCategoria />
                </ProtectedRouteAdmin>
              }
            />
            <Route
              path="/marcas-gt/proveedor"
              element={
                <ProtectedRouteAdmin>
                  <CrearProveedor />
                </ProtectedRouteAdmin>
              }
            />
            <Route
              path="/marcas-gt/crear-cliente"
              element={
                <ProtectedRoute>
                  <CreateClient />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marcas-gt/registro-entregas"
              element={
                <ProtectedRouteAdmin>
                  <StockDeliveryRecords />
                </ProtectedRouteAdmin>
              }
            />

            <Route
              path="/marcas-gt/prospecto"
              element={
                <ProtectedRoute>
                  <ProspectoFormulario />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marcas-gt/prospecto-ubicacion"
              element={
                <ProtectedRoute>
                  <ProspectoUbicacion />
                </ProtectedRoute>
              }
            />
            {/* <Route
              path="/conseguir-comprobante-entrega"
              element={
                <ProtectedRoute>
                  <DeliveryPdfPage />
                </ProtectedRoute>
              }
            /> */}
            <Route
              path="/marcas-gt/editar-cliente/:id"
              element={
                <ProtectedRoute>
                  <EditCustomer />
                </ProtectedRoute>
              }
            />

            <Route
              path="/marcas-gt/mis-ventas"
              element={
                <ProtectedRoute>
                  <MySales />
                </ProtectedRoute>
              }
            />

            <Route
              path="/marcas-gt/visita"
              element={
                <ProtectedRoute>
                  <RegistroVisita />
                </ProtectedRoute>
              }
            />

            <Route
              path="/marcas-gt/historial-visitas"
              element={
                <ProtectedRouteAdmin>
                  <VisitasTable />
                </ProtectedRouteAdmin>
              }
            />

            <Route
              path="/marcas-gt/historial-cliente-ventas/:id"
              element={
                <ProtectedRoute>
                  <CustomerSales />
                </ProtectedRoute>
              }
            />

            <Route
              path="/marcas-gt/comprobante-venta/:id"
              element={
                <ProtectedRoute>
                  <VentaPdfPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/marcas-gt/empresa-info"
              element={
                <ProtectedRouteAdmin>
                  <EmpresaForm />
                </ProtectedRouteAdmin>
              }
            />

            <Route
              path="/marcas-gt/analisis"
              element={
                <ProtectedRouteAdmin>
                  <ChatsAnalytics />
                </ProtectedRouteAdmin>
              }
            />

            <Route
              path="/marcas-gt/reportes"
              element={
                <ProtectedRouteAdmin>
                  <Reportes />
                </ProtectedRouteAdmin>
              }
            />

            {/* <Route
              path="/recovery"
              element={
                // <ProtectedRoute>
                <SolicitarRecuperacion />
                // </ProtectedRoute>
              }
            /> */}

            <Route
              path="/marcas-gt/restablecer-contraseña"
              element={
                <ProtectedRoute>
                  <RestablecerContrasena />
                </ProtectedRoute>
              }
            />

            <Route
              path="/marcas-gt/saldos"
              element={
                <ProtectedRouteAdmin>
                  <Saldos />
                </ProtectedRouteAdmin>
              }
            />

            <Route
              path="/marcas-gt/comprobante-pago/:id"
              element={
                <ProtectedRoute>
                  <PaymentCreditPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/marcas-gt/creditos"
              element={
                <ProtectedRouteAdmin>
                  <Creditos />
                </ProtectedRouteAdmin>
              }
            />

            <Route
              path="/marcas-gt/seguimiento-de-cancelaciones"
              element={
                <ProtectedRoute>
                  <Cancelados />
                </ProtectedRoute>
              }
            />
          </Route>
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
