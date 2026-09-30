import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
// import { useTheme } from "next-themes";
import {
  AlertTriangle,
  Calendar,
  Check,
  CheckCircle,
  CheckCircle2,
  Coins,
  CreditCard,
  Eye,
  FileText,
  Loader2,
  Percent,
  Plus,
  Printer,
  // Search,
  ShoppingCart,
  Text,
  Trash2,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { CategoriaFiltrar } from "../Utils/Types/CategoyFilter";
// import { jwtDecode } from "jwt-decode";

// import { useSocket } from "@/Context/SocketProvider ";
import { motion } from "framer-motion";
// import { Cliente, Descuento } from "../Utils/Types/CustomersWithDiscount";
const API_URL = import.meta.env.VITE_API_URL;
import dayjs from "dayjs";
import "dayjs/locale/es"; // Importa el idioma español
import localizedFormat from "dayjs/plugin/localizedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Link } from "react-router-dom";
import SelectComponent from "react-select";
import { useStore } from "@/Context/ContextSucursal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import placeholder from "@/assets/images/placeholder.jpg";
import { Label } from "@/components/ui/label";
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.locale("es");

const formatearFecha = (fecha: string | undefined) => {
  let nueva_fecha = dayjs(fecha).format("DD MMMM YYYY, hh:mm:ss A");
  return nueva_fecha;
};
interface Imagen {
  id: number;
  url: string;
  productoId: number;
  creadoEn: string;
}

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  creadoEn: string;
  actualizadoEn: string;
  codigoProducto: string;
  stock: Stock | null;
  categorias: Category[];
  imagenes: Imagen[]; // Nueva propiedad
}

interface Stock {
  id: number;
  productoId: number;
  cantidad: number;
  proveedorId: number;
  costo: number;
  creadoEn: string;
  actualizadoEn: string;
}

interface Category {
  categoria: Categoria1;
  creadoEn: string;
}

interface Categoria1 {
  actualizadoEn: string;
  id: number;
  nombre: string;
}

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  direccion: string;
  creadoEn: string;
  actualizadoEn: string;
  descuentos: Descuento[];
}

interface Descuento {
  id: number;
  porcentaje: number;
  clienteId: number;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

interface Cliente2 {
  actualizadoEn: string;
  correo: string;
  creadoEn: string;
  descuentos: Descuento[];
  direccion: string;
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
}

interface Visita2 {
  actualizadoEn: string;
  cliente: Cliente2;
  clienteId: number;
  creadoEn: string;
  estadoVisita: string;
  fin: string | null;
  id: number;
  inicio: string;
  motivoVisita: string;
  observaciones: string | null;
  tipoVisita: string;
  usuarioId: number;
  ventaId: number | null;
}
type MetodoPagoVenta =
  | "CONTADO"
  | "TARJETA"
  | "TRANSFERENCIA_BANCO"
  | "CREDITO";

const METODOS_CON_REFERENCIA: MetodoPagoVenta[] = [
  "TARJETA",
  "TRANSFERENCIA_BANCO",
];

type SaleData = {
  // Base de la venta
  monto: number;
  montoConDescuento: number;
  metodoPago: MetodoPagoVenta;
  referenciaPago?: string;
  empresaId?: number;
  descuento: number;
  clienteId?: number;
  vendedorId?: number;
  productos: {
    productoId: number;
    codigoProducto: string;
    cantidad: number;
    precio: number;
  }[];

  // Solo para CREDITO (opcionales)
  comentario?: string;
  fechaInicio?: string; // 'YYYY-MM-DD' (opcional; hoy no lo usa el service)
  fechaFin?: string; // 'YYYY-MM-DD' (opcional; hoy no lo usa el service)
};

type Venta = {
  id: number;
  monto: number;
  montoConDescuento: number;
  descuento: number;
  metodoPago: MetodoPagoVenta;
  referenciaPago?: string | null;
  timestamp: string; // ISO 8601 timestamp
  usuarioId: number;
  clienteId: number | null; // Puede ser `null`
  visitaId: number | null; // Puede ser `null`
  // productos: ProductoVenta[];
};
// Tipos para el estado de la información del crédito
type CreditoInfo = {
  comentario: string | null;
  fechaInicio: string | null;
  fechaFin: string | null;
};

const getInitialCreditoInfo = (): CreditoInfo => ({
  comentario: null,
  fechaInicio: dayjs().format("YYYY-MM-DD"),
  fechaFin: dayjs().add(1, "month").format("YYYY-MM-DD"),
});

interface ProductImageCarouselProps {
  images: { url: string }[];
  productName: string;
}

export default function MakeSale() {
  const [cantidades, setCantidades] = useState<Record<number, number>>({});
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1);

  const handleCantidadChange = (id: number, value: number) => {
    setCantidades((prev) => ({
      ...prev,
      [id]: Math.max(
        1,
        Math.min(
          value,
          products.find((p) => p.id === id)?.stock?.cantidad || 1,
        ),
      ),
    }));
  };

