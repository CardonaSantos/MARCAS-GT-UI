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
import ProspectoHistorialDetalle from "./Pages/ProspectoHistorialDetalle";
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
import VisitaHistorialDetalle from "./Pages/Dates/VisitaHistorialDetalle";
import CustomerSales from "./Pages/CustomerSales/CustomerSales";
import { MarcasLayout } from "./ui/components/Layout/layout-marcas";
import VentaPdfPage from "./components/PDF/VentasPDF/VentaPdfPage";
import EmpresaForm from "./Pages/Empresa/EmpresaForm";
import ChatsAnalytics from "./Pages/Analytics/ChatsAnalytics";
import Reportes from "./Pages/Reportes/Reportes";
import RestablecerContrasena from "./Pages/Recovery/RestablecerContrasena";
import Saldos from "./Pages/Saldos/Saldos";
import PaymentCreditPage from "./components/PDF/PDF CREDITOS/PaymentCreditPage";
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
import RequisitionsPage from "./Pages/Requisiciones/RequisitionsPage";
import CreateRequisitionPage from "./Pages/Requisiciones/CreateRequisitionPage";
import EditRequisitionPage from "./Pages/Requisiciones/EditRequisitionPage";
import RequisitionDetailPage from "./Pages/Requisiciones/RequisitionDetailPage";
import ReceiveRequisitionPage from "./Pages/Requisiciones/ReceiveRequisitionPage";
import RequisitionReceiptsPage from "./Pages/Requisiciones/RequisitionReceiptsPage";
import TrackingLivePage from "./Pages/Tracking/TrackingLivePage";
import TrackingHistoryPage from "./Pages/Tracking/TrackingHistoryPage";
import TrackingAttendancePage from "./Pages/Tracking/TrackingAttendancePage";
import TransfersPage from "./Pages/Transferencias/TransfersPage";
import CreateTransferPage from "./Pages/Transferencias/CreateTransferPage";
import EditTransferPage from "./Pages/Transferencias/EditTransferPage";
import TransferDetailPage from "./Pages/Transferencias/TransferDetailPage";
import SendTransferPage from "./Pages/Transferencias/SendTransferPage";
import ReceiveTransferPage from "./Pages/Transferencias/ReceiveTransferPage";
import TransferOperationsPage from "./Pages/Transferencias/TransferOperationsPage";
import OrdersPage from "./Pages/Pedidos/OrdersPage";
import CreateOrderPage from "./Pages/Pedidos/CreateOrderPage";
import OrderDetailPage from "./Pages/Pedidos/OrderDetailPage";
import EditOrderPage from "./Pages/Pedidos/EditOrderPage";
import CancelOrderPage from "./Pages/Pedidos/CancelOrderPage";
import CreditApplicationsPage from "./Pages/Creditos/CreditApplicationsPage";
import CreateCreditApplicationPage from "./Pages/Creditos/CreateCreditApplicationPage";
import EditCreditApplicationPage from "./Pages/Creditos/EditCreditApplicationPage";
import CreditApplicationDetailPage from "./Pages/Creditos/CreditApplicationDetailPage";
import CancelCreditApplicationPage from "./Pages/Creditos/CancelCreditApplicationPage";
import ApproveCreditApplicationPage from "./Pages/Creditos/ApproveCreditApplicationPage";
import RejectCreditApplicationPage from "./Pages/Creditos/RejectCreditApplicationPage";
import AddCreditReferencePage from "./Pages/Creditos/AddCreditReferencePage";
import EditCreditReferencePage from "./Pages/Creditos/EditCreditReferencePage";
import ReviewCreditReferencePage from "./Pages/Creditos/ReviewCreditReferencePage";
import AddCreditDocumentPage from "./Pages/Creditos/AddCreditDocumentPage";
import ReviewCreditDocumentPage from "./Pages/Creditos/ReviewCreditDocumentPage";
import ReviewCreditRequirementPage from "./Pages/Creditos/ReviewCreditRequirementPage";
import CreditPoliciesPage from "./Pages/Creditos/CreditPoliciesPage";
import CreateCreditPolicyPage from "./Pages/Creditos/CreateCreditPolicyPage";
import EditCreditPolicyPage from "./Pages/Creditos/EditCreditPolicyPage";
import CreditPolicyDetailPage from "./Pages/Creditos/CreditPolicyDetailPage";
import DeactivateCreditPolicyPage from "./Pages/Creditos/DeactivateCreditPolicyPage";
import CreditPortfolioPage from "./Pages/Creditos/CreditPortfolioPage";
import CreditPortfolioDetailPage from "./Pages/Creditos/CreditPortfolioDetailPage";
import DispatchesPage from "./Pages/Despachos/DispatchesPage";
import CreateDispatchPage from "./Pages/Despachos/CreateDispatchPage";
import DispatchDetailPage from "./Pages/Despachos/DispatchDetailPage";
import OperationalReceiptPage from "./Pages/Comprobantes/OperationalReceiptPage";
import EditDispatchPage from "./Pages/Despachos/EditDispatchPage";
import StartDispatchPreparationPage from "./Pages/Despachos/StartDispatchPreparationPage";
import UpdateDispatchPreparationPage from "./Pages/Despachos/UpdateDispatchPreparationPage";
import RegisterDispatchOutputPage from "./Pages/Despachos/RegisterDispatchOutputPage";
import CancelDispatchPage from "./Pages/Despachos/CancelDispatchPage";
import DispatchOperationsPage from "./Pages/Despachos/DispatchOperationsPage";
import DispatchOperationalReportPage from "./Pages/Despachos/DispatchOperationalReportPage";
import ShipmentsPage from "./Pages/Transporte/ShipmentsPage";
import CreateShipmentPage from "./Pages/Transporte/CreateShipmentPage";
import ShipmentDetailPage from "./Pages/Transporte/ShipmentDetailPage";
import AssignShipmentPage from "./Pages/Transporte/AssignShipmentPage";
import ConfirmShipmentLoadPage from "./Pages/Transporte/ConfirmShipmentLoadPage";
import StartShipmentRoutePage from "./Pages/Transporte/StartShipmentRoutePage";
import CancelShipmentPage from "./Pages/Transporte/CancelShipmentPage";
import ReportShipmentIncidentPage from "./Pages/Transporte/ReportShipmentIncidentPage";
import ResolveShipmentIncidentPage from "./Pages/Transporte/ResolveShipmentIncidentPage";
import TransportOperationalReportPage from "./Pages/Transporte/TransportOperationalReportPage";
import CarriersPage from "./Pages/Transporte/CarriersPage";
import VehiclesPage from "./Pages/Transporte/VehiclesPage";
import DriversPage from "./Pages/Transporte/DriversPage";
import CreateCarrierPage from "./Pages/Transporte/CreateCarrierPage";
import CreateVehiclePage from "./Pages/Transporte/CreateVehiclePage";
import CreateDriverPage from "./Pages/Transporte/CreateDriverPage";
import DeactivateTransportResourcePage from "./Pages/Transporte/DeactivateTransportResourcePage";
import DeliveriesPage from "./Pages/Entregas/DeliveriesPage";
import CreateDeliveryPage from "./Pages/Entregas/CreateDeliveryPage";
import DeliveryDetailPage from "./Pages/Entregas/DeliveryDetailPage";
import StartDeliveryPage from "./Pages/Entregas/StartDeliveryPage";
import UpdateDeliveryResultPage from "./Pages/Entregas/UpdateDeliveryResultPage";
import FinalizeDeliveryPage from "./Pages/Entregas/FinalizeDeliveryPage";
import DeliveryOperationalReportPage from "./Pages/Entregas/DeliveryOperationalReportPage";
import InvoicesPage from "./Pages/Facturacion/InvoicesPage";
import CreateInvoicePage from "./Pages/Facturacion/CreateInvoicePage";
import InvoiceDetailPage from "./Pages/Facturacion/InvoiceDetailPage";
import PrepareInvoicePage from "./Pages/Facturacion/PrepareInvoicePage";
import DiscardInvoicePage from "./Pages/Facturacion/DiscardInvoicePage";
import ReceivablesPage from "./Pages/Facturacion/ReceivablesPage";
import BillingOperationalReportPage from "./Pages/Facturacion/BillingOperationalReportPage";
import FiscalConfigurationPage from "./Pages/Facturacion/FiscalConfigurationPage";
import PaymentsPage from "./Pages/Pagos/PaymentsPage";
import PaymentBanksPage from "./Pages/Pagos/PaymentBanksPage";
import CreatePaymentPage from "./Pages/Pagos/CreatePaymentPage";
import PaymentDetailPage from "./Pages/Pagos/PaymentDetailPage";
import ApplyPaymentPage from "./Pages/Pagos/ApplyPaymentPage";
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
            <Route
              path="/marcas-gt/inventario/reservas/:id/liberar"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <ReleaseInventoryReservationPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/inventario/reservas/:id/cancelar"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <CancelInventoryReservationPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/inventario/entradas/nueva"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <RegisterInventoryEntryPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/inventario/ajustes/nuevo"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <AdjustInventoryPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/inventario/devoluciones/nueva"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <RegisterInventoryReturnPage />
                </ProtectedRouteRoles>
              }
            />

            <Route
              path="/marcas-gt/requisiciones"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA", "CONTABILIDAD"]}>
                  <RequisitionsPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/requisiciones/nueva"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <CreateRequisitionPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/requisiciones/recepciones"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA", "CONTABILIDAD"]}>
                  <RequisitionReceiptsPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/requisiciones/:id"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA", "CONTABILIDAD"]}>
                  <RequisitionDetailPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/requisiciones/:id/editar"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <EditRequisitionPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/requisiciones/:id/recibir"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <ReceiveRequisitionPage />
                </ProtectedRouteRoles>
              }
            />

            <Route
              path="/marcas-gt/transferencias"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA", "CONTABILIDAD"]}>
                  <TransfersPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/transferencias/nueva"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <CreateTransferPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/transferencias/operaciones"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA", "CONTABILIDAD"]}>
                  <TransferOperationsPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/transferencias/:id"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA", "CONTABILIDAD"]}>
                  <TransferDetailPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/transferencias/:id/editar"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <EditTransferPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/transferencias/:id/salida"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <SendTransferPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/transferencias/:id/recibir"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <ReceiveTransferPage />
                </ProtectedRouteRoles>
              }
            />

            <Route
              path="/marcas-gt/pedidos"
              element={
                <ProtectedRouteRoles
                  roles={["ADMIN", "VENDEDOR", "BODEGA", "CONTABILIDAD"]}
                >
                  <OrdersPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/pedidos/nuevo"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "VENDEDOR", "BODEGA"]}>
                  <CreateOrderPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/pedidos/:id"
              element={
                <ProtectedRouteRoles
                  roles={["ADMIN", "VENDEDOR", "BODEGA", "CONTABILIDAD"]}
                >
                  <OrderDetailPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/pedidos/:id/editar"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "VENDEDOR", "BODEGA"]}>
                  <EditOrderPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/pedidos/:id/cancelar"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "VENDEDOR", "BODEGA"]}>
                  <CancelOrderPage />
                </ProtectedRouteRoles>
              }
            />

            <Route
              path="/marcas-gt/creditos"
              element={
                <ProtectedRouteRoles
                  roles={["ADMIN", "VENDEDOR", "CONTABILIDAD"]}
                >
                  <CreditApplicationsPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/creditos/solicitudes/nueva"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "VENDEDOR"]}>
                  <CreateCreditApplicationPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/creditos/solicitudes/:id"
              element={
                <ProtectedRouteRoles
                  roles={["ADMIN", "VENDEDOR", "CONTABILIDAD"]}
                >
                  <CreditApplicationDetailPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/creditos/solicitudes/:id/editar"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "VENDEDOR"]}>
                  <EditCreditApplicationPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/creditos/solicitudes/:id/cancelar"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "VENDEDOR"]}>
                  <CancelCreditApplicationPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/creditos/solicitudes/:id/aprobar"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "CONTABILIDAD"]}>
                  <ApproveCreditApplicationPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/creditos/solicitudes/:id/rechazar"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "CONTABILIDAD"]}>
                  <RejectCreditApplicationPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/creditos/solicitudes/:id/referencias/nueva"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "VENDEDOR"]}>
                  <AddCreditReferencePage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/creditos/solicitudes/:id/referencias/:referenceId/editar"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "VENDEDOR"]}>
                  <EditCreditReferencePage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/creditos/solicitudes/:id/referencias/:referenceId/revisar"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "CONTABILIDAD"]}>
                  <ReviewCreditReferencePage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/creditos/solicitudes/:id/documentos/nuevo"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "VENDEDOR"]}>
                  <AddCreditDocumentPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/creditos/solicitudes/:id/documentos/:documentId/revisar"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "CONTABILIDAD"]}>
                  <ReviewCreditDocumentPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/creditos/solicitudes/:id/requisitos/:requirementId/revisar"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "CONTABILIDAD"]}>
                  <ReviewCreditRequirementPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/creditos/politicas"
              element={
                <ProtectedRouteRoles
                  roles={["ADMIN", "VENDEDOR", "CONTABILIDAD"]}
                >
                  <CreditPoliciesPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/creditos/politicas/nueva"
              element={
                <ProtectedRouteRoles roles={["ADMIN"]}>
                  <CreateCreditPolicyPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/creditos/politicas/:id"
              element={
                <ProtectedRouteRoles
                  roles={["ADMIN", "VENDEDOR", "CONTABILIDAD"]}
                >
                  <CreditPolicyDetailPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/creditos/politicas/:id/editar"
              element={
                <ProtectedRouteRoles roles={["ADMIN"]}>
                  <EditCreditPolicyPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/creditos/politicas/:id/desactivar"
              element={
                <ProtectedRouteRoles roles={["ADMIN"]}>
                  <DeactivateCreditPolicyPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/creditos/cartera"
              element={
                <ProtectedRouteRoles
                  roles={["ADMIN", "VENDEDOR", "CONTABILIDAD"]}
                >
                  <CreditPortfolioPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/creditos/cartera/:id"
              element={
                <ProtectedRouteRoles
                  roles={["ADMIN", "VENDEDOR", "CONTABILIDAD"]}
                >
                  <CreditPortfolioDetailPage />
                </ProtectedRouteRoles>
              }
            />

            <Route
              path="/marcas-gt/despachos"
              element={
                <ProtectedRouteRoles
                  roles={["ADMIN", "BODEGA", "CONTABILIDAD", "VENDEDOR", "REPARTIDOR"]}
                >
                  <DispatchesPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/despachos/nuevo"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <CreateDispatchPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/despachos/operaciones"
              element={
                <ProtectedRouteRoles
                  roles={["ADMIN", "BODEGA", "CONTABILIDAD", "VENDEDOR", "REPARTIDOR"]}
                >
                  <DispatchOperationsPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/despachos/reportes/operacion"
              element={
                <ProtectedRouteRoles
                  roles={["ADMIN", "BODEGA", "CONTABILIDAD", "VENDEDOR", "REPARTIDOR"]}
                >
                  <DispatchOperationalReportPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/despachos/:id/comprobante/:operacionId"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <OperationalReceiptPage kind="SALIDA_DESPACHO" />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/despachos/:id"
              element={
                <ProtectedRouteRoles
                  roles={["ADMIN", "BODEGA", "CONTABILIDAD", "VENDEDOR", "REPARTIDOR"]}
                >
                  <DispatchDetailPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/despachos/:id/editar"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <EditDispatchPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/despachos/:id/iniciar-preparacion"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <StartDispatchPreparationPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/despachos/:id/preparacion"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <UpdateDispatchPreparationPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/despachos/:id/salida"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <RegisterDispatchOutputPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/despachos/:id/cancelar"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <CancelDispatchPage />
                </ProtectedRouteRoles>
              }
            />


            <Route
              path="/marcas-gt/transporte"
              element={
                <ProtectedRouteRoles
                  roles={["ADMIN", "BODEGA", "CONTABILIDAD", "VENDEDOR", "REPARTIDOR"]}
                >
                  <Navigate to="/marcas-gt/transporte/envios" replace />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/transporte/envios"
              element={
                <ProtectedRouteRoles
                  roles={["ADMIN", "BODEGA", "CONTABILIDAD", "VENDEDOR", "REPARTIDOR"]}
                >
                  <ShipmentsPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/transporte/envios/nuevo"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <CreateShipmentPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/transporte/reportes/operacion"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA", "CONTABILIDAD"]}>
                  <TransportOperationalReportPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/transporte/envios/:id"
              element={
                <ProtectedRouteRoles
                  roles={["ADMIN", "BODEGA", "CONTABILIDAD", "VENDEDOR", "REPARTIDOR"]}
                >
                  <ShipmentDetailPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/transporte/envios/:id/asignar"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <AssignShipmentPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/transporte/envios/:id/carga"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <ConfirmShipmentLoadPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/transporte/envios/:id/iniciar-ruta"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA", "REPARTIDOR"]}>
                  <StartShipmentRoutePage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/transporte/envios/:id/cancelar"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <CancelShipmentPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/transporte/envios/:id/incidencias/nueva"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA", "REPARTIDOR"]}>
                  <ReportShipmentIncidentPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/transporte/envios/:id/incidencias/:incidentId/resolver"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA", "REPARTIDOR"]}>
                  <ResolveShipmentIncidentPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/transporte/transportistas"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA", "CONTABILIDAD"]}>
                  <CarriersPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/transporte/transportistas/nuevo"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <CreateCarrierPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/transporte/transportistas/:id/desactivar"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <DeactivateTransportResourcePage kind="transportista" />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/transporte/vehiculos"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA", "CONTABILIDAD"]}>
                  <VehiclesPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/transporte/vehiculos/nuevo"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <CreateVehiclePage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/transporte/vehiculos/:id/desactivar"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <DeactivateTransportResourcePage kind="vehiculo" />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/transporte/conductores"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA", "CONTABILIDAD"]}>
                  <DriversPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/transporte/conductores/nuevo"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <CreateDriverPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/transporte/conductores/:id/desactivar"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA"]}>
                  <DeactivateTransportResourcePage kind="conductor" />
                </ProtectedRouteRoles>
              }
            />


            <Route
              path="/marcas-gt/entregas"
              element={
                <ProtectedRouteRoles
                  roles={["ADMIN", "BODEGA", "CONTABILIDAD", "VENDEDOR", "REPARTIDOR"]}
                >
                  <DeliveriesPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/entregas/nueva"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA", "REPARTIDOR"]}>
                  <CreateDeliveryPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/entregas/reportes/operacion"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA", "CONTABILIDAD"]}>
                  <DeliveryOperationalReportPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/entregas/:id/comprobante"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA", "REPARTIDOR"]}>
                  <OperationalReceiptPage kind="ENTREGA" />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/entregas/:id"
              element={
                <ProtectedRouteRoles
                  roles={["ADMIN", "BODEGA", "CONTABILIDAD", "VENDEDOR", "REPARTIDOR"]}
                >
                  <DeliveryDetailPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/entregas/:id/iniciar"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA", "REPARTIDOR"]}>
                  <StartDeliveryPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/entregas/:id/resultado"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA", "REPARTIDOR"]}>
                  <UpdateDeliveryResultPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/entregas/:id/finalizar"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "BODEGA", "REPARTIDOR"]}>
                  <FinalizeDeliveryPage />
                </ProtectedRouteRoles>
              }
            />


            <Route
              path="/marcas-gt/facturacion"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "CONTABILIDAD", "VENDEDOR"]}>
                  <Navigate to="/marcas-gt/facturacion/facturas" replace />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/facturacion/facturas"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "CONTABILIDAD", "VENDEDOR"]}>
                  <InvoicesPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/facturacion/facturas/nueva"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "CONTABILIDAD"]}>
                  <CreateInvoicePage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/facturacion/reportes/operacion"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "CONTABILIDAD"]}>
                  <BillingOperationalReportPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/facturacion/cuentas-por-cobrar"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "CONTABILIDAD", "VENDEDOR"]}>
                  <ReceivablesPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/facturacion/configuracion-fiscal"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "CONTABILIDAD"]}>
                  <FiscalConfigurationPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/facturacion/facturas/:id"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "CONTABILIDAD", "VENDEDOR"]}>
                  <InvoiceDetailPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/facturacion/facturas/:id/preparar"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "CONTABILIDAD"]}>
                  <PrepareInvoicePage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/facturacion/facturas/:id/descartar"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "CONTABILIDAD"]}>
                  <DiscardInvoicePage />
                </ProtectedRouteRoles>
              }
            />


            <Route
              path="/marcas-gt/pagos"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "CONTABILIDAD", "VENDEDOR"]}>
                  <PaymentsPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/pagos/bancos"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "CONTABILIDAD"]}>
                  <PaymentBanksPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/pagos/nuevo"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "CONTABILIDAD", "VENDEDOR"]}>
                  <CreatePaymentPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/pagos/:id"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "CONTABILIDAD", "VENDEDOR"]}>
                  <PaymentDetailPage />
                </ProtectedRouteRoles>
              }
            />
            <Route
              path="/marcas-gt/pagos/:id/aplicar"
              element={
                <ProtectedRouteRoles roles={["ADMIN", "CONTABILIDAD"]}>
                  <ApplyPaymentPage />
                </ProtectedRouteRoles>
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
              path="/marcas-gt/register"
              element={
                <ProtectedRouteAdmin>
                  <CreateUser />
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

            <Route path="/marcas-gt/tracking" element={<ProtectedRouteAdmin><TrackingLivePage /></ProtectedRouteAdmin>} />
            <Route path="/marcas-gt/tracking/historial" element={<ProtectedRouteAdmin><TrackingHistoryPage /></ProtectedRouteAdmin>} />
            <Route path="/marcas-gt/tracking/jornadas/:id" element={<ProtectedRouteAdmin><TrackingAttendancePage /></ProtectedRouteAdmin>} />

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
              path="/marcas-gt/historial-prospectos/:id"
              element={
                <ProtectedRouteAdmin>
                  <ProspectoHistorialDetalle />
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
              path="/marcas-gt/historial-visitas/:id"
              element={
                <ProtectedRouteAdmin>
                  <VisitaHistorialDetalle />
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
