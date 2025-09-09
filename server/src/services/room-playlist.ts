import sequelize from '../database';
import { Tx } from '../types/tx';

type CreateRoomPlaylistItemData = {
  room_id: number;
  video_id: number;
  status?: 'queued' | 'playing' | 'paused';
  started_at?: Date;
  base_time_seconds?: number;
};

export class RoomPlaylistService {
  static async create(data: CreateRoomPlaylistItemData, opt: Tx = {}) {
    let room_playlist_id = null;

    const [id] = await sequelize.query(
      `INSERT INTO room_playlist (room_id, video_id, status, started_at, base_time_seconds, created_at)
     VALUES (:room_id,:video_id,:status,:started_at,:base_time_seconds,NOW())`,
      {
        replacements: {
          room_id: data.room_id,
          video_id: data.video_id,
          status: data.status ?? 'queued',
          started_at: data.started_at ?? new Date(),
          base_time_seconds: data.base_time_seconds ?? 0,
        },
        ...opt,
      }
    );

    // console.log('id', id);

    room_playlist_id = id;

    const [rows] = await sequelize.query(
      `SELECT * FROM room_playlist WHERE id = :id`,
      { replacements: { id: room_playlist_id }, ...opt }
    );

    // console.log('rows', rows);

    // @ts-ignore
    return (rows as any[])[0];
  }
}
