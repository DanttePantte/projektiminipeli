const canMove = (board) => {
  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      if (board[row][column] === 0) {
        return true
      }
      if (column < 4 - 1 && board[row][column] === board[row][column + 1]) {
        return true
      }
      if (row < 4 - 1 && board[row][column] === board[row + 1][column]) {
        return true
      }
    }
  }

  return false
}

export default canMove