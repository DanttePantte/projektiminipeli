const hasWon = (board) => {
  return board.some((row) => row.some((value) => value >= 2048))
}

export default hasWon