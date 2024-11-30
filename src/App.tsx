import React, { useRef, useEffect, useState } from 'react';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [inputText, setInputText] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputText(text);
    drawCurve(text);
  };

  const drawCurve = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Start drawing
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2); // Start at center

    let x = canvas.width / 2;
    let y = canvas.height / 2;
    const radius = 10;

    text.split('').forEach((char, index) => {
      const charCode = char.charCodeAt(0);

      // Introduce more balanced variation by applying normalization and offsets
      const angleX = ((charCode + index * 31) % 360) * (Math.PI / 180); // Add index-based offset
      const angleY = ((charCode + index * 17) % 360) * (Math.PI / 180); // Different multiplier

      // Normalize angles to ensure better coverage across directions
      const nextX = x + Math.cos(angleX - Math.PI / 2) * radius; // Adjust baseline direction
      const nextY = y + Math.sin(angleY - Math.PI / 2) * radius; // Adjust baseline direction

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
      <h1>Text to Freeform Curve</h1>
      <input
        type="text"
        value={inputText}
        onChange={handleChange}
        placeholder="Type your sentence"
        style={{ width: '100%', padding: '10px', marginBottom: '20px', fontSize: '16px' }}
      />
      <canvas ref={canvasRef} width={800} height={600} style={{ border: '1px solid #000' }} />
    </div>
  );
};

export default App;
