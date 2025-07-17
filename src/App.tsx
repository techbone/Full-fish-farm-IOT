import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PondProvider } from './contexts/PondContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PondDetail from './pages/PondDetail';
import LoadingScreen from './components/LoadingScreen';

/**
 * Main App component with routing and authentication
 */
function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentView, setCurrentView] = useState<'dashboard' | 'pond'>('dashboard');
  const [selectedPondId, setSelectedPondId] = useState<number | null>(null);
  const { isAuthenticated, loading } = useAuth();

  // Handle loading screen completion
  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Handle hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/pond/')) {
        const pondId = parseInt(hash.split('/')[2]);
        if (!isNaN(pondId)) {
          setSelectedPondId(pondId);
          setCurrentView('pond');
        }
      } else {
        setCurrentView('dashboard');
        setSelectedPondId(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Handle initial hash

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Show loading screen initially
  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  // Show auth loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Show authentication screens
  if (!isAuthenticated) {
    if (authMode === 'register') {
      return <Register onSwitchToLogin={() => setAuthMode('login')} />;
    }
    return <Login onSwitchToRegister={() => setAuthMode('register')} />;
  }

  // Show main application
  if (currentView === 'pond' && selectedPondId) {
    return (
      <PondDetail
        pondId={selectedPondId}
        onBack={() => {
          window.location.hash = '#/dashboard';
          setCurrentView('dashboard');
          setSelectedPondId(null);
        }}
      />
    );
  }

  return <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <PondProvider>
        <AppContent />
      </PondProvider>
    </AuthProvider>
  );
}

export default App;