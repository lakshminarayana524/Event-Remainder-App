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

    const getbyId = async (req,res)=>{
        const eventId = req.params.eventId;
        // console.log("Event ID:"+ eventId)
        try{
            const event = await Event.findById({_id:eventId})
            if(event){
                res.json({msg:"Event Found",event:event});
            }else{
                res.json({msg:"Event Not Found"})
            }
        }catch(err){
            console.log("Event not found",err)
            res.json({msg:"Unable to fetch",err})
        }
    }

    const updateEvent = async (req, res) => {
        const { eventId } = req.params;
        // console.log("EventId Update :" + eventId)
        try {
            const eventup = await Event.findById({ _id: eventId });
            if (eventup) {
                eventup.title = req.body.title;
                eventup.description = req.body.description;
                eventup.eventDate = req.body.eventDate;
                eventup.reminderDate = req.body.reminderDate;
    
                await eventup.save();
    
                console.log("Successfully Event " + eventup.title + " Updated");
                res.json({ msg: "Event Updated", event: eventup });
    
                // Cancel existing cron job if it exists
                if (eventup.cronJob) {
                    eventup.cronJob.stop();
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
                            await sendEmail(req.session.user.email, 'Event Reminder', `Hello ${eventup.user.name}, this is a reminder for your event: ${eventup.title}`);
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
    
                // Attach the cron job to the event object
                eventup.cronJob = cronJob;
                await eventup.save();
    
            } else {
                console.log("Event Not found");
                res.status(404).json({ msg: "Event Not found" });
            }
        } catch (err) {
            console.log("Event Update Occurred Error ", err);
            res.status(500).json({ msg: err });
        }
    };

    const DeleteEvent = async(req,res) =>{
        const eventId = req.params.eventId;

        try{
            const event = await Event.findByIdAndDelete({_id:eventId})
            if(!event) return res.status(404).json({msg:"Event Not Found"})
                console.log("Successully Deleted Event "+event.title)
                res.status(200).json({msg:"Successfully Deleted"})
        }catch (err){
            console.log("Unable to delete Event "+err)
            res.status(500).json({msg:"unable to delete Event"})
        }
    }

    module.exports = { CreateEvent, getEvents,getbyId,updateEvent,DeleteEvent };
