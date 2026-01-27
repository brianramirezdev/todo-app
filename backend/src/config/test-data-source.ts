import { DataSource } from 'typeorm';
import { Todo } from '@entities/Todo';

export const TestDataSource = new DataSource({
    type: 'postgres',
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT || '5432'),
    username: process.env.TEST_DB_USER || 'postgres',
    password: process.env.TEST_DB_PASSWORD || 'postgres',
    database: process.env.TEST_DB_NAME || 'todo_app_test',
    synchronize: true, // En tests podemos usar true para crear tablas automáticamente
    logging: false,
    dropSchema: true, // Limpia la BD antes de cada test suite
    entities: [Todo],
});
