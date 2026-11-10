import {Routes, Route, useNavigate} from "react-router-dom"
import {useState, useEffect} from "react"
import Main from "./screens/Mainpage"
import Memory from "./screens/Memory"
import Guess from "./screens/Guess"
import _2048 from "./screens/2048"

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
      </Routes>
    </>
  )
}

export default App