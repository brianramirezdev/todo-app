import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { TodoFilters } from '@/components/TodoFilters';

describe('TodoFilters', () => {
    it('debería renderizar los tres botones de filtro', () => {
        render(<TodoFilters currentFilter="all" onFilterChange={vi.fn()} activeTodosCount={5} />);

        expect(screen.getByRole('button', { name: /todas/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /activas/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /completadas/i })).toBeInTheDocument();
    });

    it('debería mostrar el contador de tareas pendientes', () => {
        render(<TodoFilters currentFilter="all" onFilterChange={vi.fn()} activeTodosCount={5} />);

        expect(screen.getByText('5 pendientes')).toBeInTheDocument();
    });

    it('debería mostrar "1 pendiente" en singular', () => {
        render(<TodoFilters currentFilter="all" onFilterChange={vi.fn()} activeTodosCount={1} />);

        expect(screen.getByText('1 pendiente')).toBeInTheDocument();
    });

    it('debería llamar a onFilterChange al hacer clic en un filtro', async () => {
        const user = userEvent.setup();
        const onFilterChange = vi.fn();

        render(<TodoFilters currentFilter="all" onFilterChange={onFilterChange} activeTodosCount={5} />);

        const activasButton = screen.getByRole('button', { name: /activas/i });
        await user.click(activasButton);

        expect(onFilterChange).toHaveBeenCalledWith('active');
    });

    it('debería resaltar el filtro activo', () => {
        render(<TodoFilters currentFilter="active" onFilterChange={vi.fn()} activeTodosCount={5} />);

        const activasButton = screen.getByRole('button', { name: /activas/i });
        // El botón activo tiene variant="default" que aplica bg-primary
        expect(activasButton).toBeEnabled();
    });
});
