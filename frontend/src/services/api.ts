import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper para simular delay (solo para desarrollo)
// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface Todo {
    id: string;
    title: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

export type TodoStatus = 'all' | 'active' | 'completed';

export const todoApi = {
    // GET /api/todos?status=all|active|completed
    getTodos: async (status: TodoStatus = 'all'): Promise<Todo[]> => {
        // await delay(1500); // Simula 1.5 segundos de carga
        const response = await api.get<Todo[]>(`/todos?status=${status}`);
        return response.data;
    },

    // POST /api/todos
    createTodo: async (title: string): Promise<Todo> => {
        // await delay(800);
        const response = await api.post<Todo>('/todos', { title });
        return response.data;
    },

    // PATCH /api/todos/:id
    updateTodo: async (id: string, updates: { title?: string; completed?: boolean }): Promise<Todo> => {
        // await delay(500);
        const response = await api.patch<Todo>(`/todos/${id}`, updates);
        return response.data;
    },

    // DELETE /api/todos/:id
    deleteTodo: async (id: string): Promise<void> => {
        // await delay(500);
        await api.delete(`/todos/${id}`);
    },
};
