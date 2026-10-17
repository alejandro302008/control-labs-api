import { Request, Response } from 'express';
import { UsersService } from '../services/users.service';
import { asBody } from '../utils/validators';

export class UserController {
  public static getUsers = (_req: Request, res: Response): void => {
    const users = UsersService.getAll();
    res.status(200).json({ success: true, count: users.length, data: users });
  };

  public static createUser = (req: Request, res: Response): void => {
    const user = UsersService.create(asBody(req.body));
    res.status(201).json({ success: true, data: user });
  };

  public static getUserById = (req: Request, res: Response): void => {
    const user = UsersService.getById(String(req.params.id));
    res.status(200).json({ success: true, data: user });
  };

  public static updateUser = (req: Request, res: Response): void => {
    const user = UsersService.update(String(req.params.id), asBody(req.body));
    res.status(200).json({ success: true, data: user });
  };

  public static deleteUser = (req: Request, res: Response): void => {
    const user = UsersService.softDelete(String(req.params.id));
    res.status(200).json({ success: true, message: 'Usuario desactivado (eliminación lógica).', data: user });
  };
}
