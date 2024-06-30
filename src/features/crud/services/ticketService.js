"use strict";

const prisma = require("../../../config/prisma.config");
const { ErrorWithStatusCode } = require("../../../middleware/errorHandler");

const getAllticketsService = async () => {
  return await prisma.tickets.findMany();
};

const getTicketByIdService = async (id) => {
  const tickets = await prisma.tickets.findUnique({ where: { id } });
  if (!tickets) {
    throw new ErrorWithStatusCode("tickets not found", 404);
  }
  return tickets;
};

const createTicketService = async (data) => {
  return await prisma.tickets.create({ data });
};

const updateTicketService = async (id, data) => {
  try {
    return await prisma.tickets.update({
      where: { id },
      data,
    });
  } catch (err) {
    throw new ErrorWithStatusCode("tickets not found", 404);
  }
};

const deleteTicketService = async (id) => {
  try {
    await prisma.tickets.delete({ where: { id } });
  } catch (err) {
    throw new ErrorWithStatusCode("tickets not found", 404);
  }
};

module.exports = {
  getAllticketsService,
  getTicketByIdService,
  createTicketService,
  updateTicketService,
  deleteTicketService,
};
