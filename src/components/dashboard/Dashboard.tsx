import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { TaskList } from './TaskList';
import { LogOut, Plus } from 'lucide-react';
import { useTasks, useCreateTask } from '@/hooks/use-tasks';

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard = ({ onLogout }: DashboardProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const { toast } = useToast();

  // Use React Query hooks
  const { data: tasksData, isLoading } = useTasks(currentPage);
  const createTaskMutation = useCreateTask();

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      await createTaskMutation.mutateAsync({
        title: newTaskTitle,
        description: newTaskDescription,
      });
      
      setNewTaskTitle('');
      setNewTaskDescription('');
      
      toast({
        title: "Task Created",
        description: "Your new task has been added successfully",
      });
    } catch (error: any) {
      if (error.status === 401) {
        toast({
          title: "Session Expired",
          description: "Please log in again",
          variant: "destructive",
        });
        onLogout();
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to create task",
          variant: "destructive",
        });
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (tasksData?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Add Task Card */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Plus className="h-5 w-5" />
              Add New Task
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <Input
                  placeholder="Task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="h-11"
                  required
                />
              </div>
              <div>
                <Input
                  placeholder="Task description (optional)..."
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="h-11"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                disabled={createTaskMutation.isPending}
              >
                {createTaskMutation.isPending ? 'Adding Task...' : 'Add Task'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Task List */}
        <TaskList 
          tasks={tasksData?.tasks || []} 
          isLoading={isLoading}
          onAuthError={onLogout}
        />

        {/* Pagination */}
        {tasksData?.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {tasksData.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === tasksData.totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};
