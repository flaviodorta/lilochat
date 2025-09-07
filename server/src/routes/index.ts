import ingestRouter from './ingest';
import usersRouter from './user';
import { Router } from 'express';

const apiRouter = Router();

apiRouter.use('/users', usersRouter);
apiRouter.use('/ingest', ingestRouter);

export default apiRouter;
