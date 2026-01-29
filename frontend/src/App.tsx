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

function App() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [filter, setFilter] = useState<TodoStatus>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination & Sorting State
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [sortBy] = useState('createdAt');
    const [sortOrder] = useState<'ASC' | 'DESC'>('DESC');
    const [metadata, setMetadata] = useState<PaginatedTodoResponse['meta'] | null>(null);

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
                search: searchQuery
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
    const handleAddTodo = async (title: string) => {
        try {
            await todoApi.createTodo(title);
            fetchTodos(); // Recargar para mantener orden y paginación consistentes
            toast.success('Tarea creada correctamente');
        } catch (err) {
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
            // No recargamos todo para no interrumpir la vista, pero si el filtro no es 'all',
            // la tarea debería desaparecer en la siguiente recarga o podemos forzarla.
            if (filter !== 'all') {
                fetchTodos();
            } else {
                // Actualizar contadores manualmente o recargar metadatos
                fetchTodos();
            }
            completed ? toast.success('Tarea completada') : toast.info('Tarea marcada como pendiente');
        } catch (err) {
            // Revert on error
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
                loading={loading && todos.length === 0}
            />
            <SidebarInset className="flex flex-col min-h-screen bg-background">
                <div className="flex flex-col w-full items-center">
                    <header className="flex h-16 shrink-0 items-center justify-between px-4 w-full border-b md:border-transparent sticky top-0 bg-background/80 backdrop-blur-md z-10">
                        <SidebarTrigger className="-ml-1" />
                        <div className="md:hidden font-bold text-lg">Focuspan</div>
                        <div className="w-9 h-9" />
                    </header>

                    <main className="w-full max-w-7xl p-6 md:px-12 space-y-8 animate-in fade-in duration-300">
                        <div className="space-y-4">
                            <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">
                                {filter === 'all' && 'Mis Tareas'}
                                {filter === 'active' && 'Tareas Pendientes'}
                                {filter === 'completed' && 'Tareas Completadas'}
                            </h1>
                            <p className="text-muted-foreground">
                                {filter === 'all' && 'Gestiona tus actividades diarias con simplicidad.'}
                                {filter === 'active' && `Tienes ${counts.active} ${counts.active === 1 ? 'tarea pendiente' : 'tareas pendientes'}.`}
                                {filter === 'completed' && `Has completado ${counts.completed} ${counts.completed === 1 ? 'tarea' : 'tareas'}. ¡Buen trabajo!`}
                            </p>
                            <TodoInput onAdd={handleAddTodo} disabled={loading} />
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

                        <div className="relative min-h-[300px]">
                            {loading && todos.length === 0 && <TodoSkeletonList />}


                            {!loading && todos.length === 0 && (
                                <div className="text-center py-20 text-muted-foreground animate-in fade-in duration-300">
                                    <ClipboardList className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                    <p className="text-xl font-medium mb-1">{searchQuery ? 'Sin coincidencias' : 'Todo despejado'}</p>
                                    <p className="text-sm opacity-60">
                                        {searchQuery && `No encontramos resultados para "${searchQuery}"`}
                                        {!searchQuery && filter === 'active' && '¡Excelente! No tienes tareas pendientes.'}
                                        {!searchQuery && filter === 'all' && 'Empieza añadiendo una tarea arriba.'}
                                    </p>
                                </div>
                            )}

                            {todos.length > 0 && (
                                <div className="space-y-8">
                                    {searchQuery && metadata && (
                                        <p className="text-sm text-muted-foreground text-center mb-4">
                                            Mostrando {todos.length} de {metadata.total} {metadata.total === 1 ? 'resultado' : 'resultados'}
                                        </p>
                                    )}
                                    <AnimatedTodoList
                                        todos={todos}
                                        onToggle={handleToggleTodo}
                                        onDelete={handleDeleteTodo}
                                        onUpdate={handleUpdateTodo}
                                    />

                                    {metadata && metadata.totalPages > 1 && (
                                        <div className="pt-4 border-t">
                                            <TodoPagination
                                                currentPage={page}
                                                totalPages={metadata.totalPages}
                                                onPageChange={setPage}
                                            />
                                        </div>
                                    )}
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
