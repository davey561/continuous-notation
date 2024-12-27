import React, { useState, useEffect } from "react"
import Gallery from "./Gallery"
import StrokeyMaker from "./StrokeyMaker"
import "./App.css"

export const StrokeyThoughtsLocalStorageKey = "StrokeyThoughts"
const App = () => {
  const [strokeyThoughts, setStrokeyThoughts] = useState(
    JSON.parse(localStorage.getItem(StrokeyThoughtsLocalStorageKey) ?? "[]")
  )
  const [preloadedText, setPreloadedText] = useState("")

  // Parse `text` from URL on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const text = params.get("text")
    if (text) {
      setPreloadedText(decodeURIComponent(text))
      const newUrl = window.location.origin + window.location.pathname
      window.history.replaceState(null, "", newUrl)
    }
  }, [])

  return (
    <div className="strokey-app-container">
      <StrokeyMaker
        strokeyThoughts={strokeyThoughts}
        setStrokeyThoughts={setStrokeyThoughts}
        preloadedText={preloadedText}
      />
      <Gallery strokeyThoughts={strokeyThoughts} />
    </div>
  )
}

export default App
