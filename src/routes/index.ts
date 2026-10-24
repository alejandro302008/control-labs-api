import { Router } from 'express';
import usersRoutes from './users.routes';
import ambientesRoutes from './ambientes.routes';
import equipamientosRoutes from './equipamientos.routes';
import loanRoutes from './loan.routes';

const router = Router();

router.use('/usuarios', usersRoutes);          // /api/v1/usuarios
router.use('/ambientes', ambientesRoutes);     // /api/v1/ambientes
router.use('/equipos', equipamientosRoutes);   // /api/v1/equipos
router.use('/loans', loanRoutes);              // /api/v1/loans

export default router;
