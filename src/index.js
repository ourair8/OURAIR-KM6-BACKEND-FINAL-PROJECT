"use strict";

const express = require("express");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { v1 } = require("./api/v1.api");
const path = require("path");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yaml");
const fs = require("fs");
const file = fs.readFileSync(`${__dirname}/api-docs.yaml`, "utf-8");
const cors = require("cors");
const seedFlight = require("./seeds/cron-flight");

const swaggerDocument = YAML.parse(file);

var corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://bw2nj1xt-3001.asse.devtunnels.ms",
    "bw2nj1xt-3001.asse.devtunnels.ms",
  ],
  optionsSuccessStatus: 200,
};

require("dotenv").config();

const app = express()
  .use(cors(corsOptions))
  .use(cookieParser())
  .set("views", path.join(__dirname, "./views"))
  .use("/custom.css", express.static(path.join(__dirname, "./style.css")))
  .use(
    "/v1/api-docs",
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocument, {
      customCssUrl: "/custom.css",
    })
  )
  .use(logger("dev"))
  .set("view engine", "ejs")
  .use(express.json())
  .use(bodyparser.json())
  .use(express.urlencoded({ extended: false }))
  .use(bodyparser.urlencoded({ extended: false }))
  .use("/api/v1", v1)
  .get("/email", (req, res) => {
    const data = { otp: "247824", name: "Our Air wow" };
    res.render("email", data);
  })
  .get("/", (req, res) => {
    return res
      .json({
        status: true,
        message: "hello world",
      })
      .status(200);
  })

  //Taro sentry disini, cek repository mas tatang

  //500
  .use((err, req, res, next) => {
    res.status(500).json({
      status: false,
      message: err.message,
      data: null,
    });
  })

  //404
  .use((req, res, next) => {
    res.status(404).json({
      status: false,
      message: `are you lost? ${req.method} ${req.url} is not registered!`,
      data: null,
    });
  });

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
