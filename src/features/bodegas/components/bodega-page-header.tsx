import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppInline } from "@/ui/components/app/primitives/app-inline";

interface BodegaPageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  backTo?: string;
  backState?: unknown;
  backLabel?: string;
  actions?: ReactNode;
}

export function BodegaPageHeader({
  title,
  description,
  backTo,
  backState,
  backLabel = "Volver",
  actions,
}: BodegaPageHeaderProps) {
  return (
    <div className="space-y-3">
      {backTo ? (
        <AppButton asChild variant="ghost" size="sm">
          <Link to={backTo} state={backState}>
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        </AppButton>
      ) : null}

      <AppInline
        collapseBelow="md"
        align="start"
        justify="between"
        className="gap-3"
      >
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-[hsl(var(--app-foreground))] md:text-2xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 max-w-3xl text-sm text-[hsl(var(--app-muted-foreground))]">
              {description}
            </p>
          ) : null}
        </div>

        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        ) : null}
      </AppInline>
    </div>
  );
}
