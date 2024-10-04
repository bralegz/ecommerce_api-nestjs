import { NextFunction, Request, Response } from 'express';

export function loggerGlobal(req: Request, res: Response, next: NextFunction) {
  const newDate = new Date();
  const date = newDate.toLocaleDateString();
  const time = newDate.toLocaleTimeString();

  console.log(
    `You executed a ${req.method} method on the route ${req.url} on ${date} at ${time}`,
  );
  next();
}
