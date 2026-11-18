import {useState} from "react"
import {useNavigate} from "react-router-dom"
import getMines from "../scripts/minesweeper/getMines"
import getNumber from "../scripts/minesweeper/getNumber"
import "../styles/minesweeper.css"

const DIFFICULTIES = {
  easy: {label: "Helppo", width: 9, height: 9, mines: 10},
  medium: {label: "Keskitaso", width: 16, height: 16, mines: 40},
  hard: {label: "Vaikea", width: 30, height: 16, mines: 99},
  extreme: {label: "Extreme", width: 30, height: 30, mines: 225},
  impossible: {label: "Impossible", width: 20, height: 20, mines: 143},
}

const createGame = () => ({
  mines: null,
  revealed: new Set(),
  flagged: new Set(),
  status: "ready",
  exploded: null,
})

const Minesweeper = () => {
  const navigate = useNavigate()
  const [difficulty, setDifficulty] = useState("easy")
  const [game, setGame] = useState(createGame)
  const {width: WIDTH, height: HEIGHT, mines: MINE_COUNT} = DIFFICULTIES[difficulty]
  const CELL_COUNT = WIDTH * HEIGHT
  const remainingMines = MINE_COUNT - game.flagged.size

  const getNeighbors = (id) => {
    const row = Math.floor(id / WIDTH)
    const column = id % WIDTH
    const neighbors = []

    for (let nextRow = Math.max(0, row - 1); nextRow <= Math.min(HEIGHT - 1, row + 1); nextRow += 1) {
      for (let nextColumn = Math.max(0, column - 1); nextColumn <= Math.min(WIDTH - 1, column + 1); nextColumn += 1) {
        const neighbor = nextRow * WIDTH + nextColumn
        if (neighbor !== id) neighbors.push(neighbor)
      }
    }

    return neighbors
  }

  const startNewGame = (nextDifficulty = difficulty) => {
    setDifficulty(nextDifficulty)
    setGame(createGame())
  }

  const revealCell = (id) => {
    if (game.status === "won" || game.status === "lost") return

    const mines = game.mines ?? getMines(WIDTH, HEIGHT, MINE_COUNT, id)

    // Clicking an open numbered cell reveals its unopened neighbors when
    // the number of adjacent flags matches the displayed number.
    if (game.revealed.has(id)) {
      const number = getNumber(id, WIDTH, HEIGHT, mines)
      const adjacentFlags = getNeighbors(id).filter((neighbor) => game.flagged.has(neighbor)).length
      if (number <= 0 || adjacentFlags !== number) return

      const neighbors = getNeighbors(id).filter((neighbor) =>
        !game.revealed.has(neighbor) && !game.flagged.has(neighbor)
      )
      const revealedMine = neighbors.find((neighbor) => mines.includes(neighbor))
      if (revealedMine !== undefined) {
        setGame({...game, mines, status: "lost", exploded: revealedMine})
        return
      }

      const revealed = new Set(game.revealed)
      const queue = [...neighbors]

      while (queue.length) {
        const current = queue.pop()
        if (revealed.has(current) || game.flagged.has(current) || mines.includes(current)) continue

        revealed.add(current)
        if (getNumber(current, WIDTH, HEIGHT, mines) === 0) {
          getNeighbors(current).forEach((neighbor) => {
            if (!revealed.has(neighbor) && !game.flagged.has(neighbor)) queue.push(neighbor)
          })
        }
      }

      const status = revealed.size === CELL_COUNT - MINE_COUNT ? "won" : "playing"
      setGame({...game, mines, revealed, status})
      return
    }

    if (game.flagged.has(id)) return

    if (mines.includes(id)) {
      setGame({...game, mines, status: "lost", exploded: id})
      return
    }

    const revealed = new Set(game.revealed)
    const queue = [id]

    while (queue.length) {
      const current = queue.pop()
      if (revealed.has(current) || game.flagged.has(current) || mines.includes(current)) continue

      revealed.add(current)
      if (getNumber(current, WIDTH, HEIGHT, mines) === 0) {
        getNeighbors(current).forEach((neighbor) => {
          if (!revealed.has(neighbor) && !game.flagged.has(neighbor)) queue.push(neighbor)
        })
      }
    }

    const status = revealed.size === CELL_COUNT - MINE_COUNT ? "won" : "playing"
    setGame({...game, mines, revealed, status})
  }

  const toggleFlag = (event, id) => {
    event.preventDefault()
    if (game.status === "won" || game.status === "lost" || game.revealed.has(id)) return

    const flagged = new Set(game.flagged)
    if (flagged.has(id)) {
      flagged.delete(id)
    } else if (flagged.size < MINE_COUNT) {
      flagged.add(id)
    }
    setGame({...game, flagged, status: game.mines ? "playing" : "ready"})
  }

  const quit = () => {
    if (window.confirm("Lopetetaanko peli?")) navigate("/")
  }

  const statusText = game.status === "won"
    ? "Voitit! Kaikki turvalliset ruudut on avattu."
    : game.status === "lost"
      ? "Osuit miinaan. Aloita uusi peli ja yritä uudelleen."
      : game.status === "ready"
        ? "Avaa ruutu aloittaaksesi. Ensimmäinen klikkaus on turvallinen."
        : "Etsi kaikki miinat."

  return (
    <main className="minesweeper-game" style={{
      "--game-width": `${Math.max(620, WIDTH * 30 + (WIDTH - 1) * 4 + 16 + 32)}px`
    }}>
      <header className="minesweeper-header">
        <div>
          <h2>Miinaharava</h2>
          <p className="minesweeper-status" aria-live="polite">{statusText}</p>
        </div>
        <div className="minesweeper-controls">
          <span className="minesweeper-counter" aria-label={`${remainingMines} miinaa jäljellä`}>
            Miinoja: {remainingMines}
          </span>
          <button type="button" onClick={() => startNewGame()}>Uusi peli</button>
          <button type="button" onClick={quit}>Lopeta</button>
        </div>
      </header>

      <div className="minesweeper-difficulty" role="group" aria-label="Vaikeustaso">
        {Object.entries(DIFFICULTIES).map(([key, option]) => (
          <button
            key={key}
            type="button"
            className={difficulty === key ? "is-active" : ""}
            aria-pressed={difficulty === key}
            onClick={() => startNewGame(key)}
          >
            {option.label} ({option.width}x{option.height}/{option.mines})
          </button>
        ))}
      </div>

      <div className="minesweeper-board" role="grid" aria-label="Miinaharavan pelilauta" style={{
        "--board-columns": WIDTH
      }}>
        {Array.from({length: CELL_COUNT}, (_, id) => {
          const isRevealed = game.revealed.has(id)
          const isFlagged = game.flagged.has(id)
          const isMine = game.mines?.includes(id) ?? false
          const showMine = isMine && (game.status === "lost" || isRevealed)
          const number = game.mines && !isMine ? getNumber(id, WIDTH, HEIGHT, game.mines) : null

          return (
            <button
              key={id}
              type="button"
              role="gridcell"
              className={`minesweeper-cell${isRevealed ? " is-revealed" : ""}${isFlagged ? " is-flagged" : ""}${showMine ? " is-mine" : ""}${game.exploded === id ? " is-exploded" : ""}${number > 0 && isRevealed ? ` number-${number}` : ""}`}
              aria-label={isFlagged ? `Ruutu ${id + 1}, lippu` : showMine ? `Ruutu ${id + 1}, miina` : isRevealed ? `Ruutu ${id + 1}, ${number === 0 ? "tyhjä" : number}` : `Ruutu ${id + 1}, suljettu`}
              disabled={game.status === "won" || game.status === "lost"}
              onClick={() => revealCell(id)}
              onContextMenu={(event) => toggleFlag(event, id)}
            >
              {isFlagged ? "⚑" : showMine ? "✹" : isRevealed && number > 0 ? number : ""}
            </button>
          )
        })}
      </div>
    </main>
  )
}

export default Minesweeper