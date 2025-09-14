import React, { useEffect } from 'react';
import { Wifi, WifiOff, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';
import { usePond } from '../contexts/PondContext';
import { useAuth } from '../contexts/AuthContext';
import { usePondWebSocket } from '../services/websocket';
import PondCard from '../components/PondCard';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { ponds, loading, error, selectPond, fetchAllSensorData, alerts } = usePond();
  const { user, logout, isAuthenticated } = useAuth();
  const { isConnected } = usePondWebSocket();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);

  useEffect(() => {
    fetchAllSensorData();
  }, []);

  const handlePondClick = (pond) => {
    selectPond(pond);
    navigate(`/pond/${pond.sensorId}`);
  };

  const [dismissed, setDismissed] = React.useState([]);
  const handleDismiss = (idx) => setDismissed((prev) => [...prev, idx]);

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
            onClick={fetchAllSensorData}
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
      {alerts && alerts.length > 0 && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xl">
          {alerts.slice(0, 3).map((alert, idx) =>
            !dismissed.includes(idx) && (
              <div key={idx} className="flex items-center bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-2 shadow-lg animate-fade-in">
                <AlertTriangle className="text-yellow-500 mr-3" />
                <div className="flex-1">
                  <div className="font-semibold text-yellow-800">Alert for {alert.sensorId}</div>
                  <div className="text-yellow-700 text-sm">
                    {Array.isArray(alert.alerts) ? alert.alerts.join(', ') : alert.alerts}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{new Date(alert.timestamp).toLocaleString()}</div>
                </div>
                <button onClick={() => handleDismiss(idx)} className="ml-4 text-yellow-700 hover:text-yellow-900 font-bold text-lg">&times;</button>
              </div>
            )
          )}
        </div>
      )}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Fish Farm Dashboard
            </h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Three Pond Monitoring System
            </p>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span className="text-xs md:text-sm text-emerald-700">
                All data hashed and anchored on Polygon for integrity
              </span>
            </div>
          </div>
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
            {isAuthenticated && (
              <>
                <button
                  onClick={() => setShowLogoutDialog(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg"
                >
                  Logout
                </button>
                {showLogoutDialog && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full text-center">
                      <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
                      <p className="mb-6">Are you sure you want to log out{user?.username ? `, ${user.username}` : ''}?</p>
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => setShowLogoutDialog(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => { logout(); setShowLogoutDialog(false); }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <main className="px-4 md:px-8 py-6 md:py-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Welcome back!, {user?.name || user?.email}
          </h2>
          <p className="text-gray-600">
            Monitor your two fish ponds in real time1. 
            {user?.role === 'admin' ? ' Click on any pond card to access controls.' : ' Click on any pond for detailed view.'}
          </p>
        </div>

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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ponds.map((pond) => (
            pond && pond.sensorId ? (
              <PondCard
                key={pond.sensorId}
                pond={pond}
                onClick={() => handlePondClick(pond)}
              />
            ) : null
          ))}
        </div>

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