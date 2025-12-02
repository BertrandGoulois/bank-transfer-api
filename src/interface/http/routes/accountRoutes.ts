import { Router } from 'express';
import { AccountController } from '../controllers/AccountController';
import { validateBody } from '../middleware/validationMiddleware';

const router = Router();
const controller = new AccountController();

router.get('/:id', controller.getAccount.bind(controller));
router.post('/:id/deposit', validateBody(['accountId', 'amount']), controller.deposit.bind(controller));
router.post('/:id/withdraw', validateBody(['accountId', 'amount']), controller.withdraw.bind(controller));
router.post('/transfer', validateBody(['fromId', 'toId', 'amount']) ,controller.transfer.bind(controller));

export default router;
