import React, { useRef, useEffect, useState } from 'react';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [inputText, setInputText] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    drawCurve(e.target.value);
  };

  const drawCurve = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Start drawing
    ctx.beginPath();
    ctx.moveTo(50, canvas.height / 2); // Start point
    let x = 50;
    let y = canvas.height / 2;

    text.split('').forEach((char, index) => {
      const charCode = char.charCodeAt(0);
      const nextX = x + 15; // Move horizontally
      const nextY = y + Math.sin(index) * (charCode % 10); // Add variation based on character

      ctx.lineTo(nextX, nextY);
      x = nextX;
      y = nextY;
    });

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  useEffect(() => {
    drawCurve(inputText);
  }, [inputText]);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Sentence to Continuous Curve</h1>
      <input
        type="text"
        value={inputText}
        onChange={handleChange}
        placeholder="Type your sentence"
        style={{ width: '100%', padding: '10px', marginBottom: '20px', fontSize: '16px' }}
      />
      <canvas ref={canvasRef} width={800} height={400} style={{ border: '1px solid #000' }} />
    </div>
  );
};

export default App;
