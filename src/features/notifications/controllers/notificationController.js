'use strict';

const { getUserNotifications, markNotificationAsRead } = require('../services/notificationService');
const { handleError } = require("../../../middleware/errorHandler");

const getNotifications = async(req, res) => {
    try {
        const { page = 1, limit = 5 } = req.query;
        const { notifications, total } = await getUserNotifications(req.user.id, page, limit);

        res.status(200).json({
            notifications,
            total,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (error) {
        console.error(error);
        handleError(error, res);
    }
};

const markAsRead = async(req, res) => {
    try {
        const { id } = req.params;
        const notification = await markNotificationAsRead(id);

        res.status(200).json({ notification });
    } catch (error) {
        console.error(error);
        handleError(error, res);
    }
};

module.exports = {
    getNotifications,
    markAsRead
};