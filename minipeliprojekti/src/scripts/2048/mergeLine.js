const mergeLine = (line) => {
  const values = line.filter((value) => value !== 0)
  const merged = []
  const mergedIndices = []
  let score = 0

  for (let index = 0; index < values.length; index += 1) {
    if (values[index] === values[index + 1]) {
      const value = values[index] * 2
      mergedIndices.push(merged.length)
      merged.push(value)
      score += value
      index += 1
    } else {
      merged.push(values[index])
    }
  }

  return {
    line: [...merged, ...Array(4 - merged.length).fill(0)],
    mergedIndices,
    score,
  }
}

export default mergeLine