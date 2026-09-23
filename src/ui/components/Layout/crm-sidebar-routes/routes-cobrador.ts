import type { Route } from "./crm-route-types";
import {
  clientesRoute,
  creditosRoute,
  dashboardRoute,
  perfilRoute,
  rutasCobroRoute,
  soporteTicketsRoute,
} from "./crm-route-items";

export const routesCrm_Cobrador: Route[] = [
  dashboardRoute,
  clientesRoute,
  soporteTicketsRoute,
  rutasCobroRoute,
  creditosRoute,
  perfilRoute,
];
