import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

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

        if (error && value.trim()) {
            setError('');
        }
    };

    return (
        <div className="space-y-3 w-full animate-in fade-in duration-200">
            <form onSubmit={handleSubmit} className="flex gap-3">
                <div className="flex-1">
                    <Input
                        value={title}
                        onChange={handleChange}
                        placeholder="¿Qué necesitas hacer hoy?"
                        disabled={disabled}
                        maxLength={255}
                        className={cn(
                            'h-12 px-5 text-base w-full shadow-sm transition-all focus-visible:ring-primary/20',
                            error ? 'border-destructive focus-visible:ring-destructive/20' : 'border-border',
                        )}
                    />
                </div>

                <Button type="submit" disabled={disabled || !title.trim()} className="size-12 px-6 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <Plus className="h-5 w-5" />
                </Button>
            </form>

            <div className="flex items-center justify-between px-1">
                {error ? (
                    <p className="text-sm text-destructive font-medium animate-in fade-in slide-in-from-left-1">{error}</p>
                ) : (
                    <p className="text-xs text-muted-foreground transition-opacity duration-300">
                        Presiona{' '}
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground italic">
                            Enter
                        </kbd>{' '}
                        para añadir rápidamente
                    </p>
                )}

                <span className={cn('text-xs transition-colors', title.length > 240 ? 'text-warning' : 'text-muted-foreground/60')}>{title.length}/255</span>
            </div>
        </div>
    );
}
