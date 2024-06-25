require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const authRouter = require('./routes/authRoutes');
const eventRouter = require('./routes/eventRoutes');
const sendEmail = require('./config/mail');
const authMiddleware = require('./middleware/authMiddleware');
const mongoose = require('mongoose'); // Import mongoose

const app = express();

// Database connection
connectDB();

// Middleware setup
app.use(cors({
    origin: "http://localhost:3000", // Adjust according to your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Use "PUT" instead of "UPDATE"
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }), // Use mongoUrl
    cookie: {
        maxAge: 1000 * 60 * 60 * 3,
        httpOnly: true,
        secure: false,  // Set to true if using HTTPS
        sameSite: 'Strict'  // Adjust according to your needs
    }
}));

// Debugging middleware
app.use((req, res, next) => {
    // console.log('Session', req.session.userId);
    // console.log('Cookies:', req.cookies);
    next();
});

// Routes
app.get('/', (req, res) => {
    res.send("Hi, I am Here"); 
});

app.get('/send-test-email', async (req, res) => {
    try {
        await sendEmail('myeventremainder@gmail.com', 'Test Subject', 'Test email content');
        console.log("Test email sent successfully");
        res.send('Test email sent successfully');
    } catch (error) {
        console.error('Error sending test email:', error);
        res.status(500).send('Error sending test email');
    }
});

app.use('/api/auth', authRouter);
app.use('/api/event', authMiddleware, eventRouter);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server is running on " + port);
});
