import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, RefreshCw } from 'lucide-react';
import { usePond } from '../contexts/PondContext';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';
import SensorChart from '../components/SensorChart';
import AdminControls from '../components/AdminControls';
import HistoricalDataPanel from '../components/HistoricalDataPanel';
import { useNavigate, useParams } from 'react-router-dom';

const PondDetail = () => {
  const { sensorId } = useParams();
  const { ponds } = usePond();
  const { user } = useAuth();
  const navigate = useNavigate();
  const selectedPond = ponds.find(p => p.sensorId === sensorId);
  const [historicalData, setHistoricalData] = useState([]);
  const [limit, setLimit] = useState(50);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tableLimit, setTableLimit] = useState(5);
  const [thresholds, setThresholds] = useState(null);
  const [thresholdLoading, setThresholdLoading] = useState(false);
  const [thresholdError, setThresholdError] = useState('');
  const [thresholdSuccess, setThresholdSuccess] = useState('');
  const [showThresholdForm, setShowThresholdForm] = useState(false);

  const fetchHistoricalData = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const data = await api.getSensorData(sensorId, limit);
      setHistoricalData(Array.isArray(data) ? data : []);
    } catch (error) {
      setHistoricalData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch last N readings for the table
  useEffect(() => {
    const fetchTableData = async () => {
      if (!user?.token) return;
      try {
        const data = await api.getSensorData(sensorId, tableLimit);
        setTableData(Array.isArray(data) ? data : []);
      } catch {
        setTableData([]);
      }
    };
    fetchTableData();
  }, [sensorId, user?.token, tableLimit]);

  // Fetch thresholds
  useEffect(() => {
    const fetchThresholds = async () => {
      setThresholdLoading(true);
      setThresholdError('');
      try {
        const data = await api.getSensorThresholds(sensorId);
        setThresholds(data);
      } catch (err) {
        setThresholdError('Failed to load thresholds.');
      } finally {
        setThresholdLoading(false);
      }
    };
    fetchThresholds();
  }, [sensorId]);

  // Handle threshold form change
  const handleThresholdChange = (e) => {
    const { name, value } = e.target;
    setThresholds((prev) => ({ ...prev, [name]: value }));
  };

  // Handle threshold form submit
  const handleThresholdSubmit = async (e) => {
    e.preventDefault();
    setThresholdLoading(true);
    setThresholdError('');
    setThresholdSuccess('');
    try {
      await api.setSensorThresholds(sensorId, {
        pHMin: parseFloat(thresholds.pHMin),
        pHMax: parseFloat(thresholds.pHMax),
        tempMin: parseFloat(thresholds.tempMin),
        tempMax: parseFloat(thresholds.tempMax),
        turbidityMax: parseFloat(thresholds.turbidityMax),
        salinityMax: parseFloat(thresholds.salinityMax),
        waterLevelMin: parseFloat(thresholds.waterLevelMin),
      });
      setThresholdSuccess('Thresholds updated successfully!');
    } catch (err) {
      setThresholdError('Failed to update thresholds.');
    } finally {
      setThresholdLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
  }, [sensorId, limit, user?.token]);

  if (!selectedPond) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Pond not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const timeRangeOptions = [
    { value: 20, label: 'Last 20' },
    { value: 50, label: 'Last 50' },
    { value: 100, label: 'Last 100' },
  ];

  const sensorConfigs = [
    {
      type: 'temperature',
      title: 'Water Temperature',
      color: '#ef4444',
      unit: '°C',
    },
    {
      type: 'ph',
      title: 'pH Level',
      color: '#10b981',
      unit: 'pH',
    },
    {
      type: 'turbidity',
      title: 'Turbidity',
      color: '#3b82f6',
      unit: 'NTU',
    },
    {
      type: 'waterLevel',
      title: 'Water Level',
      color: '#8b5cf6',
      unit: 'm',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {selectedPond.name} Details
              </h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">
                Real-time monitoring and historical data
              </p>
            </div>
          </div>
          
          <button
            onClick={fetchHistoricalData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 md:px-8 py-6 md:py-8">
        {/* Thresholds Form Toggle Button */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setShowThresholdForm((v) => !v)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {showThresholdForm ? 'Hide Sensor Thresholds' : 'Edit Sensor Thresholds'}
          </button>
        </div>
        {/* Thresholds Form */}
        {showThresholdForm && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sensor Thresholds</h3>
            {thresholdLoading && <p className="text-blue-600 mb-2">Loading...</p>}
            {thresholdError && <p className="text-red-600 mb-2">{thresholdError}</p>}
            {thresholdSuccess && <p className="text-green-600 mb-2">{thresholdSuccess}</p>}
            <form onSubmit={handleThresholdSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">pH Min</label>
                <input type="number" step="0.01" name="pHMin" value={thresholds?.pHMin ?? ''} onChange={handleThresholdChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">pH Max</label>
                <input type="number" step="0.01" name="pHMax" value={thresholds?.pHMax ?? ''} onChange={handleThresholdChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temperature Min (°C)</label>
                <input type="number" step="0.1" name="tempMin" value={thresholds?.tempMin ?? ''} onChange={handleThresholdChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temperature Max (°C)</label>
                <input type="number" step="0.1" name="tempMax" value={thresholds?.tempMax ?? ''} onChange={handleThresholdChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Turbidity Max (NTU)</label>
                <input type="number" step="0.01" name="turbidityMax" value={thresholds?.turbidityMax ?? ''} onChange={handleThresholdChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salinity Max (ppm)</label>
                <input type="number" step="0.1" name="salinityMax" value={thresholds?.salinityMax ?? ''} onChange={handleThresholdChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Water Level Min (cm)</label>
                <input type="number" step="0.1" name="waterLevelMin" value={thresholds?.waterLevelMin ?? ''} onChange={handleThresholdChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
              </div>
              <div className="flex items-end">
                <button type="submit" disabled={thresholdLoading} className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
                  {thresholdLoading ? 'Saving...' : 'Save Thresholds'}
                </button>
              </div>
            </form>
          </div>
        )}
        {/* Historical Data Panel */}
        <HistoricalDataPanel sensorId={sensorId} />
        {/* Current Status */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Temperature</p>
              <p className="text-2xl font-bold text-red-600">{selectedPond.temperature?.toFixed(1)}°C</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">pH Level</p>
              <p className="text-2xl font-bold text-green-600">{selectedPond.pH?.toFixed(1)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Turbidity</p>
              <p className="text-2xl font-bold text-blue-600">{selectedPond.turbidity?.toFixed(2)} NTU</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Water Level</p>
              <p className="text-2xl font-bold text-purple-600">{selectedPond.waterLevel?.toFixed(1)} m</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Salinity</p>
              <p className="text-2xl font-bold text-cyan-600">{selectedPond.salinity?.toFixed(1)} ppm</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock size={16} className="text-gray-400" />
              <span className="text-sm text-gray-600">
                Last updated: {selectedPond.lastUpdated ? new Date(selectedPond.lastUpdated).toLocaleString() : 'Never'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${selectedPond.verified ? 'bg-green-400' : 'bg-yellow-400'}`} />
              <span className="text-sm text-gray-600">
                {selectedPond.verified ? 'Verified' : 'Unverified'}
              </span>
            </div>
          </div>
          {/* Historical Data Table */}
          <div className="mt-8">
            <h4 className="text-md font-semibold text-gray-800 mb-2">Recent Historical Data</h4>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full bg-white text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Time</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Temperature (°C)</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">pH</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Turbidity (NTU)</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Salinity (ppm)</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Water Level (m)</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-4 text-center text-gray-400">No data available.</td>
                    </tr>
                  ) : (
                    tableData.map((row, idx) => (
                      <tr key={row._id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 text-gray-700 whitespace-nowrap">{row.createdAt ? new Date(row.createdAt).toLocaleString() : ''}</td>
                        <td className="px-4 py-2 text-gray-700">{row.temperature !== undefined ? row.temperature.toFixed(1) : '--'}</td>
                        <td className="px-4 py-2 text-gray-700">{row.pH !== undefined ? row.pH.toFixed(2) : '--'}</td>
                        <td className="px-4 py-2 text-gray-700">{row.turbidity !== undefined ? row.turbidity.toFixed(2) : '--'}</td>
                        <td className="px-4 py-2 text-gray-700">{row.salinity !== undefined ? row.salinity.toFixed(1) : '--'}</td>
                        <td className="px-4 py-2 text-gray-700">{row.waterLevel !== undefined ? row.waterLevel.toFixed(1) : '--'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Load More Button */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setTableLimit(l => l + 5)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={tableData.length < tableLimit}
              >
                Load More
              </button>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        {/* <div className="mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Show:</span>
            <div className="flex space-x-1">
              {timeRangeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setLimit(option.value)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    limit === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div> */}

        {/* Charts Grid */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {sensorConfigs.map((config) => (
            <SensorChart
              key={config.type}
              data={historicalData}
              sensorType={config.type}
              title={config.title}
              color={config.color}
              unit={config.unit}
            />
          ))}
        </div> */}

        {/* Admin Controls */}
        {user?.role === 'admin' && (
          <AdminControls pondId={sensorId} />
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading historical data...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && historicalData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No historical data available for the selected time range.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PondDetail;