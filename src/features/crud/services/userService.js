'use strict'

const prisma = require('../../../config/prisma.config');
const { ErrorWithStatusCode } = require('../../../middleware/errorHandler');
const bcrypt = require('bcrypt');

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

const createUserService = async (data) => {
    try {

        const existingUser = await prisma.users.findFirst({
            where: {
                OR: [
                    { email: data.email },
                    { phone_number: data.phone_number },
                ]
            }
        });

        if (existingUser) {
            let conflictField;
            if (existingUser.email === data.email) {
                conflictField = 'Email';
            } else if (existingUser.phone_number === data.phone_number) {
                conflictField = 'Phone number';
            }
            throw new ErrorWithStatusCode(`${conflictField} is already in use`, 409);
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const userData = {
            name: data.name,
            email: data.email,
            phone_number: data.phone_number,
            password: hashedPassword,
            role: data.role,
            created_at: new Date()
        };

        const user = await prisma.users.create({
            data: userData
        });

        return user;
    } catch (err) {
        throw err;
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