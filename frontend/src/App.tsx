import { useEffect, useState } from 'react';
import type { Todo, TodoStatus } from './services/api';
import { todoApi } from './services/api';
import { TodoInput } from './components/TodoInput';
import { TodoFilters } from './components/TodoFilters';
import { TodoSearch } from './components/TodoSearch';
import { TodoSkeletonList } from './components/TodoSkeleton';
import { Card } from './components/ui/card';
import { CheckSquare, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './components/ui/button';
import { AnimatedTodoList } from './components/AnimatedTodoList';

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
            const data = await todoApi.getTodos(filter);
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
    }, [filter]);

    // Filtrar todos por búsqueda
    const filteredTodos = searchQuery.trim() ? todos.filter((todo) => todo.title.toLowerCase().includes(searchQuery.toLowerCase().trim())) : todos;

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
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <div className="container max-w-3xl mx-auto py-12 px-4">
                {/* Header */}
                <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-500">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <CheckSquare className="h-8 w-8 text-primary" />
                        <h1 className="text-4xl font-bold">Todo App</h1>
                    </div>
                    <p className="text-muted-foreground">Organiza tus tareas de forma simple y efectiva</p>
                </div>

                {/* Main Card */}
                <Card className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom duration-500 h-[80vh]">
                    {/* Input */}
                    <TodoInput onAdd={handleAddTodo} disabled={loading} />

                    {/* Search */}
                    <TodoSearch value={searchQuery} onChange={setSearchQuery} disabled={loading} />

                    {/* Filters */}
                    <TodoFilters currentFilter={filter} onFilterChange={setFilter} activeTodosCount={activeTodosCount} completedTodosCount={completedTodosCount} />

                    {/* Error State con botón de retry */}
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

                    {/* Loading Skeletons */}
                    {loading && <TodoSkeletonList />}

                    {/* Empty State */}
                    {!loading && filteredTodos.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground animate-in fade-in zoom-in duration-300">
                            <CheckSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium mb-2">{searchQuery ? 'No se encontraron tareas' : 'No hay tareas'}</p>
                            <p className="text-sm">
                                {searchQuery && `No hay resultados para "${searchQuery}"`}
                                {!searchQuery && filter === 'active' && 'No tienes tareas pendientes'}
                                {!searchQuery && filter === 'completed' && 'No has completado ninguna tarea'}
                                {!searchQuery && filter === 'all' && 'Añade tu primera tarea para comenzar'}
                            </p>
                        </div>
                    )}

                    {/* Todo List */}
                    {!loading && filteredTodos.length > 0 && (
                        <AnimatedTodoList todos={filteredTodos} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} onUpdate={handleUpdateTodo} />
                    )}

                    {/* Search Results Count */}
                    {!loading && searchQuery && filteredTodos.length > 0 && (
                        <div className="text-center text-sm text-muted-foreground">
                            Mostrando {filteredTodos.length} de {todos.length} {todos.length === 1 ? 'tarea' : 'tareas'}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}

export default App;
