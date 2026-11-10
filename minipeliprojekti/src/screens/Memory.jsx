import {useNavigate} from "react-router-dom"
import getImgs from "../scripts/getImages"

const images = getImgs(20)

const Memory = () => {
  const nav = useNavigate()
  return (<>
    <h1>Muistipeli</h1>
    <pre>Tänne tulee muistipeli</pre>
    <button onClick={()=>nav("/")}>Takaisin</button>
  </>)
}

export default Memory