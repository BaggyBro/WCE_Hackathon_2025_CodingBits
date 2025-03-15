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
        label: 'Carbon Credit Price',
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
        text: 'Carbon Credit Price Trend'
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 15, // ⬆️ Set a custom minimum value to stretch the chart
        max: 50, // ⬆️ Increase max value for better Y-axis scaling
        ticks: {
          stepSize: 5 // Controls the step increments on Y-axis
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