import {useNavigate} from "react-router-dom"

const MainRight = ({selectedGame, gameRules}) => {
  const nav = useNavigate()
  const handleClick = () => {
    // switch block with AI
    switch(selectedGame){
      case "Muistipeli": return nav("./memory")
      case "Arvaa numero": return nav("./guess")
      case "2048": return nav("./2048")
    }
  }
  return (
    <div id="mainRight"><p>Säännöt</p><br/>
      <h2 id="name">{selectedGame}</h2>
      <p id="rules">{gameRules}</p>
      <button id="startGame" onClick={()=>handleClick()}>Aloita</button>
    </div>
  )
}

export default MainRight