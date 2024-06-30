"use strict";

const express = require("express");
//const { verifyToken, checkRole } = require('../features/auth/controllers/whoAmI');
const {
  getNotifications,
  markAsRead,
  sendNotificationToAll,
  markAllAsRead
} = require("../features/notifications/controllers/notification.controller");
const { verifyToken } = require("../features/auth/controllers/whoAmI");
//const { updateNotificationControllerToTrue } = require('../features/notifications/controllers/notification.controller');

const notification = express.Router();

//notification.post('/update', verifyToken, checkRole(['USER']), updateNotificationControllerToTrue);
notification.get("/notifications", verifyToken, getNotifications);
notification.patch("/notifications/:id/read", verifyToken, markAsRead);
notification.patch("/notifications/read", verifyToken, markAllAsRead);
notification.post("/all", verifyToken, sendNotificationToAll);

module.exports = { notification };
