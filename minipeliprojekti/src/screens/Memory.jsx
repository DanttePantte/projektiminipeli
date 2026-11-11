import {useEffect, useRef, useState} from "react"
import kuva1 from "../assets/assets/kuva1.png"
import kuva2 from "../assets/assets/kuva2.jpg"
import kuva3 from "../assets/assets/kuva3.jpg"
import kuva4 from "../assets/assets/kuva4.jpg"
import kuva5 from "../assets/assets/kuva5.jpg"
import kuva6 from "../assets/assets/kuva6.jpg"
import kuva7 from "../assets/assets/kuva7.jpg"
import kuva8 from "../assets/assets/kuva8.png"
import kuva9 from "../assets/assets/kuva9.png"
import kuva10 from "../assets/assets/kuva10.jpg"
import kuva11 from "../assets/assets/kuva11.png"
import kuva12 from "../assets/assets/kuva12.png"
import kuva13 from "../assets/assets/kuva13.png"
import kuva14 from "../assets/assets/kuva14.png"
import kuva15 from "../assets/assets/kuva15.png"
import kuva16 from "../assets/assets/kuva16.png"
import kuva17 from "../assets/assets/kuva17.png"
import kuva18 from "../assets/assets/kuva18.png"
import kuva19 from "../assets/assets/kuva19.jpg"
import kuva20 from "../assets/assets/kuva20.png"
 
const images = [
  kuva1, kuva2, kuva3, kuva4, kuva5,
  kuva6, kuva7, kuva8, kuva9, kuva10,
  kuva11, kuva12, kuva13, kuva14, kuva15,
  kuva16, kuva17, kuva18, kuva19, kuva20,
]
 
const createDeck = () => {
  const cards = images.flatMap((image, pair) => [
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
  const [cards, setCards] = useState(createDeck)
  const [selectedCards, setSelectedCards] = useState([])
  const [matchedCards, setMatchedCards] = useState([])
  const [moves, setMoves] = useState(0)
  const [locked, setLocked] = useState(false)
  const timeout = useRef(null)
  const pairsFound = matchedCards.length / 2
  const gameComplete = pairsFound === images.length
 
  useEffect(() => () => clearTimeout(timeout.current), [])
 
  const restartGame = () => {
    clearTimeout(timeout.current)
    setCards(createDeck())
    setSelectedCards([])
    setMatchedCards([])
    setMoves(0)
    setLocked(false)
  }
 
}
 
export default Memory