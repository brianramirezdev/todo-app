# 🎨 Frontend - Todo App UI

Interfaz de usuario moderna y reactiva construida con **React**, **Vite** y **Tailwind CSS v4**, diseñada para una experiencia de usuario fluida con animaciones y estados optimistas.

---

## 🛠 Stack Tecnológico

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Estilos**: Tailwind CSS v4 + Lucide React (iconos)
- **Componentes**: shadcn/ui (Radix UI)
- **Animaciones**: Framer Motion
- **Estado/API**: Axios + React Hooks (useState/useEffect)
- **Testing**: Vitest + React Testing Library

---

## 📁 Estructura de Componentes

```text
frontend/
├── src/
│   ├── components/
│   │   ├── ui/             # Componentes base (shadcn)
│   │   ├── TodoInput.tsx   # Creación de tareas
│   │   ├── TodoFilters.tsx # Filtros (All, Active, Completed)
│   │   └── ...             # Otros componentes funcionales
│   ├── services/           # Comunicación con la API (Axios)
│   ├── App.tsx             # Orquestador principal y lógica de estado
│   └── main.tsx            # Punto de entrada de React
├── public/                 # Assets estáticos
└── nginx.conf              # Configuración del proxy para Docker
```

---

## 🌐 Comunicación con el Backend

El frontend utiliza un **proxy** para evitar problemas de CORS y simplificar las URLs.

- **Desarrollo**: Configurado en `vite.config.ts` para redirigir `/api` a `http://localhost:3000`.
- **Producción (Docker)**: Configurado en `nginx.conf` para redirigir `/api` al contenedor `backend:3000`.

### Cliente API

Las llamadas se centralizan en `src/services/api.ts`, asegurando un tipado fuerte para las respuestas del backend.

---

## 🧪 Testing

Utilizamos **Vitest** para tests unitarios y de componentes.

```bash
# Ejecutar tests
npm test

# Ver cobertura
npm run test:coverage
```

---

## 🚀 Ejecución

### Modo Desarrollo

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`. Para que funcione, el backend debe estar corriendo en el puerto 3000.

### Modo Docker (Producción)

En Docker, el frontend se compila y se sirve mediante **Nginx**.

```bash
# Desde la raíz del proyecto
docker compose up frontend --build
```

Disponible en `http://localhost:80`.

---

## ✨ Características Especiales

- **Sistema Multi-Tema (Paletas)**: Soporte para 5 temas dinámicos:
  - **Indigo**: El clásico balanceado.
  - **Moss**: Tonos verdes naturales y relajantes.
  - **Charcoal**: Minimalismo puro en blanco y negro "ink-like".
  - **Punchy**: Colores vibrantes y enérgicos de alto contraste.
  - **Queater**: Inspirado en tonos crema y naranja cálidos.
- **DarkMode Nativo**: Todos los temas anteriores cuentan con su propia versión optimizada para modo oscuro.
- **Optimistic Updates**: Los cambios en el estado de las tareas se reflejan instantáneamente en la UI antes de confirmarse en el servidor.
- **Responsive Design**: Layout moderno con Sidebar colapsable adaptado a móviles y tablets.
- **Skeletons**: Indicadores de carga coordinados con el diseño de las tarjetas para una carga visual fluida.
- **Sonner Notifications**: Feedback visual elegante y no intrusivo.
