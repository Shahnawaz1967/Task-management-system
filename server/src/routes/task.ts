
import { Router } from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/taskController.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();
router.use(authenticate);
router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
