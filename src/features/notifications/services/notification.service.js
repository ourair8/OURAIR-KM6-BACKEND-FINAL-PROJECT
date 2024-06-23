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

// const postNotificationToAll = async (userId, title, message) => {
//   const users = await prisma.users.findMany();

//   const notifications = users
//     .filter((user) => user.id !== userId)
//     .map((user) => ({
//       user_id: user.id,
//       title,
//       message,
//       is_read: false,
//       created_at: new Date(),
//     }));

//   await prisma.notifications.createMany({
//     data: notifications,
//   });

//   return notifications;
// };

const postNotificationToAll = async (userId, title, message) => {
  const users = await prisma.users.findMany();

  const notifications = users.map((user) => ({
    user_id: user.id !== userId ? user.id : null,
    title,
    message,
    is_read: false,
    created_at: new Date(),
  }));

  await prisma.notifications.createMany({
    data: notifications,
  });

  return notifications;
};

module.exports = {
  getUserNotifications,
  markNotificationAsRead,
  postNotificationToAll,
};
