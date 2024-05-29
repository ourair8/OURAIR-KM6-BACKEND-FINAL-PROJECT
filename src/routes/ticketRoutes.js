'use strict'

const express = require('express');
const {
    getAllTicketsController,
    getTicketByIdController,
    createTicketController,
    updateTicketController,
    deleteTicketController,
} = require('../features/crud/controllers/ticketController');

const ticketRoutes = express.Router()
    .get('/', getAllTicketsController)
    .get('/:id', getTicketByIdController)
    .post('/', createTicketController)
    .put('/:id', updateTicketController)
    .delete('/:id', deleteTicketController);

module.exports = { ticketRoutes };