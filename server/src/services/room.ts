import { QueryTypes } from 'sequelize';
import sequelize from '../database';
import { Tx } from '../types/tx';

type CreateRoomFromTitleData = {
  title: string;
  king_user_id: number;
  current_playlist_item_id: number | null;
};

type Room = {
  id: number;
  name: string;
  king_user_id: number;
  current_playlist_item_id: number | null;
  order_index: number;
  created_at: Date;
};

type SetCurrentItemData = {
  roomId: number;
  itemId: number;
};

export class RoomService {
  static async allocateFirstFreeIndex(opt: Tx = {}): Promise<number> {
    const gotRow = await sequelize.query<{ got: number }>(
      `SELECT GET_LOCK('rooms_order_index', 5) AS got`,
      { type: QueryTypes.SELECT, plain: true, ...opt }
    );
    if (!gotRow?.got) throw new Error('could_not_acquire_order_index_lock');

    try {
      const freeRow = await sequelize.query<{ free_n: number | null }>(
        `
        SELECT
          CASE
            WHEN NOT EXISTS (SELECT 1 FROM rooms WHERE order_index = 1) THEN 1
            ELSE (
              SELECT MIN(r.order_index) + 1
              FROM rooms r
              LEFT JOIN rooms r2
                ON r2.order_index = r.order_index + 1
              WHERE r2.order_index IS NULL
            )
          END AS free_n
        `,
        { type: QueryTypes.SELECT, plain: true, ...opt }
      );

      const free = Number(freeRow?.free_n ?? 1);
      return free;
    } finally {
      await sequelize.query(`SELECT RELEASE_LOCK('rooms_order_index')`, {
        type: QueryTypes.SELECT,
        ...opt,
      });
    }
  }

  static async createFromTitle(
    { title, king_user_id }: CreateRoomFromTitleData,
    opt: Tx = {}
  ): Promise<Room> {
    let attempts = 0;
    while (attempts++ < 5) {
      const order_index = await RoomService.allocateFirstFreeIndex(opt);
      try {
        const [insertId] = await sequelize.query(
          `
          INSERT INTO rooms (name, king_user_id, order_index, created_at)
          VALUES (:name, :king_user_id, :order_index, NOW())
          `,
          {
            replacements: {
              name: title.slice(0, 120),
              king_user_id,
              order_index,
            },
            ...opt,
          }
        );

        const [[room]] = await sequelize.query(
          `SELECT id FROM rooms WHERE id = :id`,
          { replacements: { id: insertId }, ...opt }
        );

        return room as Room;
      } catch (e: any) {
        const code = e?.parent?.code || e?.original?.code;
        const msg = e?.parent?.sqlMessage || e?.original?.sqlMessage || '';
        if (
          code === 'ER_DUP_ENTRY' ||
          /order_index|uq_rooms_order_index/i.test(msg)
        ) {
          continue;
        }
        throw e;
      }
    }
    throw new Error('Could not allocate order_index after several attempts');
  }

  static async setCurrentItem(data: SetCurrentItemData, opt: Tx = {}) {
    await sequelize.query(
      `UPDATE rooms SET current_playlist_item_id = :itemId WHERE id = :roomId`,
      { replacements: { itemId: data.itemId, roomId: data.roomId }, ...opt }
    );
  }

  static async findById(roomId: number, opt: Tx = {}) {
    const [rows] = await sequelize.query(
      `SELECT id, name, king_user_id, current_playlist_item_id, order_index, created_at
         FROM rooms WHERE id = :roomId`,
      { replacements: { roomId }, ...opt }
    );

    return rows[0] as Room;
  }
}
