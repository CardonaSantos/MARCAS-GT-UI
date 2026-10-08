import { zodResolver } from "@hookform/resolvers/zod";
import { List, Plus, Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { useCreateProvider } from "@/features/proveedores/api/provider.mutations";
import { useProviders } from "@/features/proveedores/api/provider.queries";
import type { Provider } from "@/features/proveedores/api/provider.types";
import { toProviderPayload } from "@/features/proveedores/common/provider.mappers";
import { ProviderDeleteDialog } from "@/features/proveedores/components/provider-delete-dialog";
import { ProviderEditDialog } from "@/features/proveedores/components/provider-edit-dialog";
import { ProviderFormFields } from "@/features/proveedores/components/provider-form-fields";
import { ProviderList } from "@/features/proveedores/components/provider-list";
import {
  emptyProviderForm, providerSchema, type ProviderFormValues,
} from "@/features/proveedores/schemas/provider.schemas";
import { useAppFormHandlers } from "@/ui/components/app/handlers";
import { AppForm, AppFormSubmit } from "@/ui/components/app/form";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppTabs } from "@/ui/components/app/primitives/app-tabs";

type ProviderTab = "create" | "list";

export default function CrearProveedor() {
  const [activeTab, setActiveTab] = useState<ProviderTab>("list");
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [deletingProvider, setDeletingProvider] = useState<Provider | null>(null);

  const providersQuery = useProviders();
  const createProvider = useCreateProvider();
  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(providerSchema),
    defaultValues: emptyProviderForm,
    mode: "onTouched",
  });
  const handlers = useAppFormHandlers(form);

  const onCreate = async (values: ProviderFormValues) => {
    try {
      await createProvider.mutateAsync(toProviderPayload(values));
      handlers.reset(emptyProviderForm);
      setActiveTab("list");
    } catch {
      // El hook notifica el error y el formulario conserva sus valores.
    }
  };

  const list = providersQuery.data ?? [];

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Proveedores"
          actions={
            <span className="text-xs tabular-nums text-[hsl(var(--app-muted-foreground))]">
              {list.length} registrados
            </span>
          }
        />

        <AppTabs<ProviderTab>
          value={activeTab}
          onValueChange={setActiveTab}
          variant="default"
          fullWidthTriggers={false}
          tabs={[
            {
              value: "list",
              label: "Directorio",
              icon: <List className="h-4 w-4" />,
              content: (
                <ProviderList
                  providers={list}
                  isLoading={providersQuery.isLoading}
                  isFetching={providersQuery.isFetching}
                  isError={providersQuery.isError}
                  onRetry={() => void providersQuery.refetch()}
                  onEdit={setEditingProvider}
                  onDelete={setDeletingProvider}
                />
              ),
            },
            {
              value: "create",
              label: "Nuevo proveedor",
              icon: <Plus className="h-4 w-4" />,
              content: (
                <AppCard title="Registrar proveedor" size="sm">
                  <AppForm form={form} onSubmit={onCreate}>
                    <AppStack gap="md">
                      <ProviderFormFields />
                      <div className="flex flex-wrap justify-end gap-2">
                        <AppFormSubmit<ProviderFormValues>
                          leftIcon={<Save />}
                          loadingText="Registrando..."
                          disabled={createProvider.isPending}
                        >
                          Crear proveedor
                        </AppFormSubmit>
                      </div>
                    </AppStack>
                  </AppForm>
                </AppCard>
              ),
            },
          ]}
        />

        <ProviderEditDialog
          provider={editingProvider}
          onClose={() => setEditingProvider(null)}
        />
        <ProviderDeleteDialog
          provider={deletingProvider}
          onClose={() => setDeletingProvider(null)}
        />
      </AppStack>
    </AppContainer>
  );
}
