// src/app/room/[id]/messages.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { FaUser } from 'react-icons/fa6';
import Spinner from '@/components/spinner';
import { cn } from '@/utils/cn';
import { RiVipCrown2Fill } from 'react-icons/ri';
import { useRoomStore } from '@/providers/room-provider';
import { getColorFromString } from '@/utils/get-color-from-string';
import { formatTime } from '@/utils/format-time';
import UserAvatar from '@/components/user-avatar';
import { useSocket } from '@/providers/socket-provider';

const Messages = () => {
  const { messages, room } = useRoomStore((state) => state);
  const { sendChat } = useSocket();

  const [newMessage, setNewMessage] = useState<string>('');
  const [isFirstRender, setIsFirstRender] = useState(true);

  const textareaRef = useRef<HTMLTextAreaElement>(null!);
  const messagesEndRefs = useRef<HTMLDivElement>(null!);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRefs.current)
      messagesEndRefs.current.scrollIntoView({ behavior });
  };

  // scroll inicial e ao chegar novas mensagens
  useEffect(() => {
    if (isFirstRender) {
      setTimeout(() => {
        scrollToBottom('auto');
      }, 100);
      setIsFirstRender(false);
    } else {
      scrollToBottom('smooth');
    }
  }, [messages, isFirstRender]);

  // Enter envia, Shift+Enter quebra linha
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleSend = async () => {
    const ok = sendChat(newMessage);
    if (ok) {
      setNewMessage('');
      // opcional: foco de volta
      textareaRef.current?.focus();
    }
  };

  // Se quiser buscar histórico extra via REST, faça aqui (não necessário pois já vem no snapshot)
  useEffect(() => {
    scrollToBottom('auto');
  }, []);

  if (isFirstRender) return null;

  return (
    <div className='w-full p-4 h-full flex flex-col bg-gray-100'>
      <div className='pb-4 bg-gray-100 flex justify-between items-center'>
        <h1 className='text-xl font-bold'>Chat with strangers</h1>
      </div>

      <ul className='flex-1 w-full h-full justify-center rounded-lg overflow-y-scroll scrollbar-thin p-4 bg-white'>
        {!Array.isArray(messages) ? (
          <div className='w-full h-full flex items-center justify-center'>
            <Spinner />
          </div>
        ) : (
          messages
            .slice(Math.max(messages.length - 200, 0)) // últimos 200
            .map((msg, index) => (
              <li
                key={index}
                className='pb-4 overflow-hidden w-full flex items-start justify-between bg-white'
              >
                <div className='flex w-full flex-col'>
                  <div className='pb-1 flex items-center w-full overflow-hidden gap-2'>
                    <div className='font-bold'>
                      {msg.user_nickname ? (
                        <UserAvatar
                          width={24}
                          height={24}
                          nickname={msg.user_nickname}
                        />
                      ) : (
                        <FaUser />
                      )}
                    </div>
                    <span
                      className={cn([
                        'text-sm font-bold break-words',
                        getColorFromString(msg.user_nickname),
                      ])}
                    >
                      {msg.user_nickname}
                    </span>
                    {msg.user_id === room.king_user_id && (
                      <span className='text-yellow-500 mr-auto -translate-y-[1px]'>
                        <RiVipCrown2Fill />
                      </span>
                    )}

                    <span className='text-xs ml-auto'>
                      {formatTime(msg.created_at)}
                    </span>
                  </div>

                  <div className='w-full break-words'>{msg.content}</div>
                </div>
              </li>
            ))
        )}
        <div ref={messagesEndRefs} />
      </ul>

      <div className='pt-2 bg-gray-100 border-gray-300'>
        <textarea
          ref={textareaRef}
          value={newMessage}
          placeholder='Digite sua mensagem'
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={onKeyDown}
          rows={3}
          className='w-full p-2 border rounded-md mb-2 outline-none resize-none'
          maxLength={2000}
        />
        <button
          onClick={handleSend}
          className='w-full bg-purple-600 text-white p-2 rounded-md disabled:opacity-60'
          disabled={!newMessage.trim()}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Messages;
