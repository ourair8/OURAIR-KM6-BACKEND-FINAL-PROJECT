"use strict";

const http = require("http");
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
const compression = require('compression');

require("dotenv").config();
require("./utils/instrument");
const Sentry = require("@sentry/node");
Sentry.init({ dsn: process.env.SENTRY_DSN });
const WebSocket = require("ws");

const swaggerDocument = YAML.parse(file);

var corsOptions = {
  origin: [
    "https://ourair.tech",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3001",
    "http://localhost:3000",
    "https://ourair.my.id",
    "https://accounts.google.com/o/oauth2/v2",
    "https://bw2nj1xt-3001.asse.devtunnels.ms",
    "bw2nj1xt-3001.asse.devtunnels.ms",
  ],
  optionsSuccessStatus: 200,
  credentials : true,
};

require("dotenv").config();

const app = express()
  .use(cors(corsOptions))
  .use(cookieParser())
  .use(compression())
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
  .use(express.urlencoded({ extended: true }))
  .use(bodyparser.urlencoded({ extended: true }))
  .use("/api/v1", v1)
  .get('/apasih', (req, res) => {
    res.render("websocket");
  })
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

  // Optional fallthrough error handler
  .use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
  })
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

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

const PORT = 3001;
// const PORT_WS = 8085;

//kerjaan huzi websocket
const server_huzi = http.createServer(app);

server_huzi.on('upgrade', (request, socket, head) => {
  webSocketServer.handleUpgrade(request, socket, head, (ws) => {
      webSocketServer.emit('connection', ws, request);
  });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// //kerjaan samuel websocket
// // const server_samuel = app.listen(PORT_WS, () => {
// //   console.log(`Express server listening on port ${PORT_WS}`);
// // });

// const wss = new WebSocket.Server({ server_huzi });
// app.locals.wss = wss;

// wss.on("connection", function connection(ws) {
//   console.log("New WebSocket connection");

// ws.on("message", function incoming(message) {
//     console.log(`Received: ${message}`);
//     ws.send(`Echo: ${message}`);
//   });
// });