import { cn } from "@/lib/utils";

export function TransferProgress({
  received,
  sent,
  percentage,
  compact = false,
}: {
  received: number;
  sent: number;
  percentage: number;
  compact?: boolean;
}) {
  const safe = Math.max(0, Math.min(100, percentage));

  return (
    <div className={cn("min-w-[150px]", compact ? "space-y-1" : "space-y-1.5")}>
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-medium tabular-nums">
          {received} de {sent}
        </span>
        <span className="text-[hsl(var(--app-muted-foreground))] tabular-nums">
          {safe.toFixed(safe % 1 === 0 ? 0 : 1)}%
        </span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-[hsl(var(--app-muted))]"
        role="progressbar"
        aria-label={"Recepción " + received + " de " + sent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(safe)}
      >
        <div
          className="h-full rounded-full bg-[hsl(var(--app-primary))] transition-[width]"
          style={{ width: safe + "%" }}
        />
      </div>
    </div>
  );
}
