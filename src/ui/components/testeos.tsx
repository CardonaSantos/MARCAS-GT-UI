// import * as React from "react";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import type { ColumnDef } from "@tanstack/react-table";
// import { Mail, Pencil, Trash2 } from "lucide-react";

// import { AppButton } from "@/components/app/primitives/app-button";
// import { AppInput } from "@/components/app/primitives/app-input";
// import { AppTextarea } from "@/components/app/primitives/app-textarea";
// import { AppSwitch } from "@/components/app/primitives/app-switch";
// import { AppCheckbox } from "@/components/app/primitives/app-checkbox";
// import { AppSingleSelect } from "@/components/app/primitives/app-single-select";
// import { AppMultiSelect } from "@/components/app/primitives/app-multi-select";
// import { AppDatePicker } from "@/components/app/primitives/app-date-picker";
// import { AppSearchInput } from "@/components/app/primitives/app-search-input";

// import { AppBadge } from "@/components/app/primitives/app-badge";
// import { AppAlert } from "@/components/app/primitives/app-alert";
// import { AppCard } from "@/components/app/primitives/app-card";
// import { AppContainer } from "@/components/app/primitives/app-container";
// import { AppGrid } from "@/components/app/primitives/app-grid";
// import { AppStack } from "@/components/app/primitives/app-stack";
// import { AppInline } from "@/components/app/primitives/app-inline";
// import { AppSeparator } from "@/components/app/primitives/app-separator";

// import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";

// import { AppDataTable } from "@/components/app/table/app-data-table";
// import { AppTableBulkActions } from "@/components/app/table/app-table-bulk-actions";
// import { AppTableDensityToggle } from "@/components/app/table/app-table-density-toggle";
// import { AppTableExportButton } from "@/components/app/table/app-table-export-button";
// import { createAppSelectionColumn } from "@/components/app/table/app-table-selection-column";
// import { createAppRowActionsColumn } from "@/components/app/table/app-table-row-actions";
// import {
//   createAppBadgeColumn,
//   createAppDateColumn,
//   createAppTextColumn,
// } from "@/components/app/table/app-table-column-helpers";

// import {
//   useAppAsyncAction,
//   useAppConfirmHandler,
//   useAppFormHandlers,
//   useAppStateHandlers,
//   useAppTableHandlers,
//   normalizeAppPayload,
// } from "@/components/app/handlers";

// import {
//   AppForm,
//   AppFormInput,
//   AppFormTextarea,
//   AppFormSwitch,
//   AppFormCheckbox,
//   AppFormSingleSelect,
//   AppFormMultiSelect,
//   AppFormDatePicker,
//   AppFormDateRangePicker,
//   AppFormSubmit,
// } from "@/components/app/form";
// import { AppThemeSwitcher } from "./app/theme/app-theme-switcher";

// type ClienteEstado = "ACTIVO" | "MOROSO" | "SUSPENDIDO" | "ATRASADO";

// type Cliente = {
//   id: number;
//   nombre: string;
//   telefono: string;
//   servicioId: number;
//   etiquetas: number[];
//   estado: ClienteEstado;
//   activo: boolean;
//   creadoEn: string;
// };

// const clientesMock: Cliente[] = Array.from({ length: 80 }).map((_, index) => {
//   const id = index + 1;
//   const estados: ClienteEstado[] = [
//     "ACTIVO",
//     "MOROSO",
//     "SUSPENDIDO",
//     "ATRASADO",
//   ];

//   return {
//     id,
//     nombre: `Cliente ${id}`,
//     telefono: `5024001${String(7000 + id).slice(-4)}`,
//     servicioId: id % 3 === 0 ? 3 : id % 2 === 0 ? 2 : 1,
//     etiquetas: id % 2 === 0 ? [1, 3] : [2],
//     estado: estados[id % estados.length],
//     activo: estados[id % estados.length] === "ACTIVO",
//     creadoEn: `2026-06-${String((id % 28) + 1).padStart(2, "0")}`,
//   };
// });

