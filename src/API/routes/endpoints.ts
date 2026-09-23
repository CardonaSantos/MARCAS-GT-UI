export const crm_endpoints = {
  // AUTH
  auth: {
    login: "/auth/login-user",
  },

  dashboard: {
    tecnico_panel: "/dashboard/panel-tecnico",
  },

  instalaciones: {
    post_instalacion: `/cliente-instalaciones`,

    get_instalaciones_paginated: `/cliente-instalaciones`,

    get_instalacion: (id: number) => `/cliente-instalaciones/${id}`,

    patch_instalacion: (instalacionId: number) =>
      `/cliente-instalaciones/${instalacionId}`,

    post_evidencias: (instalacionId: number, empresaId: number) =>
      `/cliente-instalaciones/${instalacionId}/evidencias/upload?empresaId=${empresaId}`,

    get_mis_instalaciones_asignadas: `/cliente-instalaciones/mis-asignadas`,

    get_instalacion_tecnica: (instalacionId: number) =>
      `/cliente-instalaciones/${instalacionId}/tecnica`,

    patch_reprogramar_instalacion: (instalacionId: number) =>
      `/cliente-instalaciones/reprogramar/${instalacionId}`,

    post_iniciar_instalacion: (instalacionId: number) =>
      `/cliente-instalaciones/iniciar/${instalacionId}`,

    post_completar_instalacion: (instalacionId: number) =>
      `/cliente-instalaciones/completar/${instalacionId}`,

    post_cancelar_instalacion: (instalacionId: number) =>
      `/cliente-instalaciones/cancelar/${instalacionId}`,
  },

  desinstalaciones: {
    get_desinstalaciones_paginated: "/cliente-desinstalaciones",

    get_desinstalacion: (desinstalacionId: number) =>
      `/cliente-desinstalaciones/${desinstalacionId}`,

    post_evidencias: (desinstalacionId: number) =>
      `/cliente-desinstalaciones/${desinstalacionId}/evidencias/upload`,

    get_contexto_creacion: (clienteId: number) =>
      `/cliente-desinstalaciones/contexto-creacion/${clienteId}`,

    post_desinstalacion: "/cliente-desinstalaciones",

    post_solicitar_autorizacion: (desinstalacionId: number) =>
      `/cliente-desinstalaciones/${desinstalacionId}/autorizaciones`,

    // auth
    get_autorizaciones_pendientes:
      "/cliente-desinstalaciones/autorizaciones/pendientes",

    patch_aprobar_autorizacion: (autorizacionId: number) =>
      `/cliente-desinstalaciones/autorizaciones/${autorizacionId}/aprobar`,

    patch_rechazar_autorizacion: (autorizacionId: number) =>
      `/cliente-desinstalaciones/autorizaciones/${autorizacionId}/rechazar`,
  },

  customer: {
    create: "/internet-customer/create-new-customer",

    get_customers_campaing_whatsapp: "/internet-customer/whatsapp-campaing",
  },

  zonas_facturacion: {
    get_all: "/facturacion-zona",

    post_zona_f: "/facturacion-zona",

    patch_zona: "/facturacion-zona/update-zona-facturacion",

    delete_zona: (id: number) => `/facturacion-zona/${id}`,
  },

  //IMPRIMIBLES
  tickets_boleta: {
    byId: (id: number) => `/tickets-soporte/get-ticket-boleta/${id}`,
  },
  //PARA TICKETS EN GENERAL
  ticket: {
    post_commentary: `/ticket-seguimiento`,

    create_ticket: `/tickets-soporte`,

    tickets_list_search: `/tickets-soporte`,

    update_ticket: (id: number) =>
      `/tickets-soporte/update-ticket-soporte/${id}`,

    delete_ticket: (id: number) => `/tickets-soporte/delete-ticket/${id}`,
  },

  // PPPoE
  pppoe: {
    // PREALTA Y CREDENCIALES DENTRO DE UNA INSTALACIÓN
    post_activar_instalacion: (instalacionId: number) =>
      `/cliente-instalaciones/${instalacionId}/pppoe/activar`,
    pppoe_perfil_homologacion_seleccionables:
      "/ppoe-perfil-homologacion/select",

    post_reintentar_prealta: (
      instalacionId: number,
      accesoInternetId: number,
    ) =>
      `/cliente-instalaciones/${instalacionId}/accesos/${accesoInternetId}/prealta-pppoe/reintentar`,

    // FLUJO PPPoE DE INSTALACIÓN

    post_iniciar_instalacion: (instalacionId: number) =>
      `/cliente-instalaciones/iniciar/${instalacionId}`,

    post_completar_instalacion: (instalacionId: number) =>
      `/cliente-instalaciones/completar/${instalacionId}`,

    // FLUJO PPPoE DE DESINSTALACIÓN

    patch_iniciar_desinstalacion: (desinstalacionId: number) =>
      `/cliente-desinstalaciones/${desinstalacionId}/iniciar`,

    // ACCIONES MANUALES SOBRE CUENTAS PPPoE

    post_suspender_cuenta: (cuentaPppoeId: number) =>
      `/pppoe-cuentas/${cuentaPppoeId}/suspender`,

    post_reactivar_cuenta: (cuentaPppoeId: number) =>
      `/pppoe-cuentas/${cuentaPppoeId}/reactivar`,

    post_dar_de_baja_cuenta: (cuentaPppoeId: number) =>
      `/pppoe-cuentas/${cuentaPppoeId}/dar-de-baja`,

    // OPERACIONES PPPoE

    get_operaciones_paginated: `/pppoe-operaciones`,

    get_operacion: (operacionId: number, empresaId: number) =>
      `/pppoe-operaciones/${operacionId}?empresaId=${empresaId}`,

    post_autorizar_operacion: (operacionId: number) =>
      `/pppoe-operaciones/${operacionId}/autorizar`,

    post_reintentar_operacion: (operacionId: number) =>
      `/pppoe-operaciones/${operacionId}/reintentar`,

    post_recuperar_operacion: (operacionId: number) =>
      `/pppoe-operaciones/${operacionId}/recuperar`,

    post_cancelar_operacion: (operacionId: number) =>
      `/pppoe-operaciones/${operacionId}/cancelar`,

    // AUDITORÍA PPPoE

    get_auditorias_paginated: `/pppoe-auditoria`,

    // HOMOLOGACIONES
    ppoe_perfil_homologacion: `/ppoe-perfil-homologacion`,

    ppoe_perfil_homologacion_actualizar_codigo: (id: number) =>
      `/ppoe-perfil-homologacion/${id ?? 0}/codigo-perfil`,

    ppoe_perfil_homologacion_actualizar_estado: (
      id: number,
      action: "activar" | "desactivar",
    ) => `/ppoe-perfil-homologacion/${id ?? 0}/${action}`,

    ppoe_perfil_homologacion_seleccionables: "/ppoe-perfil-homologacion/select",

    get_auditoria_instalacion: (instalacionId: number) =>
      `/cliente-instalaciones/${instalacionId}/auditoria-pppoe`,

    // CUENTAS PPPoE / ADMINISTRACIÓN GENERAL
    get_cuentas_paginated: "/pppoe-cuentas",

    get_cuenta: (cuentaPppoeId: number) => `/pppoe-cuentas/${cuentaPppoeId}`,

    post_prealta_cuenta: "/pppoe-cuentas/prealta",

    post_provisionar_cuenta: (cuentaPppoeId: number) =>
      `/pppoe-cuentas/${cuentaPppoeId}/provisionar`,

    post_revelar_credenciales_cuenta: (cuentaPppoeId: number) =>
      `/pppoe-cuentas/${cuentaPppoeId}/revelar-credenciales`,

    // ADOPCIÓN DE CUENTAS PPPoE EXISTENTES

    post_verificar_adopcion_cuenta: "/pppoe-cuentas/adopcion/verificar",

    post_adoptar_cuenta: "/pppoe-cuentas/adopcion",
  },

  // TICKET- CONFORMIDAD
  ticket_conformidad: {
    firmaTecnico: (conformidadId: number) =>
      `ticket-soporte-conformidad/${conformidadId}/firma-tecnico`,

    crearPorTicket: (ticketId: number) =>
      `ticket-soporte-conformidad/tickets/${ticketId}`,

    generarEnlace: (conformidadId: number) =>
      `ticket-soporte-conformidad/${conformidadId}/enlaces`,

    detalle: (conformidadId: number) =>
      `ticket-soporte-conformidad/${conformidadId}`,

    actualPorTicket: (ticketId: number) =>
      `ticket-soporte-conformidad/tickets/${ticketId}/actual`,

    public: {
      detalle: (token: string) =>
        `ticket-soporte-conformidad/public/${encodeURIComponent(token)}`,

      retrabajo: (token: string) =>
        `ticket-soporte-conformidad/public/${encodeURIComponent(token)}/retrabajo`,

      firma: (token: string) =>
        `ticket-soporte-conformidad/public/${encodeURIComponent(token)}/firma`,
    },
  },

  ticket_historial: {
    /**
     * Historial completo de un ticket concreto.
     *
     * GET
     * /ticket-soporte-historial/ticket/:ticketId
     */
    by_ticket: (ticketId: number) =>
      `/ticket-soporte-historial/ticket/${ticketId}`,

    /**
     * Consulta administrativa general.
     *
     * La dejamos disponible desde ahora aunque todavía
     * no la utilicemos en la pantalla de tickets.
     */
    list: `/ticket-soporte-historial`,

    /**
     * Obtiene un registro concreto del historial.
     */
    by_id: (historialId: number) => `/ticket-soporte-historial/${historialId}`,
  },

  contrato: {
    contrato_instalacion: (contratoId: number, plantillaId: number) =>
      `contrato-cliente/get-one-contrato/${contratoId}/${plantillaId}`,
  },

  reportes: {
    get_clientes_xlsx: "/excel-reports/clientes",

    get_tickets_xlsx: "/excel-reports/tickets",

    get_facturacion_xlsx: "/excel-reports/facturacion",
  },

  reportes_catalogos: {
    get_servicios: "/servicio-internet/get-services-to-customer",

    get_departamentos: "/location/get-all-departamentos",

    get_municipios_departamento: (departamentoId: number) =>
      `/location/get-municipio/${departamentoId}`,

    get_sectores: "/sector",

    // tickets
    get_ticket_etiquetas: "/tags-ticket/get-tags-to-ticket",

    get_ticket_tecnicos: "/user/get-tecnicos-to-ticket",

    get_ticket_clientes: "/internet-customer/get-customers-to-ticket",

    get_facturacion_usuarios: "/user/get-users-to-rutas",
    get_facturacion_zonas:
      "/facturacion-zona/get-zonas-facturacion-to-customer",
  },
} as const;
