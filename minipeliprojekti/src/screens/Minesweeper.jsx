import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import getMines from "../scripts/minesweeper/getMines"
import getNumber from "../scripts/minesweeper/getNumber"
import get3BV, {calculateSolved3BV} from "../scripts/minesweeper/get3BV"
import "../styles/minesweeper.css"
import {test, getDifficulty} from "../scripts/minesweeper/getDifficulty"

console.log(`Test results: ${test()}`)
console.log(`Check results: ${getDifficulty(95,95,1805)}`)

const DIFFICULTIES = {
  easy: {label: "Helppo", width: 9, height: 9, mines: 10},
  medium: {label: "Keskitaso", width: 16, height: 16, mines: 40},
  hard: {label: "Vaikea", width: 30, height: 16, mines: 99},
  extreme: {label: "Extreme", width: 30, height: 30, mines: 225},
  impossible: {label: "Mahdoton", width: 20, height: 20, mines: 143},
}
const DEFAULT_CUSTOM_CONFIG = {width: 9, height: 9, mines: 10}

const createGame = () => ({
  mines: null,
  revealed: new Set(),
  flagged: new Set(),
  status: "ready",
  exploded: null,
  startedAt: null,
  elapsedSeconds: 0,
  clicks: 0,
  score3BV: 0,
  score: 0,
})

const calculateScore = (threeBV, elapsedSeconds, mineCount, width, height, clicks) => {
  // P = Diff x 3BV/s**2 x Eff**3 * 100
  const difficulty = getDifficulty(Math.min(width, height), Math.max(width, height), mineCount)
  const speed = threeBV / elapsedSeconds
  const efficiency = threeBV / clicks
  return Math.round(difficulty * speed**2 * efficiency**3 * 100)
}

