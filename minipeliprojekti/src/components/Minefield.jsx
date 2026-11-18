import getMines from "./scripts/getMines"
import getNumber from "./scripts/getNumber"
import cascade from "./scripts/cascade"
import gameService from "../services/gameService"
import getCurrentTime from "./scripts/getCurrentTime"
import {useRef} from "react"
import flagImage from "../images/flag.png"
import mineImage from "../images/mine.png"
import get3BV from "./scripts/get3BV"

const mineSrc = new Image()
mineSrc.src = mineImage
const flagSrc = new Image()
flagSrc.src = flagImage

// Most useRef hooks made with AI

const createGame = async(w,h,m) => {
  const addedGame = await gameService.create({
    width: w,
    height: h,
    mines: m,
    result: 0,
    started: getCurrentTime()
  })
  return addedGame
}

const Board = ({w,h,m})=>{
  const gamestatus = useRef("ready")
  const currentGame = useRef(null)
  const target = (cellId)=>{
    return document.getElementById(cellId)
  }
  const mines = useRef([])
  const flags = useRef([])
  const visible = useRef([])
  const bbbv = useRef([])
  const handleClick = async (cellId)=>{
    if(gamestatus.current=="ready"){
      mines.current = getMines(w,h,m,cellId)
      gamestatus.current = "started"
      currentGame.current = createGame(w,h,m)
      bbbv.current = get3BV(w,h,mines.current)
      console.log(`3VB value: ${bbbv.current}`)
    }
    if(gamestatus.current=="fail"){
      null
    } else {
      if(flags.current.includes(cellId)){
        return null
      }
      if(visible.current.includes(cellId)&&getNumber(cellId,w,h,mines.current)==getNumber(cellId,w,h,flags.current)){
        cascade(visible.current, handleClick, cellId, w, h)
        return null
      }
      if(!visible.current.includes(cellId)){visible.current.push(cellId)}
      document.getElementById(cellId).className += " visible"
      const number = getNumber(cellId,w,h,mines.current)
      target(cellId).className += ` clicked _${number}`
      target(cellId).innerHTML = mines.current.includes(cellId)
      ? "M"
      : number
      if(number=="mine"&&gamestatus.current!="fail"){
        gamestatus.current = "fail"
        document.getElementById("mainBoard").className = "fail"
        mines.current.map((id)=>{
          const mine = document.createElement("img")
          mine.src = mineImage
          mine.alt = "M"
          mine.className = "boom"
          target(id).replaceChildren(mine)
        })
        const game = await currentGame.current
        gameService.put(game.id, {
          width: w,
          height: h,
          mines: m,
          started: null,
          finished: getCurrentTime(),
          result: 1
        })
      }
      if(number==0){
        cascade(visible.current, handleClick, cellId, w, h)
      }
    }
    if(visible.current.length + mines.current.length == w*h){
      gamestatus.current = "win"
      document.getElementById("mainBoard").className += " win"
        const game = await currentGame.current
        gameService.put(game.id, {
          width: w,
          height: h,
          mines: m,
          started: null,
          finished: getCurrentTime(),
          result: 2
        })
    }
  }
  const handleFlag = (event, cellId) => {
    event.preventDefault()
    if(gamestatus.current=="fail"){
      return null
    }
    if(visible.current.includes(cellId)){
      return null
    }
    if(flags.current.includes(cellId)){
      flags.current = flags.current.filter((flagId)=>flagId!==cellId)
      target(cellId).innerHTML = ""
    } else {
      // Flag display made with AI
      // Flag image made by me
      flags.current = flags.current.concat([cellId])
      const flag = document.createElement("img")
      flag.src = flagImage
      flag.alt = "Flag"
      flag.className = "cellFlag"
      target(cellId).replaceChildren(flag)
    }
    target("minecount").innerHTML = m - flags.current.length
  }
  const rows = []
  for (let y = 0; y < h; y++){
    const cell = []
    for (let x = 0; x < w; x++){
      const cellId = y*w+x
      cell.push(<td key={cellId} id={cellId} class="cell depthOut" 
        tabIndex={0}
        onMouseEnter={(event)=>event.currentTarget.focus()}
        onClick={()=>handleClick(cellId)}
        onContextMenu={(event)=>handleFlag(event, cellId)}
        // keydown feature made with AI
        onKeyDown={(event)=>{
          event.preventDefault()
          const key = event.key.toLowerCase()
          if(key == "e" || key == "r"){
            handleClick(cellId)
          } else if(event.code == "Space"){
            handleFlag(event, cellId)
          } else if(key == "y"){
            window.location.reload()
          }
        }}></td>)
    }
    rows.push(<tr key={y} id={`row${y}`}>{cell}</tr>)
  }
  return (
    <div id="gameContainer" class="depthOut">
      <div id="minecount" class="depthIn">
        {m - flags.current.length}
      </div>
      <table id="mainBoard" class="depthIn" onContextMenu={(event)=>{event.preventDefault()}}>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  )
}

export default Board