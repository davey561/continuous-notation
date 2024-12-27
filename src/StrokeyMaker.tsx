import React, { useRef, useEffect, useState } from "react"
import { StrokeyThoughtsLocalStorageKey } from "./App"

export interface StrokeyThought {
  text: string
  timestamp: number
}
const StrokeyMaker = ({
  strokeyThoughts,
  setStrokeyThoughts,
  preloadedText,
}: {
  strokeyThoughts: StrokeyThought[]
  setStrokeyThoughts: any
  preloadedText: string
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [inputText, setInputText] = useState(preloadedText)

  useEffect(() => {
    // Update `inputText` when `preloadedText` changes
    if (preloadedText) {
      setInputText(preloadedText)
    }
  }, [preloadedText])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    setInputText(text)
    drawCurve(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      window.alert("Saved to gallery below.")
      const newStrokeyThoughts = [...strokeyThoughts, { text: inputText, timestamp: Date.now() }]
      setStrokeyThoughts(newStrokeyThoughts)
      localStorage.setItem(StrokeyThoughtsLocalStorageKey, JSON.stringify(newStrokeyThoughts))
      setInputText("")
    }
  }

  useEffect(() => {
    drawCurve(inputText)
  }, [inputText])

  const drawCurve = (text: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const devicePixelRatio = window.devicePixelRatio || 1
    const canvasSize = Math.min(window.innerWidth, window.innerHeight - 60)

    canvas.width = canvasSize * devicePixelRatio
    canvas.height = canvasSize * devicePixelRatio
    canvas.style.width = `${canvasSize}px`
    canvas.style.height = `${canvasSize}px`
    ctx.scale(devicePixelRatio, devicePixelRatio)

    const padding = 40
    const maxWidth = canvasSize - 2 * padding
    const maxHeight = canvasSize - 2 * padding

    let points: [number, number][] = []
    let x = 0
    let y = 0

    text.split("").forEach((char, index) => {
      const charCode = char.charCodeAt(0)
      const angle = ((charCode * 53 + index * 97) % 360) * (Math.PI / 180)
      const radius = 10
      const nextX = x + Math.cos(angle) * radius
      const nextY = y + Math.sin(angle) * radius
      points.push([nextX, nextY])
      x = nextX
      y = nextY
    })

    if (points.length === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      return
    }

    const xValues = points.map(([px]) => px)
    const yValues = points.map(([, py]) => py)
    const minX = Math.min(...xValues)
    const maxX = Math.max(...xValues)
    const minY = Math.min(...yValues)
    const maxY = Math.max(...yValues)

    const logicalWidth = maxX - minX
    const logicalHeight = maxY - minY
    const scale = Math.min(maxWidth / logicalWidth, maxHeight / logicalHeight)

    const xOffset = canvasSize / 2 - ((maxX + minX) / 2) * scale
    const yOffset = canvasSize / 2 - ((maxY + minY) / 2) * scale

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

    ctx.strokeStyle = "#000"
    const zoomFactor = scale
    ctx.lineWidth = Math.max(0.05, (1.5 + zoomFactor) / devicePixelRatio)
    ctx.stroke()
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <input
        type="text"
        value={inputText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type to draw"
        style={{
          width: "95%",
          maxWidth: "100vw",
          padding: "10px",
          marginTop: "1%",
          fontSize: "16px",
        }}
      />
      <canvas ref={canvasRef} style={{ display: "block", margin: "0 auto" }} />
    </div>
  )
}

export default StrokeyMaker