// const serviciosOptions = [
//   { value: 1, label: "Residencial 10 Mbps" },
//   { value: 2, label: "Residencial 20 Mbps" },
//   { value: 3, label: "Empresarial 50 Mbps" },
// ];

// const etiquetasOptions = [
//   { value: 1, label: "VIP" },
//   { value: 2, label: "Pendiente pago" },
//   { value: 3, label: "Router propio" },
//   { value: 4, label: "Requiere visita" },
// ];

// function getEstadoTone(estado: ClienteEstado) {
//   if (estado === "ACTIVO") return "success";
//   if (estado === "MOROSO") return "danger";
//   if (estado === "ATRASADO") return "warning";
//   return "neutral";
// }

// const clienteSchema = z.object({
//   nombre: z.string().min(2, "El nombre es obligatorio"),
//   telefono: z.string().min(8, "Teléfono inválido"),
//   servicioId: z.number({
//     error: "Seleccione un servicio",
//   }),
//   etiquetas: z.array(z.number()).min(1, "Seleccione al menos una etiqueta"),
//   fechaInstalacion: z.string().nullable(),
//   rangoReporte: z.object({
//     start: z.string().nullable().optional(),
//     end: z.string().nullable().optional(),
//   }),
//   observaciones: z.string().optional(),
//   activo: z.boolean(),
//   aceptaNotificaciones: z.boolean(),
// });

// type ClienteFormValues = z.infer<typeof clienteSchema>;

// export default function AppHandlersShowcasePage() {
//   /**
//    * 1. Estado manual para primitivos
//    */
//   const manual = useAppStateHandlers({
//     nombre: "",
//     telefono: "",
//     observaciones: "",
//     activo: true,
//     aceptaNotificaciones: false,
//     servicioId: null as number | null,
//     etiquetas: [] as number[],
//     fechaInstalacion: "",
//     rangoReporte: {
//       start: "",
//       end: "",
//     },
//     search: "",
//     serverSearch: "",
//   });

//   /**
//    * 2. Tabla con handler dedicado
//    */
//   const table = useAppTableHandlers({
//     initialPageSize: 10,
//     initialSorting: [{ id: "id", desc: false }],
//     initialColumnPinning: {
//       left: ["__select"],
//       right: ["__actions"],
//     },
//   });

//   /**
//    * 3. Confirm dialog con target
//    */
//   const deleteDialog = useAppConfirmHandler<Cliente>();
//   const bulkDeleteDialog = useAppConfirmHandler<Cliente[]>();

//   /**
//    * 4. Botones async
//    */
//   const saveManualAction = useAppAsyncAction(async () => {
//     await new Promise((resolve) => window.setTimeout(resolve, 700));

//     const payload = manual.toPayload({
//       trimStrings: true,
//       emptyStringToNull: true,
//       removeUndefined: true,
//     });

//     console.log("Payload manual:", payload);
//   });

//   const deleteAction = useAppAsyncAction(async (cliente: Cliente) => {
//     await new Promise((resolve) => window.setTimeout(resolve, 600));
//     console.log("Eliminar cliente:", cliente);
//   });

//   /**
//    * 5. React Hook Form + Zod + AppFormHandlers
//    */
//   const form = useForm<ClienteFormValues>({
//     resolver: zodResolver(clienteSchema),
//     defaultValues: {
//       nombre: "",
//       telefono: "",
//       servicioId: 1,
//       etiquetas: [],
//       fechaInstalacion: null,
//       rangoReporte: {
//         start: "",
//         end: "",
//       },
//       observaciones: "",
//       activo: true,
//       aceptaNotificaciones: false,
//     },
//     mode: "onSubmit",
//   });

//   const formHandlers = useAppFormHandlers(form);

