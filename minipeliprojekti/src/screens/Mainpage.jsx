import GameButton from "../components/gameButton"

const Main = () => {
  return (<div id="mainContainer">
    <div id="mainLeft"><p>Pelit</p><br/>
      <GameButton text="Muistipeli"/>
      <GameButton text="Arvaa numero"/>
      <GameButton text="2048"/>
    </div>
    <div id="mainRight">Pelin säännöt</div>
  </div>)
}

export default Main