const getMines = (width, height, count, startId) => {
  const startRow = Math.floor(startId / width)
  const startColumn = startId % width
  const startArea = new Set()

  for (let row = Math.max(0, startRow - 1); row <= Math.min(height - 1, startRow + 1); row += 1) {
    for (let column = Math.max(0, startColumn - 1); column <= Math.min(width - 1, startColumn + 1); column += 1) {
      startArea.add(row * width + column)
    }
  }

  const candidates = Array.from({length: width * height}, (_, id) => id)
    .filter((id) => !startArea.has(id))
  for (let index = candidates.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[candidates[index], candidates[randomIndex]] = [candidates[randomIndex], candidates[index]]
  }

  return candidates.slice(0, Math.min(count, candidates.length))
}

export default getMines