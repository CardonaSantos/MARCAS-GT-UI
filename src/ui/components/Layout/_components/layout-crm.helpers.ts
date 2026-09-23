import { RolUsuario } from "@/Crm/features/users/users-rol";

export interface CrmTokenPayload {
  id: number;
  nombre: string;
  correo: string;
  activo: boolean;
  rol: RolUsuario;
  empresaId: number;
}

export function getInitials(name?: string | null) {
  if (!name) return "??";

  const words = name.trim().split(/\s+/).filter(Boolean);

  if (!words.length) return "??";

  const first = words[0]?.[0] ?? "";
  const second = words[1]?.[0] ?? words[0]?.[1] ?? "";

  return `${first}${second}`.toUpperCase() || "??";
}

export function getRoleLabel(role?: string | null) {
  if (!role) return null;

  return role.replace(/_/g, " ");
}

export function getSafeExternalHref(value?: string | null) {
  return value && value.trim() ? value : "#";
}
