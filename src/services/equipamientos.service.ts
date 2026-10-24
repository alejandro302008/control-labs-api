import { randomUUID } from 'node:crypto';
import { AppError } from '../utils/app-error';
import { Body, pickAllowed, requireEnum, requireString } from '../utils/validators';
import { EQUIPMENT_STATUSES, Equipment } from '../types/equipment.types';
import { EnvironmentsService } from './ambientes.service';

const equipment = new Map<string, Equipment>();

function assertEnvironmentExists(ambienteId: string): void {
  if (!EnvironmentsService.exists(ambienteId)) {
    throw AppError.notFound(`No existe un ambiente con id ${ambienteId}.`);
  }
}

export class EquipmentService {
  /** Lista todos los equipos o, si se indica ambienteId, solo los de ese ambiente. */
  static getAll(ambienteId?: string): Equipment[] {
    if (ambienteId !== undefined) assertEnvironmentExists(ambienteId);
    const all = [...equipment.values()];
    return ambienteId === undefined ? all : all.filter((e) => e.ambienteId === ambienteId);
  }

  static getById(id: string): Equipment {
    const item = equipment.get(id);
    if (!item) throw AppError.notFound(`No existe un equipo con id ${id}.`);
    return item;
  }

  static create(body: Body): Equipment {
    const nombre = requireString(body.nombre, 'nombre');
    const codigo = requireString(body.codigo, 'codigo');
    const tipo = requireString(body.tipo, 'tipo');
    const ambienteId = requireString(body.ambienteId, 'ambienteId');
    assertEnvironmentExists(ambienteId);

    if ([...equipment.values()].some((e) => e.codigo.toLowerCase() === codigo.toLowerCase())) {
      throw AppError.conflict(`Ya existe un equipo con el código ${codigo}.`);
    }

    const now = new Date().toISOString();
    const item: Equipment = {
      id: randomUUID(),
      nombre,
      codigo,
      tipo,
      ambienteId,
      estado: 'disponible',
      createdAt: now,
      updatedAt: now
    };
    equipment.set(item.id, item);
    return item;
  }

  /** PATCH: estado técnico y/o ubicación (ambienteId). */
  static update(id: string, body: Body): Equipment {
    const item = EquipmentService.getById(id);
    pickAllowed(body, ['estado', 'ambienteId']);

    if (body.estado !== undefined) item.estado = requireEnum(body.estado, 'estado', EQUIPMENT_STATUSES);
    if (body.ambienteId !== undefined) {
      const ambienteId = requireString(body.ambienteId, 'ambienteId');
      assertEnvironmentExists(ambienteId);
      item.ambienteId = ambienteId;
    }

    item.updatedAt = new Date().toISOString();
    return item;
  }
}
