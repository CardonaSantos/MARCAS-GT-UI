import type { ColumnDef } from "@tanstack/react-table";
import {
  Building2,
  Pencil,
  Plus,
  Power,
  PowerOff,
} from "lucide-react";
import { useMemo, useState } from "react";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { formatDateTime } from "@/features/common/formatters/value.formatters";
import {
  useCreatePaymentBank,
  useUpdatePaymentBank,
} from "@/features/pagos/api/payment.mutations";
import { usePaymentBanksAdmin } from "@/features/pagos/api/payment.queries";
import type {
  PaymentBankAdmin,
  UpdatePaymentBankPayload,
} from "@/features/pagos/api/payment.types";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppInput } from "@/ui/components/app/primitives/app-input";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

type BankDraft = {
  nombre: string;
  codigo: string;
  cuenta: string;
  activo: boolean;
};

const emptyDraft: BankDraft = {
  nombre: "",
  codigo: "",
  cuenta: "",
  activo: true,
};

export default function PaymentBanksPage() {
  const query = usePaymentBanksAdmin();
  const createMutation = useCreatePaymentBank();
  const updateMutation = useUpdatePaymentBank();

  const [draft, setDraft] = useState<BankDraft>(emptyDraft);
  const [editing, setEditing] = useState<PaymentBankAdmin | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [toggleBank, setToggleBank] = useState<PaymentBankAdmin | null>(null);

  const rows = query.data ?? [];

  const activeCount = useMemo(
    () => rows.filter((bank) => bank.activo).length,
    [rows],
  );

  const valid = draft.nombre.trim().length >= 2;

  const startCreate = () => {
    setEditing(null);
    setDraft(emptyDraft);
  };

  const startEdit = (bank: PaymentBankAdmin) => {
    setEditing(bank);
    setDraft({
      nombre: bank.nombre,
      codigo: bank.codigo ?? "",
      cuenta: bank.cuenta ?? "",
      activo: bank.activo,
    });
  };

  const confirmSave = async () => {
    if (!valid) return;

    if (editing) {
      await updateMutation.mutateAsync({
        id: editing.id,
        payload: {
          nombre: draft.nombre.trim(),
          codigo: draft.codigo.trim() || null,
          cuenta: draft.cuenta.trim() || null,
          activo: draft.activo,
        },
      });
    } else {
      await createMutation.mutateAsync({
        nombre: draft.nombre.trim(),
        ...(draft.codigo.trim() ? { codigo: draft.codigo.trim() } : {}),
        ...(draft.cuenta.trim() ? { cuenta: draft.cuenta.trim() } : {}),
        activo: draft.activo,
      });
    }

    setReviewOpen(false);
    setEditing(null);
    setDraft(emptyDraft);
  };

  const confirmToggle = async () => {
    if (!toggleBank) return;

    const payload: UpdatePaymentBankPayload = {
      activo: !toggleBank.activo,
    };

    await updateMutation.mutateAsync({
      id: toggleBank.id,
      payload,
    });

    setToggleBank(null);
  };

  const columns: ColumnDef<PaymentBankAdmin, unknown>[] = [
    {
      accessorKey: "nombre",
      header: "Banco",
      size: 210,
      meta: { grow: true },
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.nombre}</p>
          <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
            {row.original.codigo ?? "Sin código"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "cuenta",
      header: "Cuenta / referencia",
      size: 190,
      cell: ({ row }) => row.original.cuenta ?? "—",
    },
    {
      accessorKey: "activo",
      header: "Estado",
      size: 105,
      cell: ({ row }) => (
        <AppBadge tone={row.original.activo ? "success" : "neutral"} size="xs">
          {row.original.activo ? "Activo" : "Inactivo"}
        </AppBadge>
      ),
    },
    {
      accessorKey: "actualizadoEn",
      header: "Actualizado",
      size: 160,
      cell: ({ row }) => formatDateTime(row.original.actualizadoEn),
    },
    createAppRowActionsColumn<PaymentBankAdmin>({
      actions: (row) => [
        {
          label: "Editar",
          icon: <Pencil />,
          onClick: () => startEdit(row.original),
        },
        {
          label: row.original.activo ? "Desactivar" : "Activar",
          icon: row.original.activo ? <PowerOff /> : <Power />,
          onClick: () => setToggleBank(row.original),
        },
      ],
    }),
  ];

  const busy = createMutation.isPending || updateMutation.isPending;

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Bancos"
          description="Administra los bancos disponibles para transferencias, depósitos y cheques."
          backTo="/marcas-gt/pagos"
          backLabel="Volver a pagos"
          actions={
            <AppButton
              variant="primary"
              size="sm"
              leftIcon={<Plus />}
              onClick={startCreate}
            >
              Nuevo banco
            </AppButton>
          }
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <AppCard title="Bancos registrados" icon={<Building2 />} size="sm">
            <p className="text-2xl font-semibold">{rows.length}</p>
          </AppCard>
          <AppCard title="Activos para pagos" icon={<Power />} size="sm">
            <p className="text-2xl font-semibold">{activeCount}</p>
          </AppCard>
        </div>

        <AppCard
          title={editing ? "Editar banco" : "Registrar banco"}
          description="Sólo los bancos activos aparecen al registrar un pago bancario."
          size="sm"
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium">
                Nombre *
              </label>
              <AppInput
                value={draft.nombre}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    nombre: event.target.value,
                  }))
                }
                maxLength={160}
                placeholder="Banco Industrial"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium">Código</label>
              <AppInput
                value={draft.codigo}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    codigo: event.target.value,
                  }))
                }
                maxLength={80}
                placeholder="BI"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium">
                Cuenta / referencia
              </label>
              <AppInput
                value={draft.cuenta}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    cuenta: event.target.value,
                  }))
                }
                maxLength={160}
                placeholder="Cuenta operativa o referencia"
              />
            </div>

            <div className="flex items-end">
              <label className="flex min-h-10 w-full items-center gap-2 rounded-md border border-[hsl(var(--app-border))] px-3 text-sm">
                <input
                  type="checkbox"
                  checked={draft.activo}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      activo: event.target.checked,
                    }))
                  }
                />
                Disponible para pagos
              </label>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            {editing ? (
              <AppButton
                variant="secondary"
                size="sm"
                onClick={() => {
                  setEditing(null);
                  setDraft(emptyDraft);
                }}
              >
                Cancelar edición
              </AppButton>
            ) : null}
            <AppButton
              variant="primary"
              size="sm"
              disabled={!valid}
              onClick={() => setReviewOpen(true)}
            >
              {editing ? "Revisar cambios" : "Revisar y registrar"}
            </AppButton>
          </div>
        </AppCard>

        <AppDataState
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && rows.length === 0}
          emptyTitle="Sin bancos registrados"
          emptyDescription="Registra el primer banco para habilitar transferencias, depósitos y cheques."
        >
          <AppDataTable
            data={rows}
            columns={columns}
            getRowId={(row) => String(row.id)}
            paginationMode="none"
            density="xs"
            responsiveMode="scroll"
          />
        </AppDataState>

        <AppConfirmDialog
          open={reviewOpen}
          onOpenChange={setReviewOpen}
          preset="send"
          title={editing ? "Confirmar cambios del banco" : "Registrar banco"}
          description="Revisa los datos. Los bancos activos estarán disponibles inmediatamente al registrar pagos."
          confirmText={editing ? "Guardar cambios" : "Registrar banco"}
          loadingText="Guardando..."
          isLoading={busy}
          confirmDisabled={!valid}
          onConfirm={confirmSave}
          contentCard
        >
          <div className="space-y-2 text-sm">
            <p><strong>Banco:</strong> {draft.nombre || "—"}</p>
            <p><strong>Código:</strong> {draft.codigo || "—"}</p>
            <p><strong>Cuenta:</strong> {draft.cuenta || "—"}</p>
            <p><strong>Estado:</strong> {draft.activo ? "Activo" : "Inactivo"}</p>
          </div>
        </AppConfirmDialog>

        <AppConfirmDialog
          open={toggleBank !== null}
          onOpenChange={(next) => {
            if (!next && !updateMutation.isPending) setToggleBank(null);
          }}
          preset="warning"
          title={toggleBank?.activo ? "Desactivar banco" : "Activar banco"}
          description={
            toggleBank?.activo
              ? "El banco dejará de aparecer al registrar nuevas transferencias, depósitos o cheques. Los pagos históricos conservarán la relación."
              : "El banco volverá a estar disponible para nuevos pagos."
          }
          confirmText={toggleBank?.activo ? "Desactivar" : "Activar"}
          loadingText="Actualizando..."
          isLoading={updateMutation.isPending}
          onConfirm={confirmToggle}
          contentCard
        >
          {toggleBank ? (
            <div className="text-sm">
              <strong>{toggleBank.nombre}</strong>
              {toggleBank.cuenta ? " · " + toggleBank.cuenta : ""}
            </div>
          ) : null}
        </AppConfirmDialog>
      </AppStack>
    </AppContainer>
  );
}
