'use strict'

const {
    getAllTicketsService,
    getTicketByIdService,
    createTicketService,
    updateTicketService,
    deleteTicketService,
} = require('../services/ticketService');
const { handleError } = require('../../../middleware/errorHandler');

const getAllTicketsController = async(req, res) => {
    try {
        const tickets = await getAllTicketsService();
        res.status(200).json(tickets);
    } catch (err) {
        handleError(err, res);
    }
};

const getTicketByIdController = async(req, res) => {
    try {
        const ticket = await getTicketByIdService(parseInt(req.params.id));
        res.status(200).json(ticket);
    } catch (err) {
        handleError(err, res);
    }
};

const createTicketController = async(req, res) => {
    try {
        const ticket = await createTicketService(req.body);
        res.status(201).json(ticket);
    } catch (err) {
        handleError(err, res);
    }
};

const updateTicketController = async(req, res) => {
    try {
        const ticket = await updateTicketService(parseInt(req.params.id), req.body);
        res.status(200).json(ticket);
    } catch (err) {
        handleError(err, res);
    }
};

const deleteTicketController = async(req, res) => {
    try {
        await deleteTicketService(parseInt(req.params.id));
        res.status(200).json({ message: 'Ticket deleted' });
    } catch (err) {
        handleError(err, res);
    }
};

module.exports = {
    getAllTicketsController,
    getTicketByIdController,
    createTicketController,
    updateTicketController,
    deleteTicketController,
};