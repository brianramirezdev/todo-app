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

El backend requiere un archivo `.env` en la carpeta `backend/` con las siguientes variables:

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

- `GET /todos`: Lista todas las tareas. Soporta query param `?status=all|active|completed`.
- `POST /todos`: Crea una nueva tarea. Body: `{ "title": "string" }`.
- `PATCH /todos/:id`: Actualiza título o estado. Body: `{ "title": "string", "completed": boolean }`.
- `DELETE /todos/:id`: Elimina una tarea específica.
- `DELETE /todos`: Elimina **todas** las tareas.

---

## 🧪 Testing

El backend incluye **tests de integración** con **Jest + Supertest**.

### ▶️ Ejecutar tests con Docker (recomendado)

Con los contenedores levantados:

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
