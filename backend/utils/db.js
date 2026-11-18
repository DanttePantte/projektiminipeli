const Sequelize = require("sequelize")
const {DATABASE_URL} = require("./config")

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  logging: false,
})

const getDb = async () => {
  await sequelize.authenticate()
  console.log("rapeakalapala E")
  return null
}

module.exports = {
  sequelize,
  getDb,
}
