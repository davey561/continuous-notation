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

    const devicePixelRatio = window.devicePixelRatio || 1;
    const canvasSize = Math.min(window.innerWidth, window.innerHeight - 60); // Square size with input box accounted for

    // Adjust canvas size for high resolution
    canvas.width = canvasSize * devicePixelRatio;
    canvas.height = canvasSize * devicePixelRatio;
    canvas.style.width = `${canvasSize}px`;
    canvas.style.height = `${canvasSize}px`;

    // Scale the context to account for the device pixel ratio
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const padding = 40; // Add padding around the curve
    const maxWidth = canvasSize - 2 * padding;
    const maxHeight = canvasSize - 2 * padding;

    let points: [number, number][] = [];
    let x = 0; // Center the curve in logical space
    let y = 0;

    // Generate points based on text
    text.split('').forEach((char, index) => {
      const charCode = char.charCodeAt(0);
      const angle = ((charCode * 53 + index * 97) % 360) * (Math.PI / 180);
      const radius = 10; // Constant logical radius
      const nextX = x + Math.cos(angle) * radius;
      const nextY = y + Math.sin(angle) * radius;
      points.push([nextX, nextY]);
      x = nextX;
      y = nextY;
    });

    if (points.length === 0) {
      // No points to draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    // Calculate bounds
    const xValues = points.map(([px]) => px);
    const yValues = points.map(([, py]) => py);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    // Calculate scale factor to fit into canvas
    const logicalWidth = maxX - minX;
    const logicalHeight = maxY - minY;
    const scale = Math.min(maxWidth / logicalWidth, maxHeight / logicalHeight);

    // Center the curve in the canvas
    const xOffset = canvasSize / 2 - ((maxX + minX) / 2) * scale;
    const yOffset = canvasSize / 2 - ((maxY + minY) / 2) * scale;

    // Apply scaling and draw the curve
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    points = points.map(([px, py]) => [
      xOffset + px * scale,
      yOffset + py * scale,
    ]);
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length - 1; i++) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[i + 1];
      const controlX = (x1 + x2) / 2;
      const controlY = (y1 + y2) / 2;
      ctx.quadraticCurveTo(x1, y1, controlX, controlY);
    }

    const [lastX, lastY] = points[points.length - 1];
    ctx.lineTo(lastX, lastY);

    // Adjust line width for high resolution
    ctx.strokeStyle = '#000';
    const zoomFactor = scale; // Adjust thickness based on zoom level
    ctx.lineWidth = Math.max(0.05, (1.5 + zoomFactor) / devicePixelRatio); // Thin out the stroke for high resolution
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      drawCurve(inputText);
    }
  }, [inputText]);

  return (
    <div style={{ textAlign: 'center', padding: '0', margin: '0', overflow: 'hidden', height: '100vh' }}>
      <input
        type="text"
        value={inputText}
        onChange={handleChange}
        placeholder="Type to draw"
        style={{
          width: '98%',
          maxWidth: '100vw',
          padding: '10px',
          marginTop: '10px',
          fontSize: '16px',
          boxSizing: 'border-box', // Ensure padding and border are included in width
          
          zIndex: 10,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          margin: '0 auto',
        }}
      />
    </div>
  );
};

export default App;
