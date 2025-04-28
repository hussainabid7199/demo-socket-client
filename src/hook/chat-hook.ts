import { useSocket } from "@/context/socket-context";
import { useEffect } from "react";


export const useChatRoom = (roomId: string | null | undefined) => {
  const { joinRoom, leaveRoom, currentRoomId, isConnected } = useSocket();

  useEffect(() => {
    if (!roomId || !isConnected) return;

    if (currentRoomId !== roomId) {
      joinRoom(roomId);
    }

    return () => {
      if (roomId) {
        leaveRoom(roomId);
      }
    };
  }, [roomId, isConnected]);
};
