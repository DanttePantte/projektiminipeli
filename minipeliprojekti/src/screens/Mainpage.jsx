import {useState} from "react"
import {useNavigate} from "react-router-dom"
import MainLeft from "../components/MainLeft"
import MainRight from "../components/MainRight"

const Main = () => {
  const [selectedGame, setGame] = useState("2048")
  const [gameRules, setRules] = useState("Kato vaikka googlesta")
  const navigate = useNavigate()
  const gamePaths = {
    "Muistipeli": "/memory",
    "Arvaa numero": "/guess",
    "2048": "/2048",
  }

  return (<div id="mainContainer">
    <MainLeft setGame={setGame} setRules={setRules}/>
    <div id="mainRight"><p>Säännöt</p><br/>
      <h2 id="name">{selectedGame}</h2>
      <p id="rules">{gameRules}</p>
      <button
        className="startGameButton"
        onClick={() => navigate(gamePaths[selectedGame])}
        type="button"
      >
        Aloita peli
      </button>
    </div>
  </div>)
}

export default Main