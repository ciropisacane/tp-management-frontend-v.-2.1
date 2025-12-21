import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/Projects/ProjectList';
import ProjectDetail from './pages/Projects/ProjectDetail';
import MainLayout from './components/Layout/MainLayout';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component (redirect se già autenticato)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        
        {/* Protected Routes con Layout */}
        <Route 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Projects routes */}
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          
          {/* Placeholder routes (da implementare) */}
          <Route path="/tasks" element={<PlaceholderPage title="Tasks" />} />
          <Route path="/team" element={<PlaceholderPage title="Team" />} />
          <Route path="/documents" element={<PlaceholderPage title="Documents" />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
        </Route>
        
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Temporary Placeholder Component
const PlaceholderPage = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600 text-lg">This page will be implemented in the next sprint</p>
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md">
          <p className="text-sm text-blue-800">
            <strong>Coming soon:</strong> Full {title.toLowerCase()} management with CRUD operations
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;