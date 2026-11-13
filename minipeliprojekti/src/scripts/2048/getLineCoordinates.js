const getLineCoordinates = (direction, index) => {
  if (direction === "left") {
    return Array.from({ length: 4 }, (_, column) => [index, column])
  }
  if (direction === "right") {
    return Array.from({ length: 4 }, (_, column) => [index, 4 - 1 - column])
  }
  if (direction === "up") {
    return Array.from({ length: 4 }, (_, row) => [row, index])
  }
  if (direction === "down") {
    return Array.from({ length: 4 }, (_, row) => [4 - 1 - row, index])
  }
  return null
}

export default getLineCoordinates