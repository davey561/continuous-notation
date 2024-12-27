import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import Strokey from "./Strokey"
import { StrokeyThought } from "./StrokeyMaker"
import "./Gallery.css"

const Gallery = ({
  strokeyThoughts,
  setStrokeyThoughts,
}: {
  strokeyThoughts: StrokeyThought[]
  setStrokeyThoughts: React.Dispatch<React.SetStateAction<StrokeyThought[] | undefined>>
}) => {
  const ordered = strokeyThoughts.sort((a, b) => b.timestamp - a.timestamp)
  const handleDelete = (timestamp: number) => {
    const updatedThoughts = strokeyThoughts.filter((thought) => thought.timestamp !== timestamp)
    setStrokeyThoughts(updatedThoughts)
    localStorage.setItem("StrokeyThoughts", JSON.stringify(updatedThoughts))
  }
  return (
    <div className="gallery" key={strokeyThoughts.length}>
      {strokeyThoughts.map((e: StrokeyThought) => (
        <Strokey text={e.text} key={e.timestamp} timestamp={e.timestamp} onDelete={handleDelete} />
      ))}
    </div>
  )
}

export default Gallery
