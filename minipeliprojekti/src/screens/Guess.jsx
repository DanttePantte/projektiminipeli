import {useNavigate} from "react-router-dom"

const Guess = () => {
  const nav = useNavigate()
  return (<>
    <h1>Arvaa numero</h1>
    <pre>Tänne tulee numeron arvaliupeli</pre>
    <button onClick={()=>nav("/")}>Takaisin</button>
  </>)
}

export default Guess