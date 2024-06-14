"use strict";

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const prisma = require("../config/prisma.config");

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } =
  process.env;

console.log(process.env.GOOGLE_CALLBACK_URL)
console.log(process.env.GOOGLE_CLIENT_SECRET)
console.log(GOOGLE_CLIENT_ID)
const Role = {
  USER: "USER",
  ADMIN: "ADMIN",
};

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await prisma.users.upsert({
          where: {
            email: profile.emails[0].value,
          },
          update: {
            googleId: profile.id,
          },
          create: {
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            phone_number: "",
            password: "",
            created_at: new Date(),
            username: null,
            role: Role.USER,
            is_Verified: true,
            role: Role.USER,
            avatar_link: null,
          },
        });

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;
