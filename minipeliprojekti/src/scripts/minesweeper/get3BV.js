const getGrid = (mines, w, h) => {
  const grid = []
  for (let y = 0; y < h; y++) {
    const row = []
    for (let x = 0; x < w; x++) {
      if (mines.includes(w * y + x)) {
        row.push(-1)
      } else {
        row.push(0)
      }
    }
    grid.push(row)
  }
  return grid
}

const get3BV = (w, h, mines) => {
  const board = getGrid(mines, w, h)
  const rows = board.length
  const cols = board[0].length
  const grid = Array.from({ length: rows }, () => Array(cols).fill(0))
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === -1) {
        grid[r][c] = -1
        continue
      }
      let minesCount = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dc
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc] === -1) {
            minesCount++
          }
        }
      }
      grid[r][c] = minesCount
    }
  }
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  let score3BV = 0;
  function floodFillZero(startR, startC) {
    const queue = [[startR, startC]];
    visited[startR][startC] = true;
    while (queue.length > 0) {
      const [r, c] = queue.shift();
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && grid[nr][nc] !== -1) {
            visited[nr][nc] = true;
            if (grid[nr][nc] === 0) {
              queue.push([nr, nc]);
            }
          }
        }
      }
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 0 && !visited[r][c]) {
        score3BV++;
        floodFillZero(r, c);
      }
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] > 0 && !visited[r][c]) {
        score3BV++;
        visited[r][c] = true;
      }
    }
  }

  return score3BV;
}

export default get3BV