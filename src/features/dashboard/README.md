# Dashboard UI MARCAS GT

- Página ADMIN: /marcas-gt/dashboard (ProtectedRouteAdmin)
- Página otros roles: /marcas-gt/dashboard-empleado (ProtectedRoute)
- API: seis rutas agregadas del módulo Dashboard; handlers API.useQuery, query keys del scope dashboard.
- Estado por sección: OK+datos (incluyendo cero), UNAVAILABLE+null (placeholder con reintento), error del endpoint (placeholder).
- Refresh: finanzas/alertas 60s, agenda 90s, gráficos 10m, actividad 2m, tracking 25s.
- Gráficos: react-chartjs-2 5 y Chart.js 4 existentes. Valores Q convertidos a números solamente para renderizar el canvas. El backend conserva Decimal/string.
- Período: 7, 30, 90 días y fechas personalizadas (máximo 365 días), con estado en URL.
- Charts: cobros diarios, pedidos por día (cantidad o importe), saldo de cartera por antigüedad, composición de despachos.
- Las listas de agenda y alertas son paginaciones cortas de prioridad; muestran \`total\` retornado por la API, no deducen totales de \`items.length\`.
- Actividad reciente y Live tienen su propia consulta; no bloquean el resumen.
- Créditos, pagos y pedidos no se mezclan: valor de pedidos no representa dinero cobrado; verificado no significa aplicado.
- Los accesos de empleados se construyen desde \`getMarcasRoutesByRole\`; no consumen endpoints exclusivos de ADMIN.
- Los archivos de Dashboard antiguos permanecen como reexports para evitar cambiar enrutamiento y navegación.
