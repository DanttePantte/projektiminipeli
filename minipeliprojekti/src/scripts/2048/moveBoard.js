import getLineCoordinates from "./getLineCoordinates"
import mergeLine from "./mergeLine"

const moveBoard = (board, direction) => {
  const nextBoard = board.map((row) => [...row])
  const mergedCells = []
  let score = 0

  for (let index = 0; index < 4; index += 1) {
    const coordinates = getLineCoordinates(direction, index)
    if (!coordinates) {
      return { board, score: 0, moved: false }
    }

    const values = coordinates.map(([row, column]) => board[row][column])
    const result = mergeLine(values)
    score += result.score
    result.mergedIndices.forEach((valueIndex) => {
      const [row, column] = coordinates[valueIndex]
      mergedCells.push(row * 4 + column)
    })

    coordinates.forEach(([row, column], valueIndex) => {
      nextBoard[row][column] = result.line[valueIndex]
    })
  }

  const moved = nextBoard.some((row, rowIndex) =>
    row.some((value, columnIndex) => value !== board[rowIndex][columnIndex]),
  )

  return { board: moved ? nextBoard : board, score, moved, mergedCells }
}

export default moveBoard