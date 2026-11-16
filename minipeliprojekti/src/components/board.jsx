import { useEffect, useState } from "react"
import NumberRow from "./NumberRow"
import createInitialBoard from "../scripts/2048/createInitialBoard"
import createListener from "../scripts/2048/createListener"

const createGame = () => ({
  board: createInitialBoard(0),
  freshCells: [],
  score: 0,
  status: "playing",
})

const Board = () => {
  const [game, setGame] = useState(createGame)
  const [animationsEnabled, setAnimationsEnabled] = useState(true)

  useEffect(() => {
    const cleanup = createListener(setGame)
    return cleanup
  }, [])

  return (<>
    <div id="scoreDisplay">
      <p className="scoreItem">Pisteet: {game.score}</p>
      {game.status === "won" && <p className="scoreItem">Voitit!</p>}
      {game.status === "over" && <p className="scoreItem">Peli päättyi.</p>}
      <button
        className="scoreItem"
        type="button"
        aria-pressed={animationsEnabled}
        onClick={() => setAnimationsEnabled((enabled) => !enabled)}
      >
        Soluanimaatiot: {animationsEnabled ? "päällä" : "pois"}
      </button>
      <button className="scoreItem" onClick={() => setGame(createGame())}>Aloita alusta</button>
      {game.status === "won" && <button className="scoreItem" onClick={() => {
        setGame((currentGame) => ({ ...currentGame, status: "freeplay" }))
      }}>Jatka peliä</button>}
    </div>
    <div id="gameContainer" className={animationsEnabled ? "" : "no-cell-animations"} role="grid">
      {game.board.map((values, row) => (
        <NumberRow key={row} row={row} values={values} freshCells={game.freshCells}/>
      ))}
    </div>
  </>)
}

export default Board