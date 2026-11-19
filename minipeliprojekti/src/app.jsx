import {Routes, Route, Link, useNavigate} from "react-router-dom"
import {useState, useEffect} from "react"
import Main from "./screens/Mainpage"
import Memory from "./screens/Memory"
import Guess from "./screens/Guess"
import _2048 from "./screens/2048"
import Mahjong from "./screens/Mahjong"
import Minesweeper from "./screens/Minesweeper"

const optionalStylesheets = import.meta.glob("./styles/glow-extra.css", {
  eager: true,
  query: "?inline",
  import: "default",
})
const glowStylesheet = Object.values(optionalStylesheets)[0]

if (glowStylesheet && !document.getElementById("glow-extra-styles")) {
  const styleElement = document.createElement("style")
  styleElement.id = "glow-extra-styles"
  styleElement.textContent = glowStylesheet
  document.head.append(styleElement)
}

const App = () => {
  return (
    <>
      <div id="titleBar">
        <h1>Minipelit</h1>
      </div>
      <Routes>
        <Route path="/" element={
          <Main/>
        }/>
        <Route path="/memory" element={
          <Memory/>
        }/>
        <Route path="/guess" element={
          <Guess/>
        }/>
        <Route path="/2048" element={
          <_2048/>
        }/>
        <Route path="/mahjong" element={
          <Mahjong/>
        }/>
        <Route path="/minesweeper" element={
          <Minesweeper/>
        }/>
      </Routes>
    </>
  )
}

export default App