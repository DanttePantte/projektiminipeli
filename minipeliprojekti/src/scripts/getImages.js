const getImgs = (count) => {
  const array = []
  for (let num = 0; num < count; num++){
    array.push(`kuva${num+1}.png`)
  }
  return array
}

export default getImgs