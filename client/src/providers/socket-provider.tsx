// src/providers/socket-provider.tsx
'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { io, type Socket } from 'socket.io-client';
import { useRoomStore } from '@/providers/room-provider';

type Ctx = {
  socket: Socket;
  sendChat: (content: string) => boolean; // true=emitido, false=bloqueado
};

const SocketContext = createContext<Ctx | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const {
    user,
    room,
    setRoom,
    setItems,
    setVideos,
    setMessages,
    setUsersInRoom,
    setPlaying,
    addMessage,
  } = useRoomStore((s) => s);

  // cria uma única instância por montagem do provider
  const socketRef = useRef<Socket | null>(null);
  if (!socketRef.current) {
    socketRef.current = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3333',
      { withCredentials: false, autoConnect: false }
    );
  }
  const socket = socketRef.current;

  const [connected, setConnected] = useState(socket.connected);
  const joinedRef = useRef(false);
  const joinedRoomIdRef = useRef<number | null>(null);
  const joiningRef = useRef(false);

  // conexão base
  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => {
      setConnected(false);
      joinedRef.current = false;
      joinedRoomIdRef.current = null;
      joiningRef.current = false;
    };
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    if (!socket.connected) socket.connect();
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // aplica snapshot
  const applySnapshot = (snap: any) => {
    if (snap?.room) setRoom(snap.room);
    if (Array.isArray(snap?.playlist)) {
      setItems(snap.playlist);
      if (Array.isArray(snap?.videos)) setVideos(snap.videos);
    }
    if (Array.isArray(snap?.messages)) setMessages(snap.messages);
    if (Array.isArray(snap?.users)) setUsersInRoom(snap.users);
    if (snap?.nowPlaying) setPlaying(true);
  };

  // listeners da sala (1x)
  useEffect(() => {
    const onSnapshot = (snap: any) => applySnapshot(snap);
    const onChatNew = (msg: any) => addMessage(msg);

    socket.on('room:snapshot', onSnapshot);
    socket.on('chat:new', onChatNew);
    socket.on('error', (e) => console.warn('[socket:error]', e));

    return () => {
      socket.off('room:snapshot', onSnapshot);
      socket.off('chat:new', onChatNew);
      socket.off('error');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // join com ACK
  useEffect(() => {
    if (!connected) return;
    if (!room?.id || !user?.id) return;

    // já está na mesma sala
    if (joinedRef.current && joinedRoomIdRef.current === room.id) return;

    // estava em outra sala? leave primeiro
    if (
      joinedRef.current &&
      joinedRoomIdRef.current &&
      joinedRoomIdRef.current !== room.id
    ) {
      socket.emit('room:leave', {
        roomId: joinedRoomIdRef.current,
        userId: user.id,
      });
      joinedRef.current = false;
      joinedRoomIdRef.current = null;
    }

    // evita joins concorrentes
    if (joiningRef.current) return;
    joiningRef.current = true;

    socket.emit(
      'room:join',
      { roomId: room.id, userId: user.id },
      (snap?: any) => {
        joiningRef.current = false;
        if (snap && !snap.error) applySnapshot(snap);
        joinedRef.current = true;
        joinedRoomIdRef.current = room.id;
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, room?.id, user?.id]);

  // sair ao desmontar provider
  useEffect(() => {
    return () => {
      if (joinedRef.current && joinedRoomIdRef.current && user?.id) {
        socket.emit('room:leave', {
          roomId: joinedRoomIdRef.current,
          userId: user.id,
        });
      }
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // leave em refresh/fechar aba/bfcache
  useEffect(() => {
    const leave = () => {
      if (joinedRef.current && joinedRoomIdRef.current && user?.id) {
        socket.emit('room:leave', {
          roomId: joinedRoomIdRef.current,
          userId: user.id,
        });
      }
    };
    const onBeforeUnload = () => leave();
    const onPageHide = () => leave();

    window.addEventListener('beforeunload', onBeforeUnload);
    window.addEventListener('pagehide', onPageHide);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, [user?.id]);

  // 👉 função para enviar chat
  const sendChat = (content: string): boolean => {
    const text = (content ?? '').trim();
    if (!text) return false;
    if (!socket.connected) return false;
    if (!room?.id || !user?.id) return false;
    // limite de 2000 chars, igual ao server
    const body = text.slice(0, 2000);

    socket.emit('chat:send', {
      roomId: room.id,
      userId: user.id,
      content: body,
    });

    // UI otimista? Opcional.
    // Abaixo NÃO adiciono otimista porque o server já faz broadcast do chat:new
    return true;
  };

  const ctx = useMemo(() => ({ socket, sendChat }), [socket]);
  return (
    <SocketContext.Provider value={ctx}>{children}</SocketContext.Provider>
  );
}

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within SocketProvider');
  return ctx;
};