//   const submitRHF = formHandlers.toSubmitHandler(
//     async (payload) => {
//       await new Promise((resolve) => window.setTimeout(resolve, 700));
//       console.log("Payload RHF normalizado:", payload);
//     },
//     {
//       trimStrings: true,
//       emptyStringToNull: true,
//       removeUndefined: true,
//     },
//   );

//   const filteredClientes = React.useMemo(() => {
//     const search = table.serverSearch.trim().toLowerCase();

//     if (!search) return clientesMock;

//     return clientesMock.filter((cliente) =>
//       [
//         cliente.id,
//         cliente.nombre,
//         cliente.telefono,
//         cliente.estado,
//         cliente.creadoEn,
//       ]
//         .join(" ")
//         .toLowerCase()
//         .includes(search),
//     );
//   }, [table.serverSearch]);

//   const paginatedClientes = React.useMemo(() => {
//     const start = table.pagination.pageIndex * table.pagination.pageSize;
//     return filteredClientes.slice(start, start + table.pagination.pageSize);
//   }, [filteredClientes, table.pagination.pageIndex, table.pagination.pageSize]);

//   const clientesColumns = React.useMemo<ColumnDef<Cliente, any>[]>(
//     () => [
//       createAppSelectionColumn<Cliente>(),

//       createAppTextColumn<Cliente>({
//         accessorKey: "id",
//         header: "ID",
//         size: 70,
//       }),

//       {
//         accessorKey: "nombre",
//         header: "Cliente",
//         size: 220,
//         enableSorting: true,
//         cell: ({ row }) => (
//           <div className="min-w-0">
//             <p className="truncate font-medium">{row.original.nombre}</p>
//             <p className="truncate text-[11px] text-[hsl(var(--app-muted-foreground))]">
//               {row.original.telefono}
//             </p>
//           </div>
//         ),
//       },

//       createAppTextColumn<Cliente>({
//         accessorKey: "telefono",
//         header: "Teléfono",
//         size: 140,
//       }),

//       createAppBadgeColumn<Cliente, ClienteEstado>({
//         id: "estado",
//         header: "Estado",
//         size: 130,
//         getValue: (row) => row.estado,
//         getTone: getEstadoTone,
//       }),

//       createAppDateColumn<Cliente>({
//         id: "creadoEn",
//         header: "Creado",
//         size: 130,
//         getValue: (row) => row.creadoEn,
//       }),

//       createAppRowActionsColumn<Cliente>({
//         actions: (row) => [
//           {
//             label: "Editar",
//             icon: <Pencil className="h-3.5 w-3.5" />,
//             onClick: () => console.log("Editar", row.original),
//           },
//           {
//             label: "Enviar mensaje",
//             icon: <Mail className="h-3.5 w-3.5" />,
//             onClick: () => console.log("Enviar mensaje", row.original),
//           },
//           {
//             label: "Eliminar",
//             tone: "danger",
//             icon: <Trash2 className="h-3.5 w-3.5" />,
//             separatorBefore: true,
//             onClick: () => deleteDialog.open(row.original),
//           },
//         ],
//       }),
//     ],
//     [deleteDialog],
//   );

//   const selectedClientes = React.useMemo(() => {
//     const selectedIds = new Set(Object.keys(table.rowSelection));
//     return clientesMock.filter((cliente) =>
//       selectedIds.has(String(cliente.id)),
//     );
//   }, [table.rowSelection]);

//   return (
//     <AppContainer size="2xl" paddingY="md">
//       <AppStack gap="lg">
//         <AppCard
//           title="Handlers App*"
//           description="Uso correcto de handlers con primitivos, tabla, dialogs, botones async y React Hook Form."
//         >
//           <AppAlert tone="info" title="Regla de uso">
//             `useAppStateHandlers` para estado manual. `useAppTableHandlers` para
//             tablas. `useAppConfirmHandler` para confirmaciones.
//             `useAppAsyncAction` para botones async. `useAppFormHandlers` para
//             RHF.
//           </AppAlert>
//         </AppCard>

