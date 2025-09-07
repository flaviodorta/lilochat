'use client';

const CreateRoomButton = ({ onOpen }: { onOpen: () => void }) => {
  return (
    <button onClick={onOpen} className='button'>
      <span className='hidden lg:block'>Create a room</span>
      <span className='block lg:hidden font-black'>+</span>
    </button>
  );
};

export default CreateRoomButton;
