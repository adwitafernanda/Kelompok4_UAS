const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment');
const session = require('express-session');
require('dotenv').config();

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql'
});

const Booking = require('./models/Booking');
const User = require('./models/User');
const Payment = require('./models/Payment');

const authMiddleware = require('./middleware'); // Pastikan jalur ini benar

const app = express();
const PORT = process.env.PORT || 1000;

app.set('view engine', 'ejs');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

app.locals.moment = moment;

sequelize.sync()
    .then(() => console.log('Database connected and synced...'))
    .catch(err => console.log('Error: ' + err));

// Middleware untuk menambahkan session dan userId ke res.locals
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.userId = req.session.userId;
    res.locals.userRole = req.session.userRole;
    next();
});

// Rute untuk login dan register
app.use('/users', require('./routes/users'));

// Middleware untuk memeriksa apakah pengguna sudah login
app.use(authMiddleware);

// Rute untuk bookings dan payments
app.use('/bookings', require('./routes/bookings'));
app.use('/payments', require('./routes/payments'));

// Rute untuk admin
app.use('/admin', require('./routes/admin'));

// Rute default untuk mengarahkan ke halaman bookings
app.get('/', (req, res) => {
    res.redirect('/bookings');
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
