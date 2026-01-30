import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { Todo } from '@entities/Todo';

export class TodoController {
    // GET /api/todos?status=all|active|completed&page=1&limit=10&sortBy=createdAt&sortOrder=DESC&search=...
    static async getAllTodos(req: Request, res: Response) {
        try {
            const todoRepository = req.app.locals.todoRepository as Repository<Todo>;

            // Extract query parameters with defaults
            const status = req.query.status as string || 'all';
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const sortBy = (req.query.sortBy as string) || 'createdAt';
            const sortOrder = (req.query.sortOrder as string)?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
            const search = req.query.search as string || '';

            const queryBuilder = todoRepository.createQueryBuilder('todo');

            // Filter by status
            if (status === 'active') {
                queryBuilder.andWhere('todo.completed = :completed', { completed: false });
            } else if (status === 'completed') {
                queryBuilder.andWhere('todo.completed = :completed', { completed: true });
            }

            // Filter by search term
            if (search.trim()) {
                queryBuilder.andWhere('LOWER(todo.title) LIKE LOWER(:search)', { search: `%${search.trim()}%` });
            }

            // Sorting
            queryBuilder.orderBy(`todo.${sortBy}`, sortOrder);

            // Pagination
            const skip = (page - 1) * limit;
            queryBuilder.skip(skip).take(limit);

            const [todos, total] = await queryBuilder.getManyAndCount();

            // Additional counts for the sidebar (efficiently)
            const [activeTotal, completedTotal] = await Promise.all([
                todoRepository.count({ where: { completed: false } }),
                todoRepository.count({ where: { completed: true } }),
            ]);

            res.json({
                data: todos,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    counts: {
                        all: activeTotal + completedTotal,
                        active: activeTotal,
                        completed: completedTotal,
                    }
                }
            });

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
            const { title, type = 'task' } = req.body;

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
                type: type as 'task' | 'note',
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
            await todoRepository.createQueryBuilder().delete().execute();

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

    // POST /api/todos/seed (sembrar datos de ejemplo)
    static async seedTasks(req: Request, res: Response) {
        try {
            const todoRepository = req.app.locals.todoRepository as Repository<Todo>;

            const seedData = [
                { title: 'Revisar logs de producción', type: 'task', completed: true },
                { title: 'Comprar café para el equipo', type: 'task', completed: false },
                { title: 'Idea: Refactorizar el motor de filtrado', type: 'note', completed: false },
                { title: 'Pagar suscripción de Copilot', type: 'task', completed: true },
                { title: 'Configurar variables de entorno en Staging', type: 'task', completed: false },
                { title: 'Recordatorio: Dentista mañana 10am', type: 'note', completed: false },
                { title: 'Optimizar queries de TypeORM', type: 'task', completed: true },
                { title: 'Actualizar README con guía de despliegue', type: 'task', completed: false },
                { title: 'Feedback de la última reunión de diseño', type: 'note', completed: false },
                { title: 'Investigar integración con Stripe', type: 'task', completed: false },
                { title: 'Fix bug: padding en modo móvil', type: 'task', completed: true },
                { title: 'Borrador: Roadmap Q1 2026', type: 'note', completed: false },
                { title: 'Llamar a soporte técnico de AWS', type: 'task', completed: false },
                { title: 'Revisar PR de autenticación', type: 'task', completed: true },
                { title: 'Nota mental: Usar glassmorphism en el sidebar', type: 'note', completed: false },
                { title: 'Preparar demo para el cliente', type: 'task', completed: false },
                { title: 'Instalar dependencias de testing', type: 'task', completed: true },
                { title: 'Definir paleta de colores "Charcoal"', type: 'note', completed: true },
                { title: 'Validar accesibilidad de los inputs', type: 'task', completed: false },
                { title: 'Comprar monitor ultrapanorámico', type: 'task', completed: false },
                { title: 'Lista de la compra semanal', type: 'note', completed: false },
                { title: 'Refinar animaciones de Framer Motion', type: 'task', completed: false }
            ];

            const todos = seedData.map((data, index) => {
                const date = new Date();
                // Simular fechas pasadas para scanability temporal
                if (index % 3 === 0) date.setDate(date.getDate() - 1); // Ayer
                if (index % 5 === 0) date.setDate(date.getDate() - 12); // Hace 5 días

                return todoRepository.create({
                    ...data,
                    type: data.type as 'task' | 'note',
                    createdAt: date.toISOString(),
                    updatedAt: date.toISOString()
                });
            });

            const savedTodos = await todoRepository.save(todos);

            res.status(201).json({
                message: 'Database seeded successfully',
                count: savedTodos.length,
                data: savedTodos
            });
        } catch (error) {
            console.error('Error seeding todos:', error);
            res.status(500).json({
                error: 'Internal server error',
                message: 'Failed to seed todos'
            });
        }
    }
}
