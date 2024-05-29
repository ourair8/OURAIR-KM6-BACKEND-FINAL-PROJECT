'use strict'

const prisma = require('../../../config/prisma.config');
const { ErrorWithStatusCode } = require('../../../middleware/errorHandler');

const getAllticketssService = async() => {
    return await prisma.tickets.findMany();
};

const getticketsByIdService = async(id) => {
    const tickets = await prisma.tickets.findUnique({ where: { id } });
    if (!tickets) {
        throw new ErrorWithStatusCode('tickets not found', 404);
    }
    return tickets;
};

const createticketsService = async(data) => {
    return await prisma.tickets.create({ data });
};

const updateticketsService = async(id, data) => {
    try {
        return await prisma.tickets.update({
            where: { id },
            data,
        });
    } catch (err) {
        throw new ErrorWithStatusCode('tickets not found', 404);
    }
};

const deleteticketsService = async(id) => {
    try {
        await prisma.tickets.delete({ where: { id } });
    } catch (err) {
        throw new ErrorWithStatusCode('tickets not found', 404);
    }
};

module.exports = {
    getAllticketssService,
    getticketsByIdService,
    createticketsService,
    updateticketsService,
    deleteticketsService,
};