const Minesweeper = () => {
  const navigate = useNavigate()
  const [difficulty, setDifficulty] = useState("easy")
  const [boardConfig, setBoardConfig] = useState(DIFFICULTIES.easy)
  const [customConfig, setCustomConfig] = useState(DEFAULT_CUSTOM_CONFIG)
  const [game, setGame] = useState(createGame)
  const {width: WIDTH, height: HEIGHT, mines: MINE_COUNT} = boardConfig
  const CELL_COUNT = WIDTH * HEIGHT
  const remainingMines = MINE_COUNT - game.flagged.size
  const customConfigIsValid = Number.isInteger(customConfig.width)
    && Number.isInteger(customConfig.height)
    && Number.isInteger(customConfig.mines)
    && customConfig.width >= 5
    && customConfig.width <= 50
    && customConfig.height >= 5
    && customConfig.height <= 50
    && customConfig.mines >= 1
    && customConfig.mines <= customConfig.width * customConfig.height - 9
  const customDifficulty = customConfigIsValid
    ? getDifficulty(Math.min(customConfig.width, customConfig.height), Math.max(customConfig.width, customConfig.height), customConfig.mines)
    : "-"

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

  const startNewGame = (nextDifficulty = difficulty, nextConfig) => {
    setDifficulty(nextDifficulty)
    setBoardConfig(nextConfig ?? (nextDifficulty === "custom" ? customConfig : DIFFICULTIES[nextDifficulty]))
    setGame(createGame())
  }

  const revealCell = (id) => {
    if (game.status === "won" || game.status === "lost") return

    const now = Date.now()
    const startedAt = game.startedAt ?? now
    const elapsedSeconds = Math.max(1, Math.floor((now - startedAt) / 1000))
    const clicks = game.clicks + 1
    const mines = game.mines ?? getMines(WIDTH, HEIGHT, MINE_COUNT, id)

    if (game.revealed.has(id)) {
      const number = getNumber(id, WIDTH, HEIGHT, mines)
      const adjacentFlags = getNeighbors(id).filter((neighbor) => game.flagged.has(neighbor)).length
      if (number <= 0 || adjacentFlags !== number) return

      const neighbors = getNeighbors(id).filter((neighbor) =>
        !game.revealed.has(neighbor) && !game.flagged.has(neighbor)
      )
      const revealedMine = neighbors.find((neighbor) => mines.includes(neighbor))
      if (revealedMine !== undefined) {
        finishLoss(game.revealed, mines, revealedMine, startedAt, elapsedSeconds, clicks)
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
      console.log(revealed.size, CELL_COUNT - MINE_COUNT)

      if (revealed.size === CELL_COUNT - MINE_COUNT) {
        finishWin(revealed, mines, startedAt, elapsedSeconds, clicks)
      } else {
        setGame({...game, mines, revealed, status: "playing", startedAt, elapsedSeconds, clicks})
      }
      return
    }

    if (game.flagged.has(id)) return

    if (mines.includes(id)) {
      finishLoss(game.revealed, mines, id, startedAt, elapsedSeconds, clicks)
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
    if (status === "won") {
      finishWin(revealed, mines, startedAt, elapsedSeconds, clicks)
    } else {
      setGame({...game, mines, revealed, status, startedAt, elapsedSeconds, clicks})
    }
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

    setGame({...game, flagged, clicks: game.clicks + 1})
  }

  const quit = () => {
    if (window.confirm("Lopetetaanko peli?")) navigate("/")
  }

  const finishWin = (revealed, mines, startedAt, elapsedSeconds, clicks) => {
    const threeBV = get3BV(WIDTH, HEIGHT, mines)
    const finalElapsed = Math.max(1, elapsedSeconds)
    const score = calculateScore(threeBV, finalElapsed, MINE_COUNT, WIDTH, HEIGHT, clicks)

    setGame((current) => ({
      ...current,
      mines,
      revealed,
      status: "won",
      elapsedSeconds: finalElapsed,
      startedAt,
      clicks,
      score3BV: threeBV,
      score,
    }))
  }

  const finishLoss = (revealed, mines, exploded, startedAt, elapsedSeconds, clicks) => {
    const threeBV = get3BV(WIDTH, HEIGHT, mines)
    const solved3BV = calculateSolved3BV(WIDTH, HEIGHT, mines, revealed)
    const finalElapsed = Math.max(1, elapsedSeconds)
    const baseScore = calculateScore(solved3BV, finalElapsed, MINE_COUNT, WIDTH, HEIGHT, clicks)
    const min3BV = ()=>{
      const cells = WIDTH * HEIGHT
      if (cells < 150) {
        return 0.4
      } else if (cells < 250) {
        return 0.3
      } else if (cells < 350) {
        return 0.2
      } else if (cells < 375) {
        return 0.15
      } else {
        return 0.1
      }
    }
    const completionMultiplier = Math.max((solved3BV / threeBV - min3BV()), 0)

    setGame((current) => ({
      ...current,
      mines,
      revealed,
      status: "lost",
      exploded,
      elapsedSeconds: finalElapsed,
      startedAt,
      clicks,
      score3BV: solved3BV,
      score: Math.round(baseScore * completionMultiplier / 2),
    }))
  }

  const statusText = game.status === "won"
    ? `Voitit! 3BV: ${game.score3BV}, pisteet: ${game.score.toLocaleString("fi-FI")}`
    : game.status === "lost"
      ? `Osuit miinaan. Ratkaistu 3BV: ${game.score3BV}, pisteet: ${game.score.toLocaleString("fi-FI")}`
      : game.status === "ready"
        ? "Avaa ruutu aloittaaksesi. Ensimmäinen klikkaus on turvallinen."
        : "Etsi kaikki miinat."

  useEffect(() => {
    if (!game.startedAt || game.status === "won" || game.status === "lost") return

    const timer = window.setInterval(() => {
      setGame((current) => ({
        ...current,
        elapsedSeconds: Math.max(1, Math.floor((Date.now() - current.startedAt) / 1000)),
      }))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [game.startedAt, game.status])

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
          <span className="minesweeper-counter">Aika: {game.elapsedSeconds}s</span>
          <span className="minesweeper-counter">Klikkaukset: {game.clicks}</span>
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
        <button
          type="button"
          className={difficulty === "custom" ? "is-active" : ""}
          aria-pressed={difficulty === "custom"}
          onClick={() => startNewGame("custom")}
        >
          Mukautettu
        </button>
      </div>

      {difficulty === "custom" && (
        <form
          className="minesweeper-custom-settings"
          onSubmit={(event) => {
            event.preventDefault()
            if (customConfigIsValid) startNewGame("custom", {...customConfig})
          }}
        >
          <label>
            Leveys
            <input
              type="number"
              min="5"
              max="50"
              step="1"
              value={customConfig.width}
              onChange={(event) => setCustomConfig({...customConfig, width: Number(event.target.value)})}
            />
          </label>
          <label>
            Korkeus
            <input
              type="number"
              min="5"
              max="50"
              step="1"
              value={customConfig.height}
              onChange={(event) => setCustomConfig({...customConfig, height: Number(event.target.value)})}
            />
          </label>
          <label>
            Miinat
            <input
              type="number"
              min="1"
              max={customConfig.width * customConfig.height - 9}
              step="1"
              value={customConfig.mines}
              onChange={(event) => setCustomConfig({...customConfig, mines: Number(event.target.value)})}
            />
          </label>
          <div className="minesweeper-custom-difficulty">
            Vaikeus: <span>{customDifficulty}</span>
          </div>
          <button type="submit" disabled={!customConfigIsValid}>
            Aloita {customConfig.width}x{customConfig.height}/{customConfig.mines}
          </button>
          {!customConfigIsValid && <span role="alert">Tarkista mitat ja miinojen määrä.</span>}
        </form>
      )}

      <div
        className="minesweeper-board"
        role="grid"
        aria-label="Miinaharavan pelilauta"
        style={{"--board-columns": WIDTH}}
        onContextMenu={(event) => event.preventDefault()}
      >
        {Array.from({length: CELL_COUNT}, (_, id) => {
          const isRevealed = game.revealed.has(id)
          const isFlagged = game.flagged.has(id)
          const isMine = game.mines?.includes(id) ?? false
          const showMine = isMine && (game.status === "lost" || isRevealed)
          const number = game.mines && !isMine ? getNumber(id, WIDTH, HEIGHT, game.mines) : null
          const row = Math.floor(id / WIDTH)
          const column = id % WIDTH
          const boundaryClasses = `${row > 0 && isRevealed !== game.revealed.has(id - WIDTH) ? " boundary-top" : ""}${column < WIDTH - 1 && isRevealed !== game.revealed.has(id + 1) ? " boundary-right" : ""}${row < HEIGHT - 1 && isRevealed !== game.revealed.has(id + WIDTH) ? " boundary-bottom" : ""}${column > 0 && isRevealed !== game.revealed.has(id - 1) ? " boundary-left" : ""}`

          return (
            <button
              key={id}
              type="button"
              role="gridcell"
              className={`minesweeper-cell${isRevealed ? " is-revealed" : ""}${isFlagged ? " is-flagged" : ""}${showMine ? " is-mine" : ""}${game.exploded === id ? " is-exploded" : ""}${number > 0 && isRevealed ? ` number-${number}` : ""}${boundaryClasses}`}
              aria-label={isFlagged ? `Ruutu ${id + 1}, lippu` : showMine ? `Ruutu ${id + 1}, miina` : isRevealed ? `Ruutu ${id + 1}, ${number === 0 ? "tyhjä" : number}` : `Ruutu ${id + 1}, suljettu`}
              disabled={game.status === "won" || game.status === "lost"}
              onMouseDown={(event) => {
                if (event.button === 0) revealCell(id)
              }}
              onContextMenu={(event) => toggleFlag(event, id)}
            >
              {isFlagged ? "⚑" : showMine ? "✹" : isRevealed && number > 0 ? number : ""}
            </button>
          )
        })}
      </div>
      <div id="difficultyDisplay">
        Vaikeustaso: <span id="difficultyNumber">{getDifficulty(Math.min(WIDTH, HEIGHT), Math.max(WIDTH, HEIGHT), MINE_COUNT)}</span>
      </div>
    </main>
  )
}

export default Minesweeper