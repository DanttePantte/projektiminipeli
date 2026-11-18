const getNumber = (id, w, h, mines) => {
  if (mines.includes(id)) return "mine"

  const row = Math.floor(id / w)
  const column = id % w
  let count = 0

  for (let neighborRow = Math.max(0, row - 1); neighborRow <= Math.min(h - 1, row + 1); neighborRow += 1) {
    for (let neighborColumn = Math.max(0, column - 1); neighborColumn <= Math.min(w - 1, column + 1); neighborColumn += 1) {
      if (mines.includes(neighborRow * w + neighborColumn)) count += 1
    }
  }

  return count
}

export default getNumber