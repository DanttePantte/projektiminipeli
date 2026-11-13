import spawnTile from "./spawnTile"
import createEmptyBoard from "./createEmptyBoard"

const createInitialBoard = (testmode) => {
  return testmode
  ? [[2,4,8,16],[32,64,128,256],[512,1024,2048,4096],[8192,16384,32768,65536]]
  : spawnTile(spawnTile(createEmptyBoard()))
}

export default createInitialBoard