import NumberRow from "./NumberRow"

const Board = () => {
  return (<>
    <div id="gameContainer">
      <NumberRow row={0}/>
      <NumberRow row={1}/>
      <NumberRow row={2}/>
      <NumberRow row={3}/>
    </div>
  </>)
}

export default Board