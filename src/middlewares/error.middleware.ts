import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/app-error';

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({ success: false, message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};

// Express exige 4 parámetros para reconocer un manejador de errores.
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }
  // JSON mal formado enviado por el cliente (error de body-parser).
  if (typeof err === 'object' && err !== null && (err as { type?: string }).type === 'entity.parse.failed') {
    res.status(400).json({ success: false, message: 'JSON inválido en el cuerpo de la petición.' });
    return;
  }
  console.error(err);
  res.status(500).json({ success: false, message: 'Error interno del servidor.' });
};
