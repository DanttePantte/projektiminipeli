import Cell from "./Cell"

const NumberRow = ({row}) => {
  return (<div class="numberRow">
    <Cell index={row*4}/>
    <Cell index={row*4+1}/>
    <Cell index={row*4+2}/>
    <Cell index={row*4+3}/>
  </div>
  )
}

export default NumberRow