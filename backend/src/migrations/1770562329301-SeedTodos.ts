import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedTodos1770562329301 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
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

        for (const todo of seedData) {
            await queryRunner.query(
                `INSERT INTO "todos" ("title", "type", "completed", "created_at", "updated_at") VALUES ($1, $2, $3, DEFAULT, DEFAULT)`,
                [todo.title, todo.type, todo.completed]
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "todos" WHERE title IN (
            'Revisar logs de producción', 'Comprar café para el equipo', 'Idea: Refactorizar el motor de filtrado',
            'Pagar suscripción de Copilot', 'Configurar variables de entorno en Staging', 'Recordatorio: Dentista mañana 10am',
            'Optimizar queries de TypeORM', 'Actualizar README con guía de despliegue', 'Feedback de la última reunión de diseño',
            'Investigar integración con Stripe', 'Fix bug: padding en modo móvil', 'Borrador: Roadmap Q1 2026',
            'Llamar a soporte técnico de AWS', 'Revisar PR de autenticación', 'Nota mental: Usar glassmorphism en el sidebar',
            'Preparar demo para el cliente', 'Instalar dependencias de testing', 'Definir paleta de colores "Charcoal"',
            'Validar accesibilidad de los inputs', 'Comprar monitor ultrapanorámico', 'Lista de la compra semanal',
            'Refinar animaciones de Framer Motion'
        )`);
    }

}
