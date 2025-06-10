import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Index = () => {
  const [currentView, setCurrentView] = useState<'login' | 'register'>('login');
  const { user } = useAuth();

  // If user is authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {currentView === 'login' ? (
          <LoginForm 
            onSwitchToRegister={() => setCurrentView('register')}
          />
        ) : (
          <RegisterForm 
            onSwitchToLogin={() => setCurrentView('login')}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
