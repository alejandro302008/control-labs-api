export const USER_ROLES = ['estudiante', 'docente', 'administrador'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const ACCOUNT_STATUSES = ['activo', 'inactivo', 'suspendido'] as const;
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

export interface User {
  id: string;
  nombre: string;
  email: string;
  passwordHash: string;
  rol: UserRole;
  estado: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

/** Usuario sin datos sensibles: es lo único que sale por la API. */
export type PublicUser = Omit<User, 'passwordHash'>;
