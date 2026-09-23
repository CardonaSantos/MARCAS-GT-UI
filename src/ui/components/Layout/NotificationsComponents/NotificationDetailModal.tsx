"use client";
import type { UiNotificacion } from "@/Crm/WEB/notifications/notifications.type";
import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { User, Calendar, ExternalLink, LinkIcon, Tag } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";
import {
  getCategoryMeta,
  getSeverityStyles,
  getActionFor,
} from "./notification-style";
import { Link } from "react-router-dom";
import { formattFechaWithMinutes } from "@/utils/formattFechas";

dayjs.extend(relativeTime);
dayjs.locale("es");

interface Props {
  notification: UiNotificacion | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function NotificationDetailModal({ notification, open, onOpenChange }: Props) {
  const sev = useMemo(
    () => (notification ? getSeverityStyles(notification.severidad) : null),
    [notification]
  );

  const cat = useMemo(
    () => (notification ? getCategoryMeta(notification.categoria) : null),
    [notification]
  );

  const action = useMemo(
    () => (notification ? getActionFor(notification) : null),
    [notification]
  );

  if (!notification || !sev || !cat) return null;

  const recibido = formattFechaWithMinutes(notification.recibidoEn);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 gap-0 overflow-hidden">
        <DialogHeader
          className={`${sev.accent} text-white px-5 py-4 space-y-1`}
        >
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-white/20 p-2 shrink-0 mt-0.5">
              <sev.Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base font-semibold text-white leading-snug">
                {notification.titulo ?? "Notificación"}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge className="text-[10px] px-1.5 py-0.5 bg-white/25 hover:bg-white/35 text-white border-0 font-medium">
                  <cat.Icon className="h-2.5 w-2.5 mr-1" />
                  {cat.label}
                </Badge>
                <Badge className="text-[10px] px-1.5 py-0.5 bg-white/25 hover:bg-white/35 text-white border-0 font-medium">
                  {notification.severidad}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[calc(85vh-120px)]">
          <div className="px-5 py-4 space-y-4">
            {/* Mensaje Principal */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                Mensaje
              </h4>
              <p className="text-sm text-zinc-900 dark:text-zinc-100 leading-relaxed whitespace-pre-wrap">
                {notification.mensaje}
              </p>
            </div>

            <Separator />

            {/* Información General */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Recibido</span>
                </div>
                <p className="text-sm text-zinc-900 dark:text-zinc-100">
                  {recibido}
                </p>
              </div>

              {notification.remitente && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                    <User className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">Remitente</span>
                  </div>
                  <p className="text-sm text-zinc-900 dark:text-zinc-100">
                    {notification.remitente.nombre || "Sistema"}
                  </p>
                </div>
              )}
            </div>

            {/* Metadatos Adicionales */}
            {(notification.subtipo ||
              notification.empresaId ||
              notification.referencia) && (
              <>
                <Separator />
                <div className="space-y-3">
                  {notification.subtipo && (
                    <div className="flex items-start gap-2">
                      <Tag className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          Subtipo:{" "}
                        </span>
                        <span className="text-sm text-zinc-900 dark:text-zinc-100">
                          {notification.subtipo}
                        </span>
                      </div>
                    </div>
                  )}

                  {notification.referencia &&
                    (notification.referencia.tipo ||
                      notification.referencia.id) && (
                      <div className="flex items-start gap-2">
                        <LinkIcon className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                            Referencia:{" "}
                          </span>
                          <span className="text-sm text-zinc-900 dark:text-zinc-100">
                            {notification.referencia.tipo} #
                            {notification.referencia.id}
                          </span>
                        </div>
                      </div>
                    )}
                </div>
              </>
            )}

            {/* URL Externa */}
            {notification.url && (
              <>
                <Separator />
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                    Enlace Externo
                  </h4>
                  <a
                    href={notification.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
                  >
                    {notification.url}
                  </a>
                </div>
              </>
            )}

            {/* Estado */}
            <Separator />
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                <span className="text-zinc-600 dark:text-zinc-400">Leído</span>
                <Badge
                  variant={notification.leido ? "default" : "secondary"}
                  className="text-[10px] px-1.5 py-0.5 h-auto"
                >
                  {notification.leido ? "Sí" : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Audiencia
                </span>
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0.5 h-auto"
                >
                  {notification.audiencia}
                </Badge>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer con Acciones */}
        {action && action.label && action.to !== "#" && (
          <div className="px-5 py-3 border-t bg-zinc-50 dark:bg-zinc-900">
            <Button
              asChild
              className={`w-full ${sev.accent} hover:opacity-90 text-white`}
              onClick={() => onOpenChange(false)}
            >
              <Link
                to={action.to}
                className="flex items-center justify-center gap-2"
              >
                {action.label}
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default NotificationDetailModal;
