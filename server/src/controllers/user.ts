import type { Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { createUserByNickname } from '../services/user';
import { HttpError } from '../http/error';

const bodySchema = z.object({ nickname: z.string().min(1).max(40) });

export class UserController {
  static async createUserByNickname(req: Request, res: Response) {
    try {
      const { nickname } = bodySchema.parse(req.body);
      const user = await createUserByNickname(nickname);
      res.status(201).json(user);
    } catch (err) {
      if (err instanceof ZodError) {
        const msg = err.issues
          .map((i) => `${i.path.join('.')}: ${i.message}`)
          .join('; ');
        throw new HttpError(400, msg || 'Invalid input');
      }
      throw err;
    }
  }
}
