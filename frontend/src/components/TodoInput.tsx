import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TodoInputProps {
    onAdd: (title: string) => void;
    disabled?: boolean;
}

export function TodoInput({ onAdd, disabled }: TodoInputProps) {
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');

    const validateTitle = (value: string): boolean => {
        if (!value.trim()) {
            setError('El título no puede estar vacío');
            return false;
        }
        if (value.length > 255) {
            setError('El título no puede superar 255 caracteres');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateTitle(title)) {
            onAdd(title.trim());
            setTitle('');
            setError('');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTitle(value);

        // Limpiar error mientras escribe
        if (error && value.trim()) {
            setError('');
        }
    };

    return (
        <div className="space-y-2">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="flex-1">
                    <Input
                        value={title}
                        onChange={handleChange}
                        placeholder="¿Qué necesitas hacer?"
                        disabled={disabled}
                        maxLength={255}
                        className={error ? 'border-destructive focus-visible:ring-destructive' : ''}
                    />
                </div>
                <Button type="submit" disabled={disabled || !title.trim()}>
                    <Plus className="h-4 w-4" />
                </Button>
            </form>

            {error && <p className="text-sm text-destructive animate-in fade-in slide-in-from-top-1">{error}</p>}

            <p className="text-xs text-muted-foreground">{title.length}/255 caracteres</p>
        </div>
    );
}
