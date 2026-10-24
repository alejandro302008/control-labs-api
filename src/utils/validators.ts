import { AppError } from './app-error';

export type Body = Record<string, unknown>;

/** Garantiza que el body sea un objeto JSON. */
export function asBody(body: unknown): Body {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw AppError.badRequest('El cuerpo de la petición debe ser un objeto JSON.');
  }
  return body as Body;
}

/** Garantiza que un PATCH traiga al menos un campo permitido y ninguno desconocido. */
export function pickAllowed(body: Body, allowed: readonly string[]): Body {
  const keys = Object.keys(body);
  const unknown = keys.filter((k) => !allowed.includes(k));
  if (unknown.length > 0) {
    throw AppError.badRequest(`Campos no permitidos: ${unknown.join(', ')}. Permitidos: ${allowed.join(', ')}.`);
  }
  if (keys.length === 0) {
    throw AppError.badRequest(`Debe enviar al menos un campo a modificar: ${allowed.join(', ')}.`);
  }
  return body;
}

export function requireString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw AppError.badRequest(`El campo "${field}" es obligatorio y debe ser texto.`);
  }
  return value.trim();
}

export function requirePositiveInt(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    throw AppError.badRequest(`El campo "${field}" debe ser un entero positivo.`);
  }
  return value;
}

export function requireEnum<T extends string>(value: unknown, field: string, options: readonly T[]): T {
  if (typeof value !== 'string' || !(options as readonly string[]).includes(value)) {
    throw AppError.badRequest(`El campo "${field}" debe ser uno de: ${options.join(', ')}.`);
  }
  return value as T;
}
