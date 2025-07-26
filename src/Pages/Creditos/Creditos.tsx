"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  Banknote,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Coins,
  CreditCard,
  DeleteIcon,
  Eye,
  MapPin,
  MessageSquare,
  Percent,
  Phone,
  Search,
  Trash2,
  User,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type React from "react";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import axios from "axios";
import { useStore } from "@/Context/ContextSucursal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import DatePicker from "react-datepicker";

const API_URL = import.meta.env.VITE_API_URL;

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

// TIPOS
type ClienteCredito = {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
};

type VendedorCredito = {
  id: number;
  nombre: string;
  correo: string;
};

type VentaCredito = {
  id: number;
  monto: number;
  montoConDescuento: number;
  descuento: number | null;
  metodoPago: string;
  timestamp: string;
  vendedor: VendedorCredito;
};

type CuotaCredito = {
  id: number;
  montoEsperado: number;
  montoPagado: number;
  estado: "PENDIENTE" | "PAGADA" | "ATRASADA";
  fechaVencimiento: string;
  fechaPago: string | null;
};

type Credito = {
  id: number;
  ventaId: number;
  clienteId: number;
  empresaId: number;
  montoTotal: number;
  cuotaInicial: number;
  totalPagado: number;
  numeroCuotas: number;
  estado: string;
  interes: number;
  montoConInteres: number;
  montoTotalConInteres: number;
  saldoPendiente: number;
  fechaInicio: string;
  diasEntrePagos: number;
  fechaContrato: string;
  dpi: string;
  testigos: Record<string, unknown>;
  comentario: string;
  createdAt: string;
  updatedAt: string;
  cliente: ClienteCredito;
  cuotasCredito: CuotaCredito[];
  venta: VentaCredito;
};

type MetodoPago = "CONTADO" | "TARJETA" | "TRANSFERENCIA";

interface NuevoPago {
  creditoId: number | undefined;
  cuotaId: number | undefined;
  monto: number | undefined;
  metodoPago: MetodoPago;
  ventaId: number | undefined;
}

// ESTADO INICIAL
const initialPaymentState: NuevoPago = {
  creditoId: undefined,
  cuotaId: undefined,
  monto: 0,
  metodoPago: "CONTADO",
  ventaId: undefined,
};

