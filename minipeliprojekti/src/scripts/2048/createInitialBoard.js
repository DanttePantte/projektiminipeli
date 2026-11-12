import spawnTile from "./spawnTile"
import createEmptyBoard from "./createEmptyBoard"

const createInitialBoard = () => {
  return spawnTile(spawnTile(createEmptyBoard()))
}

export default createInitialBoard