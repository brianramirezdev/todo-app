import type { Todo } from '@/services/api';
import { cn, formatRelativeDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Trash2, Edit2, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string, completed: boolean) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, title: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(todo.title);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSave = () => {
        if (editTitle.trim() && editTitle !== todo.title) {
            onUpdate(todo.id, editTitle.trim());
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditTitle(todo.title);
        setIsEditing(false);
    };

    const isNote = todo.type === 'note';
    const isLongNote = isNote && todo.title.length > 120;

    return (
        <>
            <Card
                className={cn(
                    'group transition-all h-full duration-300 border py-0 flex flex-col relative overflow-hidden',
                    todo.completed && !isNote ? 'bg-muted/50 border-transparent shadow-none' : 'hover:shadow-md border-border shadow-sm hover:border-primary/50 bg-background',
                    isNote && 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50',
                )}
            >
                <div className="p-5 flex flex-col h-full min-h-44 gap-4">
                    {/* Header: Date and Tags */}
                    <div className="flex items-center justify-between text-[9px] font-black tracking-widest uppercase">
                        <div className="flex items-center gap-2 opacity-40 group-hover:opacity-60 transition-opacity h-8">
                            <span className="leading-none text-primary bg-primary/10 rounded-full px-2 py-1">{formatRelativeDate(todo.createdAt)}</span>
                        </div>

                        {!isEditing && (
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setIsEditing(true)}
                                    disabled={todo.completed && !isNote}
                                    aria-label="Editar tarea"
                                    className={cn(
                                        'h-6 w-6 text-muted-foreground transition-colors',
                                        isNote ? 'hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10' : 'hover:text-primary hover:bg-primary/10',
                                    )}
                                >
                                    <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setShowDeleteDialog(true)}
                                    aria-label="Eliminar tarea"
                                    className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        {isEditing ? (
                            <div className="space-y-4">
                                <Input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSave();
                                        if (e.key === 'Escape') handleCancel();
                                    }}
                                    className={cn(
                                        'w-full bg-background/50',
                                        isNote
                                            ? 'border-amber-500/30 focus-visible:border-amber-500/60 focus-visible:ring-amber-500/40'
                                            : 'border-primary/20 focus-visible:border-primary/50 focus-visible:ring-primary/40',
                                    )}
                                    autoFocus
                                    maxLength={255}
                                />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <p
                                    className={cn(
                                        'text-sm leading-relaxed whitespace-pre-wrap transition-all duration-300',
                                        todo.completed && !isNote ? 'line-through text-muted-foreground/70 font-normal' : 'text-foreground/90 font-medium',
                                        isNote && !isExpanded && 'line-clamp-4',
                                        isNote && 'text-amber-950/90 dark:text-amber-100/90 font-normal',
                                    )}
                                >
                                    {todo.title}
                                </p>

                                {isLongNote && (
                                    <button
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className="text-[10px] font-bold uppercase text-amber-600/70 hover:text-amber-700 dark:text-amber-400/50 flex items-center gap-1 transition-colors"
                                    >
                                        {isExpanded ? (
                                            <>
                                                <ChevronUp className="h-3 w-3" /> Ver menos
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown className="h-3 w-3" /> Continuar leyendo
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {!isEditing && !isNote && (
                        <div className="flex items-center pt-1">
                            <Checkbox
                                id={`todo-${todo.id}`}
                                checked={todo.completed}
                                onCheckedChange={(checked) => onToggle(todo.id, checked as boolean)}
                                disabled={isEditing}
                                className="h-4 w-4 transition-all text-primary data-[state=checked]:bg-primary/60 data-[state=checked]:border-transparent rounded ml-auto"
                                aria-label={todo.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
                            />
                        </div>
                    )}
                    {isEditing && (
                        <div className="flex justify-end gap-1">
                            <Button size="sm" variant="ghost" onClick={handleCancel} className="h-7 text-xs leading-none">
                                Cancelar
                            </Button>
                            <Button size="sm" onClick={handleSave} aria-label="Guardar cambios" className="h-7 text-xs px-3 leading-none">
                                <Check className="h-3 w-3" />
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            <DeleteConfirmDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={() => onDelete(todo.id)} todoTitle={todo.title} />
        </>
    );
}
