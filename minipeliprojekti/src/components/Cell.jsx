const getTileColor = (value) => {
  switch (value) {
    case 0: return "transparent"
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
    default: return "extra"
  }
}

const Cell = ({index, value, fresh}) => {
  return (
    <div className={`cell${value ? ` ${getTileColor(value)}` : " 0"}${fresh ? " cell-fresh" : ""}`} 
    id={`cell-${index}`}>
      {value || ""}
    </div>
  )
}

export default Cell