import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
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
            <ScrollArea className="h-96 pr-6 py-2">
                <div className="space-y-3 mb-0.5">
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
            </ScrollArea>
        </AnimatePresence>
    );
}
