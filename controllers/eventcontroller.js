const Event = require('../models/event');
const User = require('../models/user');
const cron = require('node-cron');
const sendEmail = require('../config/mail');
const sendSMS = require('../config/msg');

const getEvents = async (req, res) => {
    try {
        const userId = req.headers['user-id'];
        const events = await Event.find({ user: userId });
        res.json(events);
    } catch (err) {
        console.error("Error fetching events:", err);
        res.status(500).json({ error: err.message });
    }
};

const CreateEvent = async (req, res) => {
    try {
        const userId = req.headers['user-id'];
        const { title, description, eventDate, reminderDate } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User not logged in' });
        }

        if (new Date(eventDate) < new Date() || new Date(reminderDate) < new Date()) {
            return res.status(400).json({ error: 'Event date or reminder date cannot be in the past' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newEvent = new Event({
            user: userId,
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

        const cronJob = cron.schedule(cronTime, async () => {
            let attempts = 0;
            const maxAttempts = 3;
            while (attempts < maxAttempts) {
                try {
                    console.log(`Attempt ${attempts + 1}: Sending reminder email and SMS...`);
                    await sendEmail(user.email, 'Event Reminder', `Hello ${user.name}, this is a reminder for your event: ${title}`);
                    await sendSMS(user.phone, `Hello ${user.name}, this is a reminder for your event: ${title}`);
                    newEvent.notified = true;
                    await newEvent.save();
                    console.log("Reminder email and SMS sent successfully");
                    break;
                } catch (error) {
                    console.error(`Error sending reminder on attempt ${attempts + 1}:`, error);
                    attempts += 1;
                    if (attempts === maxAttempts) {
                        console.error("Failed to send reminder email and SMS after multiple attempts");
                    } else {
                        await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5 seconds before retrying
                    }
                }
            }
        });

        savedEvent.cronJob = cronJob;
        await savedEvent.save();

        console.log("Event Created");
        res.json({ msg: "Event Created", event: savedEvent });
    } catch (err) {
        console.log("Event creation error:", err);
        res.status(500).json({ error: err.message });
    }
};

const getbyId = async (req, res) => {
    const eventId = req.params.eventId;
    try {
        const event = await Event.findById({ _id: eventId });
        if (event) {
            res.json({ msg: "Event Found", event: event });
        } else {
            res.json({ msg: "Event Not Found" });
        }
    } catch (err) {
        console.log("Event not found", err);
        res.json({ msg: "Unable to fetch", err });
    }
};

const updateEvent = async (req, res) => {
    const { eventId } = req.params;
    try {
        let event = await Event.findById(eventId).populate('user');
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Update event details
        event.title = req.body.title;
        event.description = req.body.description;
        event.eventDate = req.body.eventDate;
        event.reminderDate = req.body.reminderDate;

        // Save the updated event
        await event.save();

        // Cancel existing cron job if it exists
        if (event.cronJob) {
            event.cronJob.stop();
        }

        // Schedule a new cron job for the updated event
        const reminderDateTime = new Date(event.reminderDate);
        const cronTime = `${reminderDateTime.getMinutes()} ${reminderDateTime.getHours()} ${reminderDateTime.getDate()} ${reminderDateTime.getMonth() + 1} *`;

        const cronJob = cron.schedule(cronTime, async () => {
            try {
                console.log(`Sending reminder email and SMS for Event: ${event.title}`);
                await sendEmail(event.user.email, 'Event Reminder', `Hello ${event.user.name}, this is a reminder for your event: ${event.title}`);
                await sendSMS(event.user.phone, `Hello ${event.user.name}, this is a reminder for your event: ${event.title}`);
                event.notified = true;
                await event.save();
                console.log("Reminder email and SMS sent successfully");
            } catch (error) {
                console.error("Error sending reminder:", error);
            }
        });

        event.cronJob = cronJob;
        await event.save();

        console.log("Event updated successfully:", event.title);
        res.json({ msg: "Event updated successfully", event });
    } catch (err) {
        console.error("Event update error:", err);
        res.status(500).json({ error: err.message });
    }
};

const DeleteEvent = async (req, res) => {
    const { eventId } = req.params;
    try {
        const deletedEvent = await Event.findByIdAndDelete(eventId);
        if (!deletedEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }
        if (deletedEvent.cronJob) {
            deletedEvent.cronJob.stop();
        }
        console.log("Event Deleted");
        res.json({ msg: "Event Deleted", event: deletedEvent });
    } catch (err) {
        console.log("Event deletion error:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { CreateEvent, getEvents, getbyId, updateEvent, DeleteEvent };
