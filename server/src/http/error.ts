import { NextFunction, Request, Response } from 'express';

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err?.status ?? 500;
  const payload = {
    error: true,
    status,
    message: err?.message ?? 'Internal Server Error',
  };
  res.status(status).json(payload);
}
