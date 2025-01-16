const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    dialectOptions: {
        charset: 'utf8mb4'
    }
});

const Booking = require('./models/Booking');
const User = require('./models/User');
const Payment = require('./models/Payment');

// Import middleware
const authMiddleware = require('./middleware');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || (process.env.NODE_ENV === 'test' ? 3001 : 1000);

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

app.locals.moment = moment;

sequelize.sync()
    .then(() => console.log('Database connected and synced...'))
    .catch(err => console.log('Error: ' + err));

// Middleware for sessions and user information
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.userId = req.session.userId;
    res.locals.userRole = req.session.userRole;
    next();
});

// Middleware to serve static files from assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Routes for login and register
app.use('/users', require('./routes/users'));

// Middleware to check if the user is authenticated
app.use(authMiddleware);

// Routes for bookings and payments
app.use('/bookings', require('./routes/bookings'));
app.use('/payments', require('./routes/payments'));

// Route for admin (use isAdmin middleware to protect admin routes)
app.use('/admin', authMiddleware.isAdmin, require('./routes/admin'));

// Import the home route
app.use('/', require('./routes/home'));

// Remove default redirect to bookings
// Default route to redirect to home page
app.get('/', (req, res) => {
    res.redirect('/');
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/bookings');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login'); // Redirect to login page or home page
    });
});

// Start the server
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
