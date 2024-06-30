"use strict";

const {
    checkRole,
    verifyToken,
} = require("../features/auth/controllers/whoAmI");

const { image } = require("../libs/multer");

const express = require("express");
const {
    getAllUsersController,
    getUserByIdController,
    createUserController,
    updateUserController,
    deleteUserController,
    getUserData,
} = require("../features/crud/controllers/userController");

const {
    updateAvatar,
    updateProfile,
} = require("../features/profile/controllers/profile");

const userRoutes =
    // .get('/profile', verifyToken, checkRole(['user']), getUserData)

    express
    .Router()
    .put("/avatar-profile", verifyToken, checkRole(["USER"]), image.single("avatar"), updateAvatar)
    .get("/", verifyToken, checkRole(["ADMIN", 'USER']), getAllUsersController)
    .get("/:id", verifyToken, checkRole(["ADMIN", 'USER']), getUserByIdController)
    .post("/", verifyToken, checkRole(["ADMIN", 'USER']), createUserController)
    .put("/:id", verifyToken, checkRole(["USER"]), updateUserController)
    .delete("/:id", verifyToken, checkRole(["ADMIN", 'USER']), deleteUserController)
    .patch("/profile", verifyToken, checkRole(["USER"]), updateProfile);

module.exports = { userRoutes };