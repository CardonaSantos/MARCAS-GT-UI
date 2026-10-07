import { FilePlus2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useIdempotencyKey } from "@/features/common/utils/idempotency";
import { useCreateInvoice } from "@/features/facturacion/api/billing.mutations";
import { useBillingCandidates } from "@/features/facturacion/api/billing.queries";
import type { BillingCandidate } from "@/features/facturacion/api/billing.types";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function CreateInvoicePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const preferredDeliveryId = Number(params.get("entregaId")) || null;
  const backTo = getReturnRoute(location.state, "/marcas-gt/facturacion/facturas");
  const key = useIdempotencyKey("billing-create");
  const mutation = useCreateInvoice();
  const [search, setSearch] = useState("");
  const [serverSearch, setServerSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const query = useBillingCandidates({
    page: 1,
    limit: 100,
    search: serverSearch || undefined,
  });

  const candidates = useMemo(() => {
    const rows = query.data?.data ?? [];
    if (!preferredDeliveryId) return rows;
    return [...rows].sort((a, b) =>
      a.entrega.id === preferredDeliveryId
        ? -1
        : b.entrega.id === preferredDeliveryId
          ? 1
          : 0,
    );
  }, [preferredDeliveryId, query.data?.data]);

  const selectedCandidates = candidates.filter((candidate) =>
    selected.includes(candidate.entrega.id),
  );
  const context = selectedCandidates[0] ?? null;

  const toggle = (candidate: BillingCandidate) => {
    const exists = selected.includes(candidate.entrega.id);
    if (exists) {
      setSelected((current) => current.filter((id) => id !== candidate.entrega.id));
      return;
    }
    if (
      context &&
      (context.pedido.id !== candidate.pedido.id ||
        context.cliente.id !== candidate.cliente.id)
    ) {
      toast.error("Una factura sólo puede agrupar entregas del mismo pedido y cliente.");
      return;
    }

    setSelected((current) => [...current, candidate.entrega.id]);
    setQuantities((current) => {
      const next = { ...current };
      candidate.lineas.forEach((line) => {
        next[line.entregaDetalleId] = line.disponibleFacturar;
      });
      return next;
    });
  };

  const create = async () => {
    const rows = candidates.filter((candidate) =>
      selected.includes(candidate.entrega.id),
    );
    if (!rows.length) {
      toast.error("Selecciona al menos una entrega.");
      return;
    }

    const lineas = rows.flatMap((candidate) =>
      candidate.lineas
        .map((line) => ({
          entregaDetalleId: line.entregaDetalleId,
          cantidad: quantities[line.entregaDetalleId] ?? 0,
          max: line.disponibleFacturar,
        }))
        .filter((line) => line.cantidad > 0),
    );

    if (!lineas.length) {
      toast.error("Selecciona al menos una cantidad para facturar.");
      return;
    }
    if (lineas.some((line) => line.cantidad > line.max)) {
      toast.error("Una cantidad supera lo disponible para facturar.");
      return;
    }

    const invoice = await mutation.mutateAsync({
      entregaIds: rows.map((row) => row.entrega.id),
      lineas: lineas.map(({ entregaDetalleId, cantidad }) => ({
        entregaDetalleId,
        cantidad,
      })),
      claveIdempotencia: key,
    });

    navigate("/marcas-gt/facturacion/facturas/" + invoice.id, {
      replace: true,
      state: { from: backTo },
    });
  };

  return (
    <AppContainer size="xl" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Nueva factura"
          description="Crea un borrador desde cantidades efectivamente entregadas y todavía no facturadas."
          backTo={backTo}
          backLabel="Volver a facturación"
        />

        <AppAlert
          tone="info"
          title="Creación comercial"
          description="Crear el borrador no certifica FEL. La preparación fiscal es un paso posterior y la certificación externa sigue deshabilitada."
        />

        <AppSearchInput
          value={search}
          onValueChange={setSearch}
          onDebouncedChange={setServerSearch}
          placeholder="Buscar cliente o pedido..."
        />

        <AppDataState
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && candidates.length === 0}
          emptyTitle="Sin entregas facturables"
          emptyDescription="No hay entregas ENTREGADA/PARCIAL con cantidades disponibles para facturar."
        >
          <AppStack gap="sm">
            {candidates.map((candidate) => {
              const checked = selected.includes(candidate.entrega.id);
              const blocked =
                Boolean(context) &&
                !checked &&
                (context!.pedido.id !== candidate.pedido.id ||
                  context!.cliente.id !== candidate.cliente.id);

              return (
                <AppCard
                  key={candidate.entrega.id}
                  title={
                    "Entrega #" +
                    candidate.entrega.id +
                    " · " +
                    candidate.pedido.numero
                  }
                  description={candidate.cliente.nombreCompleto}
                  size="sm"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <label className="inline-flex items-center gap-2 text-sm font-medium">
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={blocked}
                          onChange={() => toggle(candidate)}
                        />
                        Incluir entrega
                      </label>
                      <div className="flex items-center gap-2">
                        <AppBadge tone={candidate.fiscalReady ? "success" : "warning"} size="xs">
                          {candidate.fiscalReady ? "Fiscal lista" : "Configuración fiscal pendiente"}
                        </AppBadge>
                        <span className="text-xs text-[hsl(var(--app-muted-foreground))]">
                          {candidate.unidadesDisponibles} unidades disponibles
                        </span>
                      </div>
                    </div>

                    {candidate.advertencias.map((warning) => (
                      <AppAlert
                        key={warning.codigo}
                        tone="warning"
                        title={warning.codigo.replace(/_+/g, " ")}
                        description={warning.mensaje}
                      />
                    ))}

                    <div className="overflow-x-auto rounded-md border border-[hsl(var(--app-border))]">
                      <table className="w-full min-w-[720px] text-sm">
                        <thead>
                          <tr className="border-b border-[hsl(var(--app-border))] text-left text-xs">
                            <th className="p-2">Producto</th>
                            <th className="p-2 text-right">Entregada</th>
                            <th className="p-2 text-right">Facturada</th>
                            <th className="p-2 text-right">Disponible</th>
                            <th className="p-2 text-right">Cantidad factura</th>
                          </tr>
                        </thead>
                        <tbody>
                          {candidate.lineas.map((line) => (
                            <tr key={line.entregaDetalleId} className="border-b border-[hsl(var(--app-border))] last:border-0">
                              <td className="p-2">
                                {line.producto.codigo + " · " + line.producto.nombre}
                              </td>
                              <td className="p-2 text-right">{line.entregada}</td>
                              <td className="p-2 text-right">{line.facturada}</td>
                              <td className="p-2 text-right">{line.disponibleFacturar}</td>
                              <td className="p-2 text-right">
                                <input
                                  type="number"
                                  min={0}
                                  max={line.disponibleFacturar}
                                  step={1}
                                  disabled={!checked}
                                  value={quantities[line.entregaDetalleId] ?? line.disponibleFacturar}
                                  onChange={(event) =>
                                    setQuantities((current) => ({
                                      ...current,
                                      [line.entregaDetalleId]: Number(event.target.value),
                                    }))
                                  }
                                  className="w-24 rounded-md border border-[hsl(var(--app-border))] bg-transparent px-2 py-1 text-right"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </AppCard>
              );
            })}
          </AppStack>
        </AppDataState>

        <div className="flex justify-end gap-2">
          <AppButton asChild variant="secondary">
            <Link to={backTo}>Cancelar</Link>
          </AppButton>
          <AppButton
            type="button"
            variant="primary"
            leftIcon={<FilePlus2 />}
            disabled={!selected.length || mutation.isPending}
            onClick={() => void create()}
          >
            {mutation.isPending ? "Creando..." : "Crear factura borrador"}
          </AppButton>
        </div>
      </AppStack>
    </AppContainer>
  );
}
