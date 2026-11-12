const spawnTile = (board) => {
  const nextBoard = board.map((row) => [...row])
  const emptyCells = []

  nextBoard.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      if (value === 0) {
        emptyCells.push([rowIndex, columnIndex])
      }
    })
  })

  if (emptyCells.length === 0) {
    return nextBoard
  }

  const [rowIndex, columnIndex] = emptyCells[Math.floor(Math.random() * emptyCells.length)]
  nextBoard[rowIndex][columnIndex] = Math.random() < 0.9 ? 2 : 4
  return nextBoard
}

export default spawnTile