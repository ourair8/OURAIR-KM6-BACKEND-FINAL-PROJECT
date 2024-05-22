const prisma = require('../../../config/prisma.config');
const { ErrorWithStatusCode } = require('../../../middleware/errorHandler');

const getAllUsersService = async() => {
    return await prisma.users.findMany();
};

const getUserByIdService = async(id) => {
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
        throw new ErrorWithStatusCode('User not found', 404);
    }
    return user;
};

const createUserService = async(data) => {
    return await prisma.users.create({ data });
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