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
  const [curveData, setCurveData] = useState<number[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputText(text);
    generateCurve(text);
  };

  const generateCurve = (text: string) => {
    // Split the text into words
    const words = text.split(' ');

    // Initialize x and y values
    let x = 0;
    const data: number[] = [];

    words.forEach((word, wordIndex) => {
      // Generate a unique "turn" factor for the word based on its characters
      const turnFactor = Array.from(word).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 10;

      // For each character in the word, add a "turn" in the curve
      for (let i = 0; i < word.length; i++) {
        x++;
        const y = (turnFactor % 2 === 0 ? 1 : -1) * (x ** 2) / (wordIndex + 1);
        data.push(y);
      }
    });

    setCurveData(data);
  };

  const data = {
    labels: curveData.map((_, i) => i),
    datasets: [
      {
        label: 'Dynamic Curve Based on Words',
        data: curveData,
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
        text: 'Curve with Turns Based on Typed Words',
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
      <h1>Text to Dynamic Curve</h1>
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
