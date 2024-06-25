const cron = require('node-cron');
const sendEmail = require('../config/mail');
const User = require('../models/user');

const scheduleReminder = (userId, title, reminderDate) => {
    const reminderDateTime = new Date(reminderDate);

    cron.schedule(
        `${reminderDateTime.getMinutes()} ${reminderDateTime.getHours()} ${reminderDateTime.getDate()} ${reminderDateTime.getMonth() + 1} *`,
        async () => {
            try {
                const user = await User.findById(userId);
                if (!user) {
                    throw new Error('User not found during cron job');
                }
                await sendEmail(user.email, 'Event Reminder', `Hello ${user.name}, this is a reminder for your event: ${title}`);
                console.log(`Reminder email sent to ${user.email} for event: ${title}`);
            } catch (error) {
                console.error('Error sending reminder:', error);
            }
        },
        {
            scheduled: true,
            timezone: "Asia/Kolkata"
        }
    );
};

module.exports = scheduleReminder;
