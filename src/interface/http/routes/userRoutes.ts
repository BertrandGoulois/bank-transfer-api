import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();
const controller = new UserController();

router.get('/id/:id', controller.getById.bind(controller));
router.get('/email/:email', controller.getByEmail.bind(controller));
router.get('/', controller.list.bind(controller));

export default router;