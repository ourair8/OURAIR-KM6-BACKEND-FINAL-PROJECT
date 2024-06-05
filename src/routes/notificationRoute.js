'use strict'

const express = require('express');
const { verifyToken, checkRole } = require('../features/auth/controllers/whoAmI');
const { updateNotificationControllerToTrue } = require('../features/notifications/controllers/notification.controller');

const notification= express.Router();

notification.post('/update', verifyToken, checkRole(['USER']), updateNotificationControllerToTrue);

module.exports = { notification };