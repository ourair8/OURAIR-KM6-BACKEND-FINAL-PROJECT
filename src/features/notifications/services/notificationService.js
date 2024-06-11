'use strict';

const prisma = require('../../../config/prisma.config');

const getUserNotifications = async(userId, page, limit) => {
    const notifications = await prisma.notifications.findMany({
        where: {
            user_id: userId
        },
        orderBy: {
            created_at: 'desc'
        },
        skip: (page - 1) * limit,
        take: parseInt(limit)
    });

    const totalNotifications = await prisma.notifications.count({
        where: { user_id: userId }
    });

    return { notifications, total: totalNotifications };
};

const markNotificationAsRead = async(notificationId) => {
    const notification = await prisma.notifications.update({
        where: { id: parseInt(notificationId, 10) },
        data: { is_read: true }
    });

    return notification;
};

module.exports = {
    getUserNotifications,
    markNotificationAsRead
};