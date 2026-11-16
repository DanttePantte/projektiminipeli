import {useNavigate} from "react-router-dom"
import Board from "../components/board"
import "../styles/2048.css"

const _2048 = () => {
  const nav = useNavigate()
  return (<main className="game-2048">
    <h1>2048</h1>
    <button onClick={()=>nav("/")}>Takaisin</button>
    <Board/>
  </main>)
}

export default _2048

// With AI:
// "Continue game" option
// Event handler
// Box glow styles
// Some bugfixes
// Both animations & animation toggles