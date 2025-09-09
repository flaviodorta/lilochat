import { io } from 'socket.io-client';

export const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3333',
  {
    // deixe o socket escolher o transporte (polling -> upgrade p/ ws)
    withCredentials: false,
    autoConnect: true,
  }
);
