import { Router } from 'express';
import { TodoController } from '@controllers/todo.controller';

const router = Router();

// GET /api/todos?status=all|active|completed
router.get('/', TodoController.getAllTodos);

// POST /api/todos
router.post('/', TodoController.createTodo);

// PATCH /api/todos/:id
router.patch('/:id', TodoController.updateTodo);

// DELETE /api/todos/:id
router.delete('/:id', TodoController.deleteTodo);

// DELETE /api/todos
router.delete('/', TodoController.deleteAllTodos);

export default router;
