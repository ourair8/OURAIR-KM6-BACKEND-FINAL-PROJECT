'use strict'

const { verifyToken } = require('../features/auth/controllers/whoAmI');

const express = require('express');
const { handleWebhook } = require('../features/webhook/controllers/webhookController');
const { testwebsocket } = require('../features/webhook/controllers/testwebsocket')

const webhook = express.Router();
webhook.post('/midtrans', handleWebhook);
webhook.get('/ws', verifyToken, testwebsocket);

module.exports = { webhook }