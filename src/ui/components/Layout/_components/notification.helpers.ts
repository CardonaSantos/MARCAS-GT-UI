import dayjs from "dayjs";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.locale("es");

export type NotificationTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger";

export function formatNotificationRelativeTime(value?: string | Date | null) {
  if (!value) return "Ahora";

  const date = dayjs(value);

  if (!date.isValid()) return "Ahora";

  return date.fromNow();
}

export function truncateNotificationMessage(value?: string | null, limit = 92) {
  const safeValue = value?.trim() ?? "";

  if (!safeValue) return "Sin contenido.";

  if (safeValue.length <= limit) return safeValue;

  return `${safeValue.slice(0, limit).trim()}…`;
}

export function getNotificationTone(
  severity?: string | null,
): NotificationTone {
  const normalized = String(severity ?? "").toUpperCase();

  if (
    normalized.includes("URGENTE") ||
    normalized.includes("CRIT") ||
    normalized.includes("ALTA") ||
    normalized.includes("HIGH") ||
    normalized.includes("ERROR")
  ) {
    return "danger";
  }

  if (
    normalized.includes("MEDIA") ||
    normalized.includes("WARNING") ||
    normalized.includes("WARN")
  ) {
    return "warning";
  }

  if (normalized.includes("SUCCESS") || normalized.includes("EXITO")) {
    return "success";
  }

  if (
    normalized.includes("INFO") ||
    normalized.includes("BAJA") ||
    normalized.includes("LOW")
  ) {
    return "info";
  }

  return "neutral";
}

export function getNotificationToneClasses(tone: NotificationTone) {
  switch (tone) {
    case "danger":
      return {
        border: "border-l-[hsl(var(--app-danger))]",
        icon: "bg-[hsl(var(--app-danger)/0.12)] text-[hsl(var(--app-danger))]",
        action: "text-[hsl(var(--app-danger))]",
      };

    case "warning":
      return {
        border: "border-l-[hsl(var(--app-warning))]",
        icon: "bg-[hsl(var(--app-warning)/0.12)] text-[hsl(var(--app-warning))]",
        action: "text-[hsl(var(--app-warning))]",
      };

    case "success":
      return {
        border: "border-l-[hsl(var(--app-success))]",
        icon: "bg-[hsl(var(--app-success)/0.12)] text-[hsl(var(--app-success))]",
        action: "text-[hsl(var(--app-success))]",
      };

    case "info":
      return {
        border: "border-l-[hsl(var(--app-info))]",
        icon: "bg-[hsl(var(--app-info)/0.12)] text-[hsl(var(--app-info))]",
        action: "text-[hsl(var(--app-info))]",
      };

    default:
      return {
        border: "border-l-[hsl(var(--app-border,var(--border)))]",
        icon: "bg-[hsl(var(--app-muted,var(--muted))/0.55)] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
        action:
          "text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
      };
  }
}
