import React, { useEffect } from 'react';
import { Wifi, WifiOff, Users, Activity } from 'lucide-react';
import { usePond } from '../contexts/PondContext';
import { useAuth } from '../contexts/AuthContext';
import { usePondWebSocket } from '../services/websocket';
import PondCard from '../components/PondCard';

const Dashboard: React.FC = () => {
  const { ponds, loading, error, selectPond, fetchPonds } = usePond();
  const { user } = useAuth();
  const { isConnected } = usePondWebSocket();

  useEffect(() => {
    fetchPonds();
  }, []);

  const handlePondClick = (pond: any) => {
    selectPond(pond);
    // Navigate to pond detail - you can implement routing here
    window.location.hash = `#/pond/${pond.id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pond data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-md w-full">
          <WifiOff size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Connection Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchPonds}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Fish Farm Dashboard
            </h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Three Pond Monitoring System
            </p>
          </div>
          
          {/* Status indicators */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Wifi size={20} className="text-green-600" />
              ) : (
                <WifiOff size={20} className="text-red-600" />
              )}
              <span className="text-sm text-gray-600 hidden sm:inline">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Users size={20} className="text-blue-600" />
              <span className="text-sm text-gray-600 hidden sm:inline">
                {user?.role === 'admin' ? 'Admin' : 'Viewer'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 md:px-8 py-6 md:py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || user?.email}
          </h2>
          <p className="text-gray-600">
            Monitor your three fish ponds in real-time. 
            {user?.role === 'admin' ? ' Click on any pond to access controls.' : ' Click on any pond for detailed view.'}
          </p>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Ponds</p>
                <p className="text-2xl font-bold text-gray-900">{ponds.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Wifi size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Connection Status</p>
                <p className="text-lg font-bold text-green-600">
                  {isConnected ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Access Level</p>
                <p className="text-lg font-bold text-purple-600 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pond Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ponds.map((pond) => (
            <PondCard
              key={pond.id}
              pond={pond}
              onClick={() => handlePondClick(pond)}
            />
          ))}
        </div>

        {/* Empty State */}
        {ponds.length === 0 && !loading && (
          <div className="text-center py-12">
            <Activity size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Ponds Available</h3>
            <p className="text-gray-600">
              No pond data is currently available. Please check your connection.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;