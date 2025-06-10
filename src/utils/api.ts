import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data
      Cookies.remove('token');
      Cookies.remove('user');
      // Redirect to login page
      window.location.href = '/';
      return Promise.reject(new Error('Session expired. Please login again.'));
    }

    const errorMessage = error.response?.data?.message || 'An error occurred';
    const customError = new Error(errorMessage);
    (customError as any).status = error.response?.status;
    return Promise.reject(customError);
  }
);

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
}

export interface TasksResponse {
  tasks: Task[];
  currentPage: number;
  totalPages: number;
  totalTasks: number;
}

interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    const { token, user } = response.data;
    Cookies.set('token', token, { expires: 7 }); // Expires in 7 days
    Cookies.set('user', JSON.stringify(user), { expires: 7 });
    return response.data;
  },
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    const { token, user } = response.data;
    Cookies.set('token', token, { expires: 7 }); // Expires in 7 days
    Cookies.set('user', JSON.stringify(user), { expires: 7 });
    return response.data;
  },
  logout: () => {
    Cookies.remove('token');
    Cookies.remove('user');
  },
  getCurrentUser: (): User | null => {
    const userStr = Cookies.get('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  isAuthenticated: (): boolean => {
    return !!Cookies.get('token');
  },
};

export const taskService = {
  getTasks: async (page: number = 1, limit: number = 10, search?: string): Promise<TasksResponse> => {
    const response = await api.get<TasksResponse>('/tasks', {
      params: { page, limit, search },
    });
    return response.data;
  },
  createTask: async (data: CreateTaskData): Promise<Task> => {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },
  updateTask: async (id: string, data: Partial<Task>): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${id}`, data);
    return response.data;
  },
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};