  const userId = useStore((state) => state.userId);
  const empresaId = useStore((state) => state.empresaId);
  // Estados
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMetodPago, setSelectedMetodPago] =
    useState<MetodoPagoVenta>("CONTADO");
  const [referenciaPago, setReferenciaPago] = useState("");
  const [creditoInfo, setCreditoInfo] = useState<CreditoInfo>(
    getInitialCreditoInfo(),
  );
  const [registroAbierto, setRegistroAbierto] = useState<Visita2 | null>(null);

  const requiereReferenciaPago =
    METODOS_CON_REFERENCIA.includes(selectedMetodPago);
  const [cart, setCart] = useState<(Producto & { quantity: number })[]>([]); // Agregamos `quantity` al estado del carrito
  const [selectedCustomer, setSelectedCustomer] = useState<Cliente | null>(
    null,
  );
  const [selectedDiscount, setSelectedDiscount] = useState<Descuento | null>(
    null,
  );
  const [descuento, setDescuento] = useState<number>();
  const [nota, setNota] = useState<string>("");
  const [customers, setCustomers] = useState<Cliente[]>([]);
  const [categoria, setCategoria] = useState<CategoriaFiltrar[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);
  // 📌 Estados para productos y paginación
  const [products, setProducts] = useState<Producto[]>([]);
  // const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // 📌 Estados para paginación CORREGIDOS
  const [page, setPage] = useState(1); // Volvemos a usar página
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 8; // Fijo, no variable

  const cancelToken = axios.CancelToken;
  let cancel: any;

  const fetchProducts = async (
    newPage: number,
    filters?: { query?: string; category?: string },
  ) => {
    const query = filters?.query ?? searchTerm;
    const category = filters?.category ?? selectedCategory;

    setIsFetching(true);
    try {
      if (cancel) cancel();

      const resp = await axios.get(`${API_URL}/product/search`, {
        params: {
          query: query.trim(),
          categoria: category,
          page: newPage,
          limit: itemsPerPage,
        },
        cancelToken: new cancelToken((c) => (cancel = c)),
      });

      if (resp.status === 200) {
        const fetched = resp.data.products as Producto[];
        setProducts((prev) => {
          if (newPage === 1) {
            // página 1: sustituye todo
            return fetched;
          }
          // páginas >1: sólo añade no-duplicados
          const toAdd = fetched.filter(
            (fp) => !prev.some((p) => p.id === fp.id),
          );
          return [...prev, ...toAdd];
        });
        setHasMore(newPage < resp.data.totalPages);
      }
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log("Request canceled:", e.message);
      } else {
        console.error(e);
      }
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (page !== 1) {
      // fuerza el cambio de página → activará el efecto [page]
      setPage(1);
    } else {
      // page ya era 1 → disparo explícito de la búsqueda
      fetchProducts(1);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore || isFetching) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { root: viewportRef.current, rootMargin: "200px", threshold: 0.1 },
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isFetching]);
  useEffect(() => {
    const getCustomers = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/customers/all-customers-with-discount`,
        );
        if (response.status === 200) {
          setCustomers(response.data);
        }
      } catch (error) {
        console.error(error);
        toast.error("No se encontraron clientes");
      }
    };

    getCustomers();
  }, []);

  // Obtener categorias
  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        if (response.status === 200) {
          setCategoria(response.data);
        }
      } catch (error) {
        console.error(error);
        toast.error("No se encontraron clientes");
      }
    };

    getCategories();
  }, []);

  const addToCart = (product: Producto, quantity: number) => {
    if (!product.stock || product.stock?.cantidad < quantity) {
      toast.info("Stock insuficiente");
      return;
    }

    const productoExistente = cart.some((prod) => prod.id === product.id);

    if (productoExistente) {
      toast.info("El producto ya está en el carrito");
      return;
    }

    setCart((prevCart) => [...prevCart, { ...product, quantity }]);
    toast.success(`Añadido ${quantity} al Carrito`);
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    toast.success("Eliminado del Carrito");
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) return; // Evitar cantidades negativas
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  // Calcular total con descuento
  const calculateTotalConDescuento = () => {
    const subtotal = cart.reduce(
      (total, item) => total + item.precio * item.quantity,
      0,
    );
    const discountPercentage = selectedDiscount
      ? selectedDiscount.porcentaje / 100
      : 0;
    return Number((subtotal * (1 - discountPercentage)).toFixed(2));
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce(
      (total, item) => total + item.precio * item.quantity,
      0,
    );

    return subtotal;
  };

  const formatoCartData = (
    cart: (Producto & { quantity: number })[],
  ): SaleData => {
    const base: SaleData = {
      monto: calculateTotal(),
      montoConDescuento: calculateTotalConDescuento(),
      metodoPago: selectedMetodPago,
      empresaId: empresaId ?? undefined,
      descuento: selectedDiscount?.porcentaje ?? 0,
      clienteId: selectedCustomer?.id,
      vendedorId: userId ?? undefined,
      productos: cart.map((item) => ({
        productoId: item.id,
        codigoProducto: item.codigoProducto,
        cantidad: item.quantity,
        precio: item.precio,
      })),
      ...(requiereReferenciaPago && referenciaPago.trim()
        ? { referenciaPago: referenciaPago.trim().toUpperCase() }
        : {}),
    };

    if (selectedMetodPago === "CREDITO") {
      return {
        ...base,
        comentario: creditoInfo.comentario ?? undefined,
        // Estas dos son opcionales; tu service actual no las lee:
        fechaInicio: creditoInfo.fechaInicio ?? undefined,
        fechaFin: creditoInfo.fechaFin ?? undefined,
      };
    }

    return base;
  };

  const clearCart = () => {
    setCart([]);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saleMade, setSaleMade] = useState<Venta>();
  const [openDialogSaleMade, setOpenDialogSaleMade] = useState(false);

  const formatearMoneda = (cantidad: number | undefined): string => {
    if (cantidad === undefined) {
      return "N/A";
    }

    return new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
    }).format(cantidad);
  };

  const resetSaleForm = () => {
    clearCart();

    // En una visita activa el cliente pertenece a la visita y se conserva.
    if (!registroAbierto) {
      setSelectedCustomer(null);
    }

    setSelectedDiscount(null);
    setDescuento(undefined);
    setNota("");

    setSelectedMetodPago("CONTADO");
    setReferenciaPago("");
    setCreditoInfo(getInitialCreditoInfo());

    setCantidades({});
    setCantidadSeleccionada(1);

    setSearchTerm("");
    setSelectedCategory("");

    setShowCartModal(false);
    setConfirmSale(false);

    setPage(1);
    setHasMore(true);
    setProducts([]);
  };

  const validateSaleData = (formateado: SaleData): boolean => {
    if (
      !formateado.clienteId ||
      !formateado.vendedorId ||
      !formateado.empresaId ||
      !formateado.metodoPago ||
      typeof formateado.monto !== "number" ||
      typeof formateado.montoConDescuento !== "number" ||
      !formateado.productos.length
    ) {
      toast.info("Faltan campos sin llenar");
      return false;
    }

    if (requiereReferenciaPago && !formateado.referenciaPago?.trim()) {
      toast.info("Ingresa la referencia del pago");
      return false;
    }

    if (
      formateado.metodoPago === "CREDITO" &&
      formateado.fechaInicio &&
      formateado.fechaFin &&
      formateado.fechaFin < formateado.fechaInicio
    ) {
      toast.info("La fecha fin no puede ser menor que la fecha inicio");
      return false;
    }

    return true;
  };

  const handleSuccessfulSale = async (venta: Venta) => {
    // Guardamos la respuesta antes de reiniciar el formulario.
    setSaleMade(venta);

    // La limpieza ocurre únicamente después de que el servidor respondió con éxito.
    resetSaleForm();

    // Recarga el catálogo sin depender de estados que React aún no haya actualizado.
    await fetchProducts(1, { query: "", category: "" });

    toast.success("Venta creada");

    setTimeout(() => {
      setOpenDialogSaleMade(true);
    }, 300);
  };

  const sendCartData = async (cart: (Producto & { quantity: number })[]) => {
    const formateado = formatoCartData(cart);

    console.log("Payload venta:", formateado);

    if (!validateSaleData(formateado)) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await axios.post<Venta>(`${API_URL}/sale`, formateado);

      await handleSuccessfulSale(response.data);
    } catch (error) {
      console.error("Error al crear venta:", error);
      // No se limpia el formulario cuando el envío falla.
      toast.error("Error al crear venta");
    } finally {
      setIsSubmitting(false);
    }
  };

  //----------------
  useEffect(() => {
    const getRegistOpen = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `${API_URL}/date/regist-open/${userId}`,
          );

          if (response.status === 200) {
            const visitaData = response.data;

            // Actualiza el registro abierto
            setRegistroAbierto(visitaData);

            // Usa la data recibida directamente para actualizar el selectedCustomer
            setSelectedCustomer({
              id: visitaData?.cliente?.id ?? 0, // Asegura que no sea undefined
              nombre: visitaData?.cliente?.nombre ?? "", // Proporciona un valor por defecto si es undefined
              correo: visitaData?.cliente?.correo ?? "",
              apellido: visitaData?.cliente?.apellido ?? "",
              telefono: visitaData?.cliente?.telefono ?? "",
              direccion: visitaData?.cliente?.direccion ?? "",
              creadoEn: visitaData?.cliente?.creadoEn ?? "",
              actualizadoEn: visitaData?.cliente?.actualizadoEn ?? "",
              descuentos: visitaData?.cliente?.descuentos ?? [], // Proporciona un arreglo vacío si es undefined
            });
          }
        } catch (error) {
          console.error("Error al obtener registro abierto:", error);
        }
      }
    };

    if (userId && userId) {
      getRegistOpen();
    }
  }, [userId]);

  async function realizarVentaConVisita(
    cart: (Producto & { quantity: number })[],
  ) {
    const formateado = formatoCartData(cart);

    if (!registroAbierto?.id) {
      toast.info("No hay una visita activa para vincular la venta");
      return;
    }

    if (!validateSaleData(formateado)) {
      return;
    }

    const payload = {
      ...formateado,
      registroVisitaId: registroAbierto.id,
      visita: true,
    };

    console.log("Payload venta con visita:", payload);

    try {
      setIsSubmitting(true);

      const response = await axios.post<Venta>(
        `${API_URL}/sale/sale-for-regis`,
        payload,
      );

      await handleSuccessfulSale(response.data);
    } catch (error) {
      console.error("Error al crear venta con visita:", error);
      // No se limpia el formulario cuando el envío falla.
      toast.error("Error al crear venta");
    } finally {
      setIsSubmitting(false);
    }
  }

  const requestCustomDiscount = async () => {
    if (!selectedCustomer?.id || !userId || !descuento) {
      toast.warning("Faltan datos para la solicitud");
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/discount/request-discount`,
        {
          clienteId: selectedCustomer?.id, // ID del cliente
          justificacion: nota || "", // Justificación o motivo del descuento
          usuarioId: userId, // ID del usuario/vendedor
          descuentoSolicitado: Number(descuento), // Porcentaje del descuento solicitado
          motivo: nota || "Sin motivo adicional", // Motivo adicional
        },
      );

      if (response.status == 200 || response.status == 201) {
        // console.log("Solicitud enviada con éxito");
        toast.success("Solicitud enviada. Esperando respuesta...");
        setNota("");
        setDescuento(0);
      } else {
        console.error("Error al enviar la solicitud:", response.data.error);
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  const options = customers.map((customer) => ({
    value: customer.id,
    label: `${customer.nombre} ${customer.apellido || ""}`,
  }));

  const opcionesDescuento = selectedCustomer?.descuentos.map((desc) => ({
    value: desc.id,
    label: `${desc.porcentaje.toString()}`,
  }));

  useEffect(() => {
    if (!creditoInfo.fechaInicio) return;
    const nuevaFin = dayjs(creditoInfo.fechaInicio)
      .add(1, "month")
      .format("YYYY-MM-DD");

    setCreditoInfo((prev) =>
      prev.fechaFin === nuevaFin ? prev : { ...prev, fechaFin: nuevaFin },
    );
  }, [creditoInfo.fechaInicio]);

  const [confirmSale, setConfirmSale] = useState(false);

  function ProductImageCarousel({
    images,
    productName,
  }: ProductImageCarouselProps) {
    return (
      <div className="relative w-full">
        <Carousel className="w-full">
          <CarouselContent>
            {images.length > 0 ? (
              images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-4">
                        <img
                          src={image.url ? image.url : placeholder}
                          alt={`${productName} - Image ${index + 1}`}
                          className="object-cover w-full h-full rounded-md"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-4">
                      <img
                        src={placeholder}
                        alt="Imagen no disponible"
                        className="object-cover w-full h-full rounded-md"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 scale-75 z-10 bg-white/70 shadow-sm" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 scale-75 z-10 bg-white/70 shadow-sm" />
        </Carousel>
      </div>
    );
  }

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [product, setProduct] = useState<Producto>();
  const handleQuickView = (product: Producto) => {
    setIsQuickViewOpen(true);
    setProduct(product);
  };
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Selección de Cliente y Descuento */}
      <div className="w-full p-4 ">
        <Card className="mb-8 shadow-sm">
          <CardContent>
            <h3 className="text-md font-semibold mb-4 pt-2">
              Selección de Cliente
            </h3>
            <div>
              <SelectComponent
                options={options}
                isClearable={true}
                isDisabled={!!registroAbierto} // Deshabilitar si hay registro abierto
                value={
                  registroAbierto
                    ? {
                        value: registroAbierto.cliente.id,
                        label: `${registroAbierto.cliente.nombre} ${
                          registroAbierto.cliente.apellido || ""
                        }`,
                      }
                    : selectedCustomer
                      ? {
                          value: selectedCustomer.id,
                          label: `${selectedCustomer.nombre} ${
                            selectedCustomer.apellido || ""
                          }`,
                        }
                      : null
                }
                onChange={(selectedOption) => {
                  if (!registroAbierto) {
                    if (selectedOption === null) {
                      setSelectedCustomer(null);
                      setSelectedDiscount(null);
                    } else {
                      const selectedCustomer =
                        customers.find(
                          (customer) => customer.id === selectedOption.value,
                        ) || null;
                      setSelectedCustomer(selectedCustomer);
                      setSelectedDiscount(null);
                    }
                  }
                }}
                placeholder="Seleccionar cliente..."
                noOptionsMessage={() => "No se encontró el cliente."}
                isSearchable
                className="text-black"
              />
            </div>

            {selectedCustomer && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Descuentos disponibles:</h3>

                <div>
                  <SelectComponent
                    options={opcionesDescuento || []} // Pasar las opciones de descuento
                    isClearable={true} // Permitir limpiar la selección
                    value={
                      selectedDiscount
                        ? {
                            value: selectedDiscount.id,
                            label: `${selectedDiscount.porcentaje}%`,
                          }
                        : null
                    }
                    onChange={(selectedOption) => {
                      if (selectedOption === null) {
                        setSelectedDiscount(null);
                      } else {
                        const discount = selectedCustomer?.descuentos.find(
                          (desc) => desc.id === selectedOption.value,
                        );
                        setSelectedDiscount(discount || null);
                      }
                    }}
                    placeholder="Seleccionar descuento"
                    noOptionsMessage={() => "No hay descuentos disponibles"}
                    isSearchable
                    className="text-black"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-4 shadow-sm bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <Percent className="w-5 h-5" />
              Solicitar Descuento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Input
                  type="number"
                  placeholder="Porcentaje"
                  min="0"
                  max="100"
                  value={descuento || ""}
                  onChange={(e) => setDescuento(Number(e.target.value))}
                  className="pl-8 pr-4 py-2 w-full"
                />
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 pointer-events-none">
                  %
                </span>
              </div>
            </div>
            <div className="relative">
              <Textarea
                placeholder="Justificación del descuento"
                onChange={(e) => setNota(e.target.value)}
                value={nota}
                className="pl-10 resize-none"
                rows={4}
              />
              <FileText className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="button"
              // disabled={isRequesting}
              onClick={requestCustomDiscount}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
            >
              Solicitar Descuento Personalizado
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Método de pago / resumen del carrito */}
      <div className="w-full p-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="h-5 w-5" />
                Método de pago
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Select
                value={selectedMetodPago}
                onValueChange={(value) => {
                  const metodo = value as MetodoPagoVenta;
                  setSelectedMetodPago(metodo);

                  if (!METODOS_CON_REFERENCIA.includes(metodo)) {
                    setReferenciaPago("");
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione método de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONTADO">CONTADO</SelectItem>
                  <SelectItem value="TARJETA">TARJETA</SelectItem>
                  <SelectItem value="TRANSFERENCIA_BANCO">
                    TRANSFERENCIA BANCARIA
                  </SelectItem>
                  <SelectItem value="CREDITO">CRÉDITO</SelectItem>
                </SelectContent>
              </Select>

              {requiereReferenciaPago && (
                <div className="space-y-2 rounded-lg border p-4">
                  <Label htmlFor="referenciaPago">
                    Referencia de pago <span className="text-red-500">*</span>
                  </Label>

                  <Input
                    id="referenciaPago"
                    type="text"
                    maxLength={100}
                    autoComplete="off"
                    value={referenciaPago}
                    onChange={(e) => setReferenciaPago(e.target.value)}
                    placeholder={
                      selectedMetodPago === "TRANSFERENCIA_BANCO"
                        ? "Ej. número de transferencia o boleta"
                        : "Ej. número de autorización o voucher"
                    }
                  />

                  <p className="text-xs text-muted-foreground">
                    {selectedMetodPago === "TRANSFERENCIA_BANCO"
                      ? "Ingresa la referencia proporcionada por el banco."
                      : "Ingresa la referencia o autorización de la transacción."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="h-5 w-5" />
                Resumen del carrito
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground">Productos</p>
                  <p className="text-lg font-semibold">{cart.length}</p>
                </div>

                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground">Total</p>
                  <p className="text-lg font-semibold">
                    {formatearMoneda(calculateTotalConDescuento())}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => setShowCartModal(true)}
                className="w-full bg-red-500 text-white hover:bg-red-600"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Ver carrito ({cart.length})
              </Button>
            </CardContent>
            <Dialog open={showCartModal} onOpenChange={setShowCartModal}>
              <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[700px] h-[90vh] max-h-[800px] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                  <DialogTitle className="flex items-center justify-between text-xl">
                    <span className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Carrito de Compras
                    </span>
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-500">
                    Productos añadidos al carrito.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-grow mt-4 pr-4">
                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      El carrito está vacío
                    </p>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2 sm:mb-0">
                          {/* Imagen del producto con placeholder si no tiene imágenes */}
                          <img
                            src={
                              item.imagenes.length > 0
                                ? item.imagenes[0].url
                                : placeholder
                            }
                            alt={item.nombre}
                            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-md object-cover aspect-square"
                          />

                          {/* Nombre y precio */}
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">
                              {item.nombre}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatearMoneda(item.precio)}
                            </p>
                          </div>
                        </div>

                        {/* Controles de cantidad y eliminación */}
                        <div className="flex items-center gap-10">
                          <Input
                            type="number"
                            min="1"
                            max={item.stock?.cantidad}
                            value={item.quantity}
                            onChange={(e) => {
                              const value = e.target.value
                                ? Number.parseInt(e.target.value)
                                : 1;
                              updateQuantity(item.id, value);
                            }}
                            className="w-16 text-center"
                            aria-label={`Cantidad de ${item.nombre}`}
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                            aria-label={`Eliminar ${item.nombre} del carrito`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </ScrollArea>

                <div className="flex-shrink-0 mt-4 space-y-4">
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm">
                    <p className="font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
                      <CreditCard className="w-4 h-4" />
                      Total: {formatearMoneda(calculateTotal())}
                    </p>
                    <p className="font-semibold flex items-center gap-2 text-green-600 dark:text-green-400">
                      <Percent className="w-4 h-4" />
                      Total con descuento:{" "}
                      {formatearMoneda(calculateTotalConDescuento())}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Percent className="w-4 h-4" />
                      Descuento:{" "}
                      {selectedDiscount
                        ? `${selectedDiscount.porcentaje}%`
                        : "No seleccionado"}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Cliente:{" "}
                      {registroAbierto
                        ? registroAbierto.cliente.nombre
                        : selectedCustomer?.nombre}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Método de pago: {selectedMetodPago}
                    </p>
                    {requiereReferenciaPago && (
                      <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Referencia: {referenciaPago.trim() || "Pendiente"}
                      </p>
                    )}
                  </div>

                  <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="default"
                      onClick={() => {
                        if (requiereReferenciaPago && !referenciaPago.trim()) {
                          toast.info("Ingresa la referencia del pago");
                          return;
                        }

                        setConfirmSale(true);
                      }}
                      disabled={isSubmitting || cart.length === 0}
                      className="w-full lg:w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                    >
                      Hacer venta
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setShowCartModal(false)}
                      className="w-full sm:w-auto lg:w-full"
                    >
                      Cerrar
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </Card>
        </div>
      </div>

      {/* DONDE METER INFO DEL CREDITO */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {selectedMetodPago === "CREDITO" && (
          <div className="col-span-full">
            <div className="w-full mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
              {/* ontenido */}
              <h3 className="text-center text-lg font-semibold">
                Detalles del credito
              </h3>
              <div className="flex items-center gap-4">
                <Text className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <Label
                    htmlFor="fechaInicio"
                    className="text-sm font-medium text-gray-700 mb-1 block"
                  >
                    Fecha inicio
                  </Label>
                  <Input
                    id="fechaInicio"
                    type="date"
                    value={creditoInfo.fechaInicio || ""}
                    onChange={(e) =>
                      setCreditoInfo((prev) => ({
                        ...prev,
                        fechaInicio: e.target.value,
                      }))
                    }
                  />

                  <Label
                    htmlFor="fechaFin"
                    className="text-sm font-medium text-gray-700 mb-1 block"
                  >
                    Fecha fin
                  </Label>
                  <Input
                    id="fechaFin"
                    type="date"
                    min={creditoInfo.fechaInicio || undefined} // opcional: no permitir fin < inicio
                    value={creditoInfo.fechaFin || ""}
                    onChange={(e) =>
                      setCreditoInfo((prev) => ({
                        ...prev,
                        fechaFin: e.target.value,
                      }))
                    }
                  />

                  <Label
                    htmlFor="comentario"
                    className="text-sm font-medium text-gray-700 mb-1 block"
                  >
                    Comentario
                  </Label>
                  <Textarea
                    id="comentario"
                    placeholder="Opcional"
                    value={creditoInfo.comentario || ""}
                    onChange={(e) =>
                      setCreditoInfo((prev) => ({
                        ...prev,
                        comentario: e.target.value,
                      }))
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Productos Filtrados */}
      <div className="w-full p-4">
        <Card className="mb-4 shadow-sm">
          <CardContent>
            <div className="pt-5 flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="Buscar productos por nombre o código"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />

                {/* Botón de limpiar en la posición de la lupa */}
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas">Todas las categorías</SelectItem>
                  {categoria?.map((category) => (
                    <SelectItem key={category.nombre} value={category.nombre}>
                      {category.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* <ScrollArea className="h-[calc(100vh-100px)] shadow-xl rounded-lg"> */}

        <ScrollArea
          ref={viewportRef} // ✅ Añade ref al contenedor de scroll
          className="h-[calc(100vh-100px)] shadow-sm rounded-lg"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {/* SKELETON XD */}
            {isFetching &&
              Array.from({ length: 4 }).map((_, index) => (
                <div key={`skeleton-${index}`} className="animate-pulse">
                  <Card className="h-full flex flex-col p-4">
                    <div className="w-full aspect-w-1 aspect-h-1 bg-gray-300 rounded-md"></div>
                    <div className="h-6 bg-gray-300 rounded mt-4 w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded mt-2 w-1/2"></div>
                    <div className="h-8 bg-gray-300 rounded mt-4 w-full"></div>
                  </Card>
                </div>
              ))}

            {products &&
              products.map((product) => (
                <motion.div
                  key={`product-${product.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className="h-full flex flex-col hover:shadow-lg transition-all duration-300"
                    onMouseEnter={() => setHoveredProduct(product.id)}
                  >
                    <CardContent className="flex-grow p-4 relative">
                      <div className="aspect-w-1 aspect-h-1 w-full mb-4 relative">
                        <ProductImageCarousel
                          images={product.imagenes}
                          productName={product.nombre}
                        />
                        {hoveredProduct === product.id && (
                          <Button
                            variant="secondary"
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/60 text-white p-3 rounded-full transition-all duration-300"
                            onClick={() => handleQuickView(product)}
                          >
                            <Eye className="h-6 w-6" />
                          </Button>
                        )}
                      </div>

                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {product.nombre}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {product.codigoProducto}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-2">
                        {product.categorias.map((cat, index) => (
                          <Badge
                            key={`category-${product.id}-${index}`}
                            variant="secondary"
                          >
                            {cat.categoria.nombre}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-between items-center mb-2">
                        <p className="font-bold text-lg">
                          Q{product.precio.toFixed(2)}
                        </p>
                        <Badge
                          variant={
                            product.stock && product.stock.cantidad > 0
                              ? "default"
                              : "destructive"
                          }
                        >
                          {product.stock && product.stock.cantidad > 0
                            ? `${product.stock.cantidad} En stock`
                            : "Agotado"}
                        </Badge>
                      </div>

                      {/* Input para la cantidad */}
                      <div className="flex items-center gap-2 mt-4">
                        <Input
                          type="number"
                          min="1"
                          max={product.stock?.cantidad}
                          value={cantidades[product.id] ?? 1}
                          onChange={(e) =>
                            handleCantidadChange(
                              product.id,
                              parseInt(e.target.value) || 1,
                            )
                          }
                          className="w-16 text-center"
                          aria-label={`Cantidad de ${product.nombre}`}
                        />
                      </div>
                    </CardContent>

                    <CardFooter className="p-4">
                      <Button
                        onClick={() => {
                          const cantidad = cantidades[product.id] ?? 1;
                          if (cart.some((prod) => prod.id === product.id)) {
                            removeFromCart(product.id);
                          } else {
                            addToCart(product, cantidad);
                          }
                        }}
                        disabled={
                          !product.stock || product.stock.cantidad === 0
                        }
                        className={`w-full font-semibold text-white rounded-lg shadow-sm ${
                          cart.some((prod) => prod.id === product.id)
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-blue-700 hover:bg-blue-800"
                        }`}
                      >
                        {cart.some((prod) => prod.id === product.id) ? (
                          <>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Quitar del carrito
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Añadir{" "}
                            {cantidades[product.id] > 1 &&
                              `(${cantidades[product.id]})`}
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
          </div>

          <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
            {product && (
              <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[600px] lg:max-w-[720px] xl:max-w-[800px] max-h-screen p-4 overflow-hidden">
                <ScrollArea className="h-[80vh] pr-2">
                  <DialogHeader>
                    <DialogTitle className="text-xl md:text-2xl font-bold text-center">
                      {product.nombre}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground text-center">
                      Código: {product.codigoProducto}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-6 py-4 md:grid-cols-2">
                    <div className="order-2 md:order-1 flex justify-center">
                      <Carousel className="w-full max-w-xs">
                        <CarouselContent>
                          {product.imagenes.length > 0 ? (
                            product.imagenes.map((image, index) => (
                              <CarouselItem key={index}>
                                <div className="p-1">
                                  <img
                                    src={
                                      image.url.length > 0
                                        ? image.url
                                        : placeholder
                                    }
                                    alt={`${product.nombre} - Imagen ${
                                      index + 1
                                    }`}
                                    className="w-full h-64 object-cover rounded-md"
                                  />
                                </div>
                              </CarouselItem>
                            ))
                          ) : (
                            <CarouselItem>
                              <div className="p-1">
                                <img
                                  src={placeholder}
                                  alt="Imagen no disponible"
                                  className="w-full h-64 object-cover rounded-md"
                                />
                              </div>
                            </CarouselItem>
                          )}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                      </Carousel>
                    </div>

                    <div className="order-1 md:order-2">
                      <h4 className="font-semibold mb-2">Descripción</h4>
                      <p className="text-sm mb-4">{product.descripcion}</p>
                      <Separator className="my-4" />
                      <h4 className="font-semibold mb-2">Detalles</h4>
                      <ul className="text-sm space-y-2">
                        <li>
                          <strong>Precio:</strong> Q{product.precio.toFixed(2)}
                        </li>
                        <li>
                          <strong>Estado:</strong>
                          <Badge
                            variant={
                              product.stock && product.stock.cantidad > 0
                                ? "default"
                                : "destructive"
                            }
                            className="ml-2"
                          >
                            {product.stock && product.stock.cantidad > 0
                              ? "En stock"
                              : "Agotado"}
                          </Badge>
                        </li>
                        {product.stock && (
                          <li>
                            <strong>Cantidad disponible:</strong>{" "}
                            {product.stock.cantidad}
                          </li>
                        )}
                        <li>
                          <strong>Categorías:</strong>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {product.categorias.map((cat, index) => (
                              <Badge key={index} variant="outline">
                                {cat.categoria.nombre}
                              </Badge>
                            ))}
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Input de cantidad */}
                  <div className="w-full flex justify-center mt-4">
                    <Input
                      type="number"
                      min="1"
                      max={product.stock?.cantidad}
                      value={cantidadSeleccionada}
                      onChange={(e) =>
                        setCantidadSeleccionada(
                          Math.max(
                            1,
                            Math.min(
                              parseInt(e.target.value) || 1,
                              product.stock?.cantidad || 1,
                            ),
                          ),
                        )
                      }
                      className="w-24 text-center"
                    />
                  </div>
                </ScrollArea>

                {/* Botones */}
                <div className="flex justify-end gap-4 mt-6">
                  <Button
                    onClick={() => addToCart(product, cantidadSeleccionada)}
                    disabled={!product.stock || product.stock.cantidad === 0}
                    className="w-full"
                  >
                    {cart.some((prod) => prod.id === product.id) ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        En el carrito
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Añadir ({cantidadSeleccionada})
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            )}
          </Dialog>

          {/* DETECTOR DE CARGA dentro de ScrollArea */}
          {/* <div ref={loadMoreRef} className="h-16"></div> */}
          {/* </div> */}
          <div ref={sentinelRef} className="h-8"></div>
        </ScrollArea>

        {isFetching && (
          <p className="text-center text-xl font-bold">CARGANDO...</p>
        )}
      </div>

      <Dialog open={openDialogSaleMade} onOpenChange={setOpenDialogSaleMade}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center text-lg font-semibold text-gray-900 dark:text-white">
              Venta registrada exitosamente
            </DialogTitle>
            <DialogDescription className="text-center text-gray-500 dark:text-white">
              Se ha registrado tu venta y ahora puedes generar un comprobante
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-3">
            <div className="flex items-center text-sm text-gray-500 dark:text-white">
              <span className="mr-2 font-medium">Numero de venta:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                #{saleMade?.id}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-white">
              <Calendar className="mr-2 h-4 w-4" />
              <span className="mr-2 font-medium">Fecha y hora de venta:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatearFecha(saleMade?.timestamp)}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-white">
              <Coins className="mr-2 h-4 w-4" />
              <span className="mr-2 font-medium">Total de la venta:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatearMoneda(saleMade?.monto)}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-white">
              <Coins className="mr-2 h-4 w-4" />
              <span className="mr-2 font-medium">Monto con descuento:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatearMoneda(saleMade?.montoConDescuento)}
              </span>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="destructive"
              onClick={() => setOpenDialogSaleMade(false)}
              className="inline-flex items-center w-full"
            >
              <X className="mr-2 h-4 w-4" />
              Cerrar
            </Button>
            <Link to={`/marcas-gt/comprobante-venta/${saleMade?.id}`}>
              <Button
                variant="default"
                className="inline-flex items-center w-full"
              >
                <Printer className="mr-2 h-4 w-4" />
                Imprimir Comprobante
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmSale} onOpenChange={setConfirmSale}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center text-xl font-semibold text-primary">
              <AlertTriangle className="w-6 h-6 mr-2 text-warning" />
              Confirmar Venta
            </DialogTitle>
            <DialogDescription className="text-center pt-2 text-muted-foreground">
              ¿Estás seguro de que deseas realizar esta venta?
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto text-warning mb-4" />
            <div className="space-y-2">
              <p className="flex items-center justify-center text-sm text-muted-foreground">
                <Coins className="w-4 h-4 mr-2 text-primary" />
                Total a pagar:{" "}
                <span className="font-semibold ml-1">
                  Q{calculateTotalConDescuento()}
                </span>
              </p>
              <p className="flex items-center justify-center text-sm text-muted-foreground">
                <User className="w-4 h-4 mr-2 text-primary" />
                Cliente:{" "}
                <span className="font-semibold ml-1">
                  {registroAbierto
                    ? registroAbierto.cliente.nombre
                    : selectedCustomer?.nombre}
                </span>
              </p>
              <p className="flex items-center justify-center text-sm text-muted-foreground">
                <CreditCard className="w-4 h-4 mr-2 text-primary" />
                Método de pago:{" "}
                <span className="font-semibold ml-1">{selectedMetodPago}</span>
              </p>
              {requiereReferenciaPago && (
                <p className="flex items-center justify-center text-sm text-muted-foreground">
                  <FileText className="w-4 h-4 mr-2 text-primary" />
                  Referencia:{" "}
                  <span className="font-semibold ml-1">
                    {referenciaPago.trim()}
                  </span>
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
            <Button
              onClick={() => {
                if (registroAbierto) {
                  realizarVentaConVisita(cart);
                } else {
                  sendCartData(cart);
                }
              }}
              disabled={isSubmitting || cart.length === 0}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Procesando...
                </span>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirmar venta
                </>
              )}
            </Button>
            <Button
              variant="destructive"
              onClick={() => setConfirmSale(false)}
              className="w-full"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
