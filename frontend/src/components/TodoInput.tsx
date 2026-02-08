import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, ListTodo, StickyNote } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TodoInputProps {
    onAdd: (title: string, type: 'task' | 'note') => void;
    disabled?: boolean;
}

export function TodoInput({ onAdd, disabled }: TodoInputProps) {
    const [title, setTitle] = useState('');
    const [type, setType] = useState<'task' | 'note'>('task');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title.trim()) return;

        onAdd(title.trim(), type);
        setTitle('');
        setError('');
    };

    return (
        <div className="w-full group/input animate-in fade-in slide-in-from-top-2 duration-500">
            <form onSubmit={handleSubmit} className="relative flex items-center">
                <div className="absolute left-3 z-10 flex items-center gap-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-muted"
                                disabled={disabled}
                            >
                                {type === 'task' ? (
                                    <ListTodo className="h-4 w-4 text-primary" />
                                ) : (
                                    <StickyNote className="h-4 w-4 text-amber-500" />
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-40">
                            <DropdownMenuItem onClick={() => setType('task')} className="gap-2 cursor-pointer">
                                <ListTodo className="h-4 w-4" />
                                <span>Tarea</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setType('note')} className="gap-2 cursor-pointer">
                                <StickyNote className="h-4 w-4" />
                                <span>Nota</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={type === 'task' ? "Añadir una tarea..." : "Escribir una nota..."}
                    maxLength={255}
                    className={cn(
                        'h-11 pl-12 pr-12 text-base w-full bg-muted/30 border-transparent transition-all rounded-xl',
                        'hover:bg-muted/50 focus:bg-background focus:border-primary/20 focus:ring-0 shadow-none',
                        error && 'border-destructive/50'
                    )}
                />

                <div className="absolute right-1.5 flex items-center">
                    <Button
                        type="submit"
                        disabled={disabled || !title.trim()}
                        size="icon"
                        className={cn(
                            "h-8 w-8 rounded-lg transition-all transform scale-90 opacity-0 group-focus-within/input:opacity-100 group-focus-within/input:scale-100",
                            type === 'task' ? "bg-primary" : "bg-amber-500 hover:bg-amber-600"
                        )}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </form>

            {title.length > 200 && (
                <div className="flex justify-end px-2 pt-1">
                    <span className={cn('text-[10px] font-medium transition-colors', title.length > 240 ? 'text-destructive' : 'text-muted-foreground/40')}>
                        {title.length}/255
                    </span>
                </div>
            )}
        </div>
    );
}
