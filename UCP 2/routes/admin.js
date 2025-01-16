// routes/admin.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { isAdmin } = require('../middleware');

// Rute untuk mengelola data lapangan
router.get('/manage-fields', isAdmin, (req, res) => {
    res.render('manageFields');
});

router.post('/manage-fields', isAdmin, async (req, res) => {
    // Tambahkan logika untuk mengelola data lapangan
    res.redirect('/admin/manage-fields');
});

// Rute untuk melihat laporan para pengguna
router.get('/reports', isAdmin, async (req, res) => {
    try {
        const users = await User.findAll();
        const bookings = await Booking.findAll();
        const payments = await Payment.findAll();
        res.render('reports', { users, bookings, payments });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
