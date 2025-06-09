import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask, updateTask, deleteTask } from '@/utils/api';
import type { TaskData, UpdateTaskData } from '@/utils/api';

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

export const useTasks = (page: number = 1, limit: number = 10) => {
  return useQuery<TasksResponse>({
    queryKey: ['tasks', page, limit],
    queryFn: () => getTasks({ page, limit }),
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskData: TaskData) => createTask(taskData),
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, updateData }: { taskId: string; updateData: UpdateTaskData }) =>
      updateTask(taskId, updateData),
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}; 