"use strict";

const prisma = require("../../../config/prisma.config");

const getUserNotifications = async (userId, page, limit) => {
  const notifications = await prisma.notifications.findMany({
    where: {
      user_id: userId,
    },
    orderBy: {
      created_at: "desc",
    },
    skip: (page - 1) * limit,
    take: parseInt(limit),
  });

  const totalNotifications = await prisma.notifications.count({
    where: { user_id: userId },
  });

  return { notifications, total: totalNotifications };
};

const markNotificationAsRead = async (notificationId) => {
  const notification = await prisma.notifications.update({
    where: { id: parseInt(notificationId, 10) },
    data: { is_read: true },
  });

  return notification;
};

const postNotificationToAll = async (userId, message) => {
  const users = await prisma.users.findMany();

  for (const user of users) {
    if (user.id !== userId) {
      await prisma.notifications.create({
        data: {
          user_id: user.id,
          message,
        },
      });
    }
  }
};

module.exports = {
  getUserNotifications,
  markNotificationAsRead,
  postNotificationToAll,
};
