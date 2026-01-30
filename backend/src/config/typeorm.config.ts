import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Todo } from '@entities/Todo';

dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.NODE_ENV === 'test' ? process.env.DB_HOST || 'postgres' : process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.NODE_ENV === 'test' ? process.env.DB_NAME || 'todo_app_test' : process.env.DB_NAME || 'todo_app',
    synchronize: true,
    dropSchema: process.env.NODE_ENV === 'test',
    logging: process.env.NODE_ENV === 'development',
    entities: [Todo],
    migrations: ['src/migrations/**/*.ts'],
});
