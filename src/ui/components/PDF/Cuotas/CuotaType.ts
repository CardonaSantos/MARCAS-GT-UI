export type CuotaType = {
  id: number;
  ventaCuotaId: number;
  monto: number;
  fechaVencimiento: string | null;
  fechaPago: string;
  estado: "PAGADA" | "PENDIENTE" | "CANCELADA"; // Ajustar según los posibles estados
  usuarioId: number;
  creadoEn: string;
  actualizadoEn: string;
  comentario: string;
  usuario: {
    id: number;
    nombre: string;
    rol: "ADMIN" | "USUARIO" | "SUPERVISOR"; // Ajustar según los roles disponibles
  };
  ventaCuota: {
    cliente: {
      id: number;
      nombre: string;
      dpi: string;
    };
    productos: {
      producto: {
        id: number;
        nombre: string;
        codigoProducto: string;
        descripcion: string;
      };
    }[];
  };
};
