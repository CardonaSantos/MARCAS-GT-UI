import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, RefreshCw, ShieldCheck, UserPlus, UsersRound, UserX } from "lucide-react";

import { useStore } from "@/Context/ContextSucursal";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { useUserDirectory } from "@/features/usuarios/api/user.queries";
import { useSetUserActive } from "@/features/usuarios/api/user.mutations";
import type { SystemUser } from "@/features/usuarios/api/user.types";
import { useUserDirectoryState } from "@/features/usuarios/common/use-user-directory-state";
import { UserDirectoryFilters } from "@/features/usuarios/components/user-directory-filters";
import { UserDirectoryTable } from "@/features/usuarios/components/user-directory-table";
import { UserEditDialog } from "@/features/usuarios/components/user-edit-dialog";
import { UserPasswordDialog } from "@/features/usuarios/components/user-password-dialog";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function Users() {
  const currentUserId = useStore((store) => store.userId);
  const state = useUserDirectoryState();
  const query = useUserDirectory(state.filters);
  const toggle = useSetUserActive();

  const [editUser, setEditUser] = useState<SystemUser | null>(null);
  const [passwordUser, setPasswordUser] = useState<SystemUser | null>(null);
  const [toggleUser, setToggleUser] = useState<SystemUser | null>(null);

  const meta = query.data?.meta;
  const summary = query.data?.summary;
  useEffect(() => {
    if (meta && meta.totalPages > 0 && state.filters.page > meta.totalPages) {
      state.setPagination({ pageIndex: meta.totalPages - 1, pageSize: state.filters.limit });
    }
  }, [meta?.totalPages, state.filters.page, state.filters.limit, state.setPagination]);

  const confirmToggle = async () => {
    if (!toggleUser || toggleUser.id === currentUserId) return;
    await toggle.mutateAsync({ id: toggleUser.id, activo: !toggleUser.activo });
    setToggleUser(null);
  };

  const statistics = [
    { label: "Total de usuarios", value: summary?.total, icon: <UsersRound /> },
    { label: "Cuentas activas", value: summary?.active, icon: <ShieldCheck /> },
    { label: "Cuentas inactivas", value: summary?.inactive, icon: <UserX /> },
    { label: "Administradores activos", value: summary?.admins, icon: <KeyRound /> },
  ];

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Administración de usuarios"
          description="Gestiona cuentas, roles y accesos de los miembros de tu empresa."
          actions={
            <div className="flex flex-wrap gap-2">
              <AppButton type="button" variant="secondary" size="sm" leftIcon={<RefreshCw />}
                loading={query.isFetching} disabled={query.isFetching}
                onClick={() => void query.refetch()}>
                Actualizar
              </AppButton>
              <AppButton asChild size="sm" variant="primary" leftIcon={<UserPlus />}>
                <Link to="/marcas-gt/register">Nuevo usuario</Link>
              </AppButton>
            </div>
          }
        />

        <div className="grid min-w-0 grid-cols-2 gap-3 xl:grid-cols-4" aria-label="Resumen de usuarios">
          {statistics.map((stat) => (
            <AppCard key={stat.label} title={stat.label} icon={stat.icon} size="sm">
              <p className="text-2xl font-semibold tabular-nums" aria-live="polite">
                {stat.value === undefined ? "—" : stat.value}
              </p>
            </AppCard>
          ))}
        </div>

        <UserDirectoryTable
          rows={query.data?.data ?? []}
          currentUserId={currentUserId}
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          onEdit={setEditUser}
          onPassword={setPasswordUser}
          onToggle={setToggleUser}
          sorting={state.sorting}
          onSortingChange={state.setSorting}
          pagination={{
            pageIndex: state.pagination.pageIndex,
            pageSize: state.pagination.pageSize,
            totalRows: meta?.total ?? 0,
            pageCount: Math.max(meta?.totalPages ?? 1, 1),
            onPaginationChange: state.setPagination,
          }}
          toolbar={
            <UserDirectoryFilters
              filters={state.filters}
              searchDraft={state.searchDraft}
              onSearchDraft={state.setSearchDraft}
              onSearch={state.setSearch}
              onFilter={state.setFilter}
              onClear={state.clear}
            />
          }
        />

        <UserEditDialog user={editUser} currentUserId={currentUserId}
          onClose={() => setEditUser(null)} />
        <UserPasswordDialog user={passwordUser}
          onClose={() => setPasswordUser(null)} />

        <AppConfirmDialog
          open={toggleUser !== null}
          onOpenChange={(open) => { if (!open && !toggle.isPending) setToggleUser(null); }}
          preset="warning"
          title={toggleUser?.activo ? "Desactivar cuenta" : "Reactivar cuenta"}
          description={toggleUser
            ? toggleUser.activo
              ? `La cuenta de ${toggleUser.nombre} dejará de poder acceder. Se conservará todo su historial.`
              : `La cuenta de ${toggleUser.nombre} podrá volver a iniciar sesión.`
            : undefined}
          confirmText={toggleUser?.activo ? "Desactivar usuario" : "Reactivar usuario"}
          loadingText="Guardando..."
          isLoading={toggle.isPending}
          confirmDisabled={!toggleUser || toggleUser.id === currentUserId}
          onConfirm={confirmToggle}
          onConfirmError={() => { /* La mutación ya muestra el error. */ }}
        />
      </AppStack>
    </AppContainer>
  );
}
