import {
  CategoriaNotificacion,
  SeveridadNotificacion,
  UiNotificacion,
} from "@/Crm/WEB/notifications/notifications.type";
import {
  Settings,
  FileText,
  Megaphone,
  Headphones,
  MapPin,
  Users,
  Info,
  CheckCircle2,
  AlertTriangle,
  OctagonAlert,
  ShieldAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type CategoryMeta = {
  label: string;
  Icon: LucideIcon;
  badgeClass: string;
};

// Mapa estricto basado SOLO en tu Enum CategoriaNotificacion
const CATEGORY_MAP: Record<CategoriaNotificacion, CategoryMeta> = {
  SISTEMA: {
    label: "Sistema",
    Icon: Settings,
    badgeClass:
      "bg-slate-200/70 text-slate-900 dark:bg-slate-500/20 dark:text-slate-200",
  },
  FACTURACION: {
    label: "Facturación",
    Icon: FileText,
    badgeClass:
      "bg-fuchsia-200/70 text-fuchsia-900 dark:bg-fuchsia-400/20 dark:text-fuchsia-200",
  },
  COBRANZA: {
    label: "Cobranza",
    Icon: Megaphone,
    badgeClass:
      "bg-red-200/70 text-red-900 dark:bg-red-400/20 dark:text-red-200",
  },
  SOPORTE: {
    label: "Soporte",
    Icon: Headphones,
    badgeClass:
      "bg-violet-200/70 text-violet-900 dark:bg-violet-400/20 dark:text-violet-200",
  },
  RUTA_COBRO: {
    label: "Ruta de Cobro",
    Icon: MapPin,
    badgeClass:
      "bg-lime-200/70 text-lime-900 dark:bg-lime-400/20 dark:text-lime-200",
  },
  CLIENTE: {
    label: "Clientes",
    Icon: Users,
    badgeClass:
      "bg-blue-200/70 text-blue-900 dark:bg-blue-400/20 dark:text-blue-200",
  },
  OTROS: {
    label: "Otros",
    Icon: Info,
    badgeClass:
      "bg-gray-200/70 text-gray-900 dark:bg-gray-500/20 dark:text-gray-200",
  },
  BOT: {
    label: "Otros",
    Icon: Info,
    badgeClass:
      "bg-gray-200/70 text-gray-900 dark:bg-gray-500/20 dark:text-gray-200",
  },
};

export function getCategoryMeta(cat: CategoriaNotificacion) {
  return CATEGORY_MAP[cat] ?? CATEGORY_MAP.OTROS;
}

export function getSeverityStyles(sev: SeveridadNotificacion) {
  switch (sev) {
    case SeveridadNotificacion.EXITO:
      return {
        cardBg:
          "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20",
        ring: "ring-emerald-400/60",
        accent: "bg-emerald-500",
        title: "text-emerald-950 dark:text-emerald-100",
        body: "text-emerald-800 dark:text-emerald-200",
        Icon: CheckCircle2,
      };
    case SeveridadNotificacion.ALERTA:
      return {
        cardBg:
          "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20",
        ring: "ring-amber-400/60",
        accent: "bg-amber-500",
        title: "text-amber-950 dark:text-amber-100",
        body: "text-amber-800 dark:text-amber-200",
        Icon: AlertTriangle,
      };
    case SeveridadNotificacion.ERROR:
      return {
        cardBg:
          "bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950/30 dark:to-rose-900/20",
        ring: "ring-rose-400/60",
        accent: "bg-rose-600",
        title: "text-rose-950 dark:text-rose-100",
        body: "text-rose-800 dark:text-rose-200",
        Icon: OctagonAlert,
      };
    case SeveridadNotificacion.CRITICA:
      return {
        cardBg:
          "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/40 dark:to-red-900/20",
        ring: "ring-red-500/70",
        accent: "bg-red-600",
        title: "text-red-950 dark:text-red-100",
        body: "text-red-800 dark:text-red-200",
        Icon: ShieldAlert,
      };
    case SeveridadNotificacion.INFO:
    default:
      return {
        cardBg:
          "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20",
        ring: "ring-blue-400/60",
        accent: "bg-blue-500",
        title: "text-blue-950 dark:text-blue-100",
        body: "text-blue-800 dark:text-blue-200",
        Icon: Info,
      };
  }
}

/**
 * Obtiene la acción de navegación y la etiqueta del botón.
 * Se basa estrictamente en lo que el backend envía en `route` y `actionLabel`.
 */
export function getActionFor(n: UiNotificacion) {
  const to = n.route ?? "#";
  const label = n.actionLabel ?? null;

  // Si no hay label, asumimos que no hay acción principal visible,
  // aunque 'to' tenga valor (puede ser click en toda la tarjeta).
  return { label, to };
}

export const formatGTQ = (v?: number | null) =>
  typeof v === "number"
    ? new Intl.NumberFormat("es-GT", {
        style: "currency",
        currency: "GTQ",
      }).format(v)
    : null;
