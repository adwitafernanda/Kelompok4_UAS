const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Register
router.get('/register', (req, res) => {
    res.render('register', { error: null });
});

router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            return res.status(400).render('register', { error: 'Please fill out all fields' });
        }

        const existingUser = await User.findOne({ where: { username } });

        if (existingUser) {
            return res.status(400).render('register', { error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashedPassword, email });

        if (process.env.NODE_ENV === 'test') {
            res.status(200).json({
                message: 'User successfully added!',
                user: newUser
            });
        } else {
            res.redirect('/users/login');
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).render('register', { error: 'Internal Server Error' });
    }
});


// Login
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).render('login', { error: 'Please fill out all fields' });
        }

        const user = await User.findOne({ where: { username } });

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user.id; // Simpan userId di sesi
            req.session.userRole = user.role; // Simpan role di sesi
            res.redirect('/');
        } else {
            res.status(401).render('login', { error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).render('login', { error: 'Internal Server Error' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/users/login');
});

module.exports = router;
