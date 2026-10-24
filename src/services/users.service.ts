import { randomBytes, randomUUID, scryptSync } from 'node:crypto';
import { AppError } from '../utils/app-error';
import { Body, pickAllowed, requireEnum, requireString } from '../utils/validators';
import { ACCOUNT_STATUSES, PublicUser, User, USER_ROLES } from '../types/user.types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

// Persistencia en memoria (el proyecto aún no tiene base de datos).
const users = new Map<string, User>();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}

function requirePassword(value: unknown): string {
  if (typeof value !== 'string' || value.length < MIN_PASSWORD_LENGTH) {
    throw AppError.badRequest(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
  }
  return value;
}

function toPublic({ passwordHash: _omit, ...rest }: User): PublicUser {
  return rest;
}

function findOrFail(id: string): User {
  const user = users.get(id);
  if (!user) throw AppError.notFound(`No existe un usuario con id ${id}.`);
  return user;
}

export class UsersService {
  static getAll(): PublicUser[] {
    return [...users.values()].map(toPublic);
  }

  static getById(id: string): PublicUser {
    return toPublic(findOrFail(id));
  }

  static create(body: Body): PublicUser {
    const nombre = requireString(body.nombre, 'nombre');
    const email = requireString(body.email, 'email').toLowerCase();
    if (!EMAIL_REGEX.test(email)) throw AppError.badRequest('El email no tiene un formato válido.');
    const rol = requireEnum(body.rol, 'rol', USER_ROLES);
    const password = requirePassword(body.password);

    if ([...users.values()].some((u) => u.email === email)) {
      throw AppError.conflict(`Ya existe un usuario con el email ${email}.`);
    }

    const now = new Date().toISOString();
    const user: User = {
      id: randomUUID(),
      nombre,
      email,
      passwordHash: hashPassword(password),
      rol,
      estado: 'activo',
      createdAt: now,
      updatedAt: now
    };
    users.set(user.id, user);
    return toPublic(user);
  }

  /** PATCH: solo rol, estado de cuenta o contraseña. */
  static update(id: string, body: Body): PublicUser {
    const user = findOrFail(id);
    pickAllowed(body, ['rol', 'estado', 'password']);

    if (body.rol !== undefined) user.rol = requireEnum(body.rol, 'rol', USER_ROLES);
    if (body.estado !== undefined) user.estado = requireEnum(body.estado, 'estado', ACCOUNT_STATUSES);
    if (body.password !== undefined) user.passwordHash = hashPassword(requirePassword(body.password));

    user.updatedAt = new Date().toISOString();
    return toPublic(user);
  }

  /** Eliminación lógica: el registro se conserva con estado "inactivo". */
  static softDelete(id: string): PublicUser {
    const user = findOrFail(id);
    user.estado = 'inactivo';
    user.updatedAt = new Date().toISOString();
    return toPublic(user);
  }
}
