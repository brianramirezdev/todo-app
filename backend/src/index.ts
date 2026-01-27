import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { AppDataSource } from '@config/typeorm.config';
import { Todo } from '@entities/Todo';
import todoRoutes from '@routes/todo.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Inicializar base de datos y servidor
AppDataSource.initialize()
    .then(() => {
        console.log('✅ Database connected successfully');

        // Inyectar el repository en app.locals
        app.locals.todoRepository = AppDataSource.getRepository(Todo);

        // Routes
        app.use('/api/todos', todoRoutes);

        // Health check
        app.get('/health', (req, res) => {
            res.json({ status: 'ok', message: 'Server is running' });
        });

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ Error connecting to database:', error);
        process.exit(1);
    });
