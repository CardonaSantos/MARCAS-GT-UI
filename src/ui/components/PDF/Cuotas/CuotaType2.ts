export type CuotaType2 = {
  id: number;
  monto: number;
  fechaPago: string; // ISO date
  estado: "PAGADA" | "PENDIENTE" | "CANCELADA"; // Estados posibles
  comentario: string;
  usuario: {
    id: number;
    nombre: string;
    rol: "ADMIN" | "USUARIO" | "SUPERVISOR"; // Ajustar según los roles disponibles
  };
  cliente: {
    id: number;
    nombre: string;
    dpi: string;
  };
  productos: {
    id: number;
    nombre: string;
    descripcion: string;
    codigoProducto: string;
  }[];
};
