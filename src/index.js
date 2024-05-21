const express = require("express")
const bodyparser = require("body-parser")
const logger = require("morgan")

const app = express()
    .use(logger("dev"))
    .use(express.json())
    .use(express.urlencoded({extended : false}))
    .use(bodyparser.urlencoded({extended : false}))
    .get("/", (req, res) => {
        return res.json({
            status : true,
            message : "hello world",
        }).status(200)
    })

const PORT = 3000

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
}) 