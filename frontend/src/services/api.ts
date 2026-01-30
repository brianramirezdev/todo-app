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
    type: 'task' | 'note';
    createdAt: string;
    updatedAt: string;
}

export type TodoStatus = 'all' | 'active' | 'completed';

export interface PaginationParams {
    status?: TodoStatus;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    search?: string;
}

export interface PaginatedTodoResponse {
    data: Todo[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        counts: {
            all: number;
            active: number;
            completed: number;
        };
    };
}


export const todoApi = {
    // GET /api/todos
    getTodos: async (params: PaginationParams = {}): Promise<PaginatedTodoResponse> => {
        const { status = 'all', page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', search = '' } = params;
        const response = await api.get<PaginatedTodoResponse>(`/todos`, {
            params: { status, page, limit, sortBy, sortOrder, search }
        });
        return response.data;
    },

    // POST /api/todos
    createTodo: async (title: string, type: 'task' | 'note' = 'task'): Promise<Todo> => {
        // await delay(800);
        const response = await api.post<Todo>('/todos', { title, type });
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
