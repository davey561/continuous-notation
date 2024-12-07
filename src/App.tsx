import React, { useRef, useEffect, useState } from 'react';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [inputText, setInputText] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const handleEmailSend = () => {
    console.log(`Email sent to: ${email}`);
    setEmailSent(true);
  };

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
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    const baseRadius = 10; // Keep radius constant

    const points: [number, number][] = [];
    text.split('').forEach((char, index) => {
      const charCode = char.charCodeAt(0);

      // Compute next point with full 360-degree range of variation
      const angle = ((charCode * 53 + index * 97) % 360) * (Math.PI / 180); // Random-like spread across 360 degrees
      const radius = baseRadius; // Keep radius constant to avoid outward expansion
      const nextX = x + Math.cos(angle) * radius;
      const nextY = y + Math.sin(angle) * radius;

      points.push([nextX, nextY]);
      x = nextX;
      y = nextY;
    });

    if (points.length < 2) return; // Exit if not enough points for a curve

    // Draw a smooth curve through all points
    ctx.moveTo(points[0][0], points[0][1]); // Start at the first point
    for (let i = 1; i < points.length - 1; i++) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[i + 1];
      const controlX = (x1 + x2) / 2;
      const controlY = (y1 + y2) / 2;
      ctx.quadraticCurveTo(x1, y1, controlX, controlY); // Smooth connection
    }

    // Draw the final segment to the last point
    const [lastX, lastY] = points[points.length - 1];
    ctx.lineTo(lastX, lastY);

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  useEffect(() => {
    if (!isMobile) {
      drawCurve(inputText);
    }
  }, [inputText, isMobile]);

  if (isMobile) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p>Access from Desktop Only!</p>
        <p>To play around with this prototype, please access it from a desktop browser.</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          style={{ width: '80%', padding: '10px', marginBottom: '10px', fontSize: '16px' }}
        />
        <button
          onClick={handleEmailSend}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          Send Link to My Email
        </button>
        {emailSent && <p style={{ color: 'green' }}>Link sent! Check your inbox.</p>}
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px', margin: '0 auto' }}>
      <input
        type="text"
        value={inputText}
        onChange={handleChange}
        placeholder="Type to draw"
        style={{
          width: '100%',
          maxWidth: '100vw',
          padding: '10px',
          marginBottom: '20px',
          fontSize: '16px',
          boxSizing: 'border-box', // Ensure padding and border are included in width
        }}
      />
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={600}
        style={{
          width: '100%',
          maxWidth: '100vw',
          border: '1px solid #000',
        }}
      />
    </div>
  );
};

export default App;
