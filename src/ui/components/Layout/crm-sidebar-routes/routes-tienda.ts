import type { Route } from "./crm-route-types";
import {
  clientesListadoRoute,
  dashboardRoute,
  galeriaRoute,
  perfilRoute,
  soporteTicketsRoute,
} from "./crm-route-items";

export const routesCrm_Tienda: Route[] = [
  dashboardRoute,
  clientesListadoRoute,
  soporteTicketsRoute,
  galeriaRoute,
  perfilRoute,
];
