import { randomUUID } from 'node:crypto';
import { AppError } from '../utils/app-error';
import { Body, pickAllowed, requireEnum, requirePositiveInt, requireString } from '../utils/validators';
import { ENVIRONMENT_TYPES, Environment, OPERATIONAL_STATUSES } from '../types/environment.types';

const environments = new Map<string, Environment>();

export class EnvironmentsService {
  static getAll(): Environment[] {
    return [...environments.values()];
  }

  static getById(id: string): Environment {
    const env = environments.get(id);
    if (!env) throw AppError.notFound(`No existe un ambiente con id ${id}.`);
    return env;
  }

  static exists(id: string): boolean {
    return environments.has(id);
  }

  static create(body: Body): Environment {
    const nombre = requireString(body.nombre, 'nombre');
    const ubicacion = requireString(body.ubicacion, 'ubicacion');
    const capacidad = requirePositiveInt(body.capacidad, 'capacidad');
    const tipo = body.tipo === undefined ? 'laboratorio' : requireEnum(body.tipo, 'tipo', ENVIRONMENT_TYPES);

    const now = new Date().toISOString();
    const env: Environment = {
      id: randomUUID(),
      nombre,
      tipo,
      capacidad,
      ubicacion,
      estado: 'operativo',
      createdAt: now,
      updatedAt: now
    };
    environments.set(env.id, env);
    return env;
  }

  /** PATCH: capacidad, estado operativo, ubicación o nombre. */
  static update(id: string, body: Body): Environment {
    const env = EnvironmentsService.getById(id);
    pickAllowed(body, ['nombre', 'capacidad', 'ubicacion', 'estado']);

    if (body.nombre !== undefined) env.nombre = requireString(body.nombre, 'nombre');
    if (body.capacidad !== undefined) env.capacidad = requirePositiveInt(body.capacidad, 'capacidad');
    if (body.ubicacion !== undefined) env.ubicacion = requireString(body.ubicacion, 'ubicacion');
    if (body.estado !== undefined) env.estado = requireEnum(body.estado, 'estado', OPERATIONAL_STATUSES);

    env.updatedAt = new Date().toISOString();
    return env;
  }
}
