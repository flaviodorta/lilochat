import type { Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { createUserByNickname } from '../services/user';
import { HttpError } from '../http/error';
import sequelize from '../database';
import { VideoService } from '../services/video';
import { RoomService } from '../services/room';
import { RoomPlaylistService } from '../services/room-playlist';
import { TagService } from '../services/tag';

const bodySchema = z.object({
  nickname: z.string().min(1).max(40),
  room_title: z.string().min(1).max(120),
  description: z.string().default(''),
  thumbnail_url: z.string().url(),
  tags: z.array(z.string()).default([]),
  video_title: z.string().min(1).max(255),
  video_id: z.string().min(1).max(32),
  video_url: z.string().url(),
});

export class IngestController {
  static async createRoom(req: Request, res: Response) {
    try {
      const payload = bodySchema.parse(req.body);

      const result = await sequelize.transaction(async (t) => {
        const opt = { transaction: t };

        const user = await createUserByNickname(payload.nickname, opt);

        const video = await VideoService.create({
          description: payload.description,
          thumbnail_url: payload.thumbnail_url,
          title: payload.video_title,
          video_id: payload.video_id,
          video_url: payload.video_url,
        });

        const room = await RoomService.createFromTitle(
          {
            title: payload.room_title,
            king_user_id: user.id,
            current_playlist_item_id: null,
          },
          opt
        );

        if (payload.tags?.length) {
          await TagService.createTagsForVideo(
            { video_id: video.id, names: payload.tags },
            opt
          );
        }

        const item = await RoomPlaylistService.create(
          {
            room_id: room.id,
            video_id: video.id,
            status: 'playing',
            started_at: new Date(),
            base_time_seconds: 0,
          },
          opt
        );

        await RoomService.setCurrentItem(
          { roomId: room.id, itemId: item.id },
          opt
        );

        const roomUpdated = await RoomService.findById(room.id, opt);

        return { room: roomUpdated, items: [item], videos: [video], user };
      });

      return res.status(201).json(result);
    } catch (err) {
      if (err instanceof ZodError) {
        const msg = err.issues
          .map((i) => `${i.path.join('.')}: ${i.message}`)
          .join('; ');
        throw new HttpError(400, msg || 'Invalid input');
      }
      console.error(err);
      return res.status(500).json({ error: 'Internal error' });
    }
  }
}
