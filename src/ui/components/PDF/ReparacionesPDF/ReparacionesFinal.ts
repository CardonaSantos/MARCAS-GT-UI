interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  dpi: string;
  direccion: string;
}

interface Usuario {
  id: number;
  nombre: string;
  rol: string;
}

interface Producto {
  id: number;
  nombre: string;
  codigoProducto: string;
  descripcion: string;
}

interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
}

interface UsuarioAtiende {
  id: number;
  nombre: string;
  rol: string; // Ajustar según los roles disponibles
}

interface RegistroReparacion {
  id: number;
  reparacionId: number;
  usuarioId: number;
  estado: string;
  accionesRealizadas: string;
  fechaRegistro: string; // ISO date string
  comentarioFinal: string;
  usuario: UsuarioAtiende; // Relación con el usuario que realizó la acción
}

export interface ReparacionRegistroFinal {
  id: number;
  usuarioId: number;
  sucursalId: number;
  clienteId: number;
  productoId: number | null;
  productoExterno: string | null;
  problemas: string;
  observaciones: string | null;
  fechaRecibido: string;
  fechaEntregado: string | null;
  estado: string;
  hojaSolucion: string | null;
  creadoEn: string;
  actualizadoEn: string;
  cliente: Cliente;
  usuario: Usuario;
  producto: Producto | null;
  sucursal: Sucursal;
  registros: RegistroReparacion[];
}
