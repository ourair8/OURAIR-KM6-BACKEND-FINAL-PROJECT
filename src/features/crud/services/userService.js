'use strict'

const prisma = require('../../../config/prisma.config');
const { ErrorWithStatusCode } = require('../../../middleware/errorHandler');

const getAllUsersService = async(page, limit) => {
    try {

    
        return await prisma.users.findMany({
            skip: (page - 1) * limit,
            take: limit,
        });
    } catch (err) {
        throw err
    }

};

const getUserByIdService = async(id) => {
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
        throw new ErrorWithStatusCode('User not found', 404);
    }
    return user;
};

const createUserService = async(data) => {
        try {
            const user = await prisma.users.create({
                data: {
                    ...data,
                    created_at: new Date()
                }
            });
            return user;
       } catch (err) {
        console.log(err)
        throw err
       }
};

const updateUserService = async(id, data) => {
    try {
        return await prisma.users.update({
            where: { id },
            data,
        });
    } catch (err) {
        throw new ErrorWithStatusCode('User not found', 404);
    }
};


const deleteUserService = async(id) => {

    try {
        await prisma.users.delete({ where: { id } });
    } catch (err) {
        throw new ErrorWithStatusCode('User not found', 404);
    }
};

module.exports = {
    getAllUsersService,
    getUserByIdService,
    createUserService,
    updateUserService,
    deleteUserService,
};