import hasWon from "./hasWon"
import moveBoard from "./moveBoard"
import spawnTile from "./spawnTile"
import canMove from "./canMove"

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

const createListener = (setGame) => {
  const handleMove = (event) => {
    const direction = keyDirections[event.key.toLowerCase()]
    if (!direction) {
      return
    }

    event.preventDefault()
    setGame((currentGame) => {
      if (currentGame.status !== "playing" && currentGame.status !== "freeplay") {
        return currentGame
      }

      const result = moveBoard(currentGame.board, direction)
      if (!result.moved) {
        return currentGame
      }

      const board = spawnTile(result.board)
      const status = 
        currentGame.status == "freeplay"
        ? "freeplay"
        : hasWon(board) 
          ? "won" 
          : canMove(board) 
            ? "playing" 
            : "over"

      return {
        board,
        freshCells: result.mergedCells,
        score: currentGame.score + result.score,
        status,
      }
    })
  }

  window.addEventListener("keydown", handleMove)
  return () => window.removeEventListener("keydown", handleMove)
}

export default createListener