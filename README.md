# 📝 Todo App Full-Stack

> Aplicación TODO moderna con arquitectura separada frontend/backend, construida con TypeScript, Express, PostgreSQL y TypeORM.

![Tests](https://img.shields.io/badge/tests-13%20passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Node](https://img.shields.io/badge/Node.js-18%2B-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)

---

## 📋 Tabla de Contenidos

- Descripción
- Requisitos Previos
- Tecnologías Utilizadas
- Arquitectura del Proyecto
- Instalación
- Configuración
- Ejecución
- API Endpoints
- Migraciones de Base de Datos
- Testing
- Scripts Disponibles
- Decisiones Técnicas
- Mejoras Futuras
- Troubleshooting

---

## 🎯 Descripción

Aplicación TODO end-to-end diseñada con arquitectura moderna de microservicios. El backend está completamente funcional con API REST, validaciones, tests automatizados y sistema de migraciones. El frontend está pendiente de implementación.

**Estado actual:**

- ✅ Backend completo (Node.js + TypeScript + Express)
- ✅ Base de datos PostgreSQL con TypeORM
- ✅ Sistema de migraciones
- ✅ 13 tests automatizados (100% passing)
- ⏳ Frontend React (pendiente)

---

## 🔧 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** v18 o superior → [Descargar](https://nodejs.org/)
- **Docker Desktop** → [Descargar](https://www.docker.com/products/docker-desktop/)
- **Git** → [Descargar](https://git-scm.com/)
- **Editor de código** (recomendado: VS Code)

Verifica las instalaciones:

```bash
node --version
docker --version
git --version
```

---

## 🛠 Tecnologías Utilizadas

### Backend

| Tecnología     | Versión | Propósito                  |
| -------------- | ------- | -------------------------- |
| **Node.js**    | 18+     | Runtime de JavaScript      |
| **TypeScript** | 5.9     | Tipado estático y mejor DX |
| **Express**    | 5.2     | Framework web minimalista  |
| **TypeORM**    | 0.3     | ORM para PostgreSQL        |
| **PostgreSQL** | 15      | Base de datos relacional   |
| **Jest**       | 30.2    | Framework de testing       |

### DevOps

- **Docker Compose**: Orquestación de PostgreSQL
- **ts-node**: Ejecución de TypeScript en desarrollo
- **nodemon**: Hot reload en desarrollo
- **tsconfig-paths**: Path aliases (@entities, @config, etc.)

---

## 📁 Estructura del Proyecto

- `todo-app/`
    - `backend/` — Servidor API
        - `src/`
            - `config/` — Configuraciones
                - `typeorm.config.ts` — DataSource de producción
                - `test-data-source.ts` — DataSource de testing
            - `entities/` — Modelos de dominio
                - `Todo.ts` — Entidad Todo con decoradores
            - `controllers/` — Lógica de negocio
                - `todo.controller.ts` — CRUD + validaciones
            - `routes/` — Definición de rutas HTTP
                - `todo.routes.ts` — Endpoints de la API
            - `migrations/` — Migraciones de base de datos
                - `[timestamp]-CreateTodoTable.ts`
            - `index.ts` — Punto de entrada del servidor
        - `tests/` — Tests automatizados
            - `todo.test.ts` — 13 tests (CRUD + validaciones)
        - `package.json` — Dependencias y scripts
        - `tsconfig.json` — Configuración de TypeScript
        - `jest.config.js` — Configuración de Jest
    - `frontend/` — Aplicación frontend (pendiente de implementar)
    - `docker-compose.yml` — PostgreSQL containerizado
    - `.env.example` — Template de variables de entorno
    - `.gitignore` — Archivos ignorados por Git
    - `README.md` — Documentación del proyecto

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/brianramirezdev/todo-app
cd todo-app
```

### 2. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 3. Levantar PostgreSQL con Docker

```bash
docker-compose up -d
docker ps
```

---

## ⚙️ Configuración

### Variables de Entorno

```bash
copy .env.example .env
```

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=todo_app

PORT=3000
NODE_ENV=development
```

### Ejecutar Migraciones

```bash
npm run migration:run
```

---

## ▶️ Ejecución

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm run build
npm start
```

---

## 🌐 API Endpoints

Base URL: `http://localhost:3000/api`

### Listar TODOs

```bash
GET /api/todos?status=all|active|completed
```

### Crear TODO

```bash
POST /api/todos
```

### Actualizar TODO

```bash
PATCH /api/todos/:id
```

### Eliminar TODO

```bash
DELETE /api/todos/:id
```

### Eliminar todos los TODOs

```bash
DELETE /api/todos
```

---

## 🧪 Testing

```bash
npm test
```

---

## 📜 Scripts Disponibles

| Script      | Comando               | Descripción    |
| ----------- | --------------------- | -------------- |
| Desarrollo  | `npm run dev`         | Hot reload     |
| Build       | `npm run build`       | Compilar TS    |
| Producción  | `npm start`           | Ejecutar build |
| Tests       | `npm test`            | Tests          |
| Migraciones | `npm run migration:*` | Gestión BD     |

---

## 🚀 Mejoras Futuras

- Frontend React
- Autenticación JWT
- Swagger / OpenAPI
- CI/CD
- Paginación
- Logging

---

## 📝 Licencia

MIT
