import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService, Task, CreateTaskData } from '@/utils/api';

interface TasksResponse {
  tasks: Task[];
  currentPage: number;
  totalPages: number;
  totalTasks: number;
}

export const useTasks = (page: number = 1, limit: number = 10, search?: string) => {
  return useQuery<TasksResponse>({
    queryKey: ['tasks', page, limit, search],
    queryFn: () => taskService.getTasks(page, limit, search),
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskData: CreateTaskData) => taskService.createTask(taskData),
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, updateData }: { taskId: string; updateData: Partial<Task> }) =>
      taskService.updateTask(taskId, updateData),
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => taskService.deleteTask(taskId),
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}; 