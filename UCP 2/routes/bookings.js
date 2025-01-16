// routes/bookings.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

router.get('/new', (req, res) => {
    res.render('newbooking');
});

// routes/bookings.js
// router.post('/', async (req, res) => {
//     try {
//         const { name, date, time, duration, totalharga } = req.body;
//         console.log('Received data:', { name, date, time, duration, totalharga }); // Debug log untuk memeriksa nilai totalharga

//         // Validasi input
//         if (!name || !date || !time || !duration || !totalharga) {
//             return res.status(400).send('Please fill out all fields');
//         }

//         const userId = req.session.userId;
//         const bookingStatus = 'Belum Lunas'; // Default status

//         // Buat booking baru dengan totalharga yang valid
//         const booking = await Booking.create({ 
//             name, 
//             date, 
//             time, 
//             duration: parseInt(duration), // Durasi dalam format integer
//             totalharga: parseInt(totalharga),  // Pastikan totalharga dihitung dan dikirim
//             userId, 
//             status: bookingStatus
//         });

//         console.log('Booking created:', booking);
//         res.redirect('/bookings');
//     } catch (error) {
//         console.error('Error adding booking:', error);
//         res.status(400).send(error);
//     }
// });
router.post('/', async (req, res) => {
    try {
        const { name, date, time, duration, totalharga, paymentMethod } = req.body;

        // Validasi input
        if (!name || !date || !time || !duration || !totalharga || !paymentMethod) {
            return res.status(400).send('Please fill out all fields');
        }

        const userId = req.session.userId;
        const bookingStatus = 'Belum Lunas'; // Default status

        // Buat booking baru dengan paymentMethod
        const booking = await Booking.create({
            name,
            date,
            time,
            duration: parseInt(duration),
            totalharga: parseInt(totalharga),
            userId,
            status: bookingStatus,
            paymentMethod // Menambahkan paymentMethod yang dipilih
        });

        console.log('Booking created:', booking);
        res.redirect('/bookings');
    } catch (error) {
        console.error('Error adding booking:', error);
        res.status(400).send(error);
    }
});




router.get('/bookings', async (req, res) => {
    try {
        // Mengambil data booking dengan atribut yang diinginkan (termasuk 'totalharga')
        const bookingData = await Booking.findAll({
            attributes: ['id', 'name', 'date', 'time', 'duration', 'userId', 'status', 'totalharga','paymentMethod'] // Pastikan 'totalharga' ada
        });

        // Mengirimkan data ke view (misalnya ke file ejs atau template lainnya)
        res.render('bookingList', { bookings: bookingData });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).send('Error fetching bookings');
    }
});



// READ ALL
router.get('/', async (req, res) => {
    try {
        // Semua pengguna dapat melihat semua bookings
        const bookings = await Booking.findAll();
        res.render('index', { bookings, userId: req.session.userId, userRole: req.session.userRole });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).send(error);
    }
});

// READ ONE (View specific booking)
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) {
            return res.redirect('/bookings');
        }
        res.render('showbooking', { booking });
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).send(error);
    }
});

// FORM EDIT BOOKING
router.get('/edit/:id', async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) {
            return res.redirect('/bookings');
        }
        // Pastikan hanya admin atau pemilik booking yang dapat mengedit
        if (req.session.userRole !== 'admin' && booking.userId !== req.session.userId) {
            return res.status(403).send('Access denied');
        }
        res.render('editbooking', { booking });
    } catch (error) {
        console.error('Error fetching booking for edit:', error);
        res.status(500).send(error);
    }
});

// UPDATE
router.post('/edit/:id', async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) {
            return res.redirect('/bookings');
        }

        // Pastikan hanya admin atau pemilik booking yang dapat mengedit
        if (req.session.userRole !== 'admin' && booking.userId !== req.session.userId) {
            return res.status(403).send('Access denied');
        }

        // Ambil data dari form edit
        const { name, date, time, duration,status } = req.body;

        // Harga per jam, misalnya Rp 100.000 per jam
        const pricePerHour = 85000;

        // Hitung total harga baru berdasarkan durasi
        const newTotalHarga = pricePerHour * parseInt(duration);

        // Update booking dengan total harga baru
        await booking.update({
            name,
            date,
            time,
            duration: parseInt(duration),
            totalharga: newTotalHarga,
            status
        });

        // Logging updated booking
        console.log('Booking updated:', booking);

        res.redirect('/bookings');
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(400).send(error);
    }
});


// DELETE
router.post('/:id/delete', async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) {
            return res.redirect('/bookings');
        }
        // Pastikan hanya admin atau pemilik booking yang dapat menghapus
        if (req.session.userRole !== 'admin' && booking.userId !== req.session.userId) {
            return res.status(403).send('Access denied');
        }
        // Hapus pembayaran terkait terlebih dahulu
        await Payment.destroy({ where: { Id: req.params.id } });
        // Kemudian hapus booking
        await booking.destroy();

        // Logging deleted booking
        console.log('Booking deleted:', booking);

        res.redirect('/bookings');
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).send(error);
    }
});


router.post('/:id/update-status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const booking = await Booking.findByPk(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.status = status;
        await booking.save();

        res.json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Failed to update status' });
    }
});



module.exports = router;
