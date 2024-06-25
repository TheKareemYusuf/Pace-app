const Notification = require('../models/notificationModel');

const getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            results: notifications.length,
            data: {
                notifications
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getNotifications
};