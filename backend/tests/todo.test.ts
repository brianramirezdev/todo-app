import request from 'supertest';
import express from 'express';
import { AppDataSource } from '../src/config/typeorm.config';
import { Todo } from '../src/entities/Todo';
import todoRoutes from '../src/routes/todo.routes';
import 'reflect-metadata';

const app = express();
app.use(express.json());

describe('Todo API Tests', () => {
    beforeAll(async () => {
        process.env.NODE_ENV = 'test';

        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        // Inyectar el repository REAL (pero en DB de test)
        app.locals.todoRepository = AppDataSource.getRepository(Todo);

        // Montar rutas después de inyectar dependencias
        app.use('/api/todos', todoRoutes);
    });

    afterAll(async () => {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    });

    beforeEach(async () => {
        await AppDataSource.getRepository(Todo).clear();
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
        });

        it('debería rechazar un título muy largo', async () => {
            const longTitle = 'a'.repeat(300);

            const response = await request(app).post('/api/todos').send({ title: longTitle }).expect(400);

            expect(response.body).toHaveProperty('error');
        });
    });

    describe('GET /api/todos', () => {
        it('debería devolver un array vacío cuando no hay todos', async () => {
            const response = await request(app).get('/api/todos').expect(200);

            expect(response.body).toEqual([]);
        });

        it('debería devolver todos los todos', async () => {
            await request(app).post('/api/todos').send({ title: 'Todo 1' });
            await request(app).post('/api/todos').send({ title: 'Todo 2' });

            const response = await request(app).get('/api/todos').expect(200);

            expect(response.body.length).toBe(2);
        });
    });

    describe('PATCH /api/todos/:id', () => {
        it('debería actualizar un todo', async () => {
            const create = await request(app).post('/api/todos').send({ title: 'Original' });

            const response = await request(app).patch(`/api/todos/${create.body.id}`).send({ title: 'Updated' }).expect(200);

            expect(response.body.title).toBe('Updated');
        });
    });

    describe('DELETE /api/todos/:id', () => {
        it('debería eliminar un todo', async () => {
            const create = await request(app).post('/api/todos').send({ title: 'Test' });

            await request(app).delete(`/api/todos/${create.body.id}`).expect(204);

            const response = await request(app).get('/api/todos');
            expect(response.body).toEqual([]);
        });
    });
});
