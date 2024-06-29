"use strict";

const {
  getUserNotifications,
  markNotificationAsRead,
  postNotificationToAll,
  markAllNotificationsAsRead,
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

const markAllAsRead = async (req, res) => {
  try {
    const notifications = await markAllNotificationsAsRead(req.user.id);

    res.status(200).json({ notifications });
  } catch (error) {
    console.error(error);
    handleError(error, res);
  }
};

const sendNotificationToAll = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: "Title and message are required" });
    }

    const notifications = await postNotificationToAll(title, message);
    const io = req.app.get('io');
    io.emit("notification-all", notifications);

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
  markAllAsRead,
  sendNotificationToAll,
};
