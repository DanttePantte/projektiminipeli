import rules from "./rules"

const GameButton = ({text, setGame, setRules}) => {
  const handleClick = () => {
    setGame(text)
    setRules(rules[text])
    console.log(rules)
  }
  return (
    <button class="gameButton"
    onClick={()=>handleClick()}>{text}</button>
  )
}

export default GameButton