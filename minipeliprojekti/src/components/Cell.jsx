const Cell = ({index, value}) => {
  return (
    <div className="cell" id={`cell-${index}`} role="gridcell" aria-label={value || "Tyhjä"}>
      {value || ""}
    </div>
  )
}

export default Cell