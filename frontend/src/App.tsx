import { useEffect, useState } from 'react';
import type { Todo, TodoStatus } from './services/api';
import { todoApi } from './services/api';
import { TodoInput } from './components/TodoInput';
import { TodoSkeletonList } from './components/TodoSkeleton';
import { AlertCircle, RefreshCw, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './components/ui/button';
import { AnimatedTodoList } from './components/AnimatedTodoList';
import { SidebarProvider, SidebarInset, SidebarTrigger } from './components/ui/sidebar';
import { AppSidebar } from './components/AppSidebar';

function App() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [filter, setFilter] = useState<TodoStatus>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar todos
    const fetchTodos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await todoApi.getTodos('all'); // Siempre cargamos todo para tener contadores exactos
            setTodos(data);
        } catch (err) {
            const errorMsg = 'Error al cargar las tareas. Verifica tu conexión.';
            setError(errorMsg);
            toast.error(errorMsg);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []); // Cargar una sola vez al inicio

    // Filtrar todos por búsqueda y por estado del filtro
    const filteredTodos = todos.filter((todo) => {
        const matchesSearch = !searchQuery.trim() || todo.title.toLowerCase().includes(searchQuery.toLowerCase().trim());
        const matchesFilter = filter === 'all' || (filter === 'active' ? !todo.completed : todo.completed);
        return matchesSearch && matchesFilter;
    });


    // Crear todo
    const handleAddTodo = async (title: string) => {
        try {
            const newTodo = await todoApi.createTodo(title);
            setTodos((prev) => [newTodo, ...prev]);
            toast.success('Tarea creada correctamente');
        } catch (err) {
            toast.error('Error al crear la tarea');
            console.error(err);
        }
    };

    // Toggle completado (con optimistic update)
    const handleToggleTodo = async (id: string, completed: boolean) => {
        // Optimistic update
        setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed } : todo)));

        try {
            await todoApi.updateTodo(id, { completed });
            completed ? toast.success('Tarea completada') : toast.info('Tarea marcada como pendiente');
        } catch (err) {
            // Revert on error
            setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: !completed } : todo)));
            toast.error('Error al actualizar la tarea');
            console.error(err);
        }
    };

    // Actualizar título (con optimistic update)
    const handleUpdateTodo = async (id: string, title: string) => {
        const originalTodo = todos.find((t) => t.id === id);

        // Optimistic update
        setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, title } : todo)));

        try {
            await todoApi.updateTodo(id, { title });
            toast.success('Tarea actualizada');
        } catch (err) {
            // Revert on error
            if (originalTodo) {
                setTodos((prev) => prev.map((todo) => (todo.id === id ? originalTodo : todo)));
            }
            toast.error('Error al actualizar la tarea');
            console.error(err);
        }
    };

    // Eliminar todo (con optimistic update)
    const handleDeleteTodo = async (id: string) => {
        const deletedTodo = todos.find((t) => t.id === id);

        // Optimistic update
        setTodos((prev) => prev.filter((todo) => todo.id !== id));

        try {
            await todoApi.deleteTodo(id);
            toast.success('Tarea eliminada');
        } catch (err) {
            // Revert on error
            if (deletedTodo) {
                setTodos((prev) => [deletedTodo, ...prev]);
            }
            toast.error('Error al eliminar la tarea');
            console.error(err);
        }
    };

    const activeTodosCount = todos.filter((todo) => !todo.completed).length;
    const completedTodosCount = todos.filter((todo) => todo.completed).length;

    return (
        <SidebarProvider>
            <AppSidebar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filter={filter}
                onFilterChange={setFilter}
                activeCount={activeTodosCount}
                completedCount={completedTodosCount}
                loading={loading}
            />
            <SidebarInset className="bg-background">
                {/* Canvas Principal */}
                <div className="flex flex-col h-full items-center">
                    {/* Header para móvil/colapsado */}
                    <header className="flex h-16 shrink-0 items-center justify-between px-4 w-full border-b md:border-transparent">
                        <SidebarTrigger className="-ml-1" />
                        <div className="md:hidden font-bold text-lg">Focuspan</div>
                        <div className="w-9 h-9" /> {/* Spacer */}
                    </header>

                    <main className="flex-1 w-full max-w-8xl p-6 md:px-12 space-y-8 animate-in fade-in duration-300 overflow-y-hidden">
                        {/* Input Area */}
                        <div className="space-y-4">
                            <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">
                                {filter === 'all' && 'Mis Tareas'}
                                {filter === 'active' && 'Tareas Pendientes'}
                                {filter === 'completed' && 'Tareas Completadas'}
                            </h1>
                            <p className="text-muted-foreground">
                                {filter === 'all' && 'Gestiona tus actividades diarias con simplicidad.'}
                                {filter === 'active' && `Tienes ${activeTodosCount} ${activeTodosCount === 1 ? 'tarea pendiente' : 'tareas pendientes'}.`}
                                {filter === 'completed' && `Has completado ${completedTodosCount} ${completedTodosCount === 1 ? 'tarea' : 'tareas'}. ¡Buen trabajo!`}
                            </p>
                            <TodoInput onAdd={handleAddTodo} disabled={loading} />
                        </div>

                        {/* Error State */}
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

                        {/* List Area */}
                        <div className="relative min-h-100">
                            {loading && <TodoSkeletonList />}

                            {!loading && filteredTodos.length === 0 && (
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

                            {!loading && filteredTodos.length > 0 && (
                                <div className="space-y-4">
                                    {searchQuery && (
                                        <p className="text-sm text-muted-foreground text-center mb-4">
                                            Mostrando {filteredTodos.length} de {todos.length} {todos.length === 1 ? 'resultado' : 'resultados'}
                                        </p>
                                    )}
                                    <AnimatedTodoList todos={filteredTodos} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} onUpdate={handleUpdateTodo} />
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
