import { motion, AnimatePresence } from 'framer-motion';
import { TodoItem } from '@/components/TodoItem';

import type { Todo } from '@/services/api';

interface AnimatedTodoListProps {
    todos: Todo[];
    onToggle: (id: string, completed: boolean) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, title: string) => void;
}

export function AnimatedTodoList({ todos, onToggle, onDelete, onUpdate }: AnimatedTodoListProps) {
    return (
        <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
                {todos.map((todo) => (
                    <motion.div
                        key={todo.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        layout
                        className="h-full"
                    >
                        <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} onUpdate={onUpdate} />
                    </motion.div>
                ))}
            </div>
        </AnimatePresence>
    );
}
