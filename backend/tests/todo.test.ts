import request from 'supertest';
import express from 'express';
import { TestDataSource } from '../src/config/test-data-source';
import { Todo } from '../src/entities/Todo';
import todoRoutes from '../src/routes/todo.routes';
import 'reflect-metadata';

const app = express();
app.use(express.json());

describe('Todo API Tests', () => {
    beforeAll(async () => {
        // Conectar a la base de datos de test
        await TestDataSource.initialize();

        // Inyectar el repository de test en app.locals
        app.locals.todoRepository = TestDataSource.getRepository(Todo);

        // Configurar rutas DESPUÉS de inyectar el repository
        app.use('/api/todos', todoRoutes);
    });

    afterAll(async () => {
        // Cerrar conexión
        await TestDataSource.destroy();
    });

    beforeEach(async () => {
        // Limpiar la tabla antes de cada test
        await TestDataSource.getRepository(Todo).clear();
    });

    describe('POST /api/todos', () => {
        it('debería crear un nuevo todo', async () => {
            const response = await request(app).post('/api/todos').send({ title: 'Test todo' }).expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe('Test todo');
            expect(response.body.completed).toBe(false);
            expect(response.body).toHaveProperty('createdAt');
            expect(response.body).toHaveProperty('updatedAt');
        });

        it('debería rechazar un todo sin título', async () => {
            const response = await request(app).post('/api/todos').send({ title: '' }).expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.message).toContain('required');
        });

        it('debería rechazar un título muy largo', async () => {
            const longTitle = 'a'.repeat(300);

            const response = await request(app).post('/api/todos').send({ title: longTitle }).expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.message).toContain('255');
        });
    });

    describe('GET /api/todos', () => {
        it('debería devolver un array vacío cuando no hay todos', async () => {
            const response = await request(app).get('/api/todos').expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });

        it('debería devolver todos los todos', async () => {
            await request(app).post('/api/todos').send({ title: 'Todo 1' });
            await request(app).post('/api/todos').send({ title: 'Todo 2' });

            const response = await request(app).get('/api/todos').expect(200);

            expect(response.body.length).toBe(2);
        });

        it('debería filtrar todos activos', async () => {
            const todo1 = await request(app).post('/api/todos').send({ title: 'Todo 1' });
            await request(app).post('/api/todos').send({ title: 'Todo 2' });

            await request(app).patch(`/api/todos/${todo1.body.id}`).send({ completed: true });

            const response = await request(app).get('/api/todos?status=active').expect(200);

            expect(response.body.length).toBe(1);
            expect(response.body[0].completed).toBe(false);
        });

        it('debería filtrar todos completados', async () => {
            const todo1 = await request(app).post('/api/todos').send({ title: 'Todo 1' });
            await request(app).post('/api/todos').send({ title: 'Todo 2' });

            await request(app).patch(`/api/todos/${todo1.body.id}`).send({ completed: true });

            const response = await request(app).get('/api/todos?status=completed').expect(200);

            expect(response.body.length).toBe(1);
            expect(response.body[0].completed).toBe(true);
        });
    });

    describe('PATCH /api/todos/:id', () => {
        it('debería actualizar el título de un todo', async () => {
            const createResponse = await request(app).post('/api/todos').send({ title: 'Original title' });

            const todoId = createResponse.body.id;

            const response = await request(app).patch(`/api/todos/${todoId}`).send({ title: 'Updated title' }).expect(200);

            expect(response.body.title).toBe('Updated title');
        });

        it('debería marcar un todo como completado', async () => {
            const createResponse = await request(app).post('/api/todos').send({ title: 'Test todo' });

            const todoId = createResponse.body.id;

            const response = await request(app).patch(`/api/todos/${todoId}`).send({ completed: true }).expect(200);

            expect(response.body.completed).toBe(true);
        });

        it('debería devolver 404 para un todo inexistente', async () => {
            const fakeId = '00000000-0000-0000-0000-000000000000';

            const response = await request(app).patch(`/api/todos/${fakeId}`).send({ completed: true }).expect(404);

            expect(response.body).toHaveProperty('error');
            expect(response.body.message).toContain('not found');
        });

        it('debería rechazar un título vacío', async () => {
            const createResponse = await request(app).post('/api/todos').send({ title: 'Test todo' });

            const response = await request(app).patch(`/api/todos/${createResponse.body.id}`).send({ title: '' }).expect(400);

            expect(response.body).toHaveProperty('error');
        });
    });

    describe('DELETE /api/todos/:id', () => {
        it('debería eliminar un todo existente', async () => {
            const createResponse = await request(app).post('/api/todos').send({ title: 'Test todo' });

            const todoId = createResponse.body.id;

            await request(app).delete(`/api/todos/${todoId}`).expect(204);

            const getResponse = await request(app).get('/api/todos');
            expect(getResponse.body.length).toBe(0);
        });

        it('debería devolver 404 al intentar eliminar un todo inexistente', async () => {
            const fakeId = '00000000-0000-0000-0000-000000000000';

            const response = await request(app).delete(`/api/todos/${fakeId}`).expect(404);

            expect(response.body).toHaveProperty('error');
            expect(response.body.message).toContain('not found');
        });
    });
});
