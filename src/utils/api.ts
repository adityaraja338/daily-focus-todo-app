
const API_BASE_URL = 'http://localhost:3000/api'; // Update this to your backend URL

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface TaskData {
  title: string;
  description?: string;
}

interface UpdateTaskData {
  title?: string;
  description?: string;
  completed?: boolean;
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
    const error = new Error(errorData.message || 'An error occurred');
    (error as any).status = response.status;
    throw error;
  }
  return response.json();
};

// Authentication APIs
export const registerUser = async (userData: RegisterData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  return handleResponse(response);
};

export const loginUser = async (loginData: LoginData) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
  });
  
  return handleResponse(response);
};

// Task APIs
export const getTasks = async () => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  
  return handleResponse(response);
};

export const createTask = async (taskData: TaskData) => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  });
  
  return handleResponse(response);
};

export const updateTask = async (taskId: string, updateData: UpdateTaskData) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData),
  });
  
  return handleResponse(response);
};

export const deleteTask = async (taskId: string) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  return handleResponse(response);
};
