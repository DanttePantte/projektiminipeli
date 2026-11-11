import rules from "../scripts/rules"

const GameButton = ({text, setGame, setRules}) => {
  const handleClick = () => {
    setGame(text)
    setRules(rules[text])
  }
  return (
    <button class="gameButton"
    onClick={()=>handleClick()}>{text}</button>
  )
}

export default GameButton