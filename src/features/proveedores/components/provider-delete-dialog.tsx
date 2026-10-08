import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";

import { useDeleteProvider } from "../api/provider.mutations";
import type { Provider } from "../api/provider.types";

interface Props {
  provider: Provider | null;
  onClose: () => void;
}

export function ProviderDeleteDialog({ provider, onClose }: Props) {
  const mutation = useDeleteProvider();
  return (
    <AppConfirmDialog
      open={provider !== null}
      onOpenChange={(open) => { if (!open && !mutation.isPending) onClose(); }}
      preset="delete"
      title="Eliminar proveedor"
      description={
        provider ? (
          <>
            Se eliminará «{provider.nombre}». Esta acción no se puede deshacer.
            Si ya tiene requisiciones o movimientos relacionados, el servidor
            puede rechazarla. En ese caso, es preferible editarlo y desactivarlo.
          </>
        ) : undefined
      }
      confirmText="Eliminar proveedor"
      loadingText="Eliminando..."
      isLoading={mutation.isPending}
      onConfirm={async () => {
        if (!provider) return;
        await mutation.mutateAsync({ id: provider.id });
        onClose();
      }}
      onConfirmError={() => {
        // El hook ya presenta el error de API.
      }}
    />
  );
}
