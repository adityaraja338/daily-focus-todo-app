import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService, Task, CreateTaskData } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';

interface TasksResponse {
  tasks: Task[];
  currentPage: number;
  totalPages: number;
  totalTasks: number;
}

export const useTasks = (page: number = 1, limit: number = 10, search?: string) => {
  const { logout } = useAuth();

  return useQuery<TasksResponse>({
    queryKey: ['tasks', page, limit, search],
    queryFn: () => taskService.getTasks(page, limit, search),
    retry: (failureCount, error: any) => {
      if (error.status === 401) {
        logout();
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  return useMutation({
    mutationFn: (taskData: CreateTaskData) => taskService.createTask(taskData),
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      if (error.status === 401) {
        logout();
      }
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  return useMutation({
    mutationFn: ({ taskId, updateData }: { taskId: string; updateData: Partial<Task> }) =>
      taskService.updateTask(taskId, updateData),
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      if (error.status === 401) {
        logout();
      }
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  return useMutation({
    mutationFn: (taskId: string) => taskService.deleteTask(taskId),
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      if (error.status === 401) {
        logout();
      }
    },
  });
}; 