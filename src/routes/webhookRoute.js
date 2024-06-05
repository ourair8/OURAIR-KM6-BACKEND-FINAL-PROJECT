'use strict'

const express = require('express');
const { handleWebhook } = require('../features/webhook/controllers/webhookController');

const webhook = express.Router();
webhook.post('/midtrans', handleWebhook);

module.exports = { webhook }