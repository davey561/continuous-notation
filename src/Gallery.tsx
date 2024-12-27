import React, { useEffect, useState } from "react"
import { StrokeyThought, StrokeyThoughtsLocalStorageKey } from "./StrokeyMaker"
import Strokey from "./Strokey"

const Gallery = ({ strokeyThoughts }: { strokeyThoughts: StrokeyThought[] }) => {
  const ordered = strokeyThoughts.sort((a, b) => b.timestamp - a.timestamp)
  return (
    <div className="gallery" key={strokeyThoughts.length}>
      {strokeyThoughts.map((e: StrokeyThought) => (
        <Strokey text={e.text} key={e.timestamp} />
      ))}
    </div>
  )
}

export default Gallery
