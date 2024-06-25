require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const authRouter = require('./routes/authRoutes');
const eventRouter = require('./routes/eventRoutes');
const sendEmail = require('./config/mail');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

app.use(cors({
    origin: "https://my-event-remainder.vercel.app",
    // origin:"http://localhost:3000",
    methods: ["GET", "POST", "UPDATE", "DELETE"],
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
connectDB();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
        httpOnly: true,
        sameSite: 'None' // Set to 'None' for cross-origin requests
    }// Ensure cookies are set correctly
}));

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

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Server is running on " + port);
});
