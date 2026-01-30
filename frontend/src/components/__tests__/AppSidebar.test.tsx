import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { AppSidebar } from '@/components/AppSidebar';

describe('AppSidebar', () => {
    const defaultProps = {
        searchQuery: '',
        onSearchChange: vi.fn(),
        filter: 'all' as const,
        onFilterChange: vi.fn(),
        activeCount: 5,
        completedCount: 3,
        loading: false,
        isDevMode: false,
        onDevModeChange: vi.fn(),
    };

    it('debería renderizar los elementos principales', () => {
        render(<AppSidebar {...defaultProps} />);

        expect(screen.getByText('Focuspan')).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument();
        expect(screen.getByText('Todas')).toBeInTheDocument(); // ✅ Cambiado
        expect(screen.getByText('Activas')).toBeInTheDocument();
        expect(screen.getByText('Completadas')).toBeInTheDocument();
    });

    it('debería llamar a onSearchChange al escribir en el buscador', async () => {
        const user = userEvent.setup();
        const onSearchChange = vi.fn();
        render(<AppSidebar {...defaultProps} onSearchChange={onSearchChange} />);

        const input = screen.getByPlaceholderText(/buscar/i);
        await user.type(input, 'test');

        expect(onSearchChange).toHaveBeenCalled();
    });

    it('debería llamar a onFilterChange al seleccionar un filtro', async () => {
        const user = userEvent.setup();
        const onFilterChange = vi.fn();
        render(<AppSidebar {...defaultProps} onFilterChange={onFilterChange} />);

        const activeFilter = screen.getByText('Activas');
        await user.click(activeFilter);

        expect(onFilterChange).toHaveBeenCalledWith('active');
    });

    it('debería mostrar los contadores correctamente', () => {
        render(<AppSidebar {...defaultProps} activeCount={10} completedCount={2} />);

        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('12')).toBeInTheDocument(); // Total (10 + 2)
    });
});
