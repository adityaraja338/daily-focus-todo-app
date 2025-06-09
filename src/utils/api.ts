import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Update this to your backend URL

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
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

export interface TaskData {
  title: string;
  description?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface GetTasksParams {
  page?: number;
  limit?: number;
}

interface TasksResponse {
  tasks: Array<{
    _id: string;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: string;
  }>;
  currentPage: number;
  totalPages: number;
  totalTasks: number;
}

// Authentication APIs
export const registerUser = async (userData: RegisterData) => {
  return api.post('/auth/register', userData);
};

export const loginUser = async (loginData: LoginData) => {
  return api.post('/auth/login', loginData);
};

// Task APIs
export const getTasks = async (params: GetTasksParams = {}): Promise<TasksResponse> => {
  const { page = 1, limit = 10 } = params;
  const response = await api.get<TasksResponse>('/tasks', { params: { page, limit } });
  return response.data;
};

export const createTask = async (taskData: TaskData) => {
  return api.post('/tasks', taskData);
};

export const updateTask = async (taskId: string, updateData: UpdateTaskData) => {
  return api.patch(`/tasks/${taskId}`, updateData);
};

export const deleteTask = async (taskId: string) => {
  return api.delete(`/tasks/${taskId}`);
};

// Export the api instance for direct use if needed
export { api };
