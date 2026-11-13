import { useState } from "react"
import NumberRow from "./NumberRow"
import canMove from "../scripts/2048/canMove"
import createInitialBoard from "../scripts/2048/createInitialBoard"
import hasWon from "../scripts/2048/hasWon"
import moveBoard from "../scripts/2048/moveBoard"
import spawnTile from "../scripts/2048/spawnTile"

const createGame = () => ({
  board: createInitialBoard(true),
  score: 0,
  status: "playing",
})

const keyDirections = {
  arrowleft: "left",
  a: "left",
  arrowright: "right",
  d: "right",
  arrowup: "up",
  w: "up",
  arrowdown: "down",
  s: "down",
}

const Board = () => {
  const [game, setGame] = useState(createGame)

  const attachKeyboardListener = () => {
    const handleMove = (event) => {
      const direction = keyDirections[event.key.toLowerCase()]
      if (!direction) {
        return
      }

      event.preventDefault()
      setGame((currentGame) => {
        if (currentGame.status !== "playing") {
          return currentGame
        }

        const result = moveBoard(currentGame.board, direction)
        if (!result.moved) {
          return currentGame
        }

        const board = spawnTile(result.board)
        const status = hasWon(board) ? "won" : canMove(board) ? "playing" : "over"

        return {
          board,
          score: currentGame.score + result.score,
          status,
        }
      })
    }

    window.addEventListener("keydown", handleMove)
    return () => window.removeEventListener("keydown", handleMove)
  }

  return (<>
    <p>Pisteet: {game.score}</p>
    {game.status === "won" && <p>Voitit!</p>}
    {game.status === "over" && <p>Peli päättyi.</p>}
    <button onClick={() => setGame(createGame())}>Aloita alusta</button>
    <div id="gameContainer" ref={attachKeyboardListener} role="grid" aria-label="2048 pelilauta">
      {game.board.map((values, row) => (
        <NumberRow key={row} row={row} values={values}/>
      ))}
    </div>
  </>)
}

export default Board