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
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  data: Array<{
    id: string;
    name: string;
    temperature: number;
    humidity: number;
    lastUpdate: string;
    status: 'online' | 'offline';
  }>;
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  // Generate mock time series data for demonstration
  const generateTimeSeriesData = () => {
    const now = new Date();
    const labels = [];
    interface TimeSeriesDataset {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      borderWidth: number;
      fill: boolean;
      tension: number;
      pointRadius: number;
      pointHoverRadius: number;
    }

    const datasets: TimeSeriesDataset[] = [];

    // Generate labels for last 24 hours
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      labels.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }

    // Generate datasets for each sensor
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    
    data.forEach((sensor, index) => {
      const sensorData = [];
      let baseTemp = sensor.temperature;
      
      // Generate realistic temperature variations
      for (let i = 0; i < 24; i++) {
        const variation = (Math.random() - 0.5) * 4; // ±2°C variation
        baseTemp += variation * 0.1; // Gradual changes
        sensorData.push(Number(baseTemp.toFixed(1)));
      }

      datasets.push({
        label: sensor.name,
        data: sensorData,
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + '20',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 1,
        pointHoverRadius: 5,
      });
    });

    return { labels, datasets };
  };

  const chartData = generateTimeSeriesData();

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 500
          }
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}°C`;
          }
        }
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time',
          font: {
            size: 12,
            weight: 600
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          maxTicksLimit: 8,
          font: {
            size: 11
          }
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Temperature (°C)',
          font: {
            size: 12,
            weight: 600
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return value + '°C';
          },
          font: {
            size: 11
          }
        }
      },
    },
    elements: {
      line: {
        borderJoinStyle: 'round',
        borderCapStyle: 'round',
      },
      point: {
        hoverBorderWidth: 3,
      }
    }
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Chart;