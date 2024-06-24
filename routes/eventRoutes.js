const express = require('express')
const {CreateEvent , getEvents} = require('../controllers/eventcontroller')

const router = express.Router();

router.post('/create',CreateEvent);
router.get('/getevents',getEvents);

module.exports= router;
