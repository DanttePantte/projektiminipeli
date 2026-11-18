const getCurrentTime = () => {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
}

export default getCurrentTime