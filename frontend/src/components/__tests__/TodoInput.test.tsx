import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { TodoInput } from '@/components/TodoInput';

describe('TodoInput', () => {
    it('debería renderizar el input y el botón', () => {
        render(<TodoInput onAdd={vi.fn()} />);

        expect(screen.getByPlaceholderText('¿Qué necesitas hacer?')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('debería llamar a onAdd cuando se envía el formulario', async () => {
        const user = userEvent.setup();
        const onAdd = vi.fn();

        render(<TodoInput onAdd={onAdd} />);

        const input = screen.getByPlaceholderText('¿Qué necesitas hacer?');
        const button = screen.getByRole('button');

        await user.type(input, 'Nueva tarea');
        await user.click(button);

        expect(onAdd).toHaveBeenCalledWith('Nueva tarea');
        expect(input).toHaveValue('');
    });

    it('debería deshabilitar el botón cuando disabled es true', () => {
        render(<TodoInput onAdd={vi.fn()} disabled />);

        const input = screen.getByPlaceholderText('¿Qué necesitas hacer?');
        const button = screen.getByRole('button');

        expect(input).toBeDisabled();
        expect(button).toBeDisabled();
    });

    it('debería mostrar contador de caracteres', () => {
        render(<TodoInput onAdd={vi.fn()} />);

        expect(screen.getByText('0/255 caracteres')).toBeInTheDocument();
    });

    it('debería actualizar contador al escribir', async () => {
        const user = userEvent.setup();
        render(<TodoInput onAdd={vi.fn()} />);

        const input = screen.getByPlaceholderText('¿Qué necesitas hacer?');
        await user.type(input, 'Test');

        expect(screen.getByText('4/255 caracteres')).toBeInTheDocument();
    });
});
