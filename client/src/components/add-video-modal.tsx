'use client';

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
import { useEffect, useState } from 'react';
import { getVideoData } from '@/actions/videos/get-video-data';
import { createRoom } from '@/actions/rooms/create-room';
import axios from 'axios';

const AddVideoModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleAddVideo = async () => {};

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className='min-w-[300px] pb-6'>
        <ModalHeader className='text-center'>Add more videos</ModalHeader>
        <ModalBody className='pb-6'>
          <div className='flex flex-col gap-6'>
            <div className=''>
              <Text className='font-bold'>Youtube video link</Text>
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              ></Input>
            </div>
            <button
              onClick={handleAddVideo}
              disabled={isLoading}
              className='button text-white w-full'
            >
              {isLoading ? 'Adding a video...' : 'Add a video'}
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddVideoModal;
