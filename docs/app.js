// external imports
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const swaggerUi = require("swagger-ui-express")
const swaggerDocument = require("./swagger.json")

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
const port = 11000
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})