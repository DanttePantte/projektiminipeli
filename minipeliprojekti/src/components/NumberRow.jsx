import Cell from "./Cell"

const NumberRow = ({row, values}) => {
  return (<div className="numberRow" role="row">
    {values.map((value, column) => (
      <Cell key={column} index={row * 4 + column} value={value}/>
    ))}
  </div>
  )
}

export default NumberRow