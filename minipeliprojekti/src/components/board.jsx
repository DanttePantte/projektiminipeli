import { useEffect, useState } from "react"
import NumberRow from "./NumberRow"
import createInitialBoard from "../scripts/2048/createInitialBoard"
import createListener from "../scripts/2048/createListener"

const createGame = () => ({
  board: createInitialBoard(0),
  score: 0,
  status: "playing",
})

const Board = () => {
  const [game, setGame] = useState(createGame)

  useEffect(() => {
    const cleanup = createListener(setGame)
    return cleanup
  }, [])

  return (<>
    <div id="scoreDisplay">
      <p class="scoreItem">Pisteet: {game.score}</p>
      {game.status === "won" && <p class="scoreItem">Voitit!</p>}
      {game.status === "over" && <p class="scoreItem">Peli päättyi.</p>}
      <button class="scoreItem" onClick={() => setGame(createGame())}>Aloita alusta</button>
      {game.status === "won" && <button class="scoreItem" onClick={() => {
        setGame((currentGame) => ({ ...currentGame, status: "freeplay" }))
      }}>Jatka peliä</button>}
    </div>
    <div id="gameContainer" role="grid">
      {game.board.map((values, row) => (
        <NumberRow key={row} row={row} values={values}/>
      ))}
    </div>
  </>)
}

export default Board