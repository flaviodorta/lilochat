'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { useRoomStore } from '@/providers/room-provider';

export default function Player() {
  const { playing, videos, setPlaying } = useRoomStore((s) => s);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const localPlayerRef = useRef<ReactPlayer>(null);

  const url = useMemo(() => {
    const v = videos?.[0];
    if (!v) return '';
    if (v.video_url && /^https?:\/\//i.test(v.video_url)) return v.video_url;
    if (v.video_id) return `https://www.youtube.com/watch?v=${v.video_id}`;
    return '';
  }, [videos]);

  if (!mounted) return null;
  if (!url) {
    return (
      <div className='w-full h-full flex items-center justify-center bg-neutral-50'>
        <span className='text-sm text-neutral-500'>
          Nenhum vídeo carregado…
        </span>
      </div>
    );
  }

  console.log(localPlayerRef.current?.seekTo);

  return (
    <div
      className='group w-full h-full flex items-center justify-center relative bg-neutral-50'
      style={{
        // garanta uma altura! você pode trocar por h-[400px], etc.
        aspectRatio: '16 / 9',
      }}
    >
      <ReactPlayer
        ref={localPlayerRef}
        url={url}
        playing={true}
        width='100%'
        height='100%'
        controls={false}
        onError={(e) => console.error('ReactPlayer error:', e, 'url:', url)}
        onProgress={(e) => console.log(e)}
        onDurationChange={(v) => console.log(v)}
      />

      <button
        type='button'
        onClick={() => localPlayerRef.current?.seekTo(0.9999999)}
        className='absolute cursor-default inset-0 flex items-center justify-center'
      ></button>
    </div>
  );
}
