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
│   │   ├── AppSidebar.tsx  # Centralizador de filtros, búsqueda y temas
│   │   ├── TodoInput.tsx   # Creación de tareas y notas
│   │   ├── TodoItem.tsx    # Visualización (Cartas con lógica Task/Note)
│   │   ├── TodoPagination.tsx # Navegación server-side
│   │   ├── DevOverlay.tsx  # Panel técnico flotante (seeder/clear)
│   │   └── ...
│   ├── services/           # Comunicación con la API (Axios)
│   ├── hooks/              # Lógica reutilizable
│   ├── App.tsx             # Orquestador principal y gestión de estado
│   └── main.tsx            # Punto de entrada de React
├── public/                 # Assets estáticos
└── nginx.conf              # Configuración del proxy para Docker
```

---

## ✨ Características Especiales

- **Gestión Avanzada de Datos**:
    - Paginación real integrada en la parte superior para navegación fluida.
    - Ordenación por fecha y alfabética.
    - Modo Tarea (Checklist) vs Modo Nota (Paper-like aesthetic).
- **Modo Desarrollo (DX)**: Icono de engranaje en el sidebar que activa un panel flotante para inyectar 20+ datos de prueba o limpiar la base de datos instantáneamente.
- **Sistema Multi-Tema (Paletas)**: Soporte para 5 temas dinámicos:
  - **Indigo**: El clásico balanceado.
  - **Moss**: Tonos verdes naturales y relajantes.
  - **Charcoal**: Minimalismo puro en blanco y negro "ink-like".
  - **Punchy**: Colores vibrantes y enérgicos de alto contraste.
  - **Queater**: Inspirado en tonos crema y naranja cálidos.
- **DarkMode Nativo**: Versión optimizada para modo oscuro en cada paleta.
- **Optimistic Updates**: Interacción instantánea sin esperar al servidor.
- **Responsive Design**: Sidebar colapsable adaptado a móviles y tablets.
- **Sonner Notifications**: Feedback visual elegante.
- **Testing Full-Suite**: Pruebas con Vitest + Mocks de ResizeObserver/Radix UI.

---

## 🧪 Testing

El frontend incluye **tests unitarios y de componentes** utilizando **Vitest** y **React Testing Library**.

### ▶️ Ejecutar tests (Local)
A diferencia del backend, los tests de frontend están diseñados para correr en el entorno local para maximizar la velocidad de desarrollo (Watch Mode).

```bash
cd frontend
npm install
npm test
```

Esto abrirá Vitest en modo interactivo, permitiéndote ver los resultados en tiempo real mientras editas componentes.
