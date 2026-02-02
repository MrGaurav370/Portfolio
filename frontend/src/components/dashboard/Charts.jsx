import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Card } from '../ui/card';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Charts = ({ revenueData, salesData, categoryData }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#9ca3af',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: '#1a1a1a',
        titleColor: '#00d9ff',
        bodyColor: '#ffffff',
        borderColor: '#2a2a2a',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: '#2a2a2a',
          display: false
        },
        ticks: {
          color: '#9ca3af'
        }
      },
      y: {
        grid: {
          color: '#2a2a2a'
        },
        ticks: {
          color: '#9ca3af'
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#9ca3af',
          font: {
            size: 12
          },
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: '#1a1a1a',
        titleColor: '#00d9ff',
        bodyColor: '#ffffff',
        borderColor: '#2a2a2a',
        borderWidth: 1
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Revenue Chart */}
      <Card className="bg-[#1a1a1a] border-[#2a2a2a] p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white mb-1">Revenue Trend</h3>
          <p className="text-sm text-gray-400">Monthly revenue over the last 6 months</p>
        </div>
        <div className="h-64">
          <Line data={revenueData} options={chartOptions} />
        </div>
      </Card>

      {/* Sales Chart */}
      <Card className="bg-[#1a1a1a] border-[#2a2a2a] p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white mb-1">Product Sales</h3>
          <p className="text-sm text-gray-400">Sales by product category</p>
        </div>
        <div className="h-64">
          <Bar data={salesData} options={chartOptions} />
        </div>
      </Card>

      {/* Category Distribution */}
      <Card className="bg-[#1a1a1a] border-[#2a2a2a] p-6 lg:col-span-2">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white mb-1">Category Distribution</h3>
          <p className="text-sm text-gray-400">Sales distribution by category</p>
        </div>
        <div className="h-64">
          <Doughnut data={categoryData} options={doughnutOptions} />
        </div>
      </Card>
    </div>
  );
};

export default Charts;
