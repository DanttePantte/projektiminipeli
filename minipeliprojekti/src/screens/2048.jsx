import {useNavigate} from "react-router-dom"

const _2048 = () => {
  const nav = useNavigate()
  return (<>
    <h1>2048</h1>
    <pre>Tänne tulee peli</pre>
    <button onClick={()=>nav("/")}>Takaisin</button>
  </>)
}

export default _2048