const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const Lapangan = require('../models/lapangan');



// Form Pembayaran
router.get('/new', async (req, res) => {
    try {
        const bookingId = req.query.bookingId;
        const bookings = await Booking.findAll({ where: { userId: req.session.userId } });
        const lapangan = await Lapangan.findAll();
        res.render('newpayment', { bookings, lapangan, selectedBookingId: bookingId });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Proses Pembayaran
router.post('/', async (req, res) => {
    try {
        const { bookingId, totalharga, paymentMethod } = req.body;
        const payment = await Payment.create({
            userId: req.session.userId,
            bookingId,
            totalharga,
            paymentMethod,
            paymentDate: new Date()
        });
        res.redirect('/payments');
    } catch (error) {
        res.status(400).send(error);
    }
});


// Route untuk menampilkan daftar pembayaran
router.get('/payments', async (req, res) => {
    try {
        const payments = await Payment.findAll(); // Ambil data pembayaran dari database
        res.render('payments', { payments });
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Lihat Semua Pembayaran
router.get('/', async (req, res) => {
    try {
        const payments = await Payment.findAll({ where: { userId: req.session.userId } });
        res.render('indexpayment', { payments });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;