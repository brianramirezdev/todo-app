import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { TodoInput } from '@/components/TodoInput';

describe('TodoInput', () => {
    it('debería renderizar el input con placeholder de tarea por defecto', () => {
        render(<TodoInput onAdd={vi.fn()} />);

        expect(screen.getByPlaceholderText('Añadir una tarea...')).toBeInTheDocument();
    });

    it('debería cambiar el placeholder al seleccionar tipo nota', async () => {
        const user = userEvent.setup();
        render(<TodoInput onAdd={vi.fn()} />);

        // Abrir el dropdown (primer botón)
        const typeButtons = screen.getAllByRole('button');
        await user.click(typeButtons[0]);

        // Seleccionar "Nota"
        const noteOption = screen.getByText('Nota');
        await user.click(noteOption);

        expect(screen.getByPlaceholderText('Escribir una nota...')).toBeInTheDocument();
    });

    it('debería llamar a onAdd con el tipo correcto (task)', async () => {
        const user = userEvent.setup();
        const onAdd = vi.fn();

        render(<TodoInput onAdd={onAdd} />);

        const input = screen.getByPlaceholderText('Añadir una tarea...');
        await user.type(input, 'Nueva tarea');

        // Submit con Enter
        await user.keyboard('{Enter}');

        expect(onAdd).toHaveBeenCalledWith('Nueva tarea', 'task');
        expect(input).toHaveValue('');
    });

    it('debería llamar a onAdd con el tipo correcto (note)', async () => {
        const user = userEvent.setup();
        const onAdd = vi.fn();

        render(<TodoInput onAdd={onAdd} />);

        // Cambiar a nota
        const typeButtons = screen.getAllByRole('button');
        await user.click(typeButtons[0]);
        await user.click(screen.getByText('Nota'));

        const input = screen.getByPlaceholderText('Escribir una nota...');
        await user.type(input, 'Esto es una nota');

        // Submit con Enter
        await user.keyboard('{Enter}');

        expect(onAdd).toHaveBeenCalledWith('Esto es una nota', 'note');
    });

    it('debería deshabilitar el botón de submit cuando disabled es true', () => {
        render(<TodoInput onAdd={vi.fn()} disabled />);

        // El input NO está deshabilitado
        expect(screen.getByRole('textbox')).not.toBeDisabled();

        // El botón de submit (el segundo botón en el comp) SÍ está deshabilitado
        const buttons = screen.getAllByRole('button');
        const submitBtn = buttons[buttons.length - 1];
        expect(submitBtn).toBeDisabled();
    });

    it('debería mostrar contador solo cuando hay mucho texto (>200)', async () => {
        const user = userEvent.setup();
        render(<TodoInput onAdd={vi.fn()} />);

        // Al inicio no debe haber contador
        expect(screen.queryByText(/255/)).not.toBeInTheDocument();

        const input = screen.getByRole('textbox');

        // Escribir texto largo (>200 caracteres)
        const longText = 'a'.repeat(201);
        await user.type(input, longText);

        // Ahora sí debe aparecer el contador
        expect(screen.getByText('201/255')).toBeInTheDocument();
    });

    it('no debería enviar tarea vacía', async () => {
        const user = userEvent.setup();
        const onAdd = vi.fn();

        render(<TodoInput onAdd={onAdd} />);

        // Intentar enviar vacío
        await user.keyboard('{Enter}');

        expect(onAdd).not.toHaveBeenCalled();
    });
});
