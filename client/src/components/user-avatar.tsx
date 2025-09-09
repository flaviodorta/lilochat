'use client';

import { Image } from '@chakra-ui/react';
import { useMemo } from 'react';
import multiavatar from '@multiavatar/multiavatar/esm';

type Props = {
  nickname: string;
  width?: number;
  height?: number;
};

export default function UserAvatar({
  nickname,
  width = 24,
  height = 24,
}: Props) {
  // 1) gera o SVG uma vez por nickname
  const svg = useMemo(() => multiavatar(nickname || 'Guest'), [nickname]);

  // 2) transforma em data URL
  const dataUrl = useMemo(
    () => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
    [svg]
  );

  return (
    <Image
      src={dataUrl}
      alt={`Avatar de ${nickname}`}
      width={`${width}px`}
      height={`${height}px`}
      borderRadius='full' // deixa redondo
      objectFit='cover'
      // fallbackSrc="/fallback-avatar.png" // opcional
    />
  );
}
