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

const SensorChart = ({ data, sensorType, title, color, unit }) => {
  // Use correct keys from getSensorData sample
  const getValue = (d) => {
    if (sensorType === 'ph') {
      return d.pH;
    }
    return d[sensorType];
  };

  const chartData = {
    labels: data.map(d => {
      if (d.createdAt && !isNaN(Date.parse(d.createdAt))) {
        const date = new Date(d.createdAt);
        // Format as 'YYYY-MM-DD HH:mm'
        return date.toLocaleString([], {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).replace(',', '');
      }
      return '';
    }),
    datasets: [
      {
        label: title,
        data: data.map(getValue),
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
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          afterLabel: (context) => {
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
      mode: 'index',
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