import {useState} from "react"
import {useNavigate} from "react-router-dom"
import GameResults from "../components/GameResults"
import "../styles/mahjong.css"

const tileFaces = [
  ...[
    {suit: "character", label: "kuvio"},
    {suit: "bamboo", label: "bambu"},
    {suit: "circle", label: "ympyrä"},
  ].flatMap(({suit, label}) =>
    Array.from({length: 9}, (_, index) => ({
      id: `${suit}-${index + 1}`,
      suit,
      value: index + 1,
      label: `${label} ${index + 1}`,
    }))
  ),
  {id: "dragon-red", suit: "dragon-red", label: "punainen lohikäärme"},
  {id: "dragon-green", suit: "dragon-green", label: "vihreä lohikäärme"},
  {id: "dragon-white", suit: "dragon-white", label: "valkoinen lohikäärme"},
]

const pipPositions = [
  [9, 9], [18, 9], [27, 9],
  [9, 18], [18, 18], [27, 18],
  [9, 27], [18, 27], [27, 27],
]

const TileIcon = ({face}) => {
  if (face.suit.startsWith("dragon")) {
    return (
      <svg className={`mahjong-icon ${face.suit}`} viewBox="0 0 36 36" aria-hidden="true">
        {face.suit === "dragon-red" && <path d="M18 3c-1 7-9 10-7 18 1 4 4 6 7 7-1-5 5-6 6-12 4 5 3 12-1 16 8-3 12-11 7-19-2 6-5 6-6 1-1-5-3-8-6-11Z" fill="currentColor" />}
        {face.suit === "dragon-green" && <path d="M18 32V13M18 21c-8 0-11-4-10-10 7 0 10 3 10 10ZM18 17c0-7 4-11 11-11 0 7-4 11-11 11ZM18 27c-6 0-9-3-9-8 6 0 9 3 9 8ZM18 24c0-5 3-8 8-8 0 5-3 8-8 8Z" fill="currentColor" />}
        {face.suit === "dragon-white" && <><circle cx="18" cy="18" r="11" fill="none" stroke="currentColor" strokeWidth="2.5" /><path d="m18 9 2.7 6.3L27 18l-6.3 2.7L18 27l-2.7-6.3L9 18l6.3-2.7L18 9Z" fill="currentColor" /></>}
      </svg>
    )
  }

  return (
    <svg className={`mahjong-icon suit-${face.suit}`} viewBox="0 0 36 36" aria-hidden="true">
      {pipPositions.slice(0, face.value).map(([x, y], index) => {
        if (face.suit === "circle") {
          return <circle key={index} cx={x} cy={y} r="3" fill="currentColor" />
        }
        if (face.suit === "bamboo") {
          return <g key={index}>
            <rect x={x - 2} y={y - 4} width="4" height="8" rx="2" fill="currentColor" />
            <path d={`M${x - 1.5} ${y}h3`} stroke="#131025" strokeWidth="0.8" />
          </g>
        }
        return <path key={index} d={`M${x} ${y - 3.5}  L${x + 3.5} ${y} ${x} ${y + 3.5} ${x - 3.5} ${y}Z`} fill="currentColor" />
      })}
    </svg>
  )
}

const layerLayout = [
  {layer: 0, rows: 15, columns: 12, offsetRow: 0, offsetColumn: 0, hole: [5, 9, 3, 8]},
  {layer: 1, rows: 14, columns: 11, offsetRow: 1, offsetColumn: 1, hole: [5, 8, 2, 7]},
  {layer: 2, rows: 13, columns: 10, offsetRow: 2, offsetColumn: 2, hole: [4, 8, 2, 6]},
]

const difficultyLevels = [
  {id: "easy", label: "Helppo", layers: 1},
  {id: "medium", label: "Medium", layers: 2},
  {id: "hard", label: "Vaikea", layers: 3},
]

