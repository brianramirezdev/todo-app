import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { TodoStatus } from '@/services/api';

interface TodoFiltersProps {
    currentFilter: TodoStatus;
    onFilterChange: (filter: TodoStatus) => void;
    activeTodosCount: number;
    completedTodosCount: number;
}

export function TodoFilters({ currentFilter, onFilterChange, activeTodosCount, completedTodosCount }: TodoFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2">
            <div className="flex gap-2 flex-wrap">
                <Button variant={currentFilter === 'all' ? 'default' : 'outline'} onClick={() => onFilterChange('all')} size="sm" className="border border-transparent">
                    Todas
                </Button>
                <Button variant={currentFilter === 'active' ? 'default' : 'outline'} onClick={() => onFilterChange('active')} size="sm" className="border border-transparent">
                    Activas
                </Button>
                <Button variant={currentFilter === 'completed' ? 'default' : 'outline'} onClick={() => onFilterChange('completed')} size="sm" className="border border-transparent">
                    Completadas
                </Button>
            </div>
            {currentFilter === 'all' ? (
                <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary" className={`text-xs sm:text-sm`}>
                        {activeTodosCount} {activeTodosCount === 1 ? 'pendiente' : 'pendientes'}
                    </Badge>
                    <Badge variant="secondary" className={`text-xs sm:text-sm`}>
                        {completedTodosCount} {completedTodosCount === 1 ? 'completada' : 'completadas'}
                    </Badge>
                </div>
            ) : (
                <Badge variant="secondary" className={`text-xs sm:text-sm`}>
                    {currentFilter === 'completed' ? completedTodosCount + ' completadas' : activeTodosCount + ' pendientes'}
                </Badge>
            )}
        </div>
    );
}
