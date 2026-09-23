export interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  sucursal: Sucursal;
}

export interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
  dpi: string;
}

export interface Garantia {
  id: number;
  fechaRecepcion: string;
  estado: string;
  cliente: Cliente;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  codigoProducto: string;
}

export interface RegistroGarantiaFINALPDFType {
  id: number;
  garantiaId: number;
  usuarioId: number;
  productoId: number;
  estado: "REPARADO" | "REEMPLAZADO";
  conclusion: string;
  accionesRealizadas: string;
  fechaRegistro: string;
  producto: Producto;
  usuario: Usuario;
  garantia: Garantia;
}
