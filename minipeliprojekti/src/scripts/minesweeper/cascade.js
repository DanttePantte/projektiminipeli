const cascade = (visible, handleClick, cellId, w, h) => {
  const yPos = Math.floor(cellId/w)
  const xPos = Math.floor(cellId%w)
  const xMin = xPos==0?xPos:xPos-1
  const xMax = xPos==w-1?xPos:xPos+1
  const yMin = yPos==0?yPos:yPos-1
  const yMax = yPos==h-1?yPos:yPos+1
  for(let x=xMin;x<=xMax;x++){for(let y=yMin;y<=yMax;y++){
    const targetId = y*w+x
    visible.includes(targetId)
    ? null
    : handleClick(targetId)
  }}
}

export default cascade