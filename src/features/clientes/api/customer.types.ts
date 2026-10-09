/** Contratos de POST /customers y customer-location. */
export interface CustomerDepartment {
  id: number;
  nombre: string;
}
export interface CustomerMunicipality {
  id: number;
  nombre: string;
  departamentoId: number;
}
export interface CreateCustomerPayload {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  direccion: string;
  departamentoId?: number;
  municipioId?: number;
  latitud?: number;
  longitud?: number;
  tipoCliente?: string;
  categoriasInteres: string[];
  volumenCompra?: string;
  presupuestoMensual?: string;
  preferenciaContacto?: string;
  comentarios?: string;
  descuentoInicial?: number;
}
export interface CreatedCustomer {
  id: number;
  nombre: string;
  apellido: string | null;
  correo: string | null;
  telefono: string;
  direccion: string;
  creadoEn: string;
}
