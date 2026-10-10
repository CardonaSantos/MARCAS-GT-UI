import { useMemo, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Filler, Tooltip, Legend, type ChartData, type ChartOptions,
} from "chart.js";
import { BarChart3, CircleDollarSign, ClipboardList, Layers3 } from "lucide-react";
import { DashboardBlock, mutedText } from "./dashboard-widgets";
import { asChartAmount, fillDailyRows, moneyGt } from "../common/dashboard.utils";
import type { DailyPoint, DashboardSection } from "../api/dashboard.types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip, Legend);

const palette = [
  "hsl(var(--chart-1))", "hsl(var(--chart-2))",
  "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))",
];
const moneyTooltip = (value: number | null) => moneyGt(value ?? 0);
const baseScales = {
  x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8 } },
  y: { beginAtZero: true, grid: { color: "rgba(128,128,128,.12)" } },
};
const chartBase = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 300 },
  plugins: { legend: { display: false } },
} as const;
type GraphicProps = {
  section?: DashboardSection<DailyPoint[]>;
  loading: boolean; error?: boolean; retry: () => void; from: string; to: string;
};

export function CashChart({ section, loading, error, retry, from, to }: GraphicProps) {
  const rows = useMemo(() =>
    section?.status === "OK" ? fillDailyRows(section.data, from, to) : [],
    [section, from, to]);
  const data: ChartData<"line"> = {
    labels: rows.map(r => r.dia.slice(5)),
    datasets: [{ label: "Cobros verificados", data: rows.map(r => asChartAmount(r.monto)),
      fill: true, tension: 0.32, borderColor: palette[0], backgroundColor: "rgba(20,184,166,.12)",
      pointRadius: rows.length > 31 ? 0 : 2, pointHoverRadius: 5, borderWidth: 2 }],
  };
  const options: ChartOptions<"line"> = {
    ...chartBase, interaction: { mode: "index", intersect: false }, scales: baseScales,
    plugins: { ...chartBase.plugins, tooltip: { callbacks: { label: ctx => moneyTooltip(ctx.parsed.y) } } },
  };
  return <DashboardBlock title="Evolución de cobros" icon={CircleDollarSign}
    description="Dinero verificado por día · GTQ" section={section}
    loading={loading} error={error} retry={retry}
    isEmpty={data => data.length === 0}>
    {() => <div className="h-56 w-full sm:h-64 lg:h-72" role="img" aria-label="Evolución de cobros diarios verificados">
      <Line data={data} options={options} />
    </div>}
  </DashboardBlock>;
}

export function OrdersChart({ section, loading, error, retry, from, to }: GraphicProps) {
  const [mode, setMode] = useState<"cantidad" | "monto">("cantidad");
  const rows = useMemo(() =>
    section?.status === "OK" ? fillDailyRows(section.data, from, to) : [],
    [section, from, to]);
  const data: ChartData<"bar"> = {
    labels: rows.map(r => r.dia.slice(5)),
    datasets: [{ label: mode === "cantidad" ? "Pedidos" : "Valor de pedidos",
      data: rows.map(r => mode === "cantidad" ? r.cantidad : asChartAmount(r.monto)),
      backgroundColor: palette[1], borderRadius: 5, maxBarThickness: 30 }],
  };
  const options: ChartOptions<"bar"> = {
    ...chartBase, scales: baseScales,
    plugins: { ...chartBase.plugins, tooltip: { callbacks: { label: ctx => mode === "monto" ? moneyTooltip(ctx.parsed.y) : String(ctx.parsed.y ?? 0) + " pedidos" } } },
  };
  return <DashboardBlock title="Actividad de pedidos" icon={ClipboardList}
    description="Pedidos creados en el período, excluyendo cancelados"
    section={section} loading={loading} error={error} retry={retry}
    isEmpty={data => data.length === 0}>
    {() => <>
      <div className="mb-3 flex flex-wrap gap-1" aria-label="Métrica del gráfico">
        {(["cantidad", "monto"] as const).map(item =>
          <button key={item} type="button" onClick={() => setMode(item)}
            aria-pressed={mode === item}
            className={"rounded-md border px-3 py-1.5 text-xs transition-colors " +
              (mode === item ? "border-[hsl(var(--app-primary))] bg-[hsl(var(--app-muted))] font-semibold" : "border-[hsl(var(--app-border))] " + mutedText)}>
            {item === "cantidad" ? "Cantidad" : "Valor (Q)"}
          </button>)}
      </div>
      <div className="h-52 w-full sm:h-60 lg:h-64" role="img" aria-label="Pedidos diarios">
        <Bar data={data} options={options} />
      </div>
    </>}
  </DashboardBlock>;
}

