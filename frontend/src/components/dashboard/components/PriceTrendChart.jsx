import PropTypes from 'prop-types';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
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

const PriceTrendChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'CO2 Emissions per metric ton',
        data: data.map(item => item.price),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'CO2 Emissions Trend'
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 0,  // Set a lower value for more space on the Y-axis
        max: 100, // Increase the max value to make the Y-axis longer
        ticks: {
          stepSize: 10 // Controls the step increments on Y-axis (adjust as needed)
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };
  

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="h-[300px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};



PriceTrendChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired
    })
  ).isRequired
};


export default PriceTrendChart;