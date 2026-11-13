const getTileColor = (value) => {
  switch (value) {
    case 2: return "lightblue"
    case 4: return "cyan"
    case 8: return "lightgreen"
    case 16: return "lightyellow"
    case 32: return "yellow"
    case 64: return "orange"
    case 128: return "red"
    case 256: return "pink"
    case 512: return "magenta"
    case 1024: return "purple"
    case 2048: return "darkblue"
    default: return "transparent"
  }
}

const Cell = ({index, value}) => {
  return (
    <div className={`cell${value ? ` ${getTileColor(value)}` : ""}`} 
    id={`cell-${index}`} 
    role="gridcell" 
    aria-label={value || "Tyhjä"}>
      {value || ""}
    </div>
  )
}

export default Cell