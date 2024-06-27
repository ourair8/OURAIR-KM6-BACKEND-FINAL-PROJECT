"use strict";

const {
  getUserNotifications,
  markNotificationAsRead,
  postNotificationToAll,
} = require("../services/notification.service");
const { handleError } = require("../../../middleware/errorHandler");

const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const { notifications, total } = await getUserNotifications(
      req.user.id,
      page,
      limit
    );

    res.status(200).json({
      notifications,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error(error);
    handleError(error, res);
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await markNotificationAsRead(id);

    res.status(200).json({ notification });
  } catch (error) {
    console.error(error);
    handleError(error, res);
  }
};

// const sendNotificationToAll = async (req, res) => {
//   try {
//     const { userId, title, message } = req.body;

//     const notifications = await postNotificationToAll(userId, title, message);

//     req.io.emit("notification-all", notifications);

//     res.status(200).json({
//       status: true,
//       message: "Notifications sent to all users.",
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

// const sendNotificationToAll = async (req, res) => {
//   try {
//     const { userId, title, message } = req.body;

//     const notifications = await postNotificationToAll(userId, title, message);

//     req.io.emit("notification-all", notifications);

//     res.status(200).json({
//       status: true,
//       message: "Notifications sent to all users.",
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

const sendNotificationToAll = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: "Title and message are required" });
    }

    const notifications = await postNotificationToAll(title, message);

    req.io.emit("notification-all", notifications);

    res.status(200).json({
      status: true,
      message: "Notifications sent to all users.",
    });
  } catch (error) {
    console.error("Error sending notifications to all users:", error);
    handleError(error, res);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  sendNotificationToAll,
  // notificationPage,
};

// 'use strict'

// const prisma = require('../../../config/prisma.config');

// const updateNotificationControllerToTrue = async function(req, res) {
//     try {
//         const id = req.user.id;

//         await prisma.notifications.updateMany({
//             where: {
//                 AND: {
//                     user_id: id,
//                     is_read: false
//                 }
//             },
//             data: {
//                 is_read: true
//             }
//         });

//         res.status(200).json({ message: 'Notifications updated successfully' });
//     } catch (err) {
//         console.error('Error updating notifications:', err);
//         res.status(500).json({ error: 'An error occurred while updating notifications' });
//     }
// }

// module.exports = {updateNotificationControllerToTrue};
