// local imports
const config = require("../config.json")

// external imports
require("dotenv").config()
const axios = require("axios")
const moment = require("moment")
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const { Database } = require("sqlite3")

// db
const db = new Database("../data.db")

// express initialisation
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan("combined"))
app.use(cors())

// github
app.get("/github/:username/:time", (req, res) => {
    axios.get(`https://api.github.com/users/${req.params.username}/events`, {
        headers: {
            "Authorization": "Bearer " + process.env.GITHUB_AUTHORIZATION
        }
    }).then(response => {
        let obj = { total: 0 }
        response.data.filter(x => moment(x.created_at).unix() > moment().unix() - req.params.time).forEach(event => {
            if (!(event.type in obj)) obj[event.type] = 1
            else obj[event.type]++
            obj["total"]++
        })
        return res.send(obj)
    })
})

// start server
app.listen(config.api_port, () => {
    console.log(`Server listening on port ${config.api_port}!`)
})