//         <AppGrid cols={{ base: 1, xl: 2 }} gap="md">
//           <AppCard
//             title="1. Primitivos con useAppStateHandlers"
//             description="Sin crear un handleChange por cada input."
//           >
//             <AppStack gap="sm">
//               <AppGrid cols={{ base: 1, md: 2 }} gap="sm">
//                 <AppInput
//                   {...manual.inputProps("nombre")}
//                   placeholder="Nombre"
//                   clearable
//                   onClear={() => manual.clearField("nombre")}
//                 />

//                 <AppInput
//                   {...manual.inputProps("telefono")}
//                   placeholder="Teléfono"
//                   clearable
//                   onClear={() => manual.clearField("telefono")}
//                 />

//                 <AppSingleSelect<number>
//                   {...manual.singleSelectProps<"servicioId", number>(
//                     "servicioId",
//                   )}
//                   options={serviciosOptions}
//                   placeholder="Servicio"
//                 />

//                 <AppMultiSelect<number>
//                   {...manual.multiSelectProps<"etiquetas", number>("etiquetas")}
//                   options={etiquetasOptions}
//                   placeholder="Etiquetas"
//                 />

//                 <AppDatePicker
//                   mode="single"
//                   {...manual.datePickerSingleProps("fechaInstalacion")}
//                 />

//                 <AppDatePicker
//                   mode="range"
//                   {...manual.datePickerRangeProps("rangoReporte")}
//                 />
//               </AppGrid>

//               <AppTextarea
//                 {...manual.textareaProps("observaciones")}
//                 placeholder="Observaciones"
//               />

//               <AppInline gap="md" wrap>
//                 <AppSwitch
//                   {...manual.switchProps("activo")}
//                   label="Cliente activo"
//                   description="Manejado con switchProps"
//                 />

//                 <AppCheckbox
//                   {...manual.checkboxProps("aceptaNotificaciones")}
//                   label="Acepta notificaciones"
//                 />
//               </AppInline>

//               <AppSearchInput
//                 {...manual.searchInputProps("search", {
//                   debouncedKey: "serverSearch",
//                 })}
//                 placeholder="Search local/debounced"
//               />

//               <AppSeparator />

//               <AppInline gap="xs" wrap>
//                 <AppButton
//                   loading={saveManualAction.isLoading}
//                   loadingText="Guardando..."
//                   onClick={() => saveManualAction.run()}
//                 >
//                   Guardar manual
//                 </AppButton>

//                 <AppButton variant="secondary" onClick={() => manual.reset()}>
//                   Reset manual
//                 </AppButton>

//                 <AppButton
//                   variant="ghost"
//                   onClick={() => {
//                     const payload = normalizeAppPayload(manual.state, {
//                       trimStrings: true,
//                       emptyStringToNull: true,
//                     });

//                     console.log("normalizeAppPayload:", payload);
//                   }}
//                 >
//                   Ver payload
//                 </AppButton>
//               </AppInline>

//               <pre className="max-h-72 overflow-auto rounded-md border border-[hsl(var(--app-border))] bg-[hsl(var(--app-muted))] p-3 text-xs">
//                 {JSON.stringify(manual.state, null, 2)}
//               </pre>
//             </AppStack>
//           </AppCard>

//           <AppCard
//             title="2. React Hook Form + Zod"
//             description="AppForm* maneja los campos. useAppFormHandlers maneja patch/reset/payload."
//           >
//             <AppForm form={form} onSubmit={submitRHF} className="space-y-3">
//               <AppGrid cols={{ base: 1, md: 2 }} gap="sm">
//                 <AppFormInput<ClienteFormValues>
//                   name="nombre"
//                   label="Nombre"
//                   placeholder="Nombre del cliente"
//                   required
//                 />

//                 <AppFormInput<ClienteFormValues>
//                   name="telefono"
//                   label="Teléfono"
//                   placeholder="50240017273"
//                   required
//                 />

