import { RotateCcw } from "lucide-react";

import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";

export function CreditPolicyFilters({
  search,
  activo,
  onSearchChange,
  onSearchDebouncedChange,
  onActivoChange,
  onReset,
}: {
  search: string;
  activo: boolean | null;
  onSearchChange: (value: string) => void;
  onSearchDebouncedChange: (value: string) => void;
  onActivoChange: (value: boolean | null) => void;
  onReset: () => void;
}) {
  const statusOptions = [
    { value: "all", label: "Todas" },
    { value: "active", label: "Activas" },
    { value: "inactive", label: "Inactivas" },
  ];

  return (
    <div className="grid w-full gap-2 md:grid-cols-[minmax(220px,1fr)_220px_auto]">
      <AppSearchInput
        value={search}
        onValueChange={onSearchChange}
        onDebouncedChange={onSearchDebouncedChange}
        placeholder="Buscar política..."
      />

      <AppSingleSelect
        value={
          activo === null ? "all" : activo ? "active" : "inactive"
        }
        options={statusOptions}
        isClearable={false}
        isSearchable={false}
        onChange={(value) =>
          onActivoChange(
            value === "active" ? true : value === "inactive" ? false : null,
          )
        }
      />

      <AppButton
        variant="secondary"
        size="sm"
        leftIcon={<RotateCcw />}
        disabled={!search && activo === null}
        onClick={onReset}
      >
        Limpiar
      </AppButton>
    </div>
  );
}
