import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { TodoItem } from '@/components/TodoItem';
import type { Todo } from '@/services/api';

const mockTodo: Todo = {
    id: '1',
    title: 'Tarea de prueba',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

describe('TodoItem', () => {
    it('debería renderizar la tarea', () => {
        render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} onUpdate={vi.fn()} />);

        expect(screen.getByText('Tarea de prueba')).toBeInTheDocument();
    });

    it('debería llamar a onToggle cuando se marca el checkbox', async () => {
        const user = userEvent.setup();
        const onToggle = vi.fn();

        render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={vi.fn()} onUpdate={vi.fn()} />);

        const checkbox = screen.getByRole('checkbox');
        await user.click(checkbox);

        expect(onToggle).toHaveBeenCalledWith('1', true);
    });

    it('debería mostrar la tarea tachada cuando está completada', () => {
        const completedTodo = { ...mockTodo, completed: true };

        render(<TodoItem todo={completedTodo} onToggle={vi.fn()} onDelete={vi.fn()} onUpdate={vi.fn()} />);

        const title = screen.getByText('Tarea de prueba');
        expect(title).toHaveClass('line-through');
    });

    it('debería entrar en modo edición al hacer clic en editar', async () => {
        const user = userEvent.setup();

        render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} onUpdate={vi.fn()} />);

        // Obtener todos los botones y seleccionar el de editar (primer botón después del checkbox)
        const buttons = screen.getAllByRole('button');
        const editButton = buttons[0]; // Botón de editar
        await user.click(editButton);

        expect(screen.getByDisplayValue('Tarea de prueba')).toBeInTheDocument();
    });

    it('debería llamar a onUpdate cuando se guarda la edición', async () => {
        const user = userEvent.setup();
        const onUpdate = vi.fn();

        render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} onUpdate={onUpdate} />);

        // Entrar en modo edición
        const editButton = screen.getAllByRole('button')[0];
        await user.click(editButton);

        const input = screen.getByRole('textbox');
        await user.clear(input);
        await user.type(input, 'Tarea modificada');

        // Guardar
        const saveButton = screen.getAllByRole('button')[0];
        await user.click(saveButton);

        expect(onUpdate).toHaveBeenCalledTimes(1);
        expect(onUpdate).toHaveBeenCalledWith('1', 'Tarea modificada');
    });

    it('debería mostrar dialog de confirmación al eliminar', async () => {
        const user = userEvent.setup();

        render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} onUpdate={vi.fn()} />);

        // Obtener el botón de eliminar (segundo botón después del checkbox)
        const buttons = screen.getAllByRole('button');
        const deleteButton = buttons[1]; // Botón de eliminar

        await user.click(deleteButton);

        const dialog = screen.getByRole('alertdialog');

        expect(within(dialog).getByText(/¿estás seguro?/i)).toBeInTheDocument();
        expect(within(dialog).getByText(/tarea de prueba/i)).toBeInTheDocument();
    });
});
