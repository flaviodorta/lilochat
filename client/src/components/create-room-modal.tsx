'use client';

import { createRoom } from '@/actions/rooms/create-room';
import { getVideoData } from '@/actions/videos/get-video-data';
import { getVideoId } from '@/utils/get-video-id';
// import { useAuth } from '@/context/auth-context';
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Toast,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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

  const handleCreateRoom = async () => {
    if (!roomTitle || !videoUrl || !nickname) {
      return toast({
        title: 'Input a nickname. room title and youtube video url.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }

    const response = await getVideoData(videoUrl);
    const video_id = getVideoId(videoUrl);

    const response2 = await createRoom({
      nickname,
      description: response.description,
      tags: response.tags,
      room_title: roomTitle,
      thumbnail_url: response.thumbnail_url,
      video_title: response.title,
      video_url: videoUrl,
      video_id,
    });
    console.log(response2);

    setIsLoading(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className='min-w-[300px] pb-6'>
        <ModalHeader className='text-center'>Create Room</ModalHeader>
        <ModalBody className='pb-6'>
          <div className='flex flex-col gap-6'>
            <div className=''>
              <Text className='font-bold'>Your nickname</Text>
              <Input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              ></Input>
            </div>

            <div className=''>
              <Text className='font-bold'>Room title</Text>
              <Input
                value={roomTitle}
                onChange={(e) => setRoomTitle(e.target.value)}
              ></Input>
            </div>

            <div className=''>
              <Text className='font-bold'>Youtube video link</Text>
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              ></Input>
            </div>
            <button
              onClick={handleCreateRoom}
              disabled={false}
              className='button w-full'
            >
              {isLoading ? 'Creating a room...' : 'Create a room'}
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateRoomModal;
