const express = require('express');
const { CreateEvent, getEvents,getbyId,updateEvent,DeleteEvent } = require('../controllers/eventcontroller');
const verifySession = require('../middleware/authMiddleware');
const router = express.Router();

router.use(verifySession);

router.post('/create', CreateEvent); 
router.get('/getevents' , getEvents);
router.get('/getdetails/:eventId',getbyId);
router.put('/update/:eventId',updateEvent)
router.delete('/delete/:eventId',DeleteEvent)

module.exports = router;
