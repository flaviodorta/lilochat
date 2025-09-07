import sequelize from '../database';
import { Tx } from '../types/tx';

type CreateTagForVideoData = {
  video_id: number;
  names: string[];
};

export class TagService {
  static async createTagsForVideo(
    { video_id, names }: CreateTagForVideoData,
    opt: Tx = {}
  ) {
    const clean = Array.from(
      new Set(names.map((s) => s.trim()).filter(Boolean))
    );

    for (const name of clean) {
      await sequelize.query(
        `INSERT INTO tags (video_id, name, created_at)
       VALUES (:video_id,:name,NOW())
       ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        { replacements: { video_id, name }, ...opt }
      );
    }

    const [rows] = await sequelize.query(
      `SELECT id, video_id, name, created_at FROM tags WHERE video_id = :video_id ORDER BY name`,
      { replacements: { video_id }, ...opt }
    );

    return rows as any[];
  }
}
