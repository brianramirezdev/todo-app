import { motion, AnimatePresence } from 'framer-motion';
import { TodoItem } from './TodoItem';
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
            <div className="space-y-2">
                {todos.map((todo, index) => (
                    <motion.div
                        key={todo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        layout
                    >
                        <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} onUpdate={onUpdate} />
                    </motion.div>
                ))}
            </div>
        </AnimatePresence>
    );
}
