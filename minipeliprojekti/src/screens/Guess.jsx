import {useState} from "react"
import {useNavigate} from "react-router-dom"

const difficulties = [
  {id: "easy", label: "Helppo", max: 50},
  {id: "medium", label: "Medium", max: 100},
  {id: "hard", label: "Vaikea", max: 200},
]

const createNumber = (max) => Math.floor(Math.random() * max) + 1

const Guess = () => {
  const navigate = useNavigate()
  const [difficulty, setDifficulty] = useState("medium")
  const activeDifficulty = difficulties.find(({id}) => id === difficulty)
  const [number, setNumber] = useState(() => createNumber(activeDifficulty.max))
  const [guess, setGuess] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [feedback, setFeedback] = useState("Arvaa numero!")
  const [hasWon, setHasWon] = useState(false)
}

export default Guess
