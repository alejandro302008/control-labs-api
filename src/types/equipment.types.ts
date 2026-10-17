export const EQUIPMENT_STATUSES = ['disponible', 'en_uso', 'en_mantenimiento', 'dado_de_baja'] as const;
export type EquipmentStatus = (typeof EQUIPMENT_STATUSES)[number];

export interface Equipment {
  id: string;
  nombre: string;
  codigo: string;
  tipo: string;
  ambienteId: string;
  estado: EquipmentStatus;
  createdAt: string;
  updatedAt: string;
}
