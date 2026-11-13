import Cell from "./Cell"

const NumberRow = ({row, values, freshCells}) => {
  return (<div className="numberRow" role="row">
    {values.map((value, column) => (
      <Cell key={column} index={row * 4 + column} value={value} fresh={freshCells.includes(row * 4 + column)}/>
    ))}
  </div>
  )
}

export default NumberRow