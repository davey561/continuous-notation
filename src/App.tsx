import React, { useState } from "react"
import Gallery from "./Gallery"
import StrokeyMaker, { StrokeyThoughtsLocalStorageKey } from "./StrokeyMaker"

const App = () => {
  const [strokeyThoughts, setStrokeyThoughts] = useState(
    JSON.parse(localStorage.getItem(StrokeyThoughtsLocalStorageKey) ?? "[]")
  )
  return (
    <div>
      <StrokeyMaker {...{ strokeyThoughts, setStrokeyThoughts }} />
      <Gallery {...{ strokeyThoughts }} />
    </div>
  )
}

export default App
