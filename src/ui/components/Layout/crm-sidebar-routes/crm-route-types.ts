import type { CustomIconProps } from "@/Crm/Icons/ChartNetWork";
import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

export type AppRouteIcon = LucideIcon | ComponentType<CustomIconProps>;

export type Route = {
  icon: AppRouteIcon;
  label: string;
  href?: string;
  submenu?: Route[];
};
