import sequelize from '../database';
import type { Transaction } from 'sequelize';
import { HttpError } from '../http/error';
import { Tx } from '../types/tx';

type User = {
  id: number;
  nickname: string;
};

export async function createUserByNickname(
  nickname: string,
  opt: Tx = {}
): Promise<User> {
  let userId = null;

  try {
    const [id] = await sequelize.query(
      `
      INSERT INTO users (nickname, created_at) VALUES (:nickname, NOW())  
    `,
      {
        replacements: { nickname },
        ...opt,
      }
    );
    userId = id;
  } catch (err) {
    if (err) throw new HttpError(400, 'Error at create user');
  }

  const [rows] = await sequelize.query(
    `SELECT id, nickname FROM users WHERE nickname = :nickname AND id = :id LIMIT 1`,
    { replacements: { nickname, id: userId }, ...opt }
  );

  return rows[0] as User;
}
