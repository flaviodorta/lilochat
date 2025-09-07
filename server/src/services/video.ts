import sequelize from '../database';
import { HttpError } from '../http/error';
import { Tx } from '../types/tx';

export type CreateVideoData = {
  video_id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
};

export class VideoService {
  static async create(data: CreateVideoData, opt: Tx = {}) {
    let video_id = null;

    const [exists] = await sequelize.query(
      `SELECT * FROM videos WHERE video_id = :video_id LIMIT 1`,
      { replacements: { video_id: data.video_id }, ...opt }
    );

    if ((exists as any[])[0]) return (exists as any[])[0];

    try {
      const [id] = await sequelize.query(
        `INSERT INTO videos (video_id, title, description, thumbnail_url, video_url, created_at)
       VALUES (:video_id, :title, :description, :thumbnail_url, :video_url, NOW())
      `,
        { replacements: { ...data }, ...opt }
      );

      video_id = id;
    } catch (error) {
      if (error) throw new HttpError(400, 'Error at create video.');
    }

    const [rows] = await sequelize.query(
      `SELECT * FROM videos WHERE id = :id`,
      { replacements: { id: video_id }, ...opt }
    );

    return (rows as any[])[0];
  }
}
