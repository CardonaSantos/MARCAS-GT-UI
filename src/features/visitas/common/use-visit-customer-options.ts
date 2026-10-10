import { useEffect, useMemo, useState } from "react";
import { useCustomerDirectory } from "@/features/clientes/api/customer-directory.queries";
import type { CustomerDirectoryItem } from "@/features/clientes/api/customer-directory.types";

export function useVisitCustomerOptions() {
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<CustomerDirectoryItem | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(input.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [input]);

  // Búsqueda acotada y paginada; nunca descargar todo el directorio.
  const customers = useCustomerDirectory({
    page: 1, limit: 20, search: search || undefined,
    sortBy: "nombre", sortDir: "asc",
  });

  const options = useMemo(() => {
    const data = customers.data?.data ?? [];
    const rows = selected && !data.some((item) => item.id === selected.id)
      ? [selected, ...data] : data;
    return rows.map((item) => ({
      value: item.id,
      label: [item.nombre, item.apellido].filter(Boolean).join(" "),
      description: item.telefono || undefined,
    }));
  }, [customers.data, selected]);

  const pick = (id: number | null) => {
    setSelected(customers.data?.data.find((item) => item.id === id) ??
      (selected?.id === id ? selected : null));
  };

  return {
    options, input, setInput, selected, pick, customers,
  };
}
