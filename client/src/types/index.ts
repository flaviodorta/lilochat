export type Room = {
  id: number;
  king_user_id: number;
  name: string;
  order_index: number;
  current_playlist_item: number;
};

export type RoomPlaylist = {
  base_time_seconds: number;
  id: number;
  started_at: Date;
  status: string;
  video_id: number;
  room_id: number;
};

export type User = {
  id: number;
  nickname: string;
};

export type Video = {
  id: number;
  description: string;
  thumbnail_url: string;
  title: string;
  video_id: string;
  video_url: string;
};
