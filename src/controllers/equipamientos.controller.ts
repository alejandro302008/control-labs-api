import { Request, Response } from 'express';
import { EquipmentService } from '../services/equipamientos.service';
import { AppError } from '../utils/app-error';
import { asBody } from '../utils/validators';

export class EquipmentController {
  public static createEquipment = (req: Request, res: Response): void => {
    const item = EquipmentService.create(asBody(req.body));
    res.status(201).json({ success: true, data: item });
  };

  /** GET /equipos o GET /equipos?ambienteId=<id> */
  public static getEquipment = (req: Request, res: Response): void => {
    const { ambienteId } = req.query;
    if (ambienteId !== undefined && typeof ambienteId !== 'string') {
      throw AppError.badRequest('El parámetro "ambienteId" debe ser un único texto.');
    }
    const items = EquipmentService.getAll(ambienteId);
    res.status(200).json({ success: true, count: items.length, data: items });
  };

  public static updateEquipment = (req: Request, res: Response): void => {
    const item = EquipmentService.update(String(req.params.id), asBody(req.body));
    res.status(200).json({ success: true, data: item });
  };
}
