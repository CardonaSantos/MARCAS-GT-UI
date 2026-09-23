import type { Route } from "./crm-route-types";

import {
  botMensajeriaRoute,
  clientesRoute,
  creditosRoute,
  dashboardRoute,
  desinstalacionesRoute,
  facturacionZonaRoute,
  instalacionesRoute,
  opticoRoute,
  perfilRoute,
  plantillasContratosRoute,
  pppoeRoute,
  registrosEliminadosRoute,
  reportsRoute,
  rutasCobroRoute,
  sectoresRoute,
  serviciosRoute,
  soporteRoute,
} from "./crm-route-items";

export const routesCrm_CoordinadorOperaciones: Route[] = [
  dashboardRoute,

  clientesRoute,

  instalacionesRoute,

  pppoeRoute,

  soporteRoute,

  desinstalacionesRoute,

  serviciosRoute,

  facturacionZonaRoute,

  sectoresRoute,

  botMensajeriaRoute,

  plantillasContratosRoute,

  rutasCobroRoute,

  opticoRoute,

  creditosRoute,

  registrosEliminadosRoute,

  reportsRoute,

  perfilRoute,
];
