const createEmptyBoard = () =>
  Array.from({ length: 4 }, () => Array(4).fill(0))

export default createEmptyBoard