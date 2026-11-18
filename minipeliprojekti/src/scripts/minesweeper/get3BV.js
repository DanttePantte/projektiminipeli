const getGrid = (mines, width, height) => {
  const mineSet = new Set(mines)
  const grid = []

  for (let row = 0; row < height; row++) {
    const gridRow = []

    for (let column = 0; column < width; column++) {
      const id = row * width + column

      if (mineSet.has(id)) {
        gridRow.push(-1)
        continue
      }

      let adjacentMines = 0
      for (let nextRow = Math.max(0, row - 1); nextRow <= Math.min(height - 1, row + 1); nextRow++) {
        for (let nextColumn = Math.max(0, column - 1); nextColumn <= Math.min(width - 1, column + 1); nextColumn++) {
          if (mineSet.has(nextRow * width + nextColumn)) adjacentMines++
        }
      }

      gridRow.push(adjacentMines)
    }

    grid.push(gridRow)
  }

  return grid
}

const getNeighbors = (row, column, width, height) => {
  const neighbors = []

  for (let nextRow = Math.max(0, row - 1); nextRow <= Math.min(height - 1, row + 1); nextRow++) {
    for (let nextColumn = Math.max(0, column - 1); nextColumn <= Math.min(width - 1, column + 1); nextColumn++) {
      if (nextRow !== row || nextColumn !== column) {
        neighbors.push([nextRow, nextColumn])
      }
    }
  }

  return neighbors
}

const calculate3BV = (width, height, mines) => {
  const grid = getGrid(mines, width, height)
  const visited = Array.from({length: height}, () => Array(width).fill(false))
  let value = 0

  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      if (grid[row][column] !== 0 || visited[row][column]) continue

      value++
      const queue = [[row, column]]
      visited[row][column] = true

      while (queue.length) {
        const [currentRow, currentColumn] = queue.shift()

        for (const [nextRow, nextColumn] of getNeighbors(currentRow, currentColumn, width, height)) {
          if (!visited[nextRow][nextColumn] && grid[nextRow][nextColumn] >= 0) {
            visited[nextRow][nextColumn] = true

            if (grid[nextRow][nextColumn] === 0) {
              queue.push([nextRow, nextColumn])
            }
          }
        }
      }
    }
  }

  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      if (grid[row][column] > 0 && !visited[row][column]) {
        value++
      }
    }
  }

  console.log(`3BV: ${value}`)
  return value
}

export const calculateSolved3BV = (width, height, mines, revealed) => {
  const mineSet = new Set(mines)
  const grid = getGrid(mines, width, height)
  const visited = Array.from({length: height}, () => Array(width).fill(false))
  let resolved = 0

  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      if (grid[row][column] !== 0 || visited[row][column]) continue

      let containsRevealed = revealed.has(row * width + column)
      const queue = [[row, column]]
      visited[row][column] = true

      while (queue.length) {
        const [currentRow, currentColumn] = queue.shift()

        for (const [nextRow, nextColumn] of getNeighbors(currentRow, currentColumn, width, height)) {
          if (visited[nextRow][nextColumn] || grid[nextRow][nextColumn] < 0) continue

          visited[nextRow][nextColumn] = true
          if (revealed.has(nextRow * width + nextColumn)) containsRevealed = true

          if (grid[nextRow][nextColumn] === 0) {
            queue.push([nextRow, nextColumn])
          }
        }
      }

      if (containsRevealed) resolved++
    }
  }

  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      const id = row * width + column
      if (
        grid[row][column] > 0
        && !visited[row][column]
        && !mineSet.has(id)
        && revealed.has(id)
      ) {
        resolved++
      }
    }
  }

  console.log(`Ratkaistu 3BV: ${resolved}`)
  return resolved
}

export default calculate3BV