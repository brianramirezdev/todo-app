import { useEffect, useState, useCallback } from 'react';
import type { Todo, TodoStatus, PaginatedTodoResponse } from './services/api';
import { todoApi } from './services/api';
import { TodoInput } from './components/TodoInput';
import { TodoSkeletonList } from './components/TodoSkeleton';
import { AlertCircle, RefreshCw, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './components/ui/button';
import { AnimatedTodoList } from './components/AnimatedTodoList';
import { SidebarProvider, SidebarInset, SidebarTrigger } from './components/ui/sidebar';
import { AppSidebar } from './components/AppSidebar';
import { TodoPagination } from './components/TodoPagination';
import { ScrollArea } from './components/ui/scroll-area';
import { DevOverlay } from './components/DevOverlay';

function App() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [filter, setFilter] = useState<TodoStatus>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination & Sorting State
    const [page, setPage] = useState(1);
    const [limit] = useState(15);
    const [sortBy] = useState('createdAt');
    const [sortOrder] = useState<'ASC' | 'DESC'>('DESC');
    const [metadata, setMetadata] = useState<PaginatedTodoResponse['meta'] | null>(null);

    // Development Mode State
    const [isDevMode, setIsDevMode] = useState(() => {
        return localStorage.getItem('dev_mode') === 'true';
    });

    const toggleDevMode = (enabled: boolean) => {
        setIsDevMode(enabled);
        localStorage.setItem('dev_mode', String(enabled));
        if (enabled) {
            toast.info('Modo Desarrollo activado', {
                description: 'Ahora tienes acceso a herramientas técnicas.',
            });
        }
    };

    // Cargar todos (Server-side)
    const fetchTodos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await todoApi.getTodos({
                status: filter,
                page,
                limit,
                sortBy,
                sortOrder,
                search: searchQuery,
            });

            setTodos(response.data);
            setMetadata(response.meta);
        } catch (err) {
            const errorMsg = 'Error al cargar las tareas. Verifica tu conexión.';
            setError(errorMsg);
            toast.error(errorMsg);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filter, page, limit, sortBy, sortOrder, searchQuery]);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    // Reset page when filter or search changes
    useEffect(() => {
        setPage(1);
    }, [filter, searchQuery]);

    // Crear todo
    const handleAddTodo = async (title: string, type: 'task' | 'note') => {
        const optimisticTodo: Todo = {
            id: Date.now().toString(), // Temporary ID for optimistic update
            title,
            completed: false,
            type,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        setTodos((prev) => [optimisticTodo, ...prev]);

        try {
            const newTodo = await todoApi.createTodo(title, type);
            setTodos((prev) => prev.map((todo) => (todo.id === optimisticTodo.id ? newTodo : todo)));
            fetchTodos(); // Recargar para mantener orden y paginación consistentes
            toast.success('Tarea creada correctamente');
        } catch (err) {
            setTodos((prev) => prev.filter((todo) => todo.id !== optimisticTodo.id)); // Revert optimistic update
            toast.error('Error al crear la tarea');
            console.error(err);
        }
    };

    // Toggle completado
    const handleToggleTodo = async (id: string, completed: boolean) => {
        // Optimistic update locally
        setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed } : todo)));

        try {
            await todoApi.updateTodo(id, { completed });
            if (filter !== 'all') {
                fetchTodos();
            }
            completed ? toast.success('Tarea completada') : toast.info('Tarea marcada como pendiente');
        } catch (err) {
            setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: !completed } : todo)));
            toast.error('Error al actualizar la tarea');
            console.error(err);
        }
    };

    // Actualizar título
    const handleUpdateTodo = async (id: string, title: string) => {
        const originalTodo = todos.find((t) => t.id === id);
        setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, title } : todo)));

        try {
            await todoApi.updateTodo(id, { title });
            toast.success('Tarea actualizada');
        } catch (err) {
            if (originalTodo) {
                setTodos((prev) => prev.map((todo) => (todo.id === id ? originalTodo : todo)));
            }
            toast.error('Error al actualizar la tarea');
            console.error(err);
        }
    };

    // Eliminar todo
    const handleDeleteTodo = async (id: string) => {
        const deletedTodo = todos.find((t) => t.id === id);
        setTodos((prev) => prev.filter((todo) => todo.id !== id));

        try {
            await todoApi.deleteTodo(id);
            fetchTodos(); // Recargar para ajustar paginación (si queda un hueco)
            toast.success('Tarea eliminada');
        } catch (err) {
            if (deletedTodo) {
                setTodos((prev) => [deletedTodo, ...prev]);
            }
            toast.error('Error al eliminar la tarea');
            console.error(err);
        }
    };

    const counts = metadata?.counts || { all: 0, active: 0, completed: 0 };

    return (
        <SidebarProvider>
            <AppSidebar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filter={filter}
                onFilterChange={setFilter}
                activeCount={counts.active}
                completedCount={counts.completed}
                isDevMode={isDevMode}
                onDevModeChange={toggleDevMode}
            />
            <SidebarInset className="flex flex-col h-screen overflow-hidden bg-background">
                {isDevMode && <DevOverlay onActionComplete={fetchTodos} />}
                <div className="flex-1 min-h-0 flex flex-col w-full items-center">
                    <header className="flex h-16 shrink-0 items-center justify-between px-4 w-full border-b md:border-transparent sticky top-0 bg-background/80 backdrop-blur-md z-10">
                        <SidebarTrigger className="-ml-1" />
                        <div className="md:hidden font-bold text-lg">Focuspan</div>
                        <div className="w-9 h-9" />
                    </header>

                    <main className="flex-1 min-h-0 flex flex-col w-full px-4 max-w-7xl md:px-8 space-y-6 animate-in fade-in duration-700 overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                            <div className="space-y-1">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground/90">
                                    {filter === 'all' && 'Mis Tareas'}
                                    {filter === 'active' && 'Tareas Pendientes'}
                                    {filter === 'completed' && 'Tareas Completadas'}
                                </h1>
                                <p className="text-sm text-muted-foreground/70">
                                    {filter === 'all' && 'Gestiona tus actividades con calma.'}
                                    {filter === 'active' && `Tienes ${counts.active} ${counts.active === 1 ? 'pendiente' : 'pendientes'}.`}
                                    {filter === 'completed' && `Has completado ${counts.completed} ${counts.completed === 1 ? 'tarea' : 'tareas'}.`}
                                </p>
                            </div>
                            <div className="w-full md:w-96">
                                <TodoInput onAdd={handleAddTodo} disabled={loading} />
                            </div>
                        </div>

                        {error && !loading && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md flex items-center justify-between animate-in fade-in slide-in-from-top">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5" />
                                    <span>{error}</span>
                                </div>
                                <Button variant="outline" size="sm" onClick={fetchTodos} className="ml-4">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Reintentar
                                </Button>
                            </div>
                        )}

                        <div className="flex-1 flex flex-col min-h-0">
                            {loading && todos.length === 0 && <TodoSkeletonList />}

                            {!loading && todos.length === 0 && (
                                <div className="text-center py-20 text-muted-foreground animate-in fade-in duration-300 flex-1 flex flex-col items-center justify-center">
                                    <ClipboardList className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                    <p className="text-xl font-medium mb-1">{searchQuery ? 'Sin coincidencias' : 'Todo despejado'}</p>
                                    <p className="text-sm opacity-60 text-center">
                                        {searchQuery && `No encontramos resultados para "${searchQuery}"`}
                                        {!searchQuery && filter === 'active' && '¡Excelente! No tienes tareas pendientes.'}
                                        {!searchQuery && filter === 'all' && 'Empieza añadiendo una tarea arriba.'}
                                    </p>
                                </div>
                            )}

                            {todos.length > 0 && (
                                <div className="flex flex-col flex-1 min-h-0">
                                    {/* Top Control Bar: Pagination & Metadata */}
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pt-2">
                                        <div className="flex items-center gap-4">
                                            {metadata && metadata.totalPages > 1 && <TodoPagination currentPage={page} totalPages={metadata.totalPages} onPageChange={setPage} />}
                                        </div>
                                    </div>

                                    <ScrollArea className="flex-1 h-full min-h-0 pr-4 mb-4 -mr-4">
                                        <AnimatedTodoList todos={todos} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} onUpdate={handleUpdateTodo} />
                                    </ScrollArea>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

export default App;
