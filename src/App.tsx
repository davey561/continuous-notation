import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [parabolaData, setParabolaData] = useState<number[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputText(text);
    generateParabola(text.length);
  };

  const generateParabola = (length: number) => {
    const range = Array.from({ length: length || 1 }, (_, i) => i - Math.floor(length / 2));
    const data = range.map(x => x ** 2);
    setParabolaData(data);
  };

  const data = {
    labels: parabolaData.map((_, i) => i),
    datasets: [
      {
        label: 'Parabolic Curve',
        data: parabolaData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Parabolic Curve Based on Text Length',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'X-axis',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Y-axis',
        },
      },
    },
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '20px' }}>
      <h1>Text to Parabolic Curve</h1>
      <input
        type="text"
        value={inputText}
        onChange={handleChange}
        placeholder="Type here"
        style={{ width: '100%', padding: '10px', marginBottom: '20px', fontSize: '16px' }}
      />
      <Line data={data} options={options} />
    </div>
  );
};

export default App;
