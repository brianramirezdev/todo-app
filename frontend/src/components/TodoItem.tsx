import type { Todo } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

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
            <Card className="p-4 transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center gap-3">
                    <Checkbox checked={todo.completed} onCheckedChange={(checked) => onToggle(todo.id, checked as boolean)} disabled={isEditing} className="transition-transform" />

                    {isEditing ? (
                        <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSave();
                                if (e.key === 'Escape') handleCancel();
                            }}
                            className="flex-1"
                            autoFocus
                            maxLength={255}
                        />
                    ) : (
                        <span className={`flex-1 transition-all duration-200 truncate ${todo.completed ? 'line-through text-muted-foreground opacity-60' : 'text-foreground'}`}>
                            {todo.title}
                        </span>
                    )}

                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                <Button size="icon" variant="ghost" onClick={handleSave} className="transition-transform  hover:bg-green-100 dark:hover:bg-green-900">
                                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={handleCancel} className="transition-transform hover:bg-red-100 dark:hover:bg-red-900">
                                    <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)} disabled={todo.completed} className="transition-transform">
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={handleDeleteClick} className="transition-transform  hover:bg-red-100 dark:hover:bg-red-900">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </Card>

            <DeleteConfirmDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleConfirmDelete} todoTitle={todo.title} />
        </>
    );
}
