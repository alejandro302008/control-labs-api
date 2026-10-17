export const ENVIRONMENT_TYPES = ['laboratorio', 'sala'] as const;
export type EnvironmentType = (typeof ENVIRONMENT_TYPES)[number];

export const OPERATIONAL_STATUSES = ['operativo', 'mantenimiento', 'fuera_de_servicio'] as const;
export type OperationalStatus = (typeof OPERATIONAL_STATUSES)[number];

export interface Environment {
  id: string;
  nombre: string;
  tipo: EnvironmentType;
  capacidad: number;
  ubicacion: string;
  estado: OperationalStatus;
  createdAt: string;
  updatedAt: string;
}
