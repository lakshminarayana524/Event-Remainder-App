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

const app = express();

app.set("trust proxy", 1); // Trust the first proxy

// Database connection
connectDB();

// Middleware setup
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Session setup
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
//   cookie: {
//     maxAge: 1000 * 60 * 60 * 3, // 3 hours
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
//     sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'Strict' // Important for cross-origin requests
//   }
// }));

// Routes
app.get('/', (req, res) => {
  res.send("Hi, I am Here");
});

app.get('/send-test-email', async (req, res) => {
  try {
    await sendEmail('myeventremainder@gmail.com', 'Test Subject', 'Test email content');
    res.send('Test email sent successfully');
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).send('Error sending test email');
  }
});

app.use('/api/auth', authRouter);
app.use('/api/event', eventRouter);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is running on " + port);
});
