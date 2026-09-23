import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

// Definimos la interfaz para el token decodificado y el contexto del socket
interface UserToken {
  nombre: string;
  correo: string;
  rol: string;
  sub: number;
  activo: boolean;
  sucursalId: number;
}

const API_URL = import.meta.env.VITE_API_URL;
type SocketContextType = Socket | null;

// Creamos el contexto
const SocketContext = createContext<SocketContextType>(null);

// Hook personalizado para acceder al contexto
export const useSocket = () => useContext(SocketContext);

// Proveedor del contexto que manejará la conexión de Socket.IO
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<SocketContextType>(null);
  const [user, setUser] = useState<UserToken | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authTokenPos");

    if (token) {
      try {
        const decodedToken: UserToken = jwtDecode(token);
        setUser(decodedToken); // Guardamos el token decodificado en el estado
        console.log(
          "El token decodificado en el socket context es: ",
          decodedToken
        );
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, []);

  console.log("El user decodificado en el token es: ", user);

  useEffect(() => {
    if (user) {
      // Solo conecta el socket si el usuario está definido
      const newSocket = io(`${API_URL}`, {
        query: {
          userID: user.sub, // Asegúrate de que este es el valor correcto
          rol: user.rol,
        },
        transports: ["websocket"],
      });

      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Socket conectado:", newSocket.id);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Error en la conexión del socket:", error.message);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
