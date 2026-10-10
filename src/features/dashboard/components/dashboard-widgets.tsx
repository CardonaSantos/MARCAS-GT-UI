import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, AlertCircle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppSkeletonCard } from "@/ui/components/app/primitives/app-skeleton";
import type { DashboardSection } from "../api/dashboard.types";

export const mutedText = "text-[hsl(var(--app-muted-foreground))]";
export const borderColor = "border-[hsl(var(--app-border))]";

type Source<T> = {
  section?: DashboardSection<T>;
  loading: boolean;
  error?: boolean;
  retry: () => void;
};
type MetricProps<T> = Source<T> & {
  label: string; value: (data: T) => string; description?: string;
  icon: LucideIcon; href?: string; emphasized?: boolean;
};

export function DashboardMetric<T>({
  section, loading, error, retry, label, value, description, icon: Icon, href, emphasized,
}: MetricProps<T>) {
  const ready = section?.status === "OK" ? section.data : null;
  const unavailable = (!loading && (!section || section.status === "UNAVAILABLE")) || error;
  return (
    <AppCard className={"h-full min-w-0 " + (emphasized ? "border-[hsl(var(--app-primary))]/30" : "")} size="sm">
      <div className="flex items-start justify-between gap-2">
        <p className={"min-w-0 text-xs font-medium " + mutedText}>{label}</p>
        <span className="rounded-lg bg-[hsl(var(--app-muted-bg))] p-2 text-[hsl(var(--app-foreground))]">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <div className="mt-3 min-h-11">
        {loading && !section ? <div className="h-9 w-28 animate-pulse rounded bg-[hsl(var(--app-muted-bg))]" /> :
          unavailable || !ready ? (
            <button type="button" onClick={retry} className={"flex items-center gap-1 text-xs underline underline-offset-2 " + mutedText}>
              <AlertCircle className="h-4 w-4" /> No disponible · Reintentar
            </button>
          ) : <p className="break-words text-2xl font-semibold tracking-tight tabular-nums md:text-[1.65rem]">{value(ready)}</p>}
      </div>
      {description && <p className={"mt-2 text-xs leading-relaxed " + mutedText}>{description}</p>}
      {href && <Link to={href} className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[hsl(var(--app-primary))] hover:underline">
        Abrir módulo <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>}
    </AppCard>
  );
}

export function DashboardBlock<T>({
  title, description, icon: Icon, href, linkLabel = "Ver todos",
  section, loading, error, retry, children, isEmpty, className,
}: Source<T> & {
  title: string; description?: string; icon?: LucideIcon;
  href?: string; linkLabel?: string; className?: string;
  isEmpty?: (data: T) => boolean;
  children: (data: T) => ReactNode;
}) {
  const ready = section?.status === "OK" ? section.data : null;
  const unavailable = error || (!loading && (!section || section.status === "UNAVAILABLE"));
  return (
    <AppCard size="sm" className={"min-w-0 h-full " + (className ?? "")}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[hsl(var(--app-border))] pb-3">
        <div className="flex min-w-0 items-start gap-2.5">
          {Icon && <span className="rounded-lg bg-[hsl(var(--app-muted-bg))] p-2"><Icon className="h-4 w-4" aria-hidden /></span>}
          <div className="min-w-0">
            <h2 className="text-sm font-semibold">{title}</h2>
            {description && <p className={"mt-1 text-xs leading-relaxed " + mutedText}>{description}</p>}
          </div>
        </div>
        {href && <AppButton variant="outline" size="xs" asChild><Link to={href}>{linkLabel} <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" /></Link></AppButton>}
      </div>
      <div className="min-w-0 pt-3">
        {loading && !section ? <AppSkeletonCard lines={3} withHeader={false} /> :
          unavailable || !ready ? (
            <div className="flex min-h-28 flex-col items-center justify-center gap-2 text-center" role="status">
              <AlertCircle className={"h-5 w-5 " + mutedText} />
              <span className={"text-xs " + mutedText}>Información temporalmente no disponible.</span>
              <AppButton variant="outline" size="xs" onClick={retry} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>Reintentar</AppButton>
            </div>
          ) : isEmpty?.(ready) ? (
            <div className={"flex min-h-28 items-center justify-center p-4 text-center text-sm " + mutedText}>No hay registros para mostrar.</div>
          ) : children(ready)}
      </div>
    </AppCard>
  );
}

export function DashboardInfoLine({
  label, value, href, detail,
}: { label: string; value: string | number; href?: string; detail?: string }) {
  const content = <div className="flex min-w-0 items-center justify-between gap-3 py-2.5">
    <div className="min-w-0">
      <p className="truncate text-sm">{label}</p>
      {detail && <p className={"mt-0.5 truncate text-xs " + mutedText}>{detail}</p>}
    </div>
    <span className="flex shrink-0 items-center gap-1 text-sm font-semibold tabular-nums">
      {value}{href && <ArrowUpRight className={"h-3.5 w-3.5 " + mutedText} />}
    </span>
  </div>;
  return href ? <Link to={href} className="block rounded-md px-1 transition-colors hover:bg-[hsl(var(--app-muted-bg))]">{content}</Link> : content;
}

export function DashboardRecord({
  title, detail, amount, href, badge,
}: { title: string; detail?: string; amount?: string; href: string; badge?: string }) {
  return <Link to={href} className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-[hsl(var(--app-border))] px-3 py-2.5 transition-colors hover:bg-[hsl(var(--app-muted-bg))]">
    <span className="min-w-0">
      <span className="block truncate text-sm font-medium">{title}</span>
      {detail && <span className={"mt-0.5 block truncate text-xs " + mutedText}>{detail}</span>}
    </span>
    <span className="flex shrink-0 items-center gap-2">
      {amount && <span className="text-xs font-medium tabular-nums">{amount}</span>}
      {badge && <span className={"max-w-28 truncate rounded-md bg-[hsl(var(--app-muted-bg))] px-2 py-1 text-[11px] " + mutedText}>{badge.replace(/_/g, " ")}</span>}
      <ArrowUpRight className={"h-4 w-4 " + mutedText} />
    </span>
  </Link>;
}
