const prisma = require('../../../config/prisma.config');
const { ErrorWithStatusCode } = require('../../../middleware/errorHandler');

const getAllUsersService = async() => {
    return await prisma.user.findMany();
};

const getUserByIdService = async(id) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
        throw new ErrorWithStatusCode('User not found', 404);
    }
    return user;
};

const createUserService = async(data) => {
    return await prisma.user.create({ data });
};

const updateUserService = async(id, data) => {
    try {
        return await prisma.user.update({
            where: { id },
            data,
        });
    } catch (err) {
        throw new ErrorWithStatusCode('User not found', 404);
    }
};

const deleteUserService = async(id) => {
    try {
        await prisma.user.delete({ where: { id } });
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