import GameButton from "./gameButton"

const MainLeft = ({setGame, setRules}) => {
  return (
    <div id="mainLeft"><p>Pelit</p><br/>
      <GameButton text="Muistipeli" setGame={setGame} setRules={setRules}/>
      <GameButton text="Arvaa numero" setGame={setGame} setRules={setRules}/>
      <GameButton text="2048" setGame={setGame} setRules={setRules}/>
    </div>
  )
}

export default MainLeft