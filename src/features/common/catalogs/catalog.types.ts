export interface ProductSelectable {
  id: number;
  codigo: string;
  nombre: string;
  precio: string;
}

export interface ProviderSelectable {
  id: number;
  nombre: string;
}

export interface UserSelectable {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  activo: boolean;
  empresaId: number | null;
}

export interface CustomerSelectable {
  id: number;
  nombre: string;
  apellido: string | null;
  nombreCompleto: string;
  telefono: string;
  correo: string | null;
  direccion: string;
}

export interface VisitSelectable {
  id: number;
  clienteId: number;
  usuarioId: number;
  estado: string;
  inicio: string;
  fin: string | null;
  cliente: {
    id: number;
    nombre: string;
    apellido?: string | null;
  };
  vendedor: {
    id: number;
    nombre: string;
    correo: string;
    rol: string;
  };
}

export interface LegacyProductRecord {
  id: number;
  codigoProducto: string;
  nombre: string;
  precio: string | number;
}

export interface LegacyProviderRecord {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface LegacyUserRecord {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  activo: boolean;
  empresaId: number | null;
}

export interface LegacyCustomerRecord {
  id: number;
  nombre: string;
  apellido?: string | null;
  telefono: string;
  correo?: string | null;
  direccion: string;
}

export interface LegacyVisitRecord {
  id: number;
  clienteId: number;
  usuarioId: number;
  estadoVisita: string;
  inicio: string;
  fin: string | null;
  cliente: {
    id: number;
    nombre: string;
    apellido?: string | null;
  };
  vendedor: {
    id: number;
    nombre: string;
    correo: string;
    rol: string;
  };
}
