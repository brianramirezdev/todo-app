# ⚙️ Backend - Todo App API

Servidor REST robusto construido con **Node.js**, **Express** y **TypeScript**, utilizando **TypeORM** para la gestión de la base de datos PostgreSQL.

---

## 🛠 Stack Tecnológico

- **Runtime**: Node.js v18+
- **Lenguaje**: TypeScript 5.9
- **Framework**: Express 5.2 (vía npm tags)
- **ORM**: TypeORM 0.3
- **Base de Datos**: PostgreSQL 15
- **Testing**: Jest + Supertest

---

## 📁 Estructura de Carpetas

```text
backend/
├── src/
│   ├── config/      # Configuraciones de TypeORM (DataSource)
│   ├── controllers/ # Lógica de control y validación de entrada
│   ├── entities/    # Modelos de datos (Decoradores TypeORM)
│   ├── migrations/  # Scripts de evolución de esquema
│   ├── routes/      # Definición de endpoints
│   └── index.ts     # Punto de entrada y configuración de Express
├── tests/           # Suites de tests de integración
└── package.json     # Scripts y dependencias
```

---

## ⚙️ Configuración (Variables de Entorno)

El backend **no requiere configuración adicional** para desarrollo local si usas los valores por defecto (PostgreSQL en localhost:5432).

Si necesitas personalizarlo, puedes crear un archivo `.env` en la carpeta `backend/` para sobrescribir los valores por defecto:

| Variable      | Descripción                | Valor Default                     |
| :------------ | :------------------------- | :-------------------------------- |
| `DB_HOST`     | Host de la base de datos   | `localhost` / `postgres` (Docker) |
| `DB_PORT`     | Puerto de PostgreSQL       | `5432`                            |
| `DB_USER`     | Usuario de la BD           | `postgres`                        |
| `DB_PASSWORD` | Contraseña de la BD        | `postgres`                        |
| `DB_NAME`     | Nombre de la base de datos | `todo_app`                        |
| `PORT`        | Puerto del servidor API    | `3000`                            |

---

## 🗄 Gestión de Base de Datos (TypeORM)

Usamos un flujo basado en migraciones para asegurar la integridad de los datos.

### Scripts Útiles

- **Correr migraciones**: `npm run migration:run`
- **Revertir última migración**: `npm run migration:revert`
- **Generar migración**: `npm run migration:generate -- src/migrations/NombreDeMigracion`

> [!IMPORTANT]
> En entornos Docker, las migraciones se ejecutan automáticamente antes de iniciar el servidor mediante el script `start:migrate`.

---

## 🌐 API Endpoints

Base URL: `http://localhost:3001/api` (vía Docker) o `http://localhost:3000/api` (local)

### TODOs



- `GET /todos`: Lista tareas con soporte para:
    - **Filtrado**: `?status=all|active|completed`
    - **Paginación**: `?page=1&limit=10`
    - **Ordenación**: `?sortBy=createdAt&sortOrder=DESC|ASC`
    - **Búsqueda**: `?search=texto_a_buscar`
- `POST /todos`: Crea una nueva tarea/nota. Body: `{ "title": "string", "type": "task" | "note" }`.
- `PATCH /todos/:id`: Actualiza título o estado.
- `DELETE /todos/:id`: Elimina una tarea específica.
- `DELETE /todos`: Elimina **todas** las tareas (usando QueryBuilder para un borrado atómico).
- `POST /todos/seed`: Genera 20+ entradas de prueba con fechas y tipos variados.

---

## 🧪 Testing

El backend incluye **tests de integración** con **Jest + Supertest**.

### ▶️ Ejecutar tests (Docker)

Esta es la forma recomendada y más fiable, ya que Docker gestiona el entorno y la base de datos de test automáticamente:

```bash
docker compose exec backend npm test
```

---

## 🚀 Ejecución Manual

```bash
npm install
npm run build
npm start
```
