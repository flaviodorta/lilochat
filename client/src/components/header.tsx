'use client';

import Image from 'next/image';
import SearchRoom from './search-room-input';
import CreateRoomButton from './create-room-button';
import { Luckiest_Guy } from 'next/font/google';
import { useDisclosure } from '@chakra-ui/react';
import CreateRoomModal from './create-room-modal';

const luckiestGuy = Luckiest_Guy({ subsets: ['latin'], weight: ['400'] });

const Header = () => {
  const {
    isOpen: isCreateRoomOpen,
    onClose: onCreateRoomClose,
    onOpen: onCreateRoomOpen,
  } = useDisclosure();

  return (
    <>
      <div className='fixed px-8 md:px-0 top-0 w-full container mx-auto bg-gray-50 z-10 left-1/2 -translate-x-1/2 flex gap-8 justify-between items-center h-24'>
        <div className=' '>
          <div
            className={`translate-y-2 text-4xl items-center flex gap-3 luckiest-guy-regular text-purple-600 ${luckiestGuy.className}`}
          >
            <Image
              src='/lilochat-logo.svg'
              width={60}
              height={30}
              className='fill-slate-500 text-purple-600 shrink-0'
              color='#A020F0'
              alt='Lilochat logo'
            />

            <span className='hidden lg:block -translate-y-[7px]'>lilochat</span>
          </div>
        </div>

        <SearchRoom />

        <CreateRoomButton onOpen={onCreateRoomOpen} />
      </div>

      <CreateRoomModal isOpen={isCreateRoomOpen} onClose={onCreateRoomClose} />
    </>
  );
};

export default Header;
