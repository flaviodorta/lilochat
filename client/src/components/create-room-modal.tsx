'use client';

import { createRoom } from '@/actions/rooms/create-room';
import { getVideoData } from '@/actions/videos/get-video-data';
import { getVideoId } from '@/utils/get-video-id';
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// 👇 importe a store
import { useRoomStore } from '@/providers/room-provider';
import type { Room, Video, RoomPlaylist } from '@/types';

type CreateRoomResponse = {
  room: Room;
  user: { id: number; nickname: string };
  items: RoomPlaylist[];
  videos: Video[];
};

const CreateRoomModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [roomTitle, setRoomTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nickname, setNickname] = useState('');
  const router = useRouter();
  const toast = useToast();

  // 👇 pegue as actions da store que vamos atualizar
  const { setUser, setRoom, setItems, setVideos, setPlaying, user, room } =
    useRoomStore((s) => s);

  const handleCreateRoom = async () => {
    try {
      setIsLoading(true);

      if (!roomTitle || !videoUrl || !nickname) {
        toast({
          title: 'Input a nickname, room title and youtube video url.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const responseVideoData = await getVideoData(videoUrl);
      const video_id = getVideoId(videoUrl);

      const responseRoom = (await createRoom({
        nickname,
        description: responseVideoData.description,
        tags: responseVideoData.tags,
        room_title: roomTitle,
        thumbnail_url: responseVideoData.thumbnail_url,
        video_title: responseVideoData.title,
        video_url: videoUrl,
        video_id,
      })) as CreateRoomResponse;

      // ---- Atualiza a store com a resposta ----
      // user (adapter: id -> user_id, add online_at)
      setUser({
        id: responseRoom.user.id,
        nickname: responseRoom.user.nickname,
      });

      // room, items, videos
      setRoom(responseRoom.room);
      setItems(Array.isArray(responseRoom.items) ? responseRoom.items : []);
      setVideos(Array.isArray(responseRoom.videos) ? responseRoom.videos : []);

      // playing = true se algum item está "playing"
      const isPlaying =
        Array.isArray(responseRoom.items) &&
        responseRoom.items.some((i) => i.status === 'playing');
      setPlaying(!!isPlaying);

      toast({ title: 'Room created!', status: 'success' });
      // (opcional) vá para a página da sala
      // router.push(`/rooms/${responseRoom.room.id}`);
      onClose();
      router.push('/room/' + responseRoom.room.id);
    } catch (e: any) {
      console.error(e);
      toast({
        title: e?.response?.data?.error || 'Failed to create room',
        status: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // console.log(user, room);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className='min-w-[300px] pb-6'>
        <ModalHeader className='text-center'>Create Room</ModalHeader>
        <ModalBody className='pb-6'>
          <div className='flex flex-col gap-6'>
            <div>
              <Text className='font-bold'>Your nickname</Text>
              <Input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>

            <div>
              <Text className='font-bold'>Room title</Text>
              <Input
                value={roomTitle}
                onChange={(e) => setRoomTitle(e.target.value)}
              />
            </div>

            <div>
              <Text className='font-bold'>Youtube video link</Text>
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </div>

            <button onClick={handleCreateRoom} className='button w-full'>
              {isLoading ? 'Creating a room...' : 'Create a room'}
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateRoomModal;
