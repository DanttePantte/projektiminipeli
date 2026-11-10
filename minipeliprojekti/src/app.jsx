import {Routes, Route, useNavigate} from "react-router-dom"
import {useState, useEffect} from "react"

const App = () => {
  const nav = useNavigate()
  return (
    <>
      <div id="titleBar">
        <h1>Minipelit</h1>
      </div>
    </>
  )
}

export default App