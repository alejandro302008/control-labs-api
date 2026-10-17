import { Request, Response } from 'express';
import { EnvironmentsService } from '../services/ambientes.service';
import { asBody } from '../utils/validators';

export class EnvironmentController {
  public static getEnvironments = (_req: Request, res: Response): void => {
    const environments = EnvironmentsService.getAll();
    res.status(200).json({ success: true, count: environments.length, data: environments });
  };

  public static createEnvironment = (req: Request, res: Response): void => {
    const environment = EnvironmentsService.create(asBody(req.body));
    res.status(201).json({ success: true, data: environment });
  };

  public static updateEnvironment = (req: Request, res: Response): void => {
    const environment = EnvironmentsService.update(String(req.params.id), asBody(req.body));
    res.status(200).json({ success: true, data: environment });
  };
}
