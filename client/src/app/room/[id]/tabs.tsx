'use client';

import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getVideoData } from '@/actions/videos/get-video-data';
import Image from 'next/image';
import { useRoomStore } from '@/providers/room-provider';
import { cn } from '@/utils/cn';
import { RxVideo } from 'react-icons/rx';
import { FaUser } from 'react-icons/fa6';
import { RiVipCrown2Fill } from 'react-icons/ri';
import UserAvatar from '@/components/user-avatar';

const RoomTabs = () => {
  // const [videos, setVideos] = useState<Video[]>([]);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { user, room, usersInRoom, videos } = useRoomStore((s) => s);

  const {
    isOpen: isVideosOpen,
    onOpen: onVideosOpen,
    onClose: onVideosClose,
  } = useDisclosure();

  const {
    isOpen: isStrangersOpen,
    onOpen: onStrangersOpen,
    onClose: onStrangersClose,
  } = useDisclosure();

  const videoList = (
    <ul className='w-full max-h-full flex-grow flex-col overflow-y-auto items-start flex gap-2'>
      {videos.map((video) => (
        <div
          key={video.id}
          className={cn([
            'flex gap-4 items-center w-full py-2',
            // isKingRoom && 'cursor-pointer',
            // videoUrl === video.video_url && 'bg-gray-200',
          ])}
          onDoubleClick={() => {}}
        >
          <Image
            width={40}
            height={26}
            alt='video'
            src={video.thumbnail_url}
          ></Image>
          <p className='leading-5'>{video.title}</p>
        </div>
      ))}
      <button onClick={onOpen} className='hover:text-purple-600 font-bold'>
        + Add more videos
      </button>
    </ul>
  );

  const strangersList = (
    <ul className='w-full h-[330px] flex-col overflow-y-auto scrollbar-thin flex gap-4'>
      {usersInRoom.map((user, idx) => (
        <div key={idx} className='flex gap-4 items-center'>
          <UserAvatar nickname={user.nickname} width={24} height={24} />
          <div className='flex gap-2 items-center'>
            {user.nickname}

            {/* {user.user_id === kingRoomId && (
              <span className='text-yellow-500 mr-auto'>
                <RiVipCrown2Fill />
              </span>
            )} */}
          </div>
        </div>
      ))}
    </ul>
  );

  return (
    <>
      <div className='pl-4 bg-white h-10 flex gap-4 lg:hidden'>
        <button
          onClick={onVideosOpen}
          className={cn([
            'flex gap-2 items-center hover:text-purple-600',
            isVideosOpen && 'text-purple-600',
          ])}
        >
          <RxVideo />
          <span>Videos</span>
        </button>
        <button
          onClick={onStrangersOpen}
          className={cn([
            'flex gap-2 items-center hover:text-purple-600',
            isStrangersOpen && 'text-purple-600',
          ])}
        >
          <FaUser />
          <span>Strangers</span>
        </button>

        <Modal isOpen={isVideosOpen} onClose={onVideosClose}>
          <ModalOverlay />
          <ModalContent className='min-w-[300px] overflow-hidden max-h-[600px] pb-6'>
            <ModalHeader className='text-center sticky top-0 bg-white'>
              <div className='flex justify-center gap-2 items-center'>
                <RxVideo />
                <span>Videos</span>
              </div>
            </ModalHeader>
            <ModalBody className='pb-6 overflow-y-auto scrollbar-thin'>
              {videoList}
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal isOpen={isStrangersOpen} onClose={onStrangersClose}>
          <ModalOverlay />
          <ModalContent className='min-w-[300px] overflow-hidden max-h-[600px] pb-6'>
            <ModalHeader className='text-center sticky top-0 bg-white'>
              <div className='flex justify-center gap-2 items-center'>
                <FaUser />
                <span>Strangers</span>
              </div>
            </ModalHeader>
            <ModalBody className='pb-6 overflow-y-auto scrollbar-thin'>
              {strangersList}
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>

      <div className='hidden lg:flex h-fit w-full lg:h-full flex-col pt-4 pb-4 bg-gray-100'>
        <Tabs
          colorScheme='purple'
          className='h-full overflow-y-auto scrollbar-thin w-full rounded-lg bg-neutral-50 flex flex-col'
          variant='enclosed'
        >
          <TabList className='sticky top-0 bg-white z-10'>
            <Tab>
              <div className='flex gap-2 items-center'>
                <RxVideo />
                <span>Videos</span>
              </div>
            </Tab>
            <Tab>
              <div className='flex gap-2 items-center'>
                <FaUser />
                <span>Strangers</span>
              </div>
            </Tab>
          </TabList>
          <TabPanels className='w-full flex-grow h-0'>
            <TabPanel className='flex-grow w-full'>{videoList}</TabPanel>

            <TabPanel className='h-full w-full'>{strangersList}</TabPanel>
          </TabPanels>
        </Tabs>

        {/* <AddVideoModal
          isOpen={isOpen}
          onClose={onClose}
          user={user}
          room={room}
        /> */}
      </div>
    </>
  );
};

export default RoomTabs;
