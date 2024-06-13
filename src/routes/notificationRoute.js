'use strict'

const express = require('express');
//const { verifyToken, checkRole } = require('../features/auth/controllers/whoAmI');
const { verifyToken1 } = require('../middleware/auth.middleware');
const { getNotifications, markAsRead } = require('../features/notifications/controllers/notification.controller')
//const { updateNotificationControllerToTrue } = require('../features/notifications/controllers/notification.controller');

const notification = express.Router();

//notification.post('/update', verifyToken, checkRole(['USER']), updateNotificationControllerToTrue);
notification.get('/notifications', verifyToken1, getNotifications);
notification.patch('/notifications/:id/read', verifyToken1, markAsRead);

module.exports = { notification };