function Creditos() {
  const userId = useStore((state) => state.userId) ?? 0;
  const empresaId = useStore((state) => state.sucursalId) ?? 0;

  // Estados principales
  const [creditos, setCreditos] = useState<Credito[]>([]);
  const [selectedCredit, setSelectedCredit] = useState<Credito | null>(null);
  const [selectedCuota, setSelectedCuota] = useState<CuotaCredito | null>(null);

  // Estados de diálogos
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [openDeleteCredit, setOpenDeleteCredit] = useState(false);
  const [openDeletePayment, setOpenDeletePayment] = useState(false);

  // Estados de formularios
  const [newPayment, setNewPayment] = useState<NuevoPago>(initialPaymentState);
  const [adminPassword, setAdminPassword] = useState("");
  const [passwordToDeletePayment, setPasswordToDeletePayment] = useState("");
  const [creditIdToDelete, setCreditIdToDelete] = useState(0);
  const [cuotaIdToDelete, setCuotaIdToDelete] = useState(0);

  // Estados de filtros y paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filtroVenta, setFiltroVenta] = useState("");

  const itemsPerPage = 25;

  // FUNCIONES AUXILIARES
  const formatearFecha = (fecha: string) => {
    return dayjs(fecha).format("DD/MM/YYYY hh:mm A");
  };

  const formatearMoneda = (cantidad: number) => {
    return new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
    }).format(cantidad);
  };

  const isCuotaVencida = (fechaVencimiento: string, estado: string) => {
    if (estado === "PAGADA") return false;
    return dayjs().isAfter(dayjs(fechaVencimiento));
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "PAGADA":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "ATRASADA":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "PENDIENTE":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "PAGADA":
        return "default";
      case "ATRASADA":
        return "destructive";
      case "PENDIENTE":
        return "secondary";
      default:
        return "outline";
    }
  };

  // FUNCIONES DE DATOS
  const getCreditos = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/credito`);
      if (response.status === 200) {
        setCreditos(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir créditos");
    }
  }, []);

  // FUNCIONES DE DIÁLOGOS
  const resetDialogStates = useCallback(() => {
    setNewPayment(initialPaymentState);
    setSelectedCuota(null);
    setAdminPassword("");
    setPasswordToDeletePayment("");
    setCreditIdToDelete(0);
    setCuotaIdToDelete(0);
  }, []);

  const openDetailDialog = useCallback((credito: Credito) => {
    setSelectedCredit(credito);
    setIsDetailOpen(true);
  }, []);

  const closeDetailDialog = useCallback(() => {
    setIsDetailOpen(false);
    setSelectedCredit(null);
    resetDialogStates();
  }, [resetDialogStates]);

  const openPaymentDialog = useCallback(
    (cuota?: CuotaCredito) => {
      if (!selectedCredit) return;

      const cuotaAPagar =
        cuota ||
        selectedCredit.cuotasCredito.find((c) => c.estado === "PENDIENTE");

      if (!cuotaAPagar) {
        toast.info("No hay cuotas pendientes para pagar");
        return;
      }

      setSelectedCuota(cuotaAPagar);
      setNewPayment({
        creditoId: selectedCredit.id,
        cuotaId: cuotaAPagar.id,
        monto: cuotaAPagar.montoEsperado - cuotaAPagar.montoPagado,
        metodoPago: "CONTADO",
        ventaId: selectedCredit.ventaId,
      });
      setIsDetailOpen(false);
      setIsPaymentOpen(true);
    },
    [selectedCredit]
  );

  const closePaymentDialog = useCallback(() => {
    setIsPaymentOpen(false);
    resetDialogStates();
    if (selectedCredit) {
      setIsDetailOpen(true);
    }
  }, [selectedCredit, resetDialogStates]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  // FUNCIONES DE OPERACIONES CRUD
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !empresaId ||
      !newPayment.monto ||
      newPayment.monto <= 0 ||
      !newPayment.metodoPago ||
      !newPayment.cuotaId
    ) {
      toast.info("Faltan datos para el registro, intente de nuevo");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/credito/regist-payment`, {
        empresaId: empresaId,
        monto: newPayment.monto,
        metodoPago: newPayment.metodoPago,
        creditoId: newPayment.creditoId,
        cuotaId: newPayment.cuotaId,
        ventaId: newPayment.ventaId,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Pago registrado correctamente");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al registrar pago");
    }
  };

  const handleDeleteCredit = async () => {
    if (!adminPassword.trim()) {
      toast.info("Ingrese la contraseña de administrador");
      return;
    }
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/credito/delete-credito-regist`,
        {
          creditoId: Number(creditIdToDelete),
          userId: userId,
          adminPassword: adminPassword.trim(),
          empresaId: empresaId,
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Registro de crédito eliminado");

        // Recargar todos los créditos
        await getCreditos();

        // Cerrar diálogos y resetear estados
        setOpenDeleteCredit(false);
        closeDetailDialog();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al eliminar el crédito");
    }
  };

  const handleDeletePaymentRegist = async () => {
    if (!userId || !passwordToDeletePayment || !cuotaIdToDelete || !empresaId) {
      toast.info("Faltan datos, intente de nuevo");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/credito/delete-payment-regist`,
        {
          userId: userId,
          password: passwordToDeletePayment,
          cuotaId: cuotaIdToDelete,
          empresaId: empresaId,
          creditoId: selectedCredit?.id ?? 0,
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Pago eliminado correctamente");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al eliminar pago");
    }
  };

  // EFECTOS
  useEffect(() => {
    getCreditos();
  }, [getCreditos]);

  // FILTROS Y PAGINACIÓN
  const ventasFiltradas = creditos?.filter((credito) => {
    const filtroNormalizado = filtroVenta.trim().toLowerCase();
    const nombreCompleto = `${credito.cliente.nombre || ""} ${
      credito.cliente.apellido || ""
    }`
      .trim()
      .toLowerCase();

    const cumpleTexto =
      nombreCompleto.includes(filtroNormalizado) ||
      credito.cliente.telefono?.toLowerCase().includes(filtroNormalizado) ||
      credito.cliente.direccion?.toLowerCase().includes(filtroNormalizado) ||
      credito.id.toString().includes(filtroNormalizado);

    const cumpleFechas =
      (!startDate || new Date(credito.fechaContrato) >= startDate) &&
      (!endDate || new Date(credito.fechaContrato) <= endDate);

    return cumpleTexto && cumpleFechas;
  });

  const totalPages = Math.ceil((ventasFiltradas?.length || 0) / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    ventasFiltradas && ventasFiltradas.slice(indexOfFirstItem, indexOfLastItem);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="container mx-auto p-4">
        <Card className="shadow-xl">
          <CardContent>
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="text-gray-400 w-7 h-7" />
                <h1 className="text-2xl font-bold">Gestión de Créditos</h1>
              </div>
            </CardHeader>

            {/* Filtros */}
            <div className="bg-muted p-4 rounded-lg mb-4 shadow-lg">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1 relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    id="search-sales"
                    type="search"
                    placeholder="Buscar créditos..."
                    value={filtroVenta}
                    onChange={(e) => setFiltroVenta(e.target.value)}
                    className="w-full pl-10"
                    aria-label="Buscar créditos"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <DatePicker
                    locale="es"
                    selected={startDate || undefined}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate || undefined}
                    endDate={endDate || undefined}
                    placeholderText="Fecha inicio"
                    isClearable
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  />
                  <DatePicker
                    locale="es"
                    isClearable
                    selected={endDate || undefined}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate || undefined}
                    endDate={endDate || undefined}
                    minDate={startDate || undefined}
                    placeholderText="Fecha fin"
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  />
                </div>
              </div>
            </div>

            {/* Tabla de Créditos */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Monto Total</TableHead>
                  <TableHead>Saldo Pagado</TableHead>
                  <TableHead>Saldo Pendiente</TableHead>
                  <TableHead>Cuotas</TableHead>
                  <TableHead>Próximo Vencimiento</TableHead>
                  <TableHead>Fecha de Registro</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                  <TableHead>Eliminar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems &&
                  currentItems.map((credito) => {
                    const cuotasPagadas = credito.cuotasCredito.filter(
                      (cuota) => cuota.estado === "PAGADA"
                    ).length;
                    const proximaCuota = credito.cuotasCredito.find(
                      (c) => c.estado === "PENDIENTE"
                    );
                    const tieneVencidas = credito.cuotasCredito.some(
                      (c) =>
                        c.estado === "PENDIENTE" &&
                        isCuotaVencida(c.fechaVencimiento, c.estado)
                    );

                    return (
                      <TableRow key={credito.id}>
                        <TableCell>{credito.id}</TableCell>
                        <TableCell>{`${credito.cliente.nombre} ${credito.cliente.apellido}`}</TableCell>
                        <TableCell>
                          {formatearMoneda(credito.montoTotalConInteres)}
                        </TableCell>
                        <TableCell>
                          {formatearMoneda(credito.totalPagado)}
                        </TableCell>
                        <TableCell>
                          {formatearMoneda(credito.saldoPendiente)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {cuotasPagadas} / {credito.numeroCuotas}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {proximaCuota ? (
                            <div className="flex items-center gap-1">
                              {isCuotaVencida(
                                proximaCuota.fechaVencimiento,
                                proximaCuota.estado
                              ) && <XCircle className="h-3 w-3 text-red-500" />}
                              <span
                                className={`text-xs ${
                                  isCuotaVencida(
                                    proximaCuota.fechaVencimiento,
                                    proximaCuota.estado
                                  )
                                    ? "text-red-600 font-semibold"
                                    : "text-gray-600"
                                }`}
                              >
                                {dayjs(proximaCuota.fechaVencimiento).format(
                                  "DD/MM/YYYY"
                                )}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-green-600">
                              Completado
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {formatearFecha(credito.fechaContrato)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              tieneVencidas
                                ? "destructive"
                                : credito.estado === "ACTIVO"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {tieneVencidas ? "VENCIDO" : credito.estado}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openDetailDialog(credito)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setOpenDeleteCredit(true);
                              setCreditIdToDelete(credito.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>

            {/* Paginación */}
            <CardFooter className="flex items-center justify-center py-4">
              <div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <Button
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                        variant={currentPage === 1 ? "outline" : "default"}
                      >
                        Primera
                      </Button>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          onPageChange(Math.max(1, currentPage - 1))
                        }
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </PaginationPrevious>
                    </PaginationItem>
                    {currentPage > 3 && (
                      <>
                        <PaginationItem>
                          <PaginationLink onClick={() => onPageChange(1)}>
                            1
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <span className="text-muted-foreground">...</span>
                        </PaginationItem>
                      </>
                    )}
                    {Array.from({ length: totalPages }, (_, index) => {
                      const page = index + 1;
                      if (
                        page === currentPage ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={index}>
                            <PaginationLink
                              onClick={() => onPageChange(page)}
                              isActive={page === currentPage}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    {currentPage < totalPages - 2 && (
                      <>
                        <PaginationItem>
                          <span className="text-muted-foreground">...</span>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => onPageChange(totalPages)}
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          onPageChange(Math.min(totalPages, currentPage + 1))
                        }
                      >
                        <ChevronRight className="h-4 w-4" />
                      </PaginationNext>
                    </PaginationItem>
                    <PaginationItem>
                      <Button
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        variant={
                          currentPage === totalPages ? "outline" : "destructive"
                        }
                      >
                        Última
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardFooter>
          </CardContent>
        </Card>

        {/* Dialog de Detalles del Crédito */}
        <Dialog open={isDetailOpen} onOpenChange={closeDetailDialog}>
          <DialogContent className="sm:max-w-[90%] sm:max-h-[75vh] md:max-w-[90%] md:max-h-[65vh] lg:max-w-[90%] lg:max-h-[97vh] max-h-[90vh] w-full overflow-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Detalles del Crédito #{selectedCredit?.id}
              </DialogTitle>
            </DialogHeader>
            {selectedCredit && (
              <div className="">
                {/* Información del Cliente y Financiera */}
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="mb-2">
                        <h3 className="font-semibold text-sm mb-2 flex items-center">
                          <User className="mr-2 w-4 h-4" />
                          Cliente
                        </h3>
                        <p className="text-sm">
                          {selectedCredit.cliente.nombre}{" "}
                          {selectedCredit.cliente.apellido}
                        </p>
                      </div>
                      <div className="mb-2">
                        <h3 className="text-sm font-semibold mb-2 flex items-center">
                          <Phone className="mr-2 w-4 h-4" /> Teléfono
                        </h3>
                        <p className="text-sm">
                          {selectedCredit.cliente.telefono}
                        </p>
                      </div>
                      <div className="mb-2">
                        <h3 className="text-sm font-semibold mb-2 flex items-center">
                          <MapPin className="mr-2 w-4 h-4" /> Dirección
                        </h3>
                        <p className="text-sm">
                          {selectedCredit.cliente.direccion}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <Coins className="mr-2" /> Información Financiera
                      </h3>
                      <div className="space-y-2">
                        <p className="text-sm flex justify-between">
                          <span>Monto Total:</span>
                          <Badge variant="secondary">
                            {formatearMoneda(
                              selectedCredit.montoTotalConInteres
                            )}
                          </Badge>
                        </p>
                        <p className="text-sm flex justify-between">
                          <span>Saldo Pagado:</span>
                          <Badge variant="secondary">
                            {formatearMoneda(selectedCredit.totalPagado)}
                          </Badge>
                        </p>
                        <p className="text-sm flex justify-between">
                          <span>Saldo Pendiente:</span>
                          <Badge variant="destructive">
                            {formatearMoneda(selectedCredit.saldoPendiente)}
                          </Badge>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator className="my-4" />

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                      <span className="font-medium">Fecha de Inicio:</span>{" "}
                      {dayjs(selectedCredit.fechaInicio).format("DD/MM/YYYY")}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                      <span className="font-medium">Cuotas:</span>{" "}
                      {
                        selectedCredit.cuotasCredito.filter(
                          (c) => c.estado === "PAGADA"
                        ).length
                      }{" "}
                      de {selectedCredit.numeroCuotas}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Percent className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                      <span className="font-medium">Interés:</span>{" "}
                      {selectedCredit.interes}%
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Coins className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                      <span className="font-medium">Cuota Inicial:</span>{" "}
                      {formatearMoneda(selectedCredit.cuotaInicial)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                      <span className="font-medium">Días entre pagos:</span>{" "}
                      {selectedCredit.diasEntrePagos}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 mb-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <MessageSquare className="mr-2 w-4 h-4" /> Comentario
                  </h3>
                  <p className="text-sm">
                    {selectedCredit.comentario || "Sin comentarios"}
                  </p>
                </div>

                {/* Tabla de Cuotas */}
                <div className="w-full overflow-x-auto">
                  <Table>
                    <TableCaption>Cuotas programadas del crédito</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Cuota</TableHead>
                        <TableHead>Monto Esperado</TableHead>
                        <TableHead>Monto Pagado</TableHead>
                        <TableHead>Saldo</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha Vencimiento</TableHead>
                        <TableHead>Fecha Pago</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCredit.cuotasCredito.map((cuota, index) => {
                        const saldoPendiente =
                          cuota.montoEsperado - cuota.montoPagado;
                        const estaVencida = isCuotaVencida(
                          cuota.fechaVencimiento,
                          cuota.estado
                        );

                        return (
                          <TableRow
                            key={cuota.id}
                            className={estaVencida ? "bg-red-50" : ""}
                          >
                            <TableCell className="font-medium">
                              {index + 1}
                            </TableCell>
                            <TableCell>
                              {formatearMoneda(cuota.montoEsperado)}
                            </TableCell>
                            <TableCell>
                              {formatearMoneda(cuota.montoPagado)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  saldoPendiente > 0 ? "destructive" : "default"
                                }
                              >
                                {formatearMoneda(saldoPendiente)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getEstadoIcon(
                                  estaVencida && cuota.estado === "PENDIENTE"
                                    ? "ATRASADA"
                                    : cuota.estado
                                )}
                                <Badge
                                  variant={getEstadoBadgeVariant(
                                    estaVencida && cuota.estado === "PENDIENTE"
                                      ? "ATRASADA"
                                      : cuota.estado
                                  )}
                                >
                                  {estaVencida && cuota.estado === "PENDIENTE"
                                    ? "ATRASADA"
                                    : cuota.estado}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-[13px]">
                              <span
                                className={
                                  estaVencida
                                    ? "text-red-600 font-semibold"
                                    : ""
                                }
                              >
                                {dayjs(cuota.fechaVencimiento).format(
                                  "DD/MM/YYYY"
                                )}
                              </span>
                            </TableCell>
                            <TableCell className="text-[13px]">
                              {cuota.fechaPago
                                ? dayjs(cuota.fechaPago).format(
                                    "DD/MM/YYYY HH:mm"
                                  )
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {cuota.estado === "PENDIENTE" && (
                                  <Button
                                    onClick={() => openPaymentDialog(cuota)}
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                  >
                                    <Coins className="h-3 w-3 mr-1" />
                                    Pagar
                                  </Button>
                                )}
                                {cuota.montoPagado > 0 && (
                                  <Button
                                    onClick={() => {
                                      setOpenDeletePayment(true);
                                      setCuotaIdToDelete(cuota.id);
                                    }}
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                  >
                                    <DeleteIcon className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <Button onClick={() => openPaymentDialog()} variant="outline">
                    <Coins className="mr-2 h-4 w-4" />
                    Pagar Siguiente Cuota
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog para Eliminar Crédito */}
        <Dialog open={openDeleteCredit} onOpenChange={setOpenDeleteCredit}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                Eliminar registro de crédito
              </DialogTitle>
            </DialogHeader>
            <div className="mt-6 space-y-6">
              <div className="text-center text-gray-600">
                <p>
                  Esta acción es irreversible. Por favor, confirme su autoridad
                  para proceder.
                </p>
              </div>
              <Input
                placeholder="Ingrese su contraseña de administrador"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                type="password"
                className="w-full"
              />
            </div>
            <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => setOpenDeleteCredit(false)}
                className="w-full sm:w-1/2"
              >
                Cancelar
              </Button>
              <Button
                disabled={isLoading}
                variant="destructive"
                onClick={handleDeleteCredit}
                className="w-full sm:w-1/2"
              >
                Confirmar y eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para Eliminar Pago */}
        <Dialog open={openDeletePayment} onOpenChange={setOpenDeletePayment}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-center">
                Eliminar registro de pago
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-5">
              <div className="flex items-center">
                <h3 className="text-md font-semibold text-center">
                  ¿Estás seguro de querer eliminar el pago registrado?
                </h3>
              </div>
              <Input
                value={passwordToDeletePayment}
                onChange={(e) => setPasswordToDeletePayment(e.target.value)}
                placeholder="Ingrese su contraseña de administrador"
                type="password"
                className="w-full"
              />
            </div>
            <DialogFooter className="mt-6 sm:space-x-4">
              <Button
                variant="outline"
                onClick={() => setOpenDeletePayment(false)}
                className="w-full my-1"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeletePaymentRegist}
                className="w-full my-1"
              >
                Eliminar pago
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para Registrar Pago */}
        <Dialog open={isPaymentOpen} onOpenChange={closePaymentDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center">
                <Coins className="mr-2" />
                Registrar Pago - Cuota{" "}
                {selectedCuota &&
                  (selectedCredit
                    ? selectedCredit.cuotasCredito.findIndex(
                        (c) => c.id === selectedCuota.id
                      ) + 1 || ""
                    : "")}
              </DialogTitle>
            </DialogHeader>
            {selectedCuota && (
              <div className="space-y-4">
                {/* Información de la cuota */}
                <Card>
                  <CardContent className="pt-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Monto esperado:</span>
                        <span className="font-semibold">
                          {formatearMoneda(selectedCuota.montoEsperado)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ya pagado:</span>
                        <span className="font-semibold">
                          {formatearMoneda(selectedCuota.montoPagado)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span>Saldo pendiente:</span>
                        <span className="font-bold text-red-600">
                          {formatearMoneda(
                            selectedCuota.montoEsperado -
                              selectedCuota.montoPagado
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fecha vencimiento:</span>
                        <span
                          className={`font-semibold ${
                            isCuotaVencida(
                              selectedCuota.fechaVencimiento,
                              selectedCuota.estado
                            )
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {dayjs(selectedCuota.fechaVencimiento).format(
                            "DD/MM/YYYY"
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="monto" className="text-sm font-medium">
                      Monto a pagar
                    </Label>
                    <div className="relative">
                      <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <Input
                        id="monto"
                        type="number"
                        value={newPayment.monto}
                        onChange={(e) =>
                          setNewPayment({
                            ...newPayment,
                            monto: Number.parseFloat(e.target.value),
                          })
                        }
                        className="pl-10"
                        max={
                          selectedCuota.montoEsperado -
                          selectedCuota.montoPagado
                        }
                        min={0.01}
                        step={0.01}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metodoPago" className="text-sm font-medium">
                      Método de Pago
                    </Label>
                    <Select
                      value={newPayment.metodoPago}
                      onValueChange={(value: MetodoPago) =>
                        setNewPayment({ ...newPayment, metodoPago: value })
                      }
                    >
                      <SelectTrigger id="metodoPago" className="w-full">
                        <SelectValue placeholder="Seleccione el método de pago" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CONTADO">
                          <span className="flex items-center">
                            <Coins className="mr-2 h-4 w-4" />
                            CONTADO
                          </span>
                        </SelectItem>
                        <SelectItem value="TARJETA">
                          <span className="flex items-center">
                            <CreditCard className="mr-2 h-4 w-4" />
                            TARJETA
                          </span>
                        </SelectItem>
                        <SelectItem value="TRANSFERENCIA">
                          <span className="flex items-center">
                            <Banknote className="mr-2 h-4 w-4" />
                            TRANSFERENCIA
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="button"
                    onClick={handlePaymentSubmit}
                    className="w-full"
                  >
                    Registrar Pago de {formatearMoneda(newPayment.monto || 0)}
                  </Button>
                </form>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Creditos;
