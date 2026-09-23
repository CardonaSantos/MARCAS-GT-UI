import type { Route } from "./crm-route-types";

import {
  botMensajeriaRoute,
  clientesRoute,
  creditosRoute,
  dashboardRoute,
  desinstalacionesRoute,
  instalacionesRoute,
  perfilRoute,
  plantillasContratosRoute,
  pppoeOficinaRoute,
  registrosEliminadosRoute,
  reportsRoute,
  rutasCobroRoute,
  sectoresRoute,
  soporteRoute,
} from "./crm-route-items";

export const routesCrm_Oficina: Route[] = [
  dashboardRoute,

  clientesRoute,

  instalacionesRoute,

  pppoeOficinaRoute,

  soporteRoute,

  desinstalacionesRoute,

  sectoresRoute,

  botMensajeriaRoute,

  plantillasContratosRoute,

  rutasCobroRoute,

  creditosRoute,

  registrosEliminadosRoute,

  reportsRoute,

  perfilRoute,
];
