import {Routes, Route, useNavigate} from "react-router-dom"
import {useState, useEffect} from "react"
import Main from "./screens/Mainpage"

const App = () => {
  return (
    <>
      <div id="titleBar">
        <h1>Minipelit</h1>
      </div>
      <Main/>
    </>
  )
}

export default App