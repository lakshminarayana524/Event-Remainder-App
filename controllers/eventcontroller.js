const express = require('express');
const Event = require('../models/event');
const User = require('../models/user');
const cron = require('node-cron');
const sendEmail = require('../config/mail');
const sendSMS = require('../config/msg');

const getEvents = async (req, res) => {
    try {
        const events = await Event.find({ user: req.session.userId });
        res.json(events);
    } catch (err) {
        console.log("Event fetch error");
        res.json(err);
    }
}

const CreateEvent = async (req, res) => {
    try {
        const { title, description, eventDate, reminderDate } = req.body;
        console.log(title, description, eventDate, reminderDate);
        if (new Date(eventDate) < new Date() || new Date(reminderDate) < new Date()) {
            return res.status(400).json({ error: 'Event date or reminder date cannot be in the past' });
        }
        console.log('test 1');

        const newEvent = new Event({
            user: req.session.userId,
            title,
            description,
            eventDate,
            reminderDate,
            notified: true,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });

        const savedEvent = await newEvent.save();
        console.log('test2');
        const reminderDateTime = new Date(reminderDate);

        cron.schedule(`${reminderDateTime.getMinutes()} ${reminderDateTime.getHours()} ${reminderDateTime.getDate()} ${reminderDateTime.getMonth() + 1} *`, async () => {
            try {
                const user = await User.findById(req.session.userId);
                await sendEmail(user.email, 'Event Reminder', `Hello ${user.name}, this is a reminder for your event: ${title}`);
                newEvent.notified = true;
                console.log('test 3');
                await newEvent.save();
            } catch (error) {
                console.error('Error sending reminder:', error);
            }
        }, {
            scheduled: true,
            timezone: "Asia/Kolkata"
        });
        console.log('test 4');
        res.json({ msg: "Event Created", savedEvent });
    } catch (err) {
        res.json(err);
        console.log("Event not created", err);
    }
}

module.exports = { CreateEvent, getEvents };
