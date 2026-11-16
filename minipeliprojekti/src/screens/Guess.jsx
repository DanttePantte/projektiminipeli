import {useState} from "react"
import {useNavigate} from "react-router-dom"
import "../styles/guess.css"

const difficulties = [
  {id: "easy", label: "Helppo", max: 50},
  {id: "medium", label: "Medium", max: 100},
  {id: "hard", label: "Vaikea", max: 167},
]

const createNumber = (max) => Math.floor(Math.random() * max) + 1

const Guess = () => {
  const navigate = useNavigate()
  const [difficulty, setDifficulty] = useState("medium")
  const activeDifficulty = difficulties.find(({id}) => id === difficulty) ?? difficulties[1]
  const [number, setNumber] = useState(() => createNumber(activeDifficulty.max))
  const [guess, setGuess] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [feedback, setFeedback] = useState("Arvaa numero!")
  const [isWon, setIsWon] = useState(false)

  const startNewGame = (nextDifficulty = difficulty) => {
    const selectedDifficulty = difficulties.find(({id}) => id === nextDifficulty) ?? activeDifficulty
    setDifficulty(nextDifficulty)
    setNumber(createNumber(selectedDifficulty.max))
    setGuess("")
    setAttempts(0)
    setFeedback("Arvaa numero!")
    setIsWon(false)
  }

  const handleGuess = (event) => {
    event.preventDefault()

    if (isWon) {
      return
    }

    const nextGuess = Number.parseInt(guess, 10)

    if (Number.isNaN(nextGuess)) {
      setFeedback("Syötä numero!")
      return
    }
// tälyllä tehty
    if (nextGuess < 1 || nextGuess > activeDifficulty.max) {
      setFeedback(`Syötä luku väliltä 1-${activeDifficulty.max}.`)
      return
    }

    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)

    if (nextGuess === number) {
      setFeedback(`Oikein! Arvasit numeron ${number} ${nextAttempts} yrityksellä.`)
      setIsWon(true)
      return
    }

    setGuess("")
    setFeedback(nextGuess < number ? "Liian pieni!" : "Liian suuri!")
  }
//
  return (
    <main className="guess-game">
      <h2>Arvaa numero</h2>

      <div className="guess-levels" role="group" aria-label="Vaikeustaso">
        {difficulties.map(({id, label}) => (
          <button
            key={id}
            type="button"
            className={difficulty === id ? "is-active" : ""}
            aria-pressed={difficulty === id}
            onClick={() => startNewGame(id)}
          >{label}
          </button>
        ))}
      </div>

      <p>Arvauksia: {attempts}</p>

      <form className="guess-form" onSubmit={handleGuess}>
        <label htmlFor="guess-number">Arvaa luku</label>
        <input
          id="guess-number"
          type="number"
          min="1"
          max={activeDifficulty.max}
          value={guess}
          onChange={(event) => setGuess(event.target.value)}
          disabled={isWon}
        />
        <button type="submit" disabled={isWon || guess === ""}>Arvaa</button>
      </form>

      <p className="guess-feedback">{feedback}</p>

      <div className="guess-actions">
        <button type="button" onClick={() => startNewGame()}>Uusi peli</button>
        <button type="button" onClick={() => navigate("/")}>Takaisin</button>
      </div>
    </main>
  )
}

export default Guess
