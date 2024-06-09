"use strict";

const express = require("express");
const bodyparser = require("body-parser");
const logger = require("morgan");
const { v1 } = require("./api/v1.api");
const path = require("path");
require("dotenv").config();
require("./utils/instrument");
const Sentry = require("@sentry/node");
Sentry.init({ dsn: process.env.SENTRY_DSN });

const app = express()
  .set("views", path.join(__dirname, "./views"))
  .use(logger("dev"))
  .set("view engine", "ejs")
  .use(express.json())
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

  // Optional fallthrough error handler
  .use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
  })

  //500
  .use((err, req, res, next) => {
    console.log(err);
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

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});