//                 <AppFormSingleSelect<ClienteFormValues, number>
//                   name="servicioId"
//                   label="Servicio"
//                   options={serviciosOptions}
//                   required
//                 />

//                 <AppFormMultiSelect<ClienteFormValues, number>
//                   name="etiquetas"
//                   label="Etiquetas"
//                   options={etiquetasOptions}
//                 />

//                 <AppFormDatePicker<ClienteFormValues>
//                   name="fechaInstalacion"
//                   label="Fecha instalación"
//                 />

//                 <AppFormDateRangePicker<ClienteFormValues>
//                   name="rangoReporte"
//                   label="Rango reporte"
//                 />
//               </AppGrid>

//               <AppFormTextarea<ClienteFormValues>
//                 name="observaciones"
//                 label="Observaciones"
//                 placeholder="Observaciones internas..."
//               />

//               <AppInline gap="md" wrap>
//                 <AppFormSwitch<ClienteFormValues>
//                   name="activo"
//                   fieldLabel="Estado"
//                   label="Cliente activo"
//                 />

//                 <AppFormCheckbox<ClienteFormValues>
//                   name="aceptaNotificaciones"
//                   fieldLabel="Notificaciones"
//                   label="Acepta notificaciones"
//                 />
//               </AppInline>

//               <AppInline gap="xs" wrap>
//                 <AppFormSubmit>Guardar RHF</AppFormSubmit>

//                 <AppButton
//                   type="button"
//                   variant="secondary"
//                   onClick={() =>
//                     formHandlers.patch({
//                       nombre: "Cliente precargado",
//                       telefono: "50240017273",
//                       observaciones: "Valores insertados con patch().",
//                     })
//                   }
//                 >
//                   Patch form
//                 </AppButton>

//                 <AppButton
//                   type="button"
//                   variant="ghost"
//                   onClick={() => {
//                     const payload = formHandlers.toPayload({
//                       trimStrings: true,
//                       emptyStringToNull: true,
//                     });

//                     console.log("Payload RHF:", payload);
//                   }}
//                 >
//                   Payload RHF
//                 </AppButton>
//               </AppInline>
//             </AppForm>
//           </AppCard>
//         </AppGrid>

//         <AppCard
//           title="3. Tabla con useAppTableHandlers"
//           description="Paginación, selección, visibilidad, pinning, density y búsqueda server-side simulada."
//         >
//           <AppDataTable
//             data={paginatedClientes}
//             columns={clientesColumns}
//             getRowId={(row) => String(row.id)}
//             toolbar={
//               <AppSearchInput
//                 value={table.search}
//                 onValueChange={table.handleSearchChange}
//                 onDebouncedChange={table.handleDebouncedSearch}
//                 placeholder="Buscar cliente..."
//                 minWidth="md"
//               />
//             }
//             rightToolbar={
//               <AppInline gap="xs" justify="end" wrap>
//                 <AppTableDensityToggle
//                   value={table.density}
//                   onChange={table.setDensity}
//                 />

