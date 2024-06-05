'use strict'

const prisma = require('../../../config/prisma.config');

const updateNotificationControllerToTrue = async function(req, res) {
    try {
        const id = req.user.id;

        await prisma.notifications.updateMany({
            where: {
                AND: {
                    user_id: id,
                    is_read: false
                }
            },
            data: {
                is_read: true
            }
        });

        res.status(200).json({ message: 'Notifications updated successfully' });
    } catch (err) {
        console.error('Error updating notifications:', err);
        res.status(500).json({ error: 'An error occurred while updating notifications' });
    }
}

module.exports = {updateNotificationControllerToTrue};
