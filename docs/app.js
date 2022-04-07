// local imports
const config = require("../config.json")

// external imports
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const swaggerUi = require("swagger-ui-express")
const swaggerDocument = require("./swagger.json")
const { Database } = require("sqlite3")

// db
const db = new Database("data.db")

// express initialisation
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan("combined"))
app.use(cors())

// views
app.set("views", "views")
app.set("view engine", "ejs")

// swagger serve
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// start server
app.listen(config.web_port, () => {
    console.log(`Server listening on port ${config.web_port}`)
})