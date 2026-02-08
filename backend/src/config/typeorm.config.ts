import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Todo } from '../entities/Todo'; // Importación directa más segura

dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

const isTest = process.env.NODE_ENV === 'test';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || (isTest ? 'postgres' : 'localhost'),
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'todo_app',
    synchronize: true, // Siempre true para un funcionamiento inmediato
    dropSchema: false, // Evitamos borrar esquema para mayor estabilidad
    logging: false,
    entities: [Todo],
    migrations: [],
});
