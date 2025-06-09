
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { updateTask, deleteTask } from '@/utils/api';
import { List, Trash2 } from 'lucide-react';

interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
}

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  isLoading: boolean;
  onAuthError: () => void;
}

export const TaskList = ({ tasks, setTasks, isLoading, onAuthError }: TaskListProps) => {
  const [updatingTasks, setUpdatingTasks] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    setUpdatingTasks(prev => new Set(prev).add(taskId));
    
    try {
      await updateTask(taskId, { completed: !completed });
      setTasks(prev => prev.map(task => 
        task._id === taskId ? { ...task, completed: !completed } : task
      ));
    } catch (error: any) {
      if (error.status === 401) {
        onAuthError();
      } else {
        toast({
          title: "Error",
          description: "Failed to update task",
          variant: "destructive",
        });
      }
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setUpdatingTasks(prev => new Set(prev).add(taskId));
    
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(task => task._id !== taskId));
      toast({
        title: "Task Deleted",
        description: "The task has been removed successfully",
      });
    } catch (error: any) {
      if (error.status === 401) {
        onAuthError();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete task",
          variant: "destructive",
        });
      }
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <List className="h-5 w-5" />
          Your Tasks ({tasks.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No tasks yet. Create your first task above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 bg-white/50 hover:bg-white/80 transition-colors"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => handleToggleComplete(task._id, task.completed)}
                  disabled={updatingTasks.has(task._id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className={`text-sm mt-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                      {task.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTask(task._id)}
                  disabled={updatingTasks.has(task._id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