const getPositions = (layouts) => layouts.flatMap(({layer, rows, columns, offsetRow, offsetColumn, hole}) => {
  const [rowStart, rowEnd, colStart, colEnd] = hole

  const cells = []
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const absoluteRow = offsetRow + row
      const absoluteColumn = offsetColumn + column

      const isInsideHole = absoluteRow >= rowStart && absoluteRow <= rowEnd && absoluteColumn >= colStart && absoluteColumn <= colEnd
      if (isInsideHole) continue

      cells.push({
        row: absoluteRow,
        column: absoluteColumn,
        layer,
      })
    }
  }

  return cells
})

const shuffle = (items) => {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]]
  }
  return shuffled
}

const getBoardPositions = (difficulty) => {
  const level = difficultyLevels.find(({id}) => id === difficulty)
  const positions = getPositions(layerLayout.slice(0, level.layers))
  const boardPositions = positions.length % 2 === 1 ? positions.slice(0, -1) : positions
  return boardPositions
}

const createTiles = (difficulty) => {
  const boardPositions = getBoardPositions(difficulty)
  const pairCount = boardPositions.length / 2
  const facePairs = shuffle(tileFaces.flatMap((face) =>
    Array.from({length: Math.ceil(pairCount / tileFaces.length)}, () => [face, face])
  ))
  const faces = facePairs.slice(0, pairCount).flat()
  return boardPositions.map((position, index) => ({...position, id: index, face: faces[index]}))
}

const getFreeTiles = (tiles, removed) => {
  const remaining = tiles.filter(({id}) => !removed.has(id))
  return remaining.filter((tile) => {
    const covered = remaining.some((other) =>
      other.layer > tile.layer && other.row === tile.row && other.column === tile.column
    )
    const leftBlocked = remaining.some((other) =>
      other.layer === tile.layer && other.row === tile.row && other.column === tile.column - 1
    )
    const rightBlocked = remaining.some((other) =>
      other.layer === tile.layer && other.row === tile.row && other.column === tile.column + 1
    )
    return !covered && (!leftBlocked || !rightBlocked)
  })
}

