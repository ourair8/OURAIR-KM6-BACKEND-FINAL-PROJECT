"use strict";

const { loginByEmailService } = require("../services/login");
const {
  ErrorWithStatusCode,
  handleError,
} = require("./../../../middleware/errorHandler");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const loginByEmailController = async function (req, res) {
  try {
    const { email, password } = await req.body;

    const result = await loginByEmailService(email, password);

    if (!result) {
      throw new ErrorWithStatusCode("bad request !", 400);
    }

    const payload = {
      id: result.id,
      name: result.name,
      username: result.username,
      email: result.email,
      phone_number: result.phone_number,
      isVerified: result.is_Verified,
      role: result.role,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

    // res.cookie("token", token, { httpOnly: true }); // set token to cookies
    // return res.redirect(`http://localhost:5173?token=${token}`); // redirect to client
    return res.redirect(
      `https://ourair-km-6-frontend-final-project.vercel.app/?token=${token}`
    ); // redirect to client
    // return res.status(201).json({
    //   status: true,
    //   message: "success",
    //   data: { ...payload, token },
    // });
  } catch (err) {
    handleError(err, res);
  }
};

const loginOAuthController = async function (req, res) {
  let token = jwt.sign({ id: req.user.id }, SECRET_KEY, { expiresIn: "1h" });

  // res.cookie("token", token, { httpOnly: true }); // set token to cookies
  // return res.redirect(`http://localhost:5173?token=${token}`); // redirect to client
  return res.redirect(
    `https://ourair-km-6-frontend-final-project.vercel.app/?token=${token}`
  ); // redirect to client

  // return res.status(200).json({
  //   status: true,
  //   message: "OK",
  //   err: null,
  //   data: { user: req.user, token },
  // });
  // return res.redirect("http://localhost:3001/api/v1/auth/who-am-i");

  // res.cookie("token", token, { httpOnly: true });
  // return res.redirect("http://localhost:3001/api/v1/auth/who-am-i");
};

module.exports = { loginByEmailController, loginOAuthController };
