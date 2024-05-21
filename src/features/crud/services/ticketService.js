const prisma = require('../../../config/prisma.config');
const { ErrorWithStatusCode } = require('../../../middleware/errorHandler');

const getAllTicketsService = async() => {
    return await prisma.ticket.findMany();
};

const getTicketByIdService = async(id) => {
    const ticket = await prisma.ticket.findUnique({ where: { id } });
    if (!ticket) {
        throw new ErrorWithStatusCode('Ticket not found', 404);
    }
    return ticket;
};

const createTicketService = async(data) => {
    return await prisma.ticket.create({ data });
};

const updateTicketService = async(id, data) => {
    try {
        return await prisma.ticket.update({
            where: { id },
            data,
        });
    } catch (err) {
        throw new ErrorWithStatusCode('Ticket not found', 404);
    }
};

const deleteTicketService = async(id) => {
    try {
        await prisma.ticket.delete({ where: { id } });
    } catch (err) {
        throw new ErrorWithStatusCode('Ticket not found', 404);
    }
};

module.exports = {
    getAllTicketsService,
    getTicketByIdService,
    createTicketService,
    updateTicketService,
    deleteTicketService,
};