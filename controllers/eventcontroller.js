const Event = require('../models/event');
const User = require('../models/user');
const cron = require('node-cron');
const sendEmail = require('../config/mail');

const getEvents = async (req, res) => {
    try {
        const events = await Event.find({ user: req.session.user.id });
        res.json(events);
    } catch (err) {
        console.log("Event fetch error:", err);
        res.status(500).json({ error: err.message });
    }
}

const CreateEvent = async (req, res) => {
    try {
        const { title, description, eventDate, reminderDate } = req.body;

        if (!req.session.user.id) {
            return res.status(400).json({ error: 'User not logged in' });
        }

        if (new Date(eventDate) < new Date() || new Date(reminderDate) < new Date()) {
            return res.status(400).json({ error: 'Event date or reminder date cannot be in the past' });
        }

        const user = await User.findById(req.session.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newEvent = new Event({
            user: req.session.user.id,
            title,
            description,
            eventDate,
            reminderDate,
            notified: false,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });

        const savedEvent = await newEvent.save();

        const reminderDateTime = new Date(reminderDate);
        const cronTime = `${reminderDateTime.getMinutes()} ${reminderDateTime.getHours()} ${reminderDateTime.getDate()} ${reminderDateTime.getMonth() + 1} *`;

        cron.schedule(cronTime, async () => {
            let attempts = 0;
            const maxAttempts = 3;
            while (attempts < maxAttempts) {
                try {
                    console.log(`Attempt ${attempts + 1}: Sending reminder email...`);
                    await sendEmail(req.session.user.email, 'Event Reminder', `Hello ${user.name}, this is a reminder for your event: ${title}`);
                    newEvent.notified = true;
                    await newEvent.save();
                    console.log("Reminder email sent successfully");
                    break;
                } catch (error) {
                    console.error(`Error sending reminder on attempt ${attempts + 1}:`, error);
                    attempts += 1;
                    if (attempts === maxAttempts) {
                        console.error("Failed to send reminder email after multiple attempts");
                    } else {
                        await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5 seconds before retrying
                    }
                }
            }
        });
            console.log("Event Created")
        res.json({ msg: "Event Created", event: savedEvent });
    } catch (err) {
        console.log("Event creation error:", err);
        res.status(500).json({ error: err.message });
    }
}

module.exports = { CreateEvent, getEvents };
