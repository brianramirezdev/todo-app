import type { Todo } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Trash2, Edit2, Check, X } from 'lucide-react';
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

    const handleDeleteClick = () => {
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = () => {
        onDelete(todo.id);
        setShowDeleteDialog(false);
    };

    return (
        <>
            <Card className="group transition-all hover:shadow-lg animate-in fade-in duration-200 border-muted/50 hover:border-primary/20 py-0 min-h-[140px] flex flex-col">
                <div className="p-4 flex flex-col h-full gap-3">
                    <div className="flex-1 min-w-0">
                        {isEditing ? (
                            <Input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSave();
                                    if (e.key === 'Escape') handleCancel();
                                }}
                                className="w-full"
                                autoFocus
                                maxLength={255}
                            />
                        ) : (
                            <p
                                className={`text-base font-medium leading-relaxed wrap-break-word transition-all duration-300 ${
                                    todo.completed ? 'line-through text-muted-foreground/60' : 'text-foreground'
                                }`}
                            >
                                {todo.title}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-muted/90">
                        <div className="flex items-center gap-1">
                            <Checkbox
                                id={`todo-${todo.id}`}
                                checked={todo.completed}
                                onCheckedChange={(checked) => onToggle(todo.id, checked as boolean)}
                                disabled={isEditing}
                                className="h-5 w-5 transition-all data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <label htmlFor={`todo-${todo.id}`} className="sr-only">
                                Marcar como completada
                            </label>
                        </div>

                        <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            {isEditing ? (
                                <>
                                    <Button size="icon" variant="ghost" onClick={handleSave} className="h-8 w-8 text-primary hover:bg-primary/10">
                                        <Check className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" onClick={handleCancel} className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setIsEditing(true)}
                                        disabled={todo.completed}
                                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={handleDeleteClick}
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Card>

            <DeleteConfirmDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleConfirmDelete} todoTitle={todo.title} />
        </>
    );
}
