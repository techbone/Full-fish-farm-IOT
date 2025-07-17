import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { PondSensorHistoryData, SensorType } from '../types/sensor';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SensorChartProps {
  data: PondSensorHistoryData[];
  sensorType: SensorType;
  title: string;
  color: string;
  unit: string;
}

const SensorChart: React.FC<SensorChartProps> = ({ 
  data, 
  sensorType, 
  title, 
  color, 
  unit 
}) => {
  const chartData = {
    labels: data.map(d => new Date(d.timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })),
    datasets: [
      {
        label: title,
        data: data.map(d => d[sensorType]),
        borderColor: color,
        backgroundColor: `${color}20`,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: data.map(d => d.verified ? color : '#ef4444'),
        pointBorderColor: data.map(d => d.verified ? color : '#ef4444'),
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          afterLabel: (context: any) => {
            const dataPoint = data[context.dataIndex];
            return dataPoint.verified ? 'Verified ✓' : 'Unverified ⚠️';
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: unit,
        },
        grid: {
          color: '#f3f4f6',
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SensorChart;