import {useState} from "react"
import MainLeft from "../components/MainLeft"
import MainRight from "../components/MainRight"

const Main = () => {
  const [selectedGame, setGame] = useState("2048")
  const [gameRules, setRules] = useState("Kato vaikka googlesta")
  return (<div id="mainContainer">
    <MainLeft setGame={setGame} setRules={setRules}/>
    <MainRight gameRules={gameRules} selectedGame={selectedGame}/>
  </div>)
}

export default Main