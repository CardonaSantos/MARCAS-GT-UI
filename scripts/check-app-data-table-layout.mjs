import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const table = read("src/ui/components/app/table/app-data-table.tsx");
const catalog = read("src/features/productos/components/product-catalog-table.tsx");

assert.ok(table.includes("rows.length > 40"),
  "Las listas cortas deben utilizar filas con altura natural.");
assert.ok(table.includes("enabled: shouldVirtualizeRows"),
  "El virtualizador debe desactivarse para listas cortas.");
assert.ok(table.includes("if (shouldVirtualizeRows)"),
  "El cuerpo también debe respetar el umbral de virtualización.");
assert.ok(table.includes("measureElement: (element) => element.getBoundingClientRect().height"),
  "La altura debe medirse en el DOM para filas de altura variable.");
assert.ok(table.includes("ref={") && table.includes("rowVirtualizer.measureElement"),
  "El virtualizador necesita medir los elementos renderizados.");
assert.ok(table.includes("data-index={shouldVirtualizeRows ? virtualIndex : undefined}"),
  "TanStack Virtual necesita data-index en las filas que mide.");
assert.ok(table.includes("renderRow(row, virtualRow.start, virtualRow.index)"),
  "La fila virtual debe recibir índice y posición.");
assert.ok(table.includes("rows.map((row) => renderRow(row))"),
  "Las filas cortas deben permanecer en flujo normal.");
assert.ok(table.includes("shouldVirtualizeRows &&\n            virtualStart !== undefined"),
  "Solo las filas virtuales deben usar posición absoluta.");
assert.ok(table.includes("...(shouldVirtualizeRows && virtualStart !== undefined"),
  "Solo las filas virtuales deben tener translateY.");
assert.ok(catalog.includes('density="sm"'),
  "El catálogo necesita padding adecuado para miniaturas.");
assert.ok(catalog.includes('className="flex items-center justify-center py-1"'),
  "El catálogo debe proporcionar distancia vertical a las imágenes.");
assert.ok(catalog.includes('className="h-9 w-9 shrink-0'),
  "Mantener el tamaño actual de la miniatura.");
assert.ok(!catalog.includes("{row.original.codigoProducto}"),
  "No duplicar el código dentro de la columna Producto.");

console.log("AppDataTable: filas de altura natural, medición de virtuales y miniaturas espaciadas verificadas.");
