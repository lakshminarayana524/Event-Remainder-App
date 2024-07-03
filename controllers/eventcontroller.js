const Event = require('../models/event');
const User = require('../models/user');
const cron = require('node-cron');
const sendEmail = require('../config/mail');

const getEvents = async (req, res) => {
    try {
        const userId = req.headers['user-id'];

        const events = await Event.find({ user: userId });

        res.json(events);
    } catch (err) {
        console.error("Error fetching events:", err); // Log any errors that occur
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
                // console.log("remainder : "+reminderDateTime);

        const cronTime = `${reminderDateTime.getMinutes()} ${reminderDateTime.getHours()} ${reminderDateTime.getDate()} ${reminderDateTime.getMonth() + 1} *`;

        const cronJob = cron.schedule(cronTime, async () => {
            let attempts = 0;
            const maxAttempts = 3;
            while (attempts < maxAttempts) {
                try {
                    console.log(`Attempt ${attempts + 1}: Sending reminder email...`);
                    await sendEmail(user.email, 'Event Reminder', `Hello ${user.name}, this is a reminder for your event: ${title}`);
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

        // Save the cron job reference
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
        const eventup = await Event.findById(eventId);
        if (eventup) {
            eventup.title = req.body.title;
            eventup.description = req.body.description;
            eventup.eventDate = req.body.eventDate;
            eventup.reminderDate = req.body.reminderDate;

            // Cancel existing cron job if it exists
            if (eventup.cronJob) {
                eventup.cronJob.stop();
                eventup.cronJob = null;
            }

            // Schedule a new cron job
            const reminderDateTime = new Date(eventup.reminderDate);
            const cronTime = `${reminderDateTime.getMinutes()} ${reminderDateTime.getHours()} ${reminderDateTime.getDate()} ${reminderDateTime.getMonth() + 1} *`;

            const cronJob = cron.schedule(cronTime, async () => {
                let attempts = 0;
                const maxAttempts = 3;
                while (attempts < maxAttempts) {
                    try {
                        console.log(`Attempt ${attempts + 1}: Sending reminder email...`);
                        await sendEmail(eventup.user.email, 'Event Reminder', `Hello ${eventup.user.name}, this is a reminder for your event: ${eventup.title}`);
                        eventup.notified = true;
                        await eventup.save();
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

            // Save the cron job reference
            eventup.cronJob = cronJob;

            await eventup.save();

            console.log("Successfully Event " + eventup.title + " Updated");
            res.json({ msg: "Event Updated", event: eventup });
        } else {
            console.log("Unable to update event");
            res.status(404).json({ msg: "Event not found" });
        }
    } catch (err) {
        console.log("Unable to update event", err);
        res.status(500).json({ msg: "Unable to update event", err });
    }
};


const DeleteEvent = async (req, res) => {
    const { eventId } = req.params;
    try {
        const eventdel = await Event.findByIdAndDelete({ _id: eventId });
        if (eventdel) {
            console.log("Successfully Event " + eventdel.title + " Deleted");
            res.json({ msg: "Event Deleted", event: eventdel });
        } else {
            console.log("Unable to delete event");
            res.json({ msg: "Unable to delete event" });
        }
    } catch (err) {
        console.log("Unable to delete event", err);
        res.json({ msg: "Unable to delete event", err });
    }
};

module.exports = { CreateEvent, getEvents, getbyId, updateEvent, DeleteEvent };
