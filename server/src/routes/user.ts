import { Router } from 'express';
import { asyncHandler } from '../http/async-handler';
import { UserController } from '../controllers/user';

const usersRouter = Router();

usersRouter.post('/', asyncHandler(UserController.createUserByNickname));

export default usersRouter;
