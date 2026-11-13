import {useEffect, useRef, useState} from "react"
import {useNavigate} from "react-router-dom"
import kuva1 from "../assets/kuva1.png"
import kuva2 from "../assets/kuva2.jpg"
import kuva3 from "../assets/kuva3.jpg"
import kuva4 from "../assets/kuva4.jpg"
import kuva5 from "../assets/kuva5.jpg"
import kuva6 from "../assets/kuva6.jpg"
import kuva7 from "../assets/kuva7.jpg"
import kuva8 from "../assets/kuva8.png"
import kuva9 from "../assets/kuva9.png"
import kuva10 from "../assets/kuva10.jpg"
import kuva11 from "../assets/kuva11.png"
import kuva12 from "../assets/kuva12.png"
import kuva13 from "../assets/kuva13.png"
import kuva14 from "../assets/kuva14.png"
import kuva15 from "../assets/kuva15.png"
import kuva16 from "../assets/kuva16.png"
import kuva17 from "../assets/kuva17.png"
import kuva18 from "../assets/kuva18.png"
import kuva19 from "../assets/kuva19.jpg"
import kuva20 from "../assets/kuva20.png"

const images = [
  kuva1, kuva2, kuva3, kuva4, kuva5,
  kuva6, kuva7, kuva8, kuva9, kuva10,
  kuva11, kuva12, kuva13, kuva14, kuva15,
  kuva16, kuva17, kuva18, kuva19, kuva20,
]

const difficulties = [
  {id: "easy", label: "Helppo", pairs: 6},
  {id: "medium", label: "Medium", pairs: 12},
  {id: "hard", label: "Vaikea", pairs: 20},
]

const createDeck = (pairCount) => {
  const cards = images.slice(0, pairCount).flatMap((image, pair) => [
    {id: `${pair}-a`, pair, image},
    {id: `${pair}-b`, pair, image},
  ])

  for (let index = cards.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[cards[index], cards[randomIndex]] = [cards[randomIndex], cards[index]]
  }

  return cards
}

const Memory = () => {
  const navigate = useNavigate()
  const [difficulty, setDifficulty] = useState("medium")
  const activeDifficulty = difficulties.find(({id}) => id === difficulty)
  const [cards, setCards] = useState(() => createDeck(activeDifficulty.pairs))
  const [selectedCards, setSelectedCards] = useState([])
  const [matchedCards, setMatchedCards] = useState([])
  const [moves, setMoves] = useState(0)
  const [locked, setLocked] = useState(false)
  const timeout = useRef(null)
  const pairsFound = matchedCards.length / 2
  const gameComplete = pairsFound === activeDifficulty.pairs
 
  useEffect(() => () => clearTimeout(timeout.current), [])
 
  const restartGame = (nextDifficulty = difficulty) => {
    clearTimeout(timeout.current)
    setDifficulty(nextDifficulty)
    setCards(createDeck(difficulties.find(({id}) => id === nextDifficulty).pairs))
    setSelectedCards([])
    setMatchedCards([])
    setMoves(0)
    setLocked(false)
  }

  const selectCard = (card) => {
    if (locked || matchedCards.includes(card.id) || selectedCards.some((selected) => selected.id === card.id)) {
      return
    }

    const nextSelectedCards = [...selectedCards, card]
    setSelectedCards(nextSelectedCards)

    if (selectedCards.length === 0) {
      return
    }

    setMoves((currentMoves) => currentMoves + 1)
    setLocked(true)

    const isMatch = selectedCards[0].pair === card.pair
    if (isMatch) {
      setMatchedCards((currentMatches) => [...currentMatches, ...nextSelectedCards.map(({id}) => id)])
    }

    timeout.current = setTimeout(() => {
      setSelectedCards([])
      setLocked(false)
    }, isMatch ? 500 : 1000)
  }

  return (
    <main className="memory-game">
      <header className="memory-header">
        <div>
          <h2>Muistipeli</h2>
          <p>Siirrot: {moves} · Parit: {pairsFound}/{activeDifficulty.pairs}</p>
        </div>
        <button type="button" onClick={restartGame}>Aloita alusta</button>
      </header>

      <div className="memory-levels" role="group" aria-label="Vaikeustaso">
        {difficulties.map(({id, label}) => (
          <button
            key={id}
            type="button"
            className={difficulty === id ? "is-active" : ""}
            aria-pressed={difficulty === id}
            onClick={() => restartGame(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {gameComplete && <p className="memory-complete">Kaikki parit löytyivät! Hienosti pelattu.</p>}

      <div className="memory-grid">
        {cards.map((card) => {
          const revealed = selectedCards.some((selected) => selected.id === card.id) || matchedCards.includes(card.id)

          return (
            <button
              key={card.id}
              type="button"
              className={`memory-card${revealed ? " is-revealed" : ""}${matchedCards.includes(card.id) ? " is-matched" : ""}`}
              aria-label={revealed ? `Kuva ${card.pair + 1}` : "Käännä kortti"}
              aria-pressed={revealed}
              onClick={() => selectCard(card)}
            >
              {revealed ? <img src={card.image} alt="" /> : <span>?</span>}
            </button>
          )
        })}
      </div>

      <button className="memory-back" type="button" onClick={() => navigate("/")}>Takaisin</button>
    </main>
  )
}
 
export default Memory