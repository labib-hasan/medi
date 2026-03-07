import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler
);

export default function ChartComponents({ type, data, options }) {
  if (type === 'line') {
    return <Line data={data} options={options} />;
  }
  
  if (type === 'doughnut') {
    return <Doughnut data={data} options={options} />;
  }
  
  return null;
}