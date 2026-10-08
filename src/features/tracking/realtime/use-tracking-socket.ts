import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { useStore } from "@/Context/ContextSucursal";
import { marcasQueryKeys } from "@/API/queryKeys";
import { trackingRealtimeKey } from "../api/tracking.queries";
import type { TrackingRealtimeView } from "../api/tracking.types";

type Connection = "connecting" | "connected" | "disconnected";

export function useTrackingSocket(): Connection {
  const [status, setStatus] = useState<Connection>("connecting");
  const queryClient = useQueryClient();
  const token = useStore((state) => state.authToken);

  useEffect(() => {
    if (!token || !import.meta.env.VITE_API_URL) {
      setStatus("disconnected");
      return;
    }

    // Socket.IO uses the origin and the NestJS /ws namespace, not the REST API path.
    const origin = new URL(import.meta.env.VITE_API_URL).origin;
    const socket = io(origin + "/ws", {
      transports: ["websocket"],
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    });

    socket.on("connect", () => {
      setStatus("connected");
      void queryClient.invalidateQueries({ queryKey: trackingRealtimeKey });
    });

    socket.on("disconnect", () => setStatus("disconnected"));
    socket.on("connect_error", () => setStatus("disconnected"));

    socket.on("tracking:location-updated", (payload: TrackingRealtimeView) => {
      if (!payload || !Number.isInteger(payload.usuario?.id) || payload.tracking?.estado !== "ACTIVA") return;
      queryClient.setQueryData<TrackingRealtimeView[]>(trackingRealtimeKey, (previous) => {
        if (!previous) return [payload];
        const withoutPrevious = previous.filter((item) => item.usuario.id !== payload.usuario.id);
        return [...withoutPrevious, payload];
      });
    });

    socket.on("tracking:state-changed", () => {
      // A session can finish or expire: refetch removes it from the active map.
      void queryClient.invalidateQueries({ queryKey: trackingRealtimeKey });
      void queryClient.invalidateQueries({ queryKey: marcasQueryKeys.tracking.lists() });
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [token, queryClient]);

  return status;
}
