// external imports
require("dotenv").config()
const axios = require("axios")
const moment = require("moment")
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const { Database } = require("sqlite3")

// db
const db = new Database("./data.db")

// express initialisation
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan("combined"))
app.use(cors())

app.set("views", "views")
app.set("view engine", "ejs")

// web
app.get("/", (req, res) => {
    res.render("index")
})

// github
app.get("/github/:username/:time", (req, res) => {
    if (!parseInt(req.params.time)) return res.status(400).end("Invalid duration")
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
    }).catch(err => {
        return res.status(400).end("Invalid username")
    })
})

app.get("/github/:username/:time/:type", (req, res) => {
    if (!parseInt(req.params.time)) return res.status(400).end("Invalid duration")
    axios.get(`https://api.github.com/users/${req.params.username}/events`, {
        headers: {
            "Authorization": "Bearer " + process.env.GITHUB_AUTHORIZATION
        }
    }).then(response => {
        let obj = { total: 0 }
        response.data.filter(x => moment(x.created_at).unix() > moment().unix() - req.params.time && x.type.toLowerCase().replace("event", "") == req.params.type.toLowerCase()).forEach(event => {
            obj["total"]++
        })
        return res.send(obj)
    }).catch(err => {
        return res.status(400).end("Invalid username")
    })
})

// steam
app.get("/steam/:id", (req, res) => {
    let total = 0
    axios.get(`https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?steamid=${req.params.id}&include_appinfo=1&include_played_free_games=1&key=79868CE2F49CAFB8042407530807230B&format=json`).then(response => {
        response.data.response.games.forEach(game => total += game.playtime_2weeks)
        res.json({ hours: parseInt(total / 60), minutes: parseInt(total - (parseInt(total / 60) * 60)) })
    }).catch()
})

// start server
const port = 7000
app.listen(port, () => {
    console.log(`Server listening on port ${port}!`)
})