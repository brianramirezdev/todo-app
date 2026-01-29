import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { TodoSearch } from '@/components/TodoSearch';

describe('TodoSearch', () => {
    it('debería renderizar el input de búsqueda', () => {
        render(<TodoSearch value="" onChange={vi.fn()} />);

        expect(screen.getByPlaceholderText('Buscar tareas...')).toBeInTheDocument();
    });

    it('debería llamar a onChange al escribir', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<TodoSearch value="" onChange={onChange} />);

        const input = screen.getByPlaceholderText('Buscar tareas...');
        await user.type(input, 'test');

        expect(onChange).toHaveBeenCalledTimes(4); // Una vez por cada letra
    });

    it('debería mostrar botón de limpiar cuando hay texto', () => {
        render(<TodoSearch value="test" onChange={vi.fn()} />);

        const clearButton = screen.getByRole('button');
        expect(clearButton).toBeInTheDocument();
    });

    it('no debería mostrar botón de limpiar cuando está vacío', () => {
        render(<TodoSearch value="" onChange={vi.fn()} />);

        const clearButton = screen.queryByRole('button');
        expect(clearButton).not.toBeInTheDocument();
    });

    it('debería limpiar el input al hacer clic en el botón', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<TodoSearch value="test" onChange={onChange} />);

        const clearButton = screen.getByRole('button');
        await user.click(clearButton);

        expect(onChange).toHaveBeenCalledWith('');
    });
});