type ChartCommon<T> = { section?: DashboardSection<T>; loading: boolean; error?: boolean; retry: () => void };
export function AgingChart({ section, loading, error, retry }: ChartCommon<{ rango: string; monto: string }[]>) {
  const data: ChartData<"bar"> = {
    labels: section?.status === "OK" ? section.data.map(r => r.rango) : [],
    datasets: [{ label: "Saldo de cartera", data: section?.status === "OK" ? section.data.map(r => asChartAmount(r.monto)) : [],
      backgroundColor: [palette[1], palette[0], palette[3], palette[4], palette[2]], borderRadius: 5, maxBarThickness: 32 }],
  };
  const options: ChartOptions<"bar"> = {
    ...chartBase, indexAxis: "y",
    scales: { x: { beginAtZero: true, grid: { color: "rgba(128,128,128,.12)" } }, y: { grid: { display: false } } },
    plugins: { ...chartBase.plugins, tooltip: { callbacks: { label: ctx => moneyTooltip(ctx.parsed.x) } } },
  };
  return <DashboardBlock title="Antigüedad de cartera" icon={BarChart3}
    description="Saldo pendiente agrupado por días de atraso · GTQ"
    section={section} loading={loading} error={error} retry={retry}
    isEmpty={rows => rows.every(r => asChartAmount(r.monto) === 0)}>
    {() => <div className="h-56 w-full sm:h-64" role="img" aria-label="Saldo vigente y vencido por antigüedad">
      <Bar data={data} options={options} />
    </div>}
  </DashboardBlock>;
}

export function DispatchChart({ section, loading, error, retry }: ChartCommon<{ estado: string; cantidad: number }[]>) {
  const rows = section?.status === "OK" ? section.data.filter(r => r.cantidad > 0) : [];
  const data: ChartData<"doughnut"> = {
    labels: rows.map(r => r.estado.replace(/_/g, " ")),
    datasets: [{ data: rows.map(r => r.cantidad), backgroundColor: rows.map((_, i) => palette[i % palette.length]),
      borderWidth: 2, borderColor: "hsl(var(--app-card-bg))", hoverOffset: 5 }],
  };
  const options: ChartOptions<"doughnut"> = {
    ...chartBase, cutout: "70%",
    plugins: { ...chartBase.plugins, tooltip: { callbacks: { label: ctx => String(ctx.parsed) + " despachos" } } },
  };
  return <DashboardBlock title="Estados de despachos" icon={Layers3}
    description="Distribución de órdenes creadas en el período"
    section={section} loading={loading} error={error} retry={retry}
    href="/marcas-gt/despachos" isEmpty={r => r.length === 0}>
    {() => <div className="flex min-w-0 flex-col items-center gap-4 sm:flex-row">
      <div className="relative h-44 w-full min-w-0 sm:h-48 sm:w-1/2" role="img" aria-label="Distribución de despachos por estado">
        <Doughnut data={data} options={options} />
      </div>
      <div className="grid w-full min-w-0 flex-1 gap-2">
        {rows.map((r, i) => <div key={r.estado} className="flex items-center justify-between gap-2 text-xs">
          <span className="flex min-w-0 items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: palette[i % palette.length] }} />
            <span className="truncate">{r.estado.replace(/_/g, " ")}</span>
          </span>
          <strong className="tabular-nums">{r.cantidad}</strong>
        </div>)}
      </div>
    </div>}
  </DashboardBlock>;
}
