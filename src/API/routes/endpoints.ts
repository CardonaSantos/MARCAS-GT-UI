export const marcasEndpoints = {
  auth: {
    login: "/auth/login",
  },

  users: {
    root: "/users",
    directory: "/users/directorio",
    selectables: "/users/seleccionables",
    detail: (id: number) => `/users/${id}`,
    changePassword: (id: number) => `/users/change-password/${id}`,
  },

  categories: {
    root: "/categories",
    detail: (id: number) => `/categories/${id}`,
  },

  products: {
    root: "/product",
    search: "/product/search",
    inventoryCatalog: "/product/get-product-to-inventary",
    catalog: "/product/catalogo",
    catalogDetail: (id: number) => `/product/catalogo/${id}`,
    uploadImages: (id: number) => `/product/update-images-product/${id}`,
    deleteImage: (productId: number, imageId: number) =>
      `/product/delete-one-image-product/${productId}/image/${imageId}`,
    detail: (id: number) => `/product/${id}`,
  },

  providers: {
    root: "/provider",
    detail: (id: number) => `/provider/${id}`,
    // DELETE /provider/:id was previously wired to removeAll().
    deleteOne: (id: number) => `/provider/delete-provider/${id}`,
  },

  prospects: {
    workflowOpen: "/prospecto/jornada/abierto",
    workflowStart: "/prospecto/jornada",
    workflowFinish: (id: number) => `/prospecto/jornada/${id}/finalizar`,
    workflowCancel: (id: number) => `/prospecto/jornada/${id}/cancelar`,
    history: "/prospecto/historial",
    historyDetail: (id: number) => `/prospecto/historial/${id}`,
    convertToCustomer: (id: number) => `/prospecto/historial/${id}/convertir-cliente`,
  },
  customers: {
    root: "/customers",
    simple: "/customers/customer-simple",
    detail: (id: number) => `/customers/${id}`,
    directory: "/customers/directorio",
    directoryDetail: (id: number) => `/customers/directorio/${id}`,
  },
  customerLocation: {
    departments: "/customer-location/get-departamentos",
    municipalities: (departmentId: number) =>
      `/customer-location/get-municipios/${departmentId}`,
  },

  visits: {
    records: "/date/get-visits-regists",
    detail: (id: number) => `/date/${id}`,
    workflowOpen: "/date/jornada/abierta",
    workflowStart: "/date/jornada",
    workflowFinish: (id: number) => `/date/jornada/${id}/finalizar`,
    workflowCancel: (id: number) => `/date/jornada/${id}/cancelar`,
    history: "/date/historial",
    historyDetail: (id: number) => `/date/historial/${id}`,
  },

  notifications: {
    forAdmin: (userId: number) =>
      `/notifications/notifications/for-admin/${userId}`,
    markAsRead: (notificationId: number) =>
      `/notifications/update-notify/${notificationId}`,
    clearAllAdmin: (userId: number) =>
      `/notifications/delete-all-notifications-admin/${userId}`,
  },

  bodegas: {
    root: "/bodegas",
    selectables: "/bodegas/seleccionables",
    principal: "/bodegas/principal",
    summary: "/bodegas/resumen",
    detail: (id: number) => `/bodegas/${id}`,
    events: (id: number) => `/bodegas/${id}/eventos`,
    responsible: (id: number) => `/bodegas/${id}/responsable`,
    activate: (id: number) => `/bodegas/${id}/activar`,
    deactivate: (id: number) => `/bodegas/${id}/desactivar`,
    setPrincipal: (id: number) => `/bodegas/${id}/principal`,
  },

  inventario: {
    root: "/inventario",
    summary: "/inventario/resumen",
    productAvailability: (productId: number) =>
      `/inventario/productos/${productId}/disponibilidad`,
    movements: "/inventario/movimientos",
    kardex: (productId: number) => `/inventario/kardex/${productId}`,
    reservations: "/inventario/reservas",
    reservation: (id: number) => `/inventario/reservas/${id}`,
    stock: (id: number) => `/inventario/stocks/${id}`,
    entries: "/inventario/entradas",
    adjustments: "/inventario/ajustes",
    returns: "/inventario/devoluciones",
    applyReservation: (id: number) => `/inventario/reservas/${id}/aplicar`,
    releaseReservation: (id: number) => `/inventario/reservas/${id}/liberar`,
    cancelReservation: (id: number) => `/inventario/reservas/${id}/cancelar`,
  },

  requisiciones: {
    root: "/requisiciones",
    summary: "/requisiciones/resumen",
    receipts: "/requisiciones/recepciones",
    detail: (id: number) => `/requisiciones/${id}`,
    events: (id: number) => `/requisiciones/${id}/eventos`,
    requisitionReceipts: (id: number) => `/requisiciones/${id}/recepciones`,
    request: (id: number) => `/requisiciones/${id}/solicitar`,
    approve: (id: number) => `/requisiciones/${id}/aprobar`,
    reject: (id: number) => `/requisiciones/${id}/rechazar`,
    cancel: (id: number) => `/requisiciones/${id}/cancelar`,
  },

  transferencias: {
    root: "/transferencias",
    summary: "/transferencias/resumen",
    operations: "/transferencias/operaciones",
    detail: (id: number) => `/transferencias/${id}`,
    events: (id: number) => `/transferencias/${id}/eventos`,
    transferOperations: (id: number) => `/transferencias/${id}/operaciones`,
    prepare: (id: number) => `/transferencias/${id}/preparar`,
    cancel: (id: number) => `/transferencias/${id}/cancelar`,
    outputs: (id: number) => `/transferencias/${id}/salidas`,
    receipts: (id: number) => `/transferencias/${id}/recepciones`,
  },

  pedidos: {
    root: "/pedidos",
    summary: "/pedidos/resumen",
    detail: (id: number) => `/pedidos/${id}`,
    events: (id: number) => `/pedidos/${id}/eventos`,
    requestValidation: (id: number) => `/pedidos/${id}/solicitar-validacion`,
    confirm: (id: number) => `/pedidos/${id}/confirmar`,
    cancel: (id: number) => `/pedidos/${id}/cancelar`,
  },

  creditos: {
    portfolio: "/creditos/cartera",
    portfolioDetail: (id: number) => `/creditos/cartera/${id}`,
    paymentPlan: (id: number) => `/creditos/cartera/${id}/plan-pagos`,
    activatePaymentPlan: (id: number) =>
      `/creditos/cartera/${id}/plan-pagos/activar`,

    policies: {
      root: "/creditos/politicas",
      detail: (id: number) => `/creditos/politicas/${id}`,
      status: (id: number) => `/creditos/politicas/${id}/estado`,
    },

    applications: {
      root: "/creditos/solicitudes",
      summary: "/creditos/solicitudes/resumen",
      detail: (id: number) => `/creditos/solicitudes/${id}`,
      events: (id: number) => `/creditos/solicitudes/${id}/eventos`,
      submit: (id: number) => `/creditos/solicitudes/${id}/enviar-revision`,
      cancel: (id: number) => `/creditos/solicitudes/${id}/cancelar`,
      references: (id: number) => `/creditos/solicitudes/${id}/referencias`,
      reference: (id: number, referenceId: number) =>
        `/creditos/solicitudes/${id}/referencias/${referenceId}`,
      reviewReference: (id: number, referenceId: number) =>
        `/creditos/solicitudes/${id}/referencias/${referenceId}/revisar`,
      documents: (id: number) => `/creditos/solicitudes/${id}/documentos`,
      reviewDocument: (id: number, documentId: number) =>
        `/creditos/solicitudes/${id}/documentos/${documentId}/revisar`,
      reviewRequirement: (id: number, requirementId: number) =>
        `/creditos/solicitudes/${id}/requisitos/${requirementId}/revisar`,
      approve: (id: number) => `/creditos/solicitudes/${id}/aprobar`,
      reject: (id: number) => `/creditos/solicitudes/${id}/rechazar`,
      retryIntegration: (id: number) =>
        `/creditos/solicitudes/${id}/reintentar-integracion`,
    },
  },

  despachos: {
    root: "/despachos",
    candidates: "/despachos/candidatos",
    summary: "/despachos/resumen",
    operationalReport: "/despachos/reportes/operacion",
    operations: "/despachos/operaciones",
    retryOperation: (operationId: number) =>
      `/despachos/operaciones/${operationId}/reintentar`,
    detail: (id: number) => `/despachos/${id}`,
    events: (id: number) => `/despachos/${id}/eventos`,
    dispatchOperations: (id: number) => `/despachos/${id}/operaciones`,
    startPreparation: (id: number) => `/despachos/${id}/iniciar-preparacion`,
    preparation: (id: number) => `/despachos/${id}/preparacion`,
    finishPreparation: (id: number) => `/despachos/${id}/finalizar-preparacion`,
    outputs: (id: number) => `/despachos/${id}/salidas`,
    cancel: (id: number) => `/despachos/${id}/cancelar`,
    observations: (id: number) => `/despachos/${id}/observaciones`,
  },

  transporte: {
    carriers: {
      root: "/transportistas",
      deactivate: (id: number) => `/transportistas/${id}/desactivar`,
    },
    vehicles: {
      root: "/vehiculos",
      deactivate: (id: number) => `/vehiculos/${id}/desactivar`,
    },
    drivers: {
      root: "/conductores",
      deactivate: (id: number) => `/conductores/${id}/desactivar`,
    },
    shipments: {
      root: "/envios",
      candidates: "/envios/candidatos",
      summary: "/envios/resumen",
      operationalReport: "/envios/reportes/operacion",
      detail: (id: number) => `/envios/${id}`,
      events: (id: number) => `/envios/${id}/eventos`,
      assign: (id: number) => `/envios/${id}/asignar`,
      confirmLoad: (id: number) => `/envios/${id}/confirmar-carga`,
      startRoute: (id: number) => `/envios/${id}/iniciar-ruta`,
      cancel: (id: number) => `/envios/${id}/cancelar`,
      observations: (id: number) => `/envios/${id}/observaciones`,
      incidents: (id: number) => `/envios/${id}/incidencias`,
      resolveIncident: (id: number, incidentId: number) =>
        `/envios/${id}/incidencias/${incidentId}/resolver`,
    },
  },

  entregas: {
    root: "/entregas",
    candidates: "/entregas/candidatos",
    summary: "/entregas/resumen",
    operationalReport: "/entregas/reportes/operacion",
    detail: (id: number) => `/entregas/${id}`,
    events: (id: number) => `/entregas/${id}/eventos`,
    evidences: (id: number) => `/entregas/${id}/evidencias`,
    evidenceUpload: (id: number) => `/entregas/${id}/evidencias/archivo`,
    evidenceFile: (id: number, evidenceId: number) =>
      `/entregas/${id}/evidencias/${evidenceId}/archivo`,
    evidenceImage: (id: number, evidenceId: number) =>
      `/entregas/${id}/evidencias/${evidenceId}/imagen`,
    evidence: (id: number, evidenceId: number) =>
      `/entregas/${id}/evidencias/${evidenceId}`,
    start: (id: number) => `/entregas/${id}/iniciar`,
    result: (id: number) => `/entregas/${id}/resultado`,
    finish: (id: number) => `/entregas/${id}/finalizar`,
    observations: (id: number) => `/entregas/${id}/observaciones`,
  },

  comprobantes: {
    detail: (id: number) => `/comprobantes/${id}`,
    action: (id: number) => `/comprobantes/${id}/acciones`,
    dispatchPreview: (dispatchId: number, operationId: number) =>
      `/comprobantes/despachos/${dispatchId}/salidas/${operationId}/vista-previa`,
    dispatchIssue: (dispatchId: number, operationId: number) =>
      `/comprobantes/despachos/${dispatchId}/salidas/${operationId}/emitir`,
    deliveryPreview: (id: number) => `/comprobantes/entregas/${id}/vista-previa`,
    deliveryIssue: (id: number) => `/comprobantes/entregas/${id}/emitir`,
  },

  facturacion: {
    invoices: {
      root: "/facturas",
      candidates: "/facturas/candidatos",
      summary: "/facturas/resumen",
      operationalReport: "/facturas/reportes/operacion",
      detail: (id: number) => `/facturas/${id}`,
      events: (id: number) => `/facturas/${id}/eventos`,
      felOperations: (id: number) => `/facturas/${id}/operaciones-fel`,
      prepare: (id: number) => `/facturas/${id}/preparar`,
      discard: (id: number) => `/facturas/${id}/descartar`,
    },
    fiscalConfig: {
      company: "/configuracion-fiscal/empresa",
      establishments: "/configuracion-fiscal/establecimientos",
      customer: (customerId: number) =>
        `/configuracion-fiscal/clientes/${customerId}`,
      product: (productId: number) =>
        `/configuracion-fiscal/productos/${productId}`,
    },
    receivables: {
      root: "/cuentas-por-cobrar",
      summary: "/cuentas-por-cobrar/resumen",
    },
  },

  pagos: {
    root: "/pagos",
    banks: "/pagos/bancos",
    banksAdmin: "/pagos/bancos/administracion",
    bank: (id: number) => `/pagos/bancos/${id}`,
    summary: "/pagos/resumen",
    detail: (id: number) => `/pagos/${id}`,
    events: (id: number) => `/pagos/${id}/eventos`,
    applications: (id: number) => `/pagos/${id}/aplicaciones`,
    candidateReceivables: (id: number) => `/pagos/${id}/cuentas-candidatas`,
    proofs: (id: number) => `/pagos/${id}/comprobantes`,
    proofUpload: (id: number) => `/pagos/${id}/comprobantes/archivo`,
    proofFile: (id: number, proofId: number) =>
      `/pagos/${id}/comprobantes/${proofId}/archivo`,
    proofRemove: (id: number, proofId: number) =>
      `/pagos/${id}/comprobantes/${proofId}`,
    verify: (id: number) => `/pagos/${id}/verificar`,
    reject: (id: number) => `/pagos/${id}/rechazar`,
    revertApplication: (paymentId: number, applicationId: number) =>
      `/pagos/${paymentId}/aplicaciones/${applicationId}/revertir`,
    cancel: (id: number) => `/pagos/${id}/anular`,
  },

  tracking: {
    start: "/real-time-location/tracking/start",
    me: "/real-time-location/tracking/me",
    location: "/real-time-location/tracking/location",
    finish: (trackingSessionId: number) =>
      `/real-time-location/tracking/${trackingSessionId}/finish`,
    realtime: "/real-time-location/tracking/realtime",
    history: "/real-time-location/tracking/history",
    attendance: (attendanceId: number) =>
      `/real-time-location/tracking/attendance/${attendanceId}`,
    attendanceLocations: (attendanceId: number) =>
      `/real-time-location/tracking/attendance/${attendanceId}/locations`,
  },
} as const;
