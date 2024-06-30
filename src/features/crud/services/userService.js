'use strict';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllUsers = async() => {
    try {
        return await prisma.users.findMany();
    } catch (error) {
        throw new Error(`Error getting users: ${error.message}`);
    }
};

const getUserById = async(id) => {
    try {
        return await prisma.users.findUnique({ where: { id: parseInt(id) } });
    } catch (error) {
        throw new ErrorWithStatusCode('User not found', 404);
    }
};

const createUser = async(userData) => {
    try {

        const user = await prisma.users.create({
            data: {
                ...userData,
                created_at: new Date()
            }
        });
        return user;
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
};

const updateUser = async(id, userData) => {
    try {
        return await prisma.users.update({
            where: { id: parseInt(id) },
            data: userData
        });
    } catch (error) {
        throw new ErrorWithStatusCode('User not found', 404);
    }
};

const deleteUser = async(id) => {
    try {
        return await prisma.users.delete({ where: { id: parseInt(id) } });
    } catch (error) {
        throw new ErrorWithStatusCode('User not found', 404);
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};