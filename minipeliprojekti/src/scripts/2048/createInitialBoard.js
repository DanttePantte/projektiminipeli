import spawnTile from "./spawnTile"
import createEmptyBoard from "./createEmptyBoard"

const createInitialBoard = (testmode) => {
  switch (testmode) {
    case 0: return spawnTile(spawnTile(createEmptyBoard()))
    case 1: return [[2,4,8,16],[32,64,128,256],[512,1024,2048,4096],[8192,16384,32768,65536]]
    case 2: return [[1024,512,256,128],[8,16,32,64],[4,2,2,0],[0,0,0,0]]
  }
}

export default createInitialBoard