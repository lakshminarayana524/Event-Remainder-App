const express = require('express');
const { CreateEvent, getEvents } = require('../controllers/eventcontroller');
const verifySession = require('../middleware/authMiddleware');
const router = express.Router();

router.use(verifySession);

router.post('/create', CreateEvent); 
router.get('/getevents' , getEvents);

module.exports = router;
