const express = require('express');
const {
    getAllTicketsController,
    getTicketByIdController,
    createTicketController,
    updateTicketController,
    deleteTicketController,
} = require('../features/crud/controllers/ticketController');

const ticketRoutes = express.Router();

ticketRoutes.get('/', getAllTicketsController);
ticketRoutes.get('/:id', getTicketByIdController);
ticketRoutes.post('/', createTicketController);
ticketRoutes.put('/:id', updateTicketController);
ticketRoutes.delete('/:id', deleteTicketController);

module.exports = { ticketRoutes };