//                 <AppTableExportButton
//                   filename="clientes-demo"
//                   rows={filteredClientes}
//                   columns={[
//                     { key: "id", label: "ID", getValue: (row) => row.id },
//                     {
//                       key: "nombre",
//                       label: "Cliente",
//                       getValue: (row) => row.nombre,
//                     },
//                     {
//                       key: "telefono",
//                       label: "Teléfono",
//                       getValue: (row) => row.telefono,
//                     },
//                     {
//                       key: "estado",
//                       label: "Estado",
//                       getValue: (row) => row.estado,
//                     },
//                   ]}
//                 />
//               </AppInline>
//             }
//             bulkActions={
//               <AppTableBulkActions
//                 selectedCount={table.selectedCount}
//                 actions={[
//                   {
//                     label: "Mensaje",
//                     icon: <Mail className="h-3.5 w-3.5" />,
//                     onClick: () => console.log("Mensaje a:", selectedClientes),
//                   },
//                   {
//                     label: "Eliminar",
//                     tone: "danger",
//                     icon: <Trash2 className="h-3.5 w-3.5" />,
//                     onClick: () => bulkDeleteDialog.open(selectedClientes),
//                   },
//                 ]}
//               />
//             }
//             paginationMode="server"
//             pagination={table.getPaginationConfig({
//               totalRows: filteredClientes.length,
//               pageSizeOptions: [10, 20, 50, 100],
//             })}
//             {...table.getDataTableStateProps()}
//             enableRowSelection
//             enableColumnVisibility
//             enableColumnPinning
//             enableVirtualization
//             stickyHeader
//             variant="card"
//             emptyTitle="No hay clientes"
//             emptyDescription="No se encontraron clientes con la búsqueda actual."
//             maxHeight="420px"
//             responsiveMode="cards"
//             renderMobileCard={(row) => (
//               <AppStack gap="xs">
//                 <AppInline justify="between">
//                   <div className="min-w-0">
//                     <p className="truncate font-semibold">
//                       {row.original.nombre}
//                     </p>
//                     <p className="truncate text-xs text-[hsl(var(--app-muted-foreground))]">
//                       {row.original.telefono}
//                     </p>
//                   </div>

//                   <AppBadge size="xs" tone={getEstadoTone(row.original.estado)}>
//                     {row.original.estado}
//                   </AppBadge>
//                 </AppInline>
//               </AppStack>
//             )}
//           />
//         </AppCard>

//         <AppConfirmDialog
//           open={deleteDialog.isOpen}
//           onOpenChange={deleteDialog.setOpen}
//           preset="delete"
//           title="Eliminar cliente"
//           description="Esta acción elimina el cliente seleccionado."
//           confirmText="Eliminar"
//           loadingText="Eliminando..."
//           contentCard
//           onConfirm={() =>
//             deleteDialog.confirm(async (target) => {
//               await deleteAction.run(target);
//             })
//           }
//         >
//           {deleteDialog.target ? (
//             <div className="space-y-1 text-xs">
//               <p>
//                 <strong>ID:</strong> {deleteDialog.target.id}
//               </p>
//               <p>
//                 <strong>Cliente:</strong> {deleteDialog.target.nombre}
//               </p>
//               <p>
//                 <strong>Estado:</strong> {deleteDialog.target.estado}
//               </p>
//             </div>
//           ) : null}
//         </AppConfirmDialog>

//         <AppConfirmDialog
//           open={bulkDeleteDialog.isOpen}
//           onOpenChange={bulkDeleteDialog.setOpen}
//           preset="delete"
//           title="Eliminar seleccionados"
//           description="Esta acción eliminaría los clientes seleccionados."
//           confirmText="Eliminar seleccionados"
//           contentCard
//           onConfirm={() =>
//             bulkDeleteDialog.confirm(async (targets) => {
//               await new Promise((resolve) => window.setTimeout(resolve, 600));
//               console.log("Eliminar bulk:", targets);
//               table.clearSelection();
//             })
//           }
//         >
//           <div className="space-y-1 text-xs">
//             <p>Seleccionados: {bulkDeleteDialog.target?.length ?? 0}</p>
//             <p>
//               IDs:{" "}
//               {bulkDeleteDialog.target
//                 ?.map((cliente) => cliente.id)
//                 .join(", ") ?? "ninguno"}
//             </p>
//           </div>
//         </AppConfirmDialog>
//       </AppStack>

//       <AppContainer size="xl" paddingY="md">
//         <AppStack gap="md">
//           <AppCard
//             title="Configuración"
//             description="Personalización visual del sistema."
//           >
//             <AppThemeSwitcher />
//           </AppCard>
//         </AppStack>
//       </AppContainer>
//     </AppContainer>
//   );
// }
