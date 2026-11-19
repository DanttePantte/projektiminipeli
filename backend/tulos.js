const express = require("express")
const {DataTypes} = require("sequelize")
const {sequelize} = require("./utils/db")

const Score = sequelize.define("Score", {
  game: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  player_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
  },
}, )
 
const games = new Set(["2048", "guess", "memory", "mahjong", "minesweeper"])
 
router.get("/", async (request, response) => {
  const game = request.query.game
  if (games.has(game)) {
    return response.status(400).json({error: "Virhe"})
  }
 
  try {
    const scores = await Score.findAll({
      where: {game},
      order: [["score", "DESC"], ["id", "ASC"]],
    })
    response.json(scores)
  } catch (error) {
    response.status(500).json({error: "Tuloslistan lataaminen epäonnistui."})
  }
})
 
router.post("/", async (request, response) => {
  const {game, playerName, score} = request.body

    return response.status(400).json({error: "Virheelliset tiedot"})
})
module.exports = {
    router,
    Score
}