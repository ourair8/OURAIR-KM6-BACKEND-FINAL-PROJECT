const express = require("express")
const bodyparser = require("body-parser")
const logger = require("morgan")
const { v1 } = require('./api/v1.api')
require('dotenv').config();

const app = express()
    .use(logger("dev"))
    .use(express.json())
    .use(express.urlencoded({extended : false}))
    .use(bodyparser.urlencoded({extended : false}))
    .use("/api/v1", v1)
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