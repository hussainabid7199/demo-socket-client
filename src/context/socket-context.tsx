"use client";

import { ChatEventEnum } from "@/enums/constant";
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";


type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  currentRoomId: string | null;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  joinRoom: () => {},
  leaveRoom: () => {},
  currentRoomId: null,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("at") || "";
    const userId = Number(localStorage.getItem("id"));

    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL as string, {
      transports: ["websocket"],
      auth: { token },
      query: { userId },
    });

    socketRef.current = socket;

    socket.on(ChatEventEnum.CONNECTED_EVENT, () => {
      setIsConnected(true);
    });

    socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
      setIsConnected(false);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on(ChatEventEnum.SOCKET_ERROR_EVENT, (error: any) => {
      console.error("Socket error:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinRoom = useCallback((newRoomId: string) => {
    if (!socketRef.current) return;

    if (currentRoomId) {
      socketRef.current.emit(ChatEventEnum.LEAVE_CHAT_EVENT, currentRoomId);
    }

    socketRef.current.emit(ChatEventEnum.JOIN_CHAT_EVENT, newRoomId);
    setCurrentRoomId(newRoomId);
  }, [currentRoomId]);

  const leaveRoom = useCallback((roomId: string) => {
    if (!socketRef.current) return;

    socketRef.current.emit(ChatEventEnum.LEAVE_CHAT_EVENT, roomId);
    if (currentRoomId === roomId) {
      setCurrentRoomId(null);
    }
  }, [currentRoomId]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        joinRoom,
        leaveRoom,
        currentRoomId,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
