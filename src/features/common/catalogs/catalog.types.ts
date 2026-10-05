export interface ProductSelectable {
  id: number;
  codigo: string;
  nombre: string;
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
}

export interface LegacyProductRecord {
  id: number;
  codigoProducto: string;
  nombre: string;
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
}
