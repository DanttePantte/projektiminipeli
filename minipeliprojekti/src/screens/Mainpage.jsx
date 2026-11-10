import {useState} from "react"
import MainLeft from "../components/MainLeft"

const Main = () => {
  const [selectedGame, setGame] = useState("2048")
  const [gameRules, setRules] = useState("Kato vaikka googlesta")
  return (<div id="mainContainer">
    <MainLeft setGame={setGame} setRules={setRules}/>
    <div id="mainRight"><p>Säännöt</p><br/>
      <h2 id="name">{selectedGame}</h2>
      <p id="rules">{gameRules}</p>
    </div>
  </div>)
}

export default Main