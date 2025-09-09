'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { socket } from '@/lib/socket';
import { useRoomStore } from '@/providers/room-provider';
import Player from './player';
import RoomTabs from './tabs';
import Messages from './messages';
import { SocketProvider } from '@/providers/socket-provider';

export default function RoomPage() {
  const router = useRouter();
  const {
    user,
    room,
    setMessages,
    setRoom,
    setItems,
    setVideos,
    setUsersInRoom,
    setPlaying,
    addMessage,
  } = useRoomStore((s) => s);

  // Redireciona se não houver sala
  useEffect(() => {
    if (!room?.id) router.replace('/');
  }, [room?.id, router]);

  return (
    <SocketProvider>
      <div className='flex flex-col w-full h-screen bg-gray-100'>
        <div className='h-full flex flex-col'>
          <h1 className='w-full text-lg font-bold h-6 bg-gray-100 p-4 flex items-center'>
            Room {room.order_index} - {room.name}
          </h1>
          <div className='h-[calc(100vh-40px)] flex flex-col lg:flex-row'>
            <div className='w-full h-full lg:w-1/2'>
              <div className='h-[calc(100%-40px)] lg:h-1/2'>
                <Player />
              </div>
              <div className='h-10 lg:h-1/2'>
                <RoomTabs />
              </div>
            </div>
            <div className='h-1/2 lg:w-1/2 lg:h-full'>
              <Messages />
            </div>
          </div>
        </div>
      </div>
    </SocketProvider>
  );
}
