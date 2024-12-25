import React, { useState, useEffect } from "react"
import Strokey from "./Strokey"

const App: React.FC = () => {
  const [inputText, setInputText] = useState("")

  // Parse text from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const text = params.get("text")
    if (text) {
      setInputText(decodeURIComponent(text))
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value)
  }

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}?text=${encodeURIComponent(
      inputText
    )}`
    navigator.clipboard.writeText(url).then(() => {
      alert("Shareable URL copied to clipboard!")
    })
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          boxSizing: "border-box",
        }}
      >
        <input
          type="text"
          value={inputText}
          onChange={handleChange}
          placeholder="Type to draw"
          style={{
            flexGrow: 1,
            maxWidth: "90%",
            padding: "10px",
            fontSize: "16px",
            marginRight: "10px",
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={handleShare}
          style={{
            padding: "10px 15px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          🔗
        </button>
      </div>
      <div
        style={{
          flexGrow: 1,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Strokey text={inputText} />
      </div>
    </div>
  )
}

export default App
