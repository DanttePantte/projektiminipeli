const app = require("./app")
const config = require("./utils/config")
const {getDb} = require("./utils/db")

app.listen(config.PORT, async () => {
	await getDb()
	console.log(`Server running on port ${config.PORT}`)
})