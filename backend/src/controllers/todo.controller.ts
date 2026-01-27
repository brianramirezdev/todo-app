import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { Todo } from '@entities/Todo';

export class TodoController {
    // GET /api/todos?status=all|active|completed
    static async getAllTodos(req: Request, res: Response) {
        try {
            const todoRepository = req.app.locals.todoRepository as Repository<Todo>;
            const { status } = req.query;

            let todos: Todo[];

            if (status === 'active') {
                todos = await todoRepository.find({ where: { completed: false } });
            } else if (status === 'completed') {
                todos = await todoRepository.find({ where: { completed: true } });
            } else {
                todos = await todoRepository.find();
            }

            res.json(todos);
        } catch (error) {
            console.error('Error fetching todos:', error);
            res.status(500).json({
                error: 'Internal server error',
                message: 'Failed to fetch todos',
            });
        }
    }

    // POST /api/todos
    static async createTodo(req: Request, res: Response) {
        try {
            const todoRepository = req.app.locals.todoRepository as Repository<Todo>;
            const { title } = req.body;

            // Validación
            if (!title || title.trim() === '') {
                return res.status(400).json({
                    error: 'Validation error',
                    message: 'Title is required and cannot be empty',
                });
            }

            if (title.length > 255) {
                return res.status(400).json({
                    error: 'Validation error',
                    message: 'Title cannot exceed 255 characters',
                });
            }

            // Crear todo
            const todo = todoRepository.create({
                title: title.trim(),
                completed: false,
            });

            const savedTodo = await todoRepository.save(todo);

            res.status(201).json(savedTodo);
        } catch (error) {
            console.error('Error creating todo:', error);
            res.status(500).json({
                error: 'Internal server error',
                message: 'Failed to create todo',
            });
        }
    }

    // PATCH /api/todos/:id
    static async updateTodo(req: Request, res: Response) {
        try {
            const todoRepository = req.app.locals.todoRepository as Repository<Todo>;
            const { id } = req.params as { id: string };
            const { title, completed } = req.body;

            // Buscar el todo
            const todo = await todoRepository.findOne({ where: { id } });

            if (!todo) {
                return res.status(404).json({
                    error: 'Not found',
                    message: 'Todo not found',
                });
            }

            // Validar título si se proporciona
            if (title !== undefined) {
                if (title.trim() === '') {
                    return res.status(400).json({
                        error: 'Validation error',
                        message: 'Title cannot be empty',
                    });
                }
                if (title.length > 255) {
                    return res.status(400).json({
                        error: 'Validation error',
                        message: 'Title cannot exceed 255 characters',
                    });
                }
                todo.title = title.trim();
            }

            // Actualizar completed si se proporciona
            if (completed !== undefined) {
                if (typeof completed !== 'boolean') {
                    return res.status(400).json({
                        error: 'Validation error',
                        message: 'Completed must be a boolean',
                    });
                }
                todo.completed = completed;
            }

            const updatedTodo = await todoRepository.save(todo);

            res.json(updatedTodo);
        } catch (error) {
            console.error('Error updating todo:', error);
            res.status(500).json({
                error: 'Internal server error',
                message: 'Failed to update todo',
            });
        }
    }

    // DELETE /api/todos/:id
    static async deleteTodo(req: Request, res: Response) {
        try {
            const todoRepository = req.app.locals.todoRepository as Repository<Todo>;
            const { id } = req.params as { id: string };

            // Buscar el todo
            const todo = await todoRepository.findOne({ where: { id } });

            if (!todo) {
                return res.status(404).json({
                    error: 'Not found',
                    message: 'Todo not found',
                });
            }

            await todoRepository.remove(todo);

            res.status(204).send();
        } catch (error) {
            console.error('Error deleting todo:', error);
            res.status(500).json({
                error: 'Internal server error',
                message: 'Failed to delete todo',
            });
        }
    }

    // DELETE /api/todos (borrar todos)
    static async deleteAllTodos(req: Request, res: Response) {
        try {
            const todoRepository = req.app.locals.todoRepository as Repository<Todo>;
            await todoRepository.delete({});

            res.json({
                message: 'All todos deleted successfully',
                deleted: true,
            });
        } catch (error) {
            console.error('Error deleting all todos:', error);
            res.status(500).json({
                error: 'Internal server error',
                message: 'Failed to delete todos',
            });
        }
    }
}
