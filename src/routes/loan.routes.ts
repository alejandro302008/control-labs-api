import { Router } from 'express';
import { LoanController} from '../controllers/loan.controller';

const router = Router();

router.post('/', LoanController.createLoan);
router.get('/search', LoanController.getLoansByFilter);
router.get('/:id',LoanController.getLoanById)
router.put('/:id/accept', LoanController.acceptLoanInventory);

export default router;
