import React, { useRef, useEffect, useState } from "react"
import "./Strokey.css"
interface StrokeyProps {
  text: string // The text to generate the stroke pattern for
}

const Strokey: React.FC<StrokeyProps> = ({ text }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [pixelLength, setPixelLength] = useState<number>()
  const [canvasSize, setCanvasSize] = useState<number>()

  const drawCurve = (text: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const devicePixelRatio = window.devicePixelRatio || 1
    const newCanvasSize = Math.min(
      canvas.parentElement?.clientWidth || 0,
      canvas.parentElement?.clientHeight || 0
    ) // Make canvas square within its parent
    setCanvasSize(newCanvasSize)

    // Adjust canvas size for high resolution
    const newPixelLength = newCanvasSize * devicePixelRatio
    canvas.width = newPixelLength
    canvas.height = newPixelLength
    setPixelLength(newPixelLength)

    canvas.style.width = `${newCanvasSize}px`
    canvas.style.height = `${newCanvasSize}px`

    // Scale the context to account for the device pixel ratio
    ctx.scale(devicePixelRatio, devicePixelRatio)

    const padding = 40 // Add padding around the curve
    const maxWidth = newCanvasSize - 2 * padding
    const maxHeight = newCanvasSize - 2 * padding

    let points: [number, number][] = []
    let x = 0 // Center the curve in logical space
    let y = 0

    // Generate points based on text
    text.split("").forEach((char, index) => {
      const charCode = char.charCodeAt(0)
      const angle = ((charCode * 53 + index * 97) % 360) * (Math.PI / 180)
      const radius = 10 // Constant logical radius
      const nextX = x + Math.cos(angle) * radius
      const nextY = y + Math.sin(angle) * radius
      points.push([nextX, nextY])
      x = nextX
      y = nextY
    })

    if (points.length === 0) {
      // No points to draw
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      return
    }

    // Calculate bounds
    const xValues = points.map(([px]) => px)
    const yValues = points.map(([, py]) => py)
    const minX = Math.min(...xValues)
    const maxX = Math.max(...xValues)
    const minY = Math.min(...yValues)
    const maxY = Math.max(...yValues)

    // Calculate scale factor to fit into canvas
    const logicalWidth = maxX - minX
    const logicalHeight = maxY - minY
    const scale = Math.min(maxWidth / logicalWidth, maxHeight / logicalHeight)

    // Center the curve in the canvas
    const xOffset = newCanvasSize / 2 - ((maxX + minX) / 2) * scale
    const yOffset = newCanvasSize / 2 - ((maxY + minY) / 2) * scale

    // Apply scaling and draw the curve
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.beginPath()
    points = points.map(([px, py]) => [xOffset + px * scale, yOffset + py * scale])
    ctx.moveTo(points[0][0], points[0][1])
    for (let i = 1; i < points.length - 1; i++) {
      const [x1, y1] = points[i]
      const [x2, y2] = points[i + 1]
      const controlX = (x1 + x2) / 2
      const controlY = (y1 + y2) / 2
      ctx.quadraticCurveTo(x1, y1, controlX, controlY)
    }

    const [lastX, lastY] = points[points.length - 1]
    ctx.lineTo(lastX, lastY)

    // Adjust line width for high resolution
    ctx.strokeStyle = "#000"
    const zoomFactor = scale // Adjust thickness based on zoom level
    ctx.lineWidth = Math.max(0.05, (1.5 + zoomFactor) / devicePixelRatio) // Thin out the stroke for high resolution
    ctx.stroke()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      drawCurve(text)
    }
  }, [text])

  return (
    <div
      className="strokey-container"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
      key={text}
    >
      {/* show text */}
      <div
        className="strokey-text-container"
        style={{
          width: `${canvasSize}px`,
        }}
      >
        <div className="strokey-text"> {text}</div>
      </div>
      <canvas
        key={text}
        className="strokey-stroke"
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      ></canvas>
    </div>
  )
}

export default Strokey