const Mahjong = () => {
  const navigate = useNavigate()
  const [difficulty, setDifficulty] = useState("hard")
  const [tiles, setTiles] = useState(() => createTiles("hard"))
  const [removed, setRemoved] = useState(() => new Set())
  const [selected, setSelected] = useState(null)
  const [hint, setHint] = useState([])
  const [message, setMessage] = useState("Valitse kaksi samanlaista vapaata laattaa.")
  const [moves, setMoves] = useState(0)
  const [round, setRound] = useState(0)
  const freeTiles = getFreeTiles(tiles, removed)
  const remainingPairs = (tiles.length - removed.size) / 2

  const restart = (nextDifficulty = difficulty) => {
    setDifficulty(nextDifficulty)
    setTiles(createTiles(nextDifficulty))
    setRemoved(new Set())
    setSelected(null)
    setHint([])
    setMessage("Valitse kaksi samanlaista vapaata laattaa.")
    setMoves(0)
    setRound((currentRound) => currentRound + 1)
  }

  const selectTile = (tile) => {
    if (!freeTiles.some(({id}) => id === tile.id)) return
    setHint([])

    if (selected === null) {
      setSelected(tile.id)
      return
    }
    if (selected === tile.id) {
      setSelected(null)
      return
    }

    setMoves((current) => current + 1)
    const firstTile = tiles.find(({id}) => id === selected)
    if (firstTile.face.id === tile.face.id) {
      setRemoved((current) => new Set([...current, firstTile.id, tile.id]))
      setSelected(null)
      setMessage("Pari poistettu!")
    } else {
      setSelected(tile.id)
      setMessage("Laatat eivät ole pari. Kokeile toista.")
    }
  }

  const showHint = () => {
    const available = getFreeTiles(tiles, removed)
    const pair = available.find((tile, index) =>
      available.slice(index + 1).some((other) => other.face.id === tile.face.id)
    )
    if (!pair) {
      setHint([])
      setMessage("Vapaita pareja ei löydy. Sekoita laatat jatkaaksesi.")
      return
    }
    const match = available.find((tile) => tile.id !== pair.id && tile.face === pair.face)
    setHint([pair.id, match.id])
    setMessage(`Vihje: pari ${pair.face.label}`)
  }

  const shuffleRemaining = () => {
    const free = getFreeTiles(tiles, removed)
    if (free.length < 2) {
      setMessage("Laattoja ei voi enää sekoittaa.")
      return
    }

    const availableTiles = tiles.filter(({id}) => !removed.has(id))
    const forcedFace = free[0].face
    const faces = availableTiles.map(({face}) => face)
    faces.splice(faces.indexOf(forcedFace), 1)
    faces.splice(faces.indexOf(forcedFace), 1)
    const remainingFaces = shuffle(faces)
    let faceIndex = 0
    const freeIds = new Set(free.slice(0, 2).map(({id}) => id))

    setTiles((current) => current.map((tile) => {
      if (removed.has(tile.id)) return tile
      if (freeIds.has(tile.id)) return {...tile, face: forcedFace}
      return {...tile, face: remainingFaces[faceIndex++]}
    }))
    setSelected(null)
    setHint([])
    setMessage("Vapaiden laattojen uudet kuviot on sekoitettu.")
  }

  return (
    <main className="mahjong-game">
      <header className="mahjong-header">
        <div>
          <h2>Mahjong</h2>
          <p>Siirrot: {moves} <span aria-hidden="true">·</span> Pareja jäljellä: {remainingPairs}</p>
        </div>
        <div className="mahjong-controls">
          <button type="button" onClick={showHint} title="Näytä vapaa pari">Vihje</button>
          <button type="button" onClick={shuffleRemaining} title="Sekoita jäljellä olevat laatat">Sekoita</button>
          <button type="button" onClick={restart} title="Aloita uusi peli">Uusi peli</button>
        </div>
      </header>

      <div className="mahjong-difficulty" role="group" aria-label="Vaikeustaso">
        {difficultyLevels.map(({id, label}) => (
          <button
            key={id}
            type="button"
            className={difficulty === id ? "is-active" : ""}
            aria-pressed={difficulty === id}
            onClick={() => restart(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="mahjong-message" aria-live="polite">
        {remainingPairs === 0 ? "Kaikki parit löytyivät. Hienosti pelattu!" : message}
      </p>

      <div className="mahjong-board" role="group" aria-label="Mahjong-laudalla olevat laatat">
        {tiles.map((tile) => {
          const isRemoved = removed.has(tile.id)
          const isFree = freeTiles.some(({id}) => id === tile.id)
          const isSelected = selected === tile.id
          const isHinted = hint.includes(tile.id)

          return (
            <button
              key={tile.id}
              type="button"
              className={`mahjong-tile layer-${tile.layer}${tile.layer ? " is-layered" : ""}${isSelected ? " is-selected" : ""}${isHinted ? " is-hinted" : ""}${isFree ? " is-free" : ""}${!isFree ? " is-blocked" : ""}${isRemoved ? " is-removed" : ""}`}
              style={{gridRow: tile.row + 1, gridColumn: tile.column + 1, zIndex: tile.layer + 1}}
              aria-label={isRemoved ? "Poistettu laatta" : `Laatta ${tile.face.label}${isFree ? ", vapaa" : ", estetty"}`}
              aria-pressed={isSelected || isHinted}
              disabled={isRemoved || !isFree}
              onClick={() => selectTile(tile)}
            >
              <TileIcon face={tile.face} />
            </button>
          )
        })}
      </div>

      <button className="mahjong-back" type="button" onClick={() => navigate("/")}>Takaisin</button>
      <GameResults
        game="mahjong"
        score={Math.round((10000 * (tiles.length / 2)) / Math.max(moves, 1))}
        complete={remainingPairs === 0}
        round={round}
      />
    </main>
  )
}

export default Mahjong
