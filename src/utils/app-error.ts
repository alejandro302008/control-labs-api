/** Error controlado de la API: lleva el código HTTP que debe devolverse. */
export class AppError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message);
    this.name = 'AppError';
  }

  static badRequest(message: string): AppError { return new AppError(400, message); }
  static notFound(message: string): AppError { return new AppError(404, message); }
  static conflict(message: string): AppError { return new AppError(409, message); }
}
