import type { Route } from "./crm-route-types";
import {
  instalacionesTecnicoRoute,
  perfilRoute,
  soporteTicketsRoute,
  tecnicoDashboardRoute,
  ticketsTecnicoRoute,
} from "./crm-route-items";

export const routesCrm_Tecnico: Route[] = [
  tecnicoDashboardRoute,
  instalacionesTecnicoRoute,
  ticketsTecnicoRoute,
  soporteTicketsRoute,
  perfilRoute,
];
