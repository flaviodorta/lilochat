import { Router } from 'express';
import { asyncHandler } from '../http/async-handler';
import { IngestController } from '../controllers/ingest';

const ingestRouter = Router();

ingestRouter.post('/', asyncHandler(IngestController.createRoom));

export default ingestRouter;
