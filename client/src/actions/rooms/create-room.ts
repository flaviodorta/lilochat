import { api } from '@/services/api';

type CreateRoomData = {
  nickname: string;
  room_title: string;
  description: string;
  thumbnail_url: string;
  tags: string[];
  video_title: string;
  video_id: string;
  video_url: string;
};

export const createRoom = async (data: CreateRoomData) => {
  const response = await api.post('/ingest', data);
  return response.data